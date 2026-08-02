import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Prisma } from "@prisma/client";
import type { AssetStatus, BookingStatus, MaintenanceStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError, paginatedMeta } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import { createAuditLog } from "../shared/audit";
import { getPagination } from "../shared/pagination";
import type { PaginationQuery } from "../../types";
import type { GenerateReportInput } from "./validators";

export interface GetAllReportsParams extends PaginationQuery {
  type?: string;
  status?: string;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, prefix + key + "_"));
    } else {
      result[prefix + key] = Array.isArray(value) ? value.map((v) => v?.name ?? v).join("; ") : value;
    }
  }
  return result;
}

function generateCSV(data: Record<string, unknown>[], columns?: string[]): string {
  if (data.length === 0) return "";
  const keys = columns || Object.keys(data[0]);
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const header = keys.join(",");
  const rows = data.map((row) =>
    keys
      .map((k) => {
        const v = row[k];
        if (v !== null && typeof v === "object" && !(v instanceof Date)) return escape(JSON.stringify(v));
        return escape(v);
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

function generatePDF(
  title: string,
  data: Record<string, unknown>[],
  columns?: string[],
  summary?: Record<string, unknown>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#1e293b").fontSize(20).font("Helvetica-Bold").text(title, { align: "center" });
    doc.moveDown(0.5);

    if (summary && Object.keys(summary).length > 0) {
      doc.fontSize(10).fillColor("#475569").font("Helvetica");
      for (const [key, value] of Object.entries(summary)) {
        doc.text(`${key}: ${String(value)}`, { continued: true, align: "left" });
        doc.moveDown(0.1);
      }
      doc.moveDown(0.5);
    }

    const keys = columns || (data.length > 0 ? Object.keys(data[0]) : []);
    const maxColWidth = Math.max(40, Math.floor((doc.page.width - 80) / keys.length));
    const cellHeight = 20;
    const headerY = doc.y;
    const headerHeight = 24;

    doc.rect(40, headerY, doc.page.width - 80, headerHeight).fill("#f8fafc");
    doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9);
    keys.forEach((key, i) => {
      const x = 40 + i * maxColWidth;
      doc.text(String(key).toUpperCase(), x + 4, headerY + 6, { width: maxColWidth - 8, height: headerHeight - 6, ellipsis: true });
    });

    doc.fillColor("#1e293b").font("Helvetica").fontSize(9);
    let y = headerY + headerHeight;
    for (const row of data) {
      if (y + cellHeight > doc.page.height - 50) {
        doc.addPage();
        y = 40;
      }
      doc.rect(40, y, doc.page.width - 80, cellHeight).strokeColor("#e2e8f0").lineWidth(0.5).stroke();
      keys.forEach((key, i) => {
        const value = row[key] ?? "";
        const text = typeof value === "object" && !(value instanceof Date) ? JSON.stringify(value) : String(value);
        doc.text(text, 40 + i * maxColWidth + 4, y + 6, { width: maxColWidth - 8, height: cellHeight - 6, ellipsis: true });
      });
      y += cellHeight;
    }

    doc.end();
  });
}

function generateExcel(data: Record<string, unknown>[], columns?: string[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Assetrix";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Data");

  const keys = columns || (data.length > 0 ? Object.keys(data[0]) : []);
  sheet.columns = keys.map((key) => ({
    header: String(key).toUpperCase(),
    key,
    width: Math.max(12, String(key).length + 8),
  }));

  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(data.length + 1, 1), column: keys.length } };

  for (const row of data) {
    const excelRow: Record<string, unknown> = {};
    for (const key of keys) {
      excelRow[key] = row[key];
    }
    sheet.addRow(excelRow);
  }

  return workbook.xlsx.writeBuffer().then((buffer) => Buffer.from(buffer));
}

function reportSummary(report: { id: string; name: string; type: string; format: string; createdAt: Date }) {
  return {
    id: report.id,
    name: report.name,
    type: report.type,
    format: report.format,
    status: "COMPLETED",
    createdAt: report.createdAt,
    completedAt: new Date(),
  };
}

export const generateAssetReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "ASSET",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const where: Prisma.AssetWhereInput = { deletedAt: null };
  if (data.filters?.departmentId) where.departmentId = data.filters.departmentId;
  if (data.filters?.categoryId) where.categoryId = data.filters.categoryId;
  if (data.filters?.status) where.status = data.filters.status as AssetStatus;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.createdAt = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const assets = await prisma.asset.findMany({
    where,
    include: {
      department: { select: { id: true, name: true, code: true } },
      category: { select: { id: true, name: true, code: true } },
      allocatedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      _count: { select: { allocations: true, bookings: true, maintenanceTasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: assets.length,
    },
  });

  return {
    message: "Asset report generated successfully",
    data: { report: reportSummary(report), data: assets },
  };
};

export const generateMaintenanceReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "MAINTENANCE",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const where: Prisma.MaintenanceTaskWhereInput = { deletedAt: null };
  if (data.filters?.assetId) where.assetId = data.filters.assetId;
  if (data.filters?.status) where.status = data.filters.status as MaintenanceStatus;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.scheduledDate = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const tasks = await prisma.maintenanceTask.findMany({
    where,
    include: {
      asset: { select: { id: true, name: true, assetTag: true, department: { select: { name: true } } } },
      assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      schedule: { select: { id: true, name: true, type: true } },
    },
    orderBy: { scheduledDate: "desc" },
  });

  const summary = {
    totalTasks: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    scheduled: tasks.filter((t) => t.status === "SCHEDULED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    overdue: tasks.filter((t) => t.status === "OVERDUE").length,
    cancelled: tasks.filter((t) => t.status === "CANCELLED").length,
    totalEstimatedCost: tasks.reduce((sum, t) => sum + (Number(t.estimatedCost) || 0), 0),
    totalActualCost: tasks
      .filter((t) => t.status === "COMPLETED")
      .reduce((sum, t) => sum + (Number(t.actualCost) || 0), 0),
    byType: {
      preventive: tasks.filter((t) => t.type === "PREVENTIVE").length,
      corrective: tasks.filter((t) => t.type === "CORRECTIVE").length,
      predictive: tasks.filter((t) => t.type === "PREDICTIVE").length,
      emergency: tasks.filter((t) => t.type === "EMERGENCY").length,
    },
  };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: tasks.length,
    },
  });

  return {
    message: "Maintenance report generated successfully",
    data: { report: reportSummary(report), summary, data: tasks },
  };
};

export const generateFinancialReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "FINANCIAL",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const assetWhere: Prisma.AssetWhereInput = { deletedAt: null };
  if (data.filters?.departmentId) assetWhere.departmentId = data.filters.departmentId;
  if (data.filters?.categoryId) assetWhere.categoryId = data.filters.categoryId;

  const assets = await prisma.asset.findMany({
    where: assetWhere,
    select: {
      id: true,
      name: true,
      assetTag: true,
      purchasePrice: true,
      currentValue: true,
      category: { select: { id: true, name: true, code: true } },
      department: { select: { id: true, name: true, code: true } },
    },
  });

  const maintenance = await prisma.maintenanceTask.aggregate({
    _sum: { estimatedCost: true, actualCost: true },
    _count: true,
  });

  const totalPurchasePrice = assets.reduce((sum, a) => sum + (Number(a.purchasePrice) || 0), 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);

  const summary = {
    totalAssets: assets.length,
    totalPurchasePrice,
    totalCurrentValue,
    totalDepreciation: Math.max(totalPurchasePrice - totalCurrentValue, 0),
    totalMaintenanceEstimated: Number(maintenance._sum.estimatedCost) || 0,
    totalMaintenanceActual: Number(maintenance._sum.actualCost) || 0,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: assets.length,
    },
  });

  return {
    message: "Financial report generated successfully",
    data: { report: reportSummary(report), summary, data: assets },
  };
};

export const generateBookingReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "BOOKING",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const where: Prisma.BookingWhereInput = { deletedAt: null };
  if (data.filters?.assetId) where.assetId = data.filters.assetId;
  if (data.filters?.userId) where.userId = data.filters.userId;
  if (data.filters?.status) where.status = data.filters.status as BookingStatus;
  if (data.filters?.startDate || data.filters?.endDate) {
    where.startDate = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      asset: { select: { id: true, name: true, assetTag: true } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      approvedBy: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const summary = {
    totalBookings: bookings.length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    rejected: bookings.filter((b) => b.status === "REJECTED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: bookings.length,
    },
  });

  return {
    message: "Booking report generated successfully",
    data: { report: reportSummary(report), summary, data: bookings },
  };
};

export const generateAuditReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "AUDIT",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const where: Prisma.AuditLogWhereInput = {};
  if (data.filters?.startDate || data.filters?.endDate) {
    where.createdAt = {
      ...(data.filters.startDate && { gte: data.filters.startDate }),
      ...(data.filters.endDate && { lte: data.filters.endDate }),
    };
  }

  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const entityBreakdown: Record<string, number> = {};
  const actionBreakdown: Record<string, number> = {};
  for (const log of logs) {
    entityBreakdown[log.entity] = (entityBreakdown[log.entity] || 0) + 1;
    actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
  }

  const summary = {
    totalLogs: logs.length,
    uniqueUsers: new Set(logs.map((l) => l.userId).filter(Boolean)).size,
    dateRange: {
      start: logs.length > 0 ? logs[logs.length - 1].createdAt : null,
      end: logs.length > 0 ? logs[0].createdAt : null,
    },
    entityBreakdown,
    actionBreakdown,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: logs.length,
    },
  });

  return {
    message: "Audit report generated successfully",
    data: { report: reportSummary(report), summary, data: logs },
  };
};

export const generateDepartmentReport = async (data: GenerateReportInput, userId: string) => {
  const report = await prisma.report.create({
    data: {
      name: data.name,
      type: "DEPARTMENT",
      format: data.format,
      status: "PROCESSING",
      parameters: (data.filters ?? {}) as unknown as Prisma.InputJsonValue,
      generatedById: userId,
    },
  });

  const departments = await prisma.department.findMany({
    where: data.filters?.departmentId ? { id: data.filters.departmentId } : undefined,
    include: {
      assets: {
        where: {
          ...(data.filters?.status ? { status: data.filters.status as AssetStatus } : {}),
        },
        select: { id: true, name: true, assetTag: true, status: true, currentValue: true },
      },
      users: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      _count: { select: { assets: true, users: true } },
    },
  });

  const departmentData = departments.map((d) => ({
    department: {
      id: d.id,
      name: d.name,
      code: d.code,
      description: d.description,
    },
    assets: d.assets,
    users: d.users,
    assetCount: d._count.assets,
    userCount: d._count.users,
  }));

  const totalAssetValue = departmentData.reduce(
    (sum, d) => sum + d.assets.reduce((s, a) => s + (Number(a.currentValue) || 0), 0),
    0
  );

  const summary = {
    totalDepartments: departments.length,
    totalAssets: departmentData.reduce((sum, d) => sum + d.assetCount, 0),
    totalUsers: departmentData.reduce((sum, d) => sum + d.userCount, 0),
    totalAssetValue,
  };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      fileSize: departments.length,
    },
  });

  return {
    message: "Department report generated successfully",
    data: { report: reportSummary(report), summary, data: departmentData },
  };
};

export const generateReport = async (
  data: GenerateReportInput,
  userId: string,
  ip?: string,
  userAgent?: string
): Promise<{ message: string; data: unknown }> => {
  let result: { message: string; data: unknown };

  switch (data.type) {
    case "ASSET":
      result = await generateAssetReport(data, userId);
      break;
    case "MAINTENANCE":
      result = await generateMaintenanceReport(data, userId);
      break;
    case "FINANCIAL":
      result = await generateFinancialReport(data, userId);
      break;
    case "BOOKING":
      result = await generateBookingReport(data, userId);
      break;
    case "AUDIT":
      result = await generateAuditReport(data, userId);
      break;
    case "DEPARTMENT":
      result = await generateDepartmentReport(data, userId);
      break;
    default:
      throw new AppError("Unsupported report type", HTTP_STATUS.BAD_REQUEST);
  }

  await createAuditLog({
    userId,
    action: "CREATE",
    entity: "Report",
    entityId: (result.data as { report: { id: string } }).report.id,
    newValues: { name: data.name, type: data.type, format: data.format },
    ipAddress: ip,
    userAgent,
  });

  return result;
};

export const getAllReports = async (params: GetAllReportsParams) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(params);
  const where: Prisma.ReportWhereInput = {};
  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;

  const [reports, totalItems] = await Promise.all([
    prisma.report.findMany({ where, orderBy: { [sortBy]: sortOrder }, skip, take: limit }),
    prisma.report.count({ where }),
  ]);

  const generatorIds = [...new Set(reports.map((r) => r.generatedById))];
  const generators =
    generatorIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: generatorIds } },
          select: { id: true, firstName: true, lastName: true, email: true },
        })
      : [];
  const generatorMap = new Map(generators.map((g) => [g.id, g]));

  const enrichedReports = reports.map((r) => ({ ...r, generatedBy: generatorMap.get(r.generatedById) || null }));

  return { reports: enrichedReports, meta: paginatedMeta(totalItems, page, limit) };
};

export const getReportById = async (id: string) => {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw new AppError("Report not found", HTTP_STATUS.NOT_FOUND);

  const generator = await prisma.user.findUnique({
    where: { id: report.generatedById },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  return { ...report, generatedBy: generator || null };
};

export const deleteReport = async (id: string, userId: string, ip?: string, userAgent?: string) => {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw new AppError("Report not found", HTTP_STATUS.NOT_FOUND);

  await prisma.report.delete({ where: { id } });

  await createAuditLog({
    userId,
    action: "DELETE",
    entity: "Report",
    entityId: id,
    oldValues: { name: report.name, type: report.type },
    ipAddress: ip,
    userAgent,
  });
};

export interface DownloadResult {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

export const downloadReport = async (id: string, format?: string): Promise<DownloadResult> => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: { generatedBy: { select: { firstName: true, lastName: true } } },
  });
  if (!report) throw new AppError("Report not found", HTTP_STATUS.NOT_FOUND);

  const targetFormat = format || report.format?.toLowerCase() || "csv";

  let reportRows: Record<string, unknown>[] = [];
  let columns: string[] = [];

  switch (report.type) {
    case "ASSET": {
      const assets = await prisma.asset.findMany({
        where: { deletedAt: null },
        include: {
          department: { select: { name: true } },
          category: { select: { name: true } },
          allocatedTo: { select: { firstName: true, lastName: true } },
        },
      });
      reportRows = assets.map((a) => ({
        assetTag: a.assetTag,
        name: a.name,
        status: a.status,
        condition: a.condition,
        department: a.department?.name || "",
        category: a.category?.name || "",
        purchasePrice: a.purchasePrice ? Number(a.purchasePrice) : 0,
        currentValue: a.currentValue ? Number(a.currentValue) : 0,
        allocatedTo: a.allocatedTo ? `${a.allocatedTo.firstName} ${a.allocatedTo.lastName}` : "",
      }));
      columns = ["assetTag", "name", "status", "condition", "department", "category", "purchasePrice", "currentValue", "allocatedTo"];
      break;
    }
    case "MAINTENANCE": {
      const tasks = await prisma.maintenanceTask.findMany({
        where: { deletedAt: null },
        include: {
          asset: { select: { name: true, assetTag: true } },
          assignedTo: { select: { firstName: true, lastName: true } },
        },
      });
      reportRows = tasks.map((t) => ({
        assetName: t.asset?.name || "",
        assetTag: t.asset?.assetTag || "",
        type: t.type,
        status: t.status,
        priority: t.priority,
        title: t.title,
        assignedTo: t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : "",
        scheduledDate: t.scheduledDate ? new Date(t.scheduledDate).toLocaleDateString("en-IN") : "",
        estimatedCost: t.estimatedCost ? Number(t.estimatedCost) : 0,
        actualCost: t.actualCost ? Number(t.actualCost) : 0,
      }));
      columns = ["assetName", "assetTag", "type", "status", "priority", "title", "assignedTo", "scheduledDate", "estimatedCost", "actualCost"];
      break;
    }
    case "BOOKING": {
      const bookings = await prisma.booking.findMany({
        where: { deletedAt: null },
        include: {
          asset: { select: { name: true, assetTag: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });
      reportRows = bookings.map((b) => ({
        resourceName: b.asset?.name || "",
        resourceTag: b.asset?.assetTag || "",
        bookedBy: b.user ? `${b.user.firstName} ${b.user.lastName}` : "",
        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString("en-IN") : "",
        endDate: b.endDate ? new Date(b.endDate).toLocaleDateString("en-IN") : "",
        status: b.status,
        purpose: b.purpose || "",
      }));
      columns = ["resourceName", "resourceTag", "bookedBy", "startDate", "endDate", "status", "purpose"];
      break;
    }
    default:
      reportRows = [{ info: "Report data not available for this type" }];
      columns = ["info"];
  }

  const flatData = reportRows.map((row) => flattenObject(row));
  const title = report.name || `${report.type} Report`;
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_");

  if (targetFormat === "pdf") {
    const buffer = await generatePDF(title, flatData, columns, {
      generatedBy: report.generatedBy ? `${report.generatedBy.firstName} ${report.generatedBy.lastName}` : "System",
    });
    return { buffer, contentType: "application/pdf", filename: `${safeTitle}.pdf` };
  }
  if (targetFormat === "excel" || targetFormat === "xlsx") {
    const buffer = await generateExcel(flatData, columns);
    return {
      buffer,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filename: `${safeTitle}.xlsx`,
    };
  }
  const csv = generateCSV(flatData, columns);
  return { buffer: Buffer.from(csv, "utf-8"), contentType: "text/csv", filename: `${safeTitle}.csv` };
};

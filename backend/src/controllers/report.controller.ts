import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as reportService from '../services/report.service';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';
import prisma from '../config/database';
import { AppError } from '../middleware/error';
import { generateCSV, generatePDF, generateExcel, flattenObject } from '../utils/export';
import logger from '../config/logger';

export const generateReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.generateReport(
    req.body,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.CREATED).json(result);
};

export const getAllReports = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.getAllReports(req.query as any);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getReportById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.getReportById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json(result);
};

export const downloadReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { format: fmt } = req.query as { format?: string };

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new AppError('Report not found', HTTP_STATUS.NOT_FOUND);
  }

  const reportData = await prisma.report.findUnique({
    where: { id },
    include: {
      generatedBy: { select: { firstName: true, lastName: true } },
    },
  });

  const format = (fmt as string) || report.format?.toLowerCase() || 'csv';

  let reportRows: Record<string, unknown>[] = [];
  let columns: string[] = [];

  switch (report.type) {
    case 'ASSET': {
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
        department: a.department?.name || '',
        category: a.category?.name || '',
        purchasePrice: a.purchasePrice ? Number(a.purchasePrice) : 0,
        currentValue: a.currentValue ? Number(a.currentValue) : 0,
        allocatedTo: a.allocatedTo ? `${a.allocatedTo.firstName} ${a.allocatedTo.lastName}` : '',
      }));
      columns = ['assetTag', 'name', 'status', 'condition', 'department', 'category', 'purchasePrice', 'currentValue', 'allocatedTo'];
      break;
    }
    case 'MAINTENANCE': {
      const tasks = await prisma.maintenanceTask.findMany({
        where: { deletedAt: null },
        include: {
          asset: { select: { name: true, assetTag: true } },
          assignedTo: { select: { firstName: true, lastName: true } },
        },
      });
      reportRows = tasks.map((t) => ({
        assetName: t.asset?.name || '',
        assetTag: t.asset?.assetTag || '',
        type: t.type,
        status: t.status,
        priority: t.priority,
        title: t.title,
        assignedTo: t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : '',
        scheduledDate: t.scheduledDate ? new Date(t.scheduledDate).toLocaleDateString('en-IN') : '',
        estimatedCost: t.estimatedCost ? Number(t.estimatedCost) : 0,
        actualCost: t.actualCost ? Number(t.actualCost) : 0,
      }));
      columns = ['assetName', 'assetTag', 'type', 'status', 'priority', 'title', 'assignedTo', 'scheduledDate', 'estimatedCost', 'actualCost'];
      break;
    }
    case 'BOOKING': {
      const bookings = await prisma.booking.findMany({
        where: { deletedAt: null },
        include: {
          asset: { select: { name: true, assetTag: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });
      reportRows = bookings.map((b) => ({
        resourceName: b.asset?.name || '',
        resourceTag: b.asset?.assetTag || '',
        bookedBy: b.user ? `${b.user.firstName} ${b.user.lastName}` : '',
        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '',
        endDate: b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN') : '',
        status: b.status,
        purpose: b.purpose || '',
      }));
      columns = ['resourceName', 'resourceTag', 'bookedBy', 'startDate', 'endDate', 'status', 'purpose'];
      break;
    }
    default: {
      reportRows = [{ info: 'Report data not available for this type' }];
      columns = ['info'];
    }
  }

  const flatData = reportRows.map((row) => flattenObject(row));
  const title = report.name || `${report.type} Report`;

  if (format === 'pdf') {
    const buffer = await generatePDF(title, flatData, columns, { generatedBy: reportData?.generatedBy ? `${reportData.generatedBy.firstName} ${reportData.generatedBy.lastName}` : 'System' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    res.send(buffer);
  } else if (format === 'excel' || format === 'xlsx') {
    const buffer = await generateExcel(title, flatData, columns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx"`);
    res.send(buffer);
  } else {
    const csv = generateCSV(flatData, columns);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.csv"`);
    res.send(csv);
  }

  logger.info({ reportId: id, format, type: report.type }, 'Report downloaded');
};

export const deleteReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await reportService.deleteReport(
    req.params.id as string,
    req.user!.userId,
    req.ip,
    req.headers['user-agent']
  );
  res.status(HTTP_STATUS.OK).json(result);
};

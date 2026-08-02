import type { Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { successResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as reportService from "./service";

export const generateReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await reportService.generateReport(req.body, req.user!.userId, req.ip, req.headers["user-agent"]);
  res.status(HTTP_STATUS.CREATED).json(successResponse(result.message, result.data));
});

export const getAllReports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await reportService.getAllReports(req.query as unknown as reportService.GetAllReportsParams);
  res.status(HTTP_STATUS.OK).json(successResponse("Reports retrieved successfully", result.reports, result.meta));
});

export const getReportById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await reportService.getReportById((req.params as { id: string }).id);
  res.status(HTTP_STATUS.OK).json(successResponse("Report retrieved successfully", result));
});

export const deleteReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await reportService.deleteReport(
    (req.params as { id: string }).id,
    req.user!.userId,
    req.ip,
    req.headers["user-agent"]
  );
  res.status(HTTP_STATUS.OK).json(successResponse("Report deleted successfully"));
});

export const downloadReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await reportService.downloadReport((req.params as { id: string }).id, req.query.format as string);
  res.set({
    "Content-Type": result.contentType,
    "Content-Disposition": `attachment; filename="${result.filename}"`,
    "Content-Length": String(result.buffer.length),
  });
  res.status(HTTP_STATUS.OK).send(result.buffer);
});

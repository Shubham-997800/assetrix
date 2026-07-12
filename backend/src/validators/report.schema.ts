import { z } from 'zod';

export const generateReportSchema = z.object({
  name: z.string().min(1, 'Report name is required').max(200),
  type: z.enum([
    'ASSET',
    'MAINTENANCE',
    'FINANCIAL',
    'BOOKING',
    'AUDIT',
    'DEPARTMENT',
  ]),
  format: z.enum(['JSON', 'CSV', 'PDF']).default('JSON'),
  filters: z
    .object({
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      departmentId: z.string().uuid().optional(),
      categoryId: z.string().uuid().optional(),
      status: z.string().optional(),
      assetId: z.string().uuid().optional(),
      userId: z.string().uuid().optional(),
    })
    .optional(),
});

export const reportIdParamSchema = z.object({
  id: z.string().uuid('Invalid report ID'),
});

export const reportQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z
    .enum(['ASSET', 'MAINTENANCE', 'FINANCIAL', 'BOOKING', 'AUDIT', 'DEPARTMENT'])
    .optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
  sortBy: z.enum(['createdAt', 'completedAt', 'name', 'type']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const deleteReportSchema = z.object({
  id: z.string().uuid('Invalid report ID'),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type ReportIdParam = z.infer<typeof reportIdParamSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;

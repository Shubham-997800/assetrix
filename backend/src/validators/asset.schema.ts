import { z } from 'zod';

const assetStatusEnum = z.enum(['AVAILABLE', 'ALLOCATED', 'MAINTENANCE', 'RETIRED', 'LOST', 'STOLEN']);
const assetConditionEnum = z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']);

export const createAssetSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  serialNumber: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  yearOfManufacture: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  salvageValue: z.number().min(0).optional(),
  warrantyExpiry: z.string().datetime().optional(),
  warrantyProvider: z.string().max(200).optional(),
  invoiceNumber: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  floor: z.string().max(50).optional(),
  room: z.string().max(50).optional(),
  departmentId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  insuranceProvider: z.string().max(200).optional(),
  insuranceExpiry: z.string().datetime().optional(),
  image: z.string().max(500).optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const assetQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: assetStatusEnum.optional(),
  condition: assetConditionEnum.optional(),
  departmentId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  allocatedToId: z.string().uuid().optional(),
  manufacturer: z.string().optional(),
});

export const assetParamsSchema = z.object({
  id: z.string().uuid('Invalid asset ID'),
});

export const qrCodeParamsSchema = z.object({
  qrCode: z.string().min(1, 'QR code is required'),
});

export const changeStatusSchema = z.object({
  status: assetStatusEnum,
  reason: z.string().max(500).optional(),
});

export const changeConditionSchema = z.object({
  condition: assetConditionEnum,
  notes: z.string().max(500).optional(),
});

export const assignAssetSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  departmentId: z.string().uuid().optional(),
  expectedReturn: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type AssetQueryInput = z.infer<typeof assetQuerySchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type ChangeConditionInput = z.infer<typeof changeConditionSchema>;
export type AssignAssetInput = z.infer<typeof assignAssetSchema>;

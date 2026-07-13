import { z } from 'zod';

export const createAssetCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(150).trim(),
  code: z.string().min(1, 'Category code is required').max(20).trim().toUpperCase(),
  description: z.string().max(500).trim().optional().nullable(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().max(20).optional().nullable(),
  depreciationMethod: z.string().max(50).optional().nullable(),
  defaultUsefulLife: z.number().int().min(0).max(999).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateAssetCategorySchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  code: z.string().min(1).max(20).trim().toUpperCase().optional(),
  description: z.string().max(500).trim().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().max(20).optional().nullable(),
  depreciationMethod: z.string().max(50).optional().nullable(),
  defaultUsefulLife: z.number().int().min(0).max(999).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const assetCategoryQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
  search: z.string().max(200).optional(),
  sortBy: z.enum(['name', 'code', 'createdAt', 'updatedAt', 'isActive']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  isActive: z.string().transform((val) => val.toLowerCase() === 'true').optional(),
  parentId: z.string().uuid().optional(),
});

export const assetCategoryParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

export type CreateAssetCategoryInput = z.infer<typeof createAssetCategorySchema>;
export type UpdateAssetCategoryInput = z.infer<typeof updateAssetCategorySchema>;
export type AssetCategoryQueryInput = z.infer<typeof assetCategoryQuerySchema>;
export type AssetCategoryParamsInput = z.infer<typeof assetCategoryParamsSchema>;

import { z } from 'zod';

const assetConditionEnum = z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']);

export const createAllocationSchema = z.object({
  assetId: z.string().uuid('Invalid asset ID'),
  userId: z.string().uuid('Invalid user ID'),
  departmentId: z.string().uuid('Invalid department ID').optional(),
  expectedReturn: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
  condition: assetConditionEnum.optional(),
});

export const returnAllocationSchema = z.object({
  returnCondition: assetConditionEnum,
  notes: z.string().max(500).optional(),
});

export const allocationIdParamSchema = z.object({
  id: z.string().uuid('Invalid allocation ID'),
});

export const transferAllocationSchema = z.object({
  newUserId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(1, 'Transfer reason is required').max(500),
  notes: z.string().max(500).optional(),
  condition: assetConditionEnum.optional(),
});

export const approveTransferSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const rejectTransferSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required').max(500),
});

export const allocationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'allocatedAt', 'returnedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['ACTIVE', 'RETURNED', 'OVERDUE', 'TRANSFERRED', 'PENDING_APPROVAL']).optional(),
  userId: z.string().uuid().optional(),
  assetId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
});

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;
export type ReturnAllocationInput = z.infer<typeof returnAllocationSchema>;
export type TransferAllocationInput = z.infer<typeof transferAllocationSchema>;
export type ApproveTransferInput = z.infer<typeof approveTransferSchema>;
export type RejectTransferInput = z.infer<typeof rejectTransferSchema>;
export type AllocationQueryInput = z.infer<typeof allocationQuerySchema>;

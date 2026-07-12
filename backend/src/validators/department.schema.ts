import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(150, 'Department name must not exceed 150 characters')
    .trim(),
  code: z
    .string()
    .min(1, 'Department code is required')
    .max(20, 'Department code must not exceed 20 characters')
    .trim()
    .toUpperCase(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  headId: z
    .string()
    .uuid('Invalid head user ID')
    .optional()
    .nullable(),
  parentId: z
    .string()
    .uuid('Invalid parent department ID')
    .optional()
    .nullable(),
  budget: z
    .number()
    .min(0, 'Budget must be a positive number')
    .max(999999999999.99, 'Budget exceeds maximum allowed value')
    .optional()
    .nullable(),
  costCenter: z
    .string()
    .max(50, 'Cost center must not exceed 50 characters')
    .trim()
    .optional()
    .nullable(),
  location: z
    .string()
    .max(200, 'Location must not exceed 200 characters')
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(150, 'Department name must not exceed 150 characters')
    .trim()
    .optional(),
  code: z
    .string()
    .min(1, 'Department code is required')
    .max(20, 'Department code must not exceed 20 characters')
    .trim()
    .toUpperCase()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  headId: z
    .string()
    .uuid('Invalid head user ID')
    .optional()
    .nullable(),
  parentId: z
    .string()
    .uuid('Invalid parent department ID')
    .optional()
    .nullable(),
  budget: z
    .number()
    .min(0, 'Budget must be a positive number')
    .max(999999999999.99, 'Budget exceeds maximum allowed value')
    .optional()
    .nullable(),
  costCenter: z
    .string()
    .max(50, 'Cost center must not exceed 50 characters')
    .trim()
    .optional()
    .nullable(),
  location: z
    .string()
    .max(200, 'Location must not exceed 200 characters')
    .trim()
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim()
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

export const departmentQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1, 'Page must be at least 1')),
  limit: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100')),
  search: z.string().max(200, 'Search query too long').optional(),
  sortBy: z
    .enum(['name', 'code', 'createdAt', 'updatedAt', 'budget', 'isActive'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  parentId: z.string().uuid('Invalid parent department ID').optional(),
});

export const departmentParamsSchema = z.object({
  id: z.string().uuid('Invalid department ID'),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type DepartmentQueryInput = z.infer<typeof departmentQuerySchema>;
export type DepartmentParamsInput = z.infer<typeof departmentParamsSchema>;

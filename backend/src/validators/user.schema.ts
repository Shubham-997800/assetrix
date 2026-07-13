import { z } from 'zod';
import { PASSWORD_REGEX, PASSWORD_MIN_MSG } from '../constants';

const userRoles = ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER', 'TECHNICIAN', 'EMPLOYEE'] as const;
const userStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] as const;

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(PASSWORD_REGEX, PASSWORD_MIN_MSG),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  role: z.enum(userRoles).default('EMPLOYEE'),
  employeeId: z
    .string()
    .max(50, 'Employee ID must not exceed 50 characters')
    .trim()
    .optional()
    .nullable(),
  designation: z
    .string()
    .max(100, 'Designation must not exceed 100 characters')
    .trim()
    .optional()
    .nullable(),
  departmentId: z
    .string()
    .uuid('Invalid department ID')
    .optional()
    .nullable(),
  managerId: z
    .string()
    .uuid('Invalid manager ID')
    .optional()
    .nullable(),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  employeeId: z
    .string()
    .max(50, 'Employee ID must not exceed 50 characters')
    .trim()
    .optional()
    .nullable(),
  designation: z
    .string()
    .max(100, 'Designation must not exceed 100 characters')
    .trim()
    .optional()
    .nullable(),
  departmentId: z
    .string()
    .uuid('Invalid department ID')
    .optional()
    .nullable(),
  managerId: z
    .string()
    .uuid('Invalid manager ID')
    .optional()
    .nullable(),
});

export const changeRoleSchema = z.object({
  role: z.enum(userRoles, {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});

export const changeStatusSchema = z.object({
  status: z.enum(userStatuses, {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
});

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  avatar: z
    .string()
    .url('Invalid avatar URL')
    .max(500, 'Avatar URL must not exceed 500 characters')
    .optional()
    .nullable(),
});

export const userQuerySchema = z.object({
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
    .enum(['firstName', 'lastName', 'email', 'role', 'status', 'createdAt', 'updatedAt', 'employeeId'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  role: z.enum(userRoles).optional(),
  departmentId: z.string().uuid('Invalid department ID').optional(),
  status: z.enum(userStatuses).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;

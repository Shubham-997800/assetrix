import { z } from "zod";
import { PASSWORD_REGEX, PASSWORD_MIN_MSG, ROLES } from "../../constants";

const email = z.string().trim().toLowerCase().email("Invalid email format");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(PASSWORD_REGEX, PASSWORD_MIN_MSG);

export const registerSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string(),
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    phone: z.string().trim().max(30).optional().nullable(),
    employeeId: z.string().trim().max(50).optional().nullable(),
    designation: z.string().trim().max(100).optional().nullable(),
    departmentId: z.string().uuid("Invalid department ID").optional().nullable(),
    role: z.enum(Object.values(ROLES) as [string, ...string[]]).default(ROLES.EMPLOYEE),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
});

export const deleteSessionSchema = z.object({
  id: z.string().uuid("Invalid session ID"),
});

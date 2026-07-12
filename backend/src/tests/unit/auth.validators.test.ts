import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
} from '../../validators/auth.schema';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    const validData = {
      email: 'test@example.com',
      password: 'SecureP@ss1',
      confirmPassword: 'SecureP@ss1',
      firstName: 'John',
      lastName: 'Doe',
      termsAccepted: true,
    };

    it('should accept valid registration data', () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept optional fields', () => {
      const result = registerSchema.safeParse({
        ...validData,
        phone: '+1234567890',
        employeeId: 'EMP001',
        designation: 'Engineer',
        departmentId: '550e8400-e29b-41d4-a716-446655440000',
        role: 'ADMIN',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({ ...validData, email: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const result = registerSchema.safeParse({ ...validData, password: 'weak', confirmPassword: 'weak' });
      expect(result.success).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: 'NoSpecial1A',
        confirmPassword: 'NoSpecial1A',
      });
      expect(result.success).toBe(false);
    });

    it('should reject when passwords do not match', () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: 'DifferentP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject when terms not accepted', () => {
      const result = registerSchema.safeParse({ ...validData, termsAccepted: false });
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const result = registerSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject invalid department ID format', () => {
      const result = registerSchema.safeParse({
        ...validData,
        departmentId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const result = registerSchema.safeParse({
        ...validData,
        role: 'INVALID_ROLE',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'SecureP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should accept with rememberMe', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'SecureP@ss1',
        rememberMe: true,
      });
      expect(result.success).toBe(true);
    });

    it('should default rememberMe to false', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'SecureP@ss1',
      });
      if (result.success) {
        expect(result.data.rememberMe).toBe(false);
      }
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-email',
        password: 'SecureP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should accept valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'TEST@EXAMPLE.COM' });
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should accept valid reset data', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'NewSecureP@ss1',
        confirmPassword: 'NewSecureP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'NewSecureP@ss1',
        confirmPassword: 'DifferentP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing token', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewSecureP@ss1',
        confirmPassword: 'NewSecureP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'weak',
        confirmPassword: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyEmailSchema', () => {
    it('should accept valid token', () => {
      const result = verifyEmailSchema.safeParse({ token: 'valid-token' });
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const result = verifyEmailSchema.safeParse({ token: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('resendVerificationSchema', () => {
    it('should accept valid email', () => {
      const result = resendVerificationSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = resendVerificationSchema.safeParse({ email: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should accept valid change password data', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'CurrentP@ss1',
        newPassword: 'NewSecureP@ss1',
        confirmNewPassword: 'NewSecureP@ss1',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'CurrentP@ss1',
        newPassword: 'NewSecureP@ss1',
        confirmNewPassword: 'DifferentP@ss1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject weak new password', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'CurrentP@ss1',
        newPassword: 'weak',
        confirmNewPassword: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });
});

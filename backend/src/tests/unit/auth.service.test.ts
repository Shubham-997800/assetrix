const mockRedisInstance = {
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(null),
  del: jest.fn().mockResolvedValue(1),
  keys: jest.fn().mockResolvedValue([]),
  incr: jest.fn().mockResolvedValue(1),
  expire: jest.fn().mockResolvedValue(1),
};

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
    loginHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    passwordResetToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    refreshToken: {
      updateMany: jest.fn(),
    },
    department: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../config/redis', () => ({
  getRedisConnection: jest.fn(() => mockRedisInstance),
  closeRedis: jest.fn(),
}));

jest.mock('../../queues', () => ({
  emailQueue: {
    add: jest.fn().mockResolvedValue({ id: '1' }),
  },
  notificationQueue: {
    add: jest.fn().mockResolvedValue({ id: '1' }),
  },
}));

jest.mock('../../notifications', () => ({
  createNotification: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../audit', () => ({
  createAuditLog: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'EMPLOYEE',
    type: 'refresh',
  }),
}));

jest.mock('../../utils', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
  comparePassword: jest.fn(),
  generateToken: jest.fn().mockReturnValue('mock-token-abc123'),
  generateId: jest.fn().mockReturnValue('mock-id'),
}));

import * as authService from '../../services/auth.service';
import prisma from '../../config/database';
import { getRedisConnection } from '../../config/redis';
import { emailQueue } from '../../queues';
import { createNotification } from '../../notifications';
import { createAuditLog } from '../../audit';
import { comparePassword } from '../../utils';

const mockPrisma = prisma as any;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisInstance.get.mockResolvedValue(null);
    mockRedisInstance.setex.mockResolvedValue('OK');
    mockRedisInstance.del.mockResolvedValue(1);
    mockRedisInstance.keys.mockResolvedValue([]);
    mockRedisInstance.incr.mockResolvedValue(1);
    mockRedisInstance.expire.mockResolvedValue(1);
  });

  describe('register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'SecureP@ss1',
      confirmPassword: 'SecureP@ss1',
      firstName: 'John',
      lastName: 'Doe',
      termsAccepted: true,
    };

    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.department.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'PENDING_VERIFICATION',
      });
      mockPrisma.session.create.mockResolvedValue({ id: 'session-1' });

      const result = await authService.register(validRegisterData, '127.0.0.1', 'Mozilla/5.0');

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
      expect(emailQueue.add).toHaveBeenCalledWith('send-email', expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Verify'),
      }));
      expect(createNotification).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'REGISTER',
      }));
    });

    it('should throw error if terms not accepted', async () => {
      await expect(
        authService.register({ ...validRegisterData, termsAccepted: false })
      ).rejects.toThrow('You must accept the terms and conditions');
    });

    it('should throw error if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'existing',
        deletedAt: null,
      });

      await expect(authService.register(validRegisterData)).rejects.toThrow(
        'An account with this email already exists'
      );
    });

    it('should throw error if employee ID already exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'existing', deletedAt: null });

      await expect(
        authService.register({ ...validRegisterData, employeeId: 'EMP001' })
      ).rejects.toThrow('An account with this employee ID already exists');
    });

    it('should validate department exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.department.findUnique.mockResolvedValue(null);

      await expect(
        authService.register({ ...validRegisterData, departmentId: 'invalid-dept' })
      ).rejects.toThrow('Department not found');
    });
  });

  describe('login', () => {
    const validLoginData = { email: 'test@example.com', password: 'SecureP@ss1' };

    it('should login successfully with valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null,
        emailVerified: true,
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockPrisma.session.create.mockResolvedValue({ id: 'session-1' });
      mockPrisma.loginHistory.findMany.mockResolvedValue([]);
      mockPrisma.session.findMany.mockResolvedValue([]);

      const result = await authService.login(validLoginData, '127.0.0.1', 'Mozilla/5.0');

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            loginAttempts: 0,
            lastLoginAt: expect.any(Date),
          }),
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGIN',
      }));
    });

    it('should throw error for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(validLoginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error for deleted user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        deletedAt: new Date(),
      });

      await expect(authService.login(validLoginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should lock account after max failed attempts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 4,
        lockedUntil: null,
        emailVerified: true,
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(validLoginData)).rejects.toThrow(
        'Account locked after 5 failed attempts'
      );

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            loginAttempts: 5,
            lockedUntil: expect.any(Date),
          }),
        })
      );
    });

    it('should throw error when account is locked', async () => {
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 5,
        lockedUntil: futureDate,
        emailVerified: true,
        deletedAt: null,
      });

      await expect(authService.login(validLoginData)).rejects.toThrow('Account is locked');
    });

    it('should throw error for suspended account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'SUSPENDED',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null,
        emailVerified: true,
        deletedAt: null,
      });

      await expect(authService.login(validLoginData)).rejects.toThrow(
        'Your account has been suspended'
      );
    });

    it('should throw error for unverified email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'PENDING_VERIFICATION',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null,
        emailVerified: false,
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(validLoginData)).rejects.toThrow(
        'Please verify your email address'
      );
    });

    it('should track failed login attempts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null,
        emailVerified: true,
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(validLoginData)).rejects.toThrow();

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ loginAttempts: 1 }),
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'FAILED_LOGIN',
      }));
    });
  });

  describe('logout', () => {
    it('should logout from current session', async () => {
      mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.session.count.mockResolvedValue(0);

      await authService.logout('user-1', 'refresh-token-123');

      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { refreshToken: 'refresh-token-123' },
          data: { isActive: false },
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGOUT',
      }));
    });

    it('should logout from all sessions when no token provided', async () => {
      mockPrisma.session.updateMany.mockResolvedValue({ count: 3 });
      mockRedisInstance.del.mockResolvedValue(1);

      await authService.logout('user-1');

      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', isActive: true },
        })
      );
    });
  });

  describe('logoutAll', () => {
    it('should logout from all devices', async () => {
      mockRedisInstance.del.mockResolvedValue(1);
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await authService.logoutAll('user-1');

      expect(mockRedisInstance.del).toHaveBeenCalled();
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'LOGOUT_ALL',
      }));
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email for existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        status: 'ACTIVE',
        deletedAt: null,
      });

      await authService.forgotPassword('test@example.com');

      expect(mockRedisInstance.setex).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalledWith('send-email', expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Reset'),
      }));
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'FORGOT_PASSWORD',
      }));
    });

    it('should silently succeed for non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.forgotPassword('nonexistent@example.com')
      ).resolves.toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid Redis token', async () => {
      mockRedisInstance.keys.mockResolvedValue(['password-reset:test@example.com']);
      mockRedisInstance.get.mockResolvedValue('valid-reset-token');
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'old-hashed-password',
        status: 'ACTIVE',
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);
      mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });

      await authService.resetPassword('valid-reset-token', 'NewSecureP@ss1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: 'hashed-password',
            loginAttempts: 0,
            lockedUntil: null,
          }),
        })
      );
      expect(mockRedisInstance.del).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'RESET_PASSWORD',
      }));
    });

    it('should throw error for invalid token', async () => {
      mockRedisInstance.keys.mockResolvedValue([]);
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(
        authService.resetPassword('invalid-token', 'NewSecureP@ss1')
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should throw error when new password is same as current', async () => {
      mockRedisInstance.keys.mockResolvedValue(['password-reset:test@example.com']);
      mockRedisInstance.get.mockResolvedValue('valid-reset-token');
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'same-password',
        status: 'ACTIVE',
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.resetPassword('valid-reset-token', 'SameP@ss1')
      ).rejects.toThrow('New password must be different');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid Redis token', async () => {
      mockRedisInstance.keys.mockResolvedValue(['email-verify:test@example.com']);
      mockRedisInstance.get.mockResolvedValue('valid-verify-token');
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        emailVerified: false,
        status: 'PENDING_VERIFICATION',
        deletedAt: null,
      });

      await authService.verifyEmail('valid-verify-token');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emailVerified: true,
            status: 'ACTIVE',
          }),
        })
      );
      expect(createNotification).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'VERIFY_EMAIL',
      }));
    });

    it('should throw error for invalid token', async () => {
      mockRedisInstance.keys.mockResolvedValue([]);
      mockPrisma.verificationToken.findUnique.mockResolvedValue(null);

      await expect(authService.verifyEmail('invalid-token')).rejects.toThrow(
        'Invalid or expired verification token'
      );
    });

    it('should throw error if email already verified', async () => {
      mockRedisInstance.keys.mockResolvedValue(['email-verify:test@example.com']);
      mockRedisInstance.get.mockResolvedValue('valid-verify-token');
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        emailVerified: true,
        status: 'ACTIVE',
        deletedAt: null,
      });

      await expect(authService.verifyEmail('valid-verify-token')).rejects.toThrow(
        'Email is already verified'
      );
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        emailVerified: false,
        status: 'PENDING_VERIFICATION',
        deletedAt: null,
      });

      await authService.resendVerification('test@example.com');

      expect(mockRedisInstance.del).toHaveBeenCalled();
      expect(mockRedisInstance.setex).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'RESEND_VERIFICATION',
      }));
    });

    it('should throw error for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.resendVerification('nonexistent@example.com')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if email already verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        emailVerified: true,
        status: 'ACTIVE',
        deletedAt: null,
      });

      await expect(
        authService.resendVerification('test@example.com')
      ).rejects.toThrow('Email is already verified');
    });
  });

  describe('getSessions', () => {
    it('should return user sessions', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          userAgent: 'Mozilla/5.0',
          ipAddress: '127.0.0.1',
          browserName: 'Chrome',
          browserVersion: '120',
          os: 'Windows 10/11',
          deviceType: 'Desktop',
          isActive: true,
          lastActiveAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
          createdAt: new Date(),
        },
      ];
      mockPrisma.session.findMany.mockResolvedValue(mockSessions);

      const result = await authService.getSessions('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].browserName).toBe('Chrome');
    });
  });

  describe('deleteSession', () => {
    it('should revoke a specific session', async () => {
      mockPrisma.session.findFirst.mockResolvedValue({
        id: 'session-1',
        userId: 'user-1',
      });
      mockPrisma.session.update.mockResolvedValue({});
      mockPrisma.session.count.mockResolvedValue(0);

      await authService.deleteSession('user-1', 'session-1');

      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { isActive: false },
      });
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: 'SESSION_REVOKED',
      }));
    });

    it('should throw error for non-existent session', async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      await expect(
        authService.deleteSession('user-1', 'nonexistent')
      ).rejects.toThrow('Session not found');
    });

    it('should throw error when trying to delete another user\'s session', async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      await expect(
        authService.deleteSession('user-1', 'session-owned-by-another')
      ).rejects.toThrow('Session not found');
    });
  });

  describe('getLoginHistory', () => {
    it('should return paginated login history', async () => {
      const mockHistory = [
        {
          id: 'login-1',
          ipAddress: '127.0.0.1',
          browserName: 'Chrome',
          browserVersion: '120',
          os: 'Windows 10/11',
          deviceType: 'Desktop',
          location: null,
          status: 'SUCCESS',
          failureReason: null,
          createdAt: new Date(),
        },
      ];
      mockPrisma.loginHistory.findMany.mockResolvedValue(mockHistory);
      mockPrisma.loginHistory.count.mockResolvedValue(1);

      const result = await authService.getLoginHistory('user-1', 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
    });
  });
});

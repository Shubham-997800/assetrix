const mockPrismaObject = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  department: {
    findUnique: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    updateMany: jest.fn(),
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
};

jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: mockPrismaObject,
}));

const mockConfig: Record<string, unknown> = {
  nodeEnv: "development",
  jwt: { secret: "secret", refreshSecret: "refresh-secret" },
  frontendUrl: "http://localhost:5173",
};

jest.mock("../../config/env", () => ({
  config: mockConfig,
}));

jest.mock("../../config/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../modules/shared/jwt", () => ({
  generateTokenPair: jest.fn().mockReturnValue({ accessToken: "mock-access", refreshToken: "mock-refresh" }),
  generateToken: jest.fn().mockReturnValue("mock-token-abc123"),
}));

jest.mock("../../modules/shared/password", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed-password"),
  comparePassword: jest.fn().mockResolvedValue(false),
}));

jest.mock("../../modules/shared/notifications", () => ({
  createNotification: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../modules/shared/audit", () => ({
  createAuditLog: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../modules/shared/email", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  emailTemplate: jest.fn().mockReturnValue("<html>Assetrix</html>"),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
  verify: jest.fn().mockReturnValue({
    userId: "test-user-id",
    email: "test@example.com",
    role: "EMPLOYEE",
    type: "refresh",
  }),
}));

import * as authService from "../../modules/auth/service";
import prisma from "../../config/prisma";
import { comparePassword } from "../../modules/shared/password";
import { createNotification } from "../../modules/shared/notifications";
import { createAuditLog } from "../../modules/shared/audit";
import { sendEmail } from "../../modules/shared/email";

const mockPrisma = prisma as unknown as typeof mockPrismaObject;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig.nodeEnv = "development";
    (comparePassword as jest.Mock).mockResolvedValue(false);
    mockPrisma.session.create.mockResolvedValue({ id: "session-1" });
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
    mockPrisma.refreshToken.create.mockResolvedValue({});
    mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.loginHistory.findMany.mockResolvedValue([]);
    mockPrisma.session.findMany.mockResolvedValue([]);
  });

  describe("register", () => {
    const validRegisterData = {
      email: "test@example.com",
      password: "SecureP@ss1",
      confirmPassword: "SecureP@ss1",
      firstName: "John",
      lastName: "Doe",
      termsAccepted: true,
    };

    it("should register a new user successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "EMPLOYEE",
        status: "ACTIVE",
      });

      const result = await authService.register(validRegisterData, "127.0.0.1", "Mozilla/5.0");

      expect(result.user.email).toBe("test@example.com");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          status: "ACTIVE",
          emailVerified: true,
        }),
      }));
      expect(mockPrisma.verificationToken.create).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
      expect(createNotification).not.toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "REGISTER",
      }));
    });

    it("should throw error if terms not accepted", async () => {
      await expect(
        authService.register({ ...validRegisterData, termsAccepted: false })
      ).rejects.toThrow("You must accept the terms and conditions");
    });

    it("should throw error if email already exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: "existing",
        deletedAt: null,
      });

      await expect(authService.register(validRegisterData)).rejects.toThrow(
        "An account with this email already exists"
      );
    });

    it("should throw error if employee ID already exists", async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "existing", deletedAt: null });

      await expect(
        authService.register({ ...validRegisterData, employeeId: "EMP001" })
      ).rejects.toThrow("An account with this employee ID already exists");
    });

    it("should validate department exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.department.findUnique.mockResolvedValue(null);

      await expect(
        authService.register({ ...validRegisterData, departmentId: "invalid-dept" })
      ).rejects.toThrow("Department not found");
    });
  });

  describe("login", () => {
    const validLoginData = { email: "test@example.com", password: "SecureP@ss1" };

    const activeUser = {
      id: "user-1",
      email: "test@example.com",
      password: "hashed-password",
      firstName: "John",
      lastName: "Doe",
      role: "EMPLOYEE",
      status: "ACTIVE",
      avatar: null,
      lastLoginAt: null,
      loginAttempts: 0,
      lockedUntil: null,
      emailVerified: true,
      deletedAt: null,
    };

    it("should login successfully with valid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(activeUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(activeUser);
      mockPrisma.loginHistory.create.mockResolvedValue({});

      const result = await authService.login(validLoginData, "127.0.0.1", "Mozilla/5.0");

      expect(result.user.email).toBe("test@example.com");
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
        action: "LOGIN",
      }));
    });

    it("should throw error for non-existent user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(validLoginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error for deleted user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        deletedAt: new Date(),
      });

      await expect(authService.login(validLoginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should lock account after max failed attempts", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...activeUser, loginAttempts: 4 });

      await expect(authService.login(validLoginData)).rejects.toThrow(
        "Account locked after 5 failed attempts"
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

    it("should throw error when account is locked", async () => {
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        loginAttempts: 5,
        lockedUntil: futureDate,
      });

      await expect(authService.login(validLoginData)).rejects.toThrow("Account is locked");
    });

    it("should throw error for suspended account", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...activeUser, status: "SUSPENDED" });

      await expect(authService.login(validLoginData)).rejects.toThrow(
        "Your account has been suspended"
      );
    });

    it("should throw error for unverified email in production", async () => {
      mockConfig.nodeEnv = "production";
      mockPrisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        status: "PENDING_VERIFICATION",
        emailVerified: false,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(validLoginData)).rejects.toThrow(
        "Please verify your email address"
      );
    });

    it("should track failed login attempts", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(activeUser);

      await expect(authService.login(validLoginData)).rejects.toThrow();

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ loginAttempts: 1 }),
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "FAILED_LOGIN",
      }));
    });
  });

  describe("logout", () => {
    it("should logout from current session", async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: "session-1" });

      await authService.logout("user-1", "refresh-token-123");

      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { refreshToken: "refresh-token-123" },
          data: { isActive: false },
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "LOGOUT",
      }));
    });

    it("should logout from all sessions when no token provided", async () => {
      mockPrisma.session.updateMany.mockResolvedValue({ count: 3 });

      await authService.logout("user-1");

      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1", isActive: true },
        })
      );
    });
  });

  describe("logoutAll", () => {
    it("should logout from all devices", async () => {
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await authService.logoutAll("user-1");

      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "LOGOUT_ALL",
      }));
    });
  });

  describe("forgotPassword", () => {
    it("should send password reset email for existing user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        status: "ACTIVE",
        deletedAt: null,
      });
      mockPrisma.passwordResetToken.create.mockResolvedValue({});

      await authService.forgotPassword("test@example.com");

      expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        to: "test@example.com",
        subject: expect.stringContaining("Reset"),
      }));
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "FORGOT_PASSWORD",
      }));
    });

    it("should silently succeed for non-existent email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.forgotPassword("nonexistent@example.com")
      ).resolves.toBeUndefined();
    });
  });

  describe("resetPassword", () => {
    it("should reset password with valid token", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        password: "old-hashed-password",
        status: "ACTIVE",
        deletedAt: null,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.passwordResetToken.updateMany.mockResolvedValue({ count: 1 });

      await authService.resetPassword("valid-reset-token", "NewSecureP@ss1");

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: "hashed-password",
            loginAttempts: 0,
            lockedUntil: null,
          }),
        })
      );
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "RESET_PASSWORD",
      }));
    });

    it("should throw error for invalid token", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(
        authService.resetPassword("invalid-token", "NewSecureP@ss1")
      ).rejects.toThrow("Invalid or expired reset token");
    });

    it("should throw error when new password is same as current", async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() + 3600000),
        isUsed: false,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        password: "same-password",
        status: "ACTIVE",
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.resetPassword("valid-reset-token", "SameP@ss1")
      ).rejects.toThrow("New password must be different");
    });
  });

  describe("verifyEmail", () => {
    it("should verify email with valid token", async () => {
      mockPrisma.verificationToken.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() + 3600000),
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        emailVerified: false,
        status: "PENDING_VERIFICATION",
        deletedAt: null,
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.verificationToken.deleteMany.mockResolvedValue({ count: 1 });

      await authService.verifyEmail("valid-verify-token");

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emailVerified: true,
            status: "ACTIVE",
          }),
        })
      );
      expect(createNotification).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "VERIFY_EMAIL",
      }));
    });

    it("should throw error for invalid token", async () => {
      mockPrisma.verificationToken.findUnique.mockResolvedValue(null);

      await expect(authService.verifyEmail("invalid-token")).rejects.toThrow(
        "Invalid or expired verification token"
      );
    });

    it("should throw error if email already verified", async () => {
      mockPrisma.verificationToken.findUnique.mockResolvedValue({
        userId: "user-1",
        expiresAt: new Date(Date.now() + 3600000),
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        emailVerified: true,
        status: "ACTIVE",
        deletedAt: null,
      });

      await expect(authService.verifyEmail("valid-verify-token")).rejects.toThrow(
        "Email is already verified"
      );
    });
  });

  describe("resendVerification", () => {
    it("should resend verification email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        emailVerified: false,
        status: "PENDING_VERIFICATION",
        deletedAt: null,
      });
      mockPrisma.verificationToken.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.verificationToken.create.mockResolvedValue({});

      await authService.resendVerification("test@example.com");

      expect(sendEmail).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "RESEND_VERIFICATION",
      }));
    });

    it("should throw error for non-existent user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.resendVerification("nonexistent@example.com")
      ).rejects.toThrow("User not found");
    });

    it("should throw error if email already verified", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        emailVerified: true,
        status: "ACTIVE",
        deletedAt: null,
      });

      await expect(
        authService.resendVerification("test@example.com")
      ).rejects.toThrow("Email is already verified");
    });
  });

  describe("getSessions", () => {
    it("should return user sessions", async () => {
      const mockSessions = [
        {
          id: "session-1",
          userAgent: "Mozilla/5.0",
          ipAddress: "127.0.0.1",
          browserName: "Chrome",
          browserVersion: "120",
          os: "Windows 10/11",
          deviceType: "Desktop",
          isActive: true,
          lastActiveAt: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
          createdAt: new Date(),
        },
      ];
      mockPrisma.session.findMany.mockResolvedValue(mockSessions);

      const result = await authService.getSessions("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].browserName).toBe("Chrome");
    });
  });

  describe("deleteSession", () => {
    it("should revoke a specific session", async () => {
      mockPrisma.session.findFirst.mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });
      mockPrisma.session.update.mockResolvedValue({});

      await authService.deleteSession("user-1", "session-1");

      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: "session-1" },
        data: { isActive: false },
      });
      expect(createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        action: "SESSION_REVOKED",
      }));
    });

    it("should throw error for non-existent session", async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      await expect(
        authService.deleteSession("user-1", "nonexistent")
      ).rejects.toThrow("Session not found");
    });
  });

  describe("getLoginHistory", () => {
    it("should return paginated login history", async () => {
      const mockHistory = [
        {
          id: "login-1",
          ipAddress: "127.0.0.1",
          browserName: "Chrome",
          browserVersion: "120",
          os: "Windows 10/11",
          deviceType: "Desktop",
          location: null,
          status: "SUCCESS",
          failureReason: null,
          createdAt: new Date(),
        },
      ];
      mockPrisma.loginHistory.findMany.mockResolvedValue(mockHistory);
      mockPrisma.loginHistory.count.mockResolvedValue(1);

      const result = await authService.getLoginHistory("user-1", 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
    });
  });
});

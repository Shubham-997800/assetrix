import express from "express";
import request from "supertest";

const mockPrismaObject = {
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
  department: {
    findUnique: jest.fn(),
  },
};

jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: mockPrismaObject,
}));

jest.mock("../../config/env", () => ({
  config: {
    nodeEnv: "development",
    jwt: { secret: "secret", refreshSecret: "refresh-secret" },
    frontendUrl: "http://localhost:5173",
  },
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

jest.mock("../../modules/shared/password", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed-password"),
  comparePassword: jest.fn(),
}));

jest.mock("../../modules/shared/jwt", () => ({
  generateTokenPair: jest.fn().mockReturnValue({ accessToken: "mock-access", refreshToken: "mock-refresh" }),
  generateToken: jest.fn().mockReturnValue("mock-token-abc123"),
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

jest.mock("../../middleware/auth", () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: "test-user-id", email: "test@example.com", role: "ADMIN" };
    next();
  },
  authorize: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../../middleware/rate-limit", () => ({
  rateLimiter: (_req: any, _res: any, next: any) => next(),
  authRateLimiter: (_req: any, _res: any, next: any) => next(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
  verify: jest.fn().mockReturnValue({
    userId: "test-user-id",
    email: "test@example.com",
    role: "ADMIN",
    type: "access",
  }),
}));

import authRouter from "../../modules/auth/routes";
import prisma from "../../config/prisma";
import { comparePassword } from "../../modules/shared/password";
import { errorHandler } from "../../middleware/error";

const mockPrisma = prisma as unknown as typeof mockPrismaObject;

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(errorHandler);

describe("Auth Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (comparePassword as jest.Mock).mockResolvedValue(false);
    mockPrisma.session.create.mockResolvedValue({ id: "session-1" });
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
    mockPrisma.refreshToken.create.mockResolvedValue({});
    mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.session.count.mockResolvedValue(0);
    mockPrisma.loginHistory.findMany.mockResolvedValue([]);
    mockPrisma.session.findMany.mockResolvedValue([]);
  });

  describe("POST /api/v1/auth/register", () => {
    it("should return 201 for valid registration", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "ADMIN",
        status: "ACTIVE",
      });

      const res = await request(app).post("/api/v1/auth/register").send({
        email: "test@example.com",
        password: "SecureP@ss1",
        confirmPassword: "SecureP@ss1",
        firstName: "John",
        lastName: "Doe",
        termsAccepted: true,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("test@example.com");
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("should return 422 for invalid data", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "invalid-email", password: "weak" });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it("should return 409 for duplicate email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "existing", deletedAt: null });

      const res = await request(app).post("/api/v1/auth/register").send({
        email: "existing@example.com",
        password: "SecureP@ss1",
        confirmPassword: "SecureP@ss1",
        firstName: "John",
        lastName: "Doe",
        termsAccepted: true,
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should return 200 for valid login", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        password: "hashed-password",
        firstName: "John",
        lastName: "Doe",
        role: "ADMIN",
        status: "ACTIVE",
        avatar: null,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null,
        emailVerified: true,
        deletedAt: null,
      });
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({});

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "SecureP@ss1",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "wrong@example.com", password: "WrongP@ss1" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should return 200 for logout", async () => {
      mockPrisma.session.findFirst.mockResolvedValue({ id: "session-1" });

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/auth/forgot-password", () => {
    it("should return 200 for forgot password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        firstName: "John",
        status: "ACTIVE",
        deletedAt: null,
      });
      mockPrisma.passwordResetToken.create.mockResolvedValue({});

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 200 even for non-existent email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/v1/auth/verify-email", () => {
    it("should return 200 for valid verification token", async () => {
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

      const res = await request(app)
        .post("/api/v1/auth/verify-email")
        .send({ token: "valid-token" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 400 for invalid token", async () => {
      mockPrisma.verificationToken.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/verify-email")
        .send({ token: "invalid-token" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should return 200 with user profile", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "test-user-id",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: null,
        avatar: null,
        role: "ADMIN",
        status: "ACTIVE",
        employeeId: null,
        designation: null,
        departmentId: null,
        emailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        department: null,
      });

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("test@example.com");
    });

    it("should return 404 when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/v1/auth/sessions", () => {
    it("should return 200 with sessions list", async () => {
      mockPrisma.session.findMany.mockResolvedValue([
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
      ]);

      const res = await request(app)
        .get("/api/v1/auth/sessions")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("DELETE /api/v1/auth/sessions/:id", () => {
    const validSessionId = "11111111-1111-4111-8111-111111111111";
    const missingSessionId = "00000000-0000-4000-8000-000000000000";

    it("should return 200 for session deletion", async () => {
      mockPrisma.session.findFirst.mockResolvedValue({
        id: validSessionId,
        userId: "test-user-id",
      });
      mockPrisma.session.update.mockResolvedValue({});

      const res = await request(app)
        .delete(`/api/v1/auth/sessions/${validSessionId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for non-existent session", async () => {
      mockPrisma.session.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/auth/sessions/${missingSessionId}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/v1/auth/login-history", () => {
    it("should return 200 with login history", async () => {
      mockPrisma.loginHistory.findMany.mockResolvedValue([
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
      ]);
      mockPrisma.loginHistory.count.mockResolvedValue(1);

      const res = await request(app)
        .get("/api/v1/auth/login-history")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});

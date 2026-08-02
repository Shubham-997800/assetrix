import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { config } from "./config/env";
import { requestLogger } from "./middleware/logger";
import { rateLimiter } from "./middleware/rate-limit";
import { errorHandler, notFoundHandler } from "./middleware/error";
import authRouter from "./modules/auth/routes";
import userRouter from "./modules/users/routes";
import departmentRouter from "./modules/departments/routes";
import assetRouter from "./modules/assets/routes";
import allocationRouter from "./modules/allocations/routes";
import bookingRouter from "./modules/bookings/routes";
import maintenanceRouter from "./modules/maintenance/routes";
import notificationRouter from "./modules/notifications/routes";
import notificationPreferenceRouter from "./modules/notification-preferences/routes";
import analyticsRouter from "./modules/analytics/routes";
import reportRouter from "./modules/reports/routes";
import auditRouter from "./modules/audit/routes";
import auditCycleRouter from "./modules/audit-cycles/routes";
import assetCategoryRouter from "./modules/asset-categories/routes";
import adminRouter from "./modules/admin/routes";
import aiRouter from "./modules/ai/routes";

const app = express();

// ─── GLOBAL MIDDLEWARE ────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = [
  config.frontendUrl,
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((o) => {
        if (o.includes("*")) {
          const pattern = new RegExp("^" + o.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
          return pattern.test(origin);
        }
        return o === origin;
      });
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(requestLogger);
app.use(rateLimiter);

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── API ROUTES ───────────────────────────────────────────
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/departments", departmentRouter);
apiRouter.use("/assets", assetRouter);
apiRouter.use("/allocations", allocationRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/maintenance", maintenanceRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/notification-preferences", notificationPreferenceRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/audit", auditRouter);
apiRouter.use("/audit-cycles", auditCycleRouter);
apiRouter.use("/asset-categories", assetCategoryRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/ai", aiRouter);
app.use(`/api/${config.apiVersion}`, apiRouter);

// ─── ERROR HANDLING ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

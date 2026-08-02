import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const isProduction = process.env.NODE_ENV === "production";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

if (isProduction) {
  requireEnv("DATABASE_URL");
  requireEnv("JWT_SECRET");
  requireEnv("JWT_REFRESH_SECRET");
  requireEnv("FRONTEND_URL");
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  apiVersion: process.env.API_VERSION || "v1",

  database: {
    url: requireEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/assetrix?schema=public"),
    directUrl: requireEnv("DIRECT_URL", requireEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/assetrix?schema=public")),
  },

  jwt: {
    secret: requireEnv("JWT_SECRET"),
    refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },

  supabase: {
    url: process.env.SUPABASE_URL || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    buckets: {
      avatars: process.env.SUPABASE_STORAGE_BUCKET_AVATARS || "avatars",
      assetDocuments: process.env.SUPABASE_STORAGE_BUCKET_ASSET_DOCUMENTS || "asset-documents",
      maintenanceAttachments: process.env.SUPABASE_STORAGE_BUCKET_MAINTENANCE_ATTACHMENTS || "maintenance-attachments",
      reports: process.env.SUPABASE_STORAGE_BUCKET_REPORTS || "reports",
    },
  },

  email: {
    enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "Assetrix <noreply@assetrix.com>",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  frontendUrl: requireEnv("FRONTEND_URL", "http://localhost:5173"),

  logLevel: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
} as const;

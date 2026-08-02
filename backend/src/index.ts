import app from "./app";
import { config } from "./config/env";
import logger from "./config/logger";
import prisma from "./config/prisma";
import { startJobs } from "./jobs";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    const server = app.listen(config.port, () => {
      logger.info(`Assetrix API running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    startJobs();

    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      try {
        server.close();
        await prisma.$disconnect();
      } finally {
        process.exit(0);
      }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("unhandledRejection", (reason: unknown) => {
      logger.error({ reason }, "Unhandled rejection");
    });
    process.on("uncaughtException", (error: Error) => {
      logger.error({ error: error.message, stack: error.stack }, "Uncaught exception");
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

void startServer();

import pino from "pino";
import { config } from "./env";

const logger = pino({
  level: config.logLevel,
  base: { service: "assetrix-backend" },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

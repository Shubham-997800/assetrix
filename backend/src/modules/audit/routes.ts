import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  auditQuerySchema,
  entityParamsSchema,
  exportAuditLogsSchema,
  recentActivityQuerySchema,
  userParamsSchema,
} from "./validators";
import * as auditController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(auditQuerySchema, "query"), auditController.getAll);
router.get("/recent", validate(recentActivityQuerySchema, "query"), auditController.getRecentActivity);
router.get("/entity/:entity/:entityId", validate(entityParamsSchema, "params"), auditController.getByEntity);
router.get("/user/:userId", validate(userParamsSchema, "params"), auditController.getByUser);
router.post("/export", validate(exportAuditLogsSchema), auditController.exportAuditLogs);

export default router;

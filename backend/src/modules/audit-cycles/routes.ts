import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  assignAuditorsSchema,
  auditCycleParamsSchema,
  auditCycleQuerySchema,
  createAuditCycleSchema,
  createDiscrepancySchema,
  resolveDiscrepancyParamsSchema,
  resolveDiscrepancySchema,
  updateAuditCycleSchema,
  verifyAssetSchema,
} from "./validators";
import * as auditCycleController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(auditCycleQuerySchema, "query"), auditCycleController.getAll);
router.get("/:id", validate(auditCycleParamsSchema, "params"), auditCycleController.getById);
router.get("/:id/history", validate(auditCycleParamsSchema, "params"), auditCycleController.getCycleHistory);

router.post("/", validate(createAuditCycleSchema), auditCycleController.create);
router.put(
  "/:id",
  validate(auditCycleParamsSchema, "params"),
  validate(updateAuditCycleSchema),
  auditCycleController.update
);
router.delete(
  "/:id",
  validate(auditCycleParamsSchema, "params"),
  auditCycleController.remove
);

router.post(
  "/:id/auditors",
  validate(auditCycleParamsSchema, "params"),
  validate(assignAuditorsSchema),
  auditCycleController.assignAuditors
);
router.post(
  "/:id/verify",
  validate(auditCycleParamsSchema, "params"),
  validate(verifyAssetSchema),
  auditCycleController.verifyAsset
);
router.post(
  "/:id/discrepancies",
  validate(auditCycleParamsSchema, "params"),
  validate(createDiscrepancySchema),
  auditCycleController.createDiscrepancy
);
router.patch(
  "/discrepancies/:discrepancyId/resolve",
  validate(resolveDiscrepancyParamsSchema, "params"),
  validate(resolveDiscrepancySchema),
  auditCycleController.resolveDiscrepancy
);
router.post("/:id/close", validate(auditCycleParamsSchema, "params"), auditCycleController.closeCycle);

export default router;

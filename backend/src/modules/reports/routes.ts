import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  generateReportSchema,
  reportIdParamSchema,
  reportQuerySchema,
} from "./validators";
import * as reportController from "./controller";

const router = Router();

router.use(authenticate);

router.post("/", validate(generateReportSchema), reportController.generateReport);
router.get("/", validate(reportQuerySchema, "query"), reportController.getAllReports);
router.get("/:id", validate(reportIdParamSchema, "params"), reportController.getReportById);
router.get("/:id/download", validate(reportIdParamSchema, "params"), reportController.downloadReport);
router.delete("/:id", validate(reportIdParamSchema, "params"), reportController.deleteReport);

export default router;

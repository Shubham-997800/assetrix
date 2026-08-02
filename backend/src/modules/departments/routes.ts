import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createDepartmentSchema,
  departmentParamsSchema,
  departmentQuerySchema,
  updateDepartmentSchema,
} from "./validators";
import * as departmentController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(departmentQuerySchema, "query"), departmentController.getAll);
router.get("/tree", departmentController.getTree);
router.get("/:id/stats", validate(departmentParamsSchema, "params"), departmentController.getDepartmentStats);
router.get("/:id", validate(departmentParamsSchema, "params"), departmentController.getById);

router.post(
  "/",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(createDepartmentSchema),
  departmentController.create
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(departmentParamsSchema, "params"),
  validate(updateDepartmentSchema),
  departmentController.update
);

router.patch(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(departmentParamsSchema, "params"),
  validate(updateDepartmentSchema),
  departmentController.update
);

router.delete(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(departmentParamsSchema, "params"),
  departmentController.remove
);

export default router;

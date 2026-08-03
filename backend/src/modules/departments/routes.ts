import { Router } from "express";
import { authenticate } from "../../middleware/auth";
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
  validate(createDepartmentSchema),
  departmentController.create
);

router.put(
  "/:id",
  validate(departmentParamsSchema, "params"),
  validate(updateDepartmentSchema),
  departmentController.update
);

router.patch(
  "/:id",
  validate(departmentParamsSchema, "params"),
  validate(updateDepartmentSchema),
  departmentController.update
);

router.delete(
  "/:id",
  validate(departmentParamsSchema, "params"),
  departmentController.remove
);

export default router;

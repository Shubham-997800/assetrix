import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createAssetSchema,
  updateAssetSchema,
  assetQuerySchema,
  assetParamsSchema,
  qrCodeParamsSchema,
  changeStatusSchema,
  changeConditionSchema,
  assignAssetSchema,
} from "./validators";
import * as assetController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(assetQuerySchema, "query"), assetController.getAll);

router.get("/stats", assetController.getStats);

router.get("/search", assetController.search);

router.get("/qr/:qrCode", validate(qrCodeParamsSchema, "params"), assetController.getByQrCode);

router.get("/:id", validate(assetParamsSchema, "params"), assetController.getById);

router.get("/:id/history", validate(assetParamsSchema, "params"), assetController.getHistory);

router.post(
  "/",
  validate(createAssetSchema),
  assetController.create
);

router.put(
  "/:id",
  validate(assetParamsSchema, "params"),
  validate(updateAssetSchema),
  assetController.update
);

router.delete(
  "/:id",
  validate(assetParamsSchema, "params"),
  assetController.remove
);

router.post(
  "/:id/assign",
  validate(assetParamsSchema, "params"),
  validate(assignAssetSchema),
  assetController.assign
);

router.post(
  "/:id/unallocate",
  validate(assetParamsSchema, "params"),
  validate(changeConditionSchema),
  assetController.unallocate
);

router.patch(
  "/:id/status",
  validate(assetParamsSchema, "params"),
  validate(changeStatusSchema),
  assetController.changeStatus
);

router.patch(
  "/:id/condition",
  validate(assetParamsSchema, "params"),
  validate(changeConditionSchema),
  assetController.changeCondition
);

export default router;

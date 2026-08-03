import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  assetCategoryParamsSchema,
  assetCategoryQuerySchema,
  createAssetCategorySchema,
  updateAssetCategorySchema,
} from "./validators";
import * as assetCategoryController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(assetCategoryQuerySchema, "query"), assetCategoryController.getAll);
router.get("/tree", assetCategoryController.getTree);
router.get("/:id/stats", validate(assetCategoryParamsSchema, "params"), assetCategoryController.getCategoryStats);
router.get("/:id", validate(assetCategoryParamsSchema, "params"), assetCategoryController.getById);

router.post(
  "/",
  validate(createAssetCategorySchema),
  assetCategoryController.create
);

router.put(
  "/:id",
  validate(assetCategoryParamsSchema, "params"),
  validate(updateAssetCategorySchema),
  assetCategoryController.update
);

router.patch(
  "/:id",
  validate(assetCategoryParamsSchema, "params"),
  validate(updateAssetCategorySchema),
  assetCategoryController.update
);

router.delete(
  "/:id",
  validate(assetCategoryParamsSchema, "params"),
  assetCategoryController.remove
);

export default router;

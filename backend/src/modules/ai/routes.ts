import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  assetIdParamSchema,
  recommendationIdParamSchema,
  actionedBodySchema,
  recommendationStatsQuerySchema,
  predictiveMaintenanceQuerySchema,
} from "./validators";
import * as aiController from "./controller";

const router = Router();

router.get(
  "/health/:assetId",
  authenticate,
  validate(assetIdParamSchema, "params"),
  aiController.getAssetHealthScore
);

router.post(
  "/recommendations/generate",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN", "DEPARTMENT_MANAGER"),
  aiController.generateRecommendations
);

router.get(
  "/recommendations/stats",
  authenticate,
  validate(recommendationStatsQuerySchema, "query"),
  aiController.getRecommendationStats
);

router.patch(
  "/recommendations/:id/action",
  authenticate,
  validate(recommendationIdParamSchema, "params"),
  validate(actionedBodySchema, "body"),
  aiController.markAsActioned
);

router.get(
  "/recommendations/:assetId",
  authenticate,
  validate(assetIdParamSchema, "params"),
  aiController.getRecommendationsForAsset
);

router.get(
  "/predictive-maintenance",
  authenticate,
  validate(predictiveMaintenanceQuerySchema, "query"),
  aiController.getPredictiveMaintenance
);

export default router;

import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { updateSystemSettingSchema, forceLogoutParamsSchema } from "./validators";
import * as adminController from "./controller";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/stats", adminController.getSystemStats);
router.get("/stats/users", adminController.getUserStats);
router.get("/stats/assets", adminController.getAssetStats);
router.get("/health", adminController.getSystemHealth);
router.get("/settings", adminController.getSystemSettings);
router.put("/settings", validate(updateSystemSettingSchema), adminController.updateSystemSetting);
router.get("/activity", adminController.getSystemActivity);
router.post(
  "/users/:userId/force-logout",
  validate(forceLogoutParamsSchema, "params"),
  adminController.forceLogout
);
router.post("/backup", adminController.backupDatabase);

export default router;

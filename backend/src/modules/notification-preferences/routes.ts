import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { updatePreferenceSchema } from "./validators";
import * as notificationPreferenceController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", notificationPreferenceController.getPreferences);
router.put("/", validate(updatePreferenceSchema), notificationPreferenceController.updatePreferences);

export default router;

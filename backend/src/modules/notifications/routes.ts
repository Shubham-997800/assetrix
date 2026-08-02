import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { notificationIdParamSchema, notificationQuerySchema } from "./validators";
import * as notificationController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(notificationQuerySchema, "query"), notificationController.getAll);
router.get("/unread-count", notificationController.getUnreadCount);
router.get("/activity", notificationController.getActivity);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", validate(notificationIdParamSchema, "params"), notificationController.markAsRead);
router.delete("/read", notificationController.deleteAllRead);
router.delete("/:id", validate(notificationIdParamSchema, "params"), notificationController.deleteNotification);

export default router;

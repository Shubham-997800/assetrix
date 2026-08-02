import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as analyticsController from "./controller";

const router = Router();

router.get("/dashboard", authenticate, analyticsController.getDashboardStats);
router.get("/assets", authenticate, analyticsController.getAssetAnalytics);
router.get("/maintenance", authenticate, analyticsController.getMaintenanceAnalytics);
router.get("/bookings", authenticate, analyticsController.getBookingAnalytics);
router.get("/financial", authenticate, analyticsController.getFinancialAnalytics);
router.get("/departments", authenticate, analyticsController.getDepartmentAnalytics);

export default router;

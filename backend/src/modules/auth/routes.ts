import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { authRateLimiter } from "../../middleware/rate-limit";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  deleteSessionSchema,
} from "./validators";
import * as authController from "./controller";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), authController.register);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.get("/verify-email", authController.verifyEmail);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-verification", authRateLimiter, validate(resendVerificationSchema), authController.resendVerification);
router.get("/me", authenticate, authController.me);
router.get("/sessions", authenticate, authController.getSessions);
router.delete("/sessions/:id", authenticate, validate(deleteSessionSchema, "params"), authController.deleteSession);
router.get("/login-history", authenticate, authController.getLoginHistory);

export default router;

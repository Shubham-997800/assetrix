import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  changePasswordSchema,
  changeRoleSchema,
  changeStatusSchema,
  createUserSchema,
  profileUpdateSchema,
  updateUserSchema,
  userQuerySchema,
} from "./validators";
import * as userController from "./controller";

const router = Router();

router.get("/", authenticate, validate(userQuerySchema, "query"), userController.getAll);
router.get("/email/:email", authenticate, userController.getByEmail);
router.get("/:id/reports", authenticate, userController.getDirectReports);
router.get("/:id", authenticate, userController.getById);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(createUserSchema),
  userController.create
);
router.post("/change-password", authenticate, validate(changePasswordSchema), userController.changePassword);

router.put("/profile", authenticate, validate(profileUpdateSchema), userController.updateProfile);
router.patch("/profile", authenticate, validate(profileUpdateSchema), userController.updateProfile);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(updateUserSchema),
  userController.update
);

router.patch(
  "/:id/role",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(changeRoleSchema),
  userController.changeRole
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(changeStatusSchema),
  userController.changeStatus
);

router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), userController.remove);

export default router;

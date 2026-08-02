import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  allocationIdParamSchema,
  allocationQuerySchema,
  approveTransferSchema,
  createAllocationSchema,
  rejectTransferSchema,
  returnAllocationSchema,
  transferAllocationSchema,
} from "./validators";
import * as allocationController from "./controller";

const router = Router();

router.use(authenticate);

router.get("/", validate(allocationQuerySchema, "query"), allocationController.getAllAllocations);

router.get("/active", validate(allocationQuerySchema, "query"), allocationController.getActiveAllocations);

router.get("/:id", validate(allocationIdParamSchema, "params"), allocationController.getAllocationById);

router.post(
  "/",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER"),
  validate(createAllocationSchema),
  allocationController.createAllocation
);

router.post(
  "/:id/return",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER", "TECHNICIAN"),
  validate(allocationIdParamSchema, "params"),
  validate(returnAllocationSchema),
  allocationController.returnAllocation
);

router.get(
  "/transfers/pending",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER"),
  validate(allocationQuerySchema, "query"),
  allocationController.getPendingTransfers
);

router.post(
  "/:id/transfer",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER"),
  validate(allocationIdParamSchema, "params"),
  validate(transferAllocationSchema),
  allocationController.transferAsset
);

router.post(
  "/:id/transfer/approve",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER"),
  validate(allocationIdParamSchema, "params"),
  validate(approveTransferSchema),
  allocationController.approveTransfer
);

router.post(
  "/:id/transfer/reject",
  authorize("SUPER_ADMIN", "ADMIN", "DEPARTMENT_MANAGER"),
  validate(allocationIdParamSchema, "params"),
  validate(rejectTransferSchema),
  allocationController.rejectTransfer
);

export default router;

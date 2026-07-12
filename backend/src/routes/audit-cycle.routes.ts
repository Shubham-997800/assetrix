import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createAuditCycleSchema,
  updateAuditCycleSchema,
  auditCycleQuerySchema,
  auditCycleParamsSchema,
  assignAuditorsSchema,
  verifyAssetSchema,
  createDiscrepancySchema,
  resolveDiscrepancySchema,
} from '../validators/audit-cycle.schema';
import * as auditCycleController from '../controllers/audit-cycle.controller';
import { ROLES } from '../constants';

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER));

router.get('/', validate(auditCycleQuerySchema, 'query'), auditCycleController.getAll);
router.get('/:id', validate(auditCycleParamsSchema, 'params'), auditCycleController.getById);
router.get('/:id/history', validate(auditCycleParamsSchema, 'params'), auditCycleController.getCycleHistory);

router.post('/', validate(createAuditCycleSchema), auditCycleController.create);
router.put('/:id', validate(auditCycleParamsSchema, 'params'), validate(updateAuditCycleSchema), auditCycleController.update);
router.delete('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), validate(auditCycleParamsSchema, 'params'), auditCycleController.remove);

router.post('/:id/auditors', validate(auditCycleParamsSchema, 'params'), validate(assignAuditorsSchema), auditCycleController.assignAuditors);
router.post('/:id/verify', validate(auditCycleParamsSchema, 'params'), validate(verifyAssetSchema), auditCycleController.verifyAsset);
router.post('/:id/discrepancies', validate(auditCycleParamsSchema, 'params'), validate(createDiscrepancySchema), auditCycleController.createDiscrepancy);
router.patch('/discrepancies/:discrepancyId/resolve', validate(resolveDiscrepancySchema), auditCycleController.resolveDiscrepancy);
router.post('/:id/close', validate(auditCycleParamsSchema, 'params'), auditCycleController.closeCycle);

export { router as auditCycleRouter };

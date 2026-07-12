import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as auditController from '../controllers/audit.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Audit
 *   description: System audit trail and activity logs
 */

router.get('/', auditController.getAll);
router.get('/recent', auditController.getRecentActivity);
router.get('/entity/:entity/:entityId', auditController.getByEntity);
router.get('/user/:userId', auditController.getByUser);
router.post('/export', auditController.exportAuditLogs);

export { router as auditRouter };

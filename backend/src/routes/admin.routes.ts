import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as adminController from '../controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System administration and configuration
 */

router.get('/stats', adminController.getSystemStats);
router.get('/stats/users', adminController.getUserStats);
router.get('/stats/assets', adminController.getAssetStats);
router.get('/health', adminController.getSystemHealth);
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSetting);
router.get('/activity', adminController.getSystemActivity);
router.post('/users/:userId/force-logout', adminController.forceLogout);
router.post('/backup', adminController.backupDatabase);

export { router as adminRouter };

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification management
 */

router.get('/', notificationController.getAll);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/read', notificationController.deleteAllRead);
router.delete('/:id', notificationController.deleteNotification);

export { router as notificationRouter };

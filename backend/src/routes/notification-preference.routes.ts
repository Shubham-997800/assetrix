import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as notificationPreferenceController from '../controllers/notification-preference.controller';

const router = Router();

router.use(authenticate);

const updatePreferenceSchema = z.object({
  emailAssetAssigned: z.boolean().optional(),
  emailAssetReturned: z.boolean().optional(),
  emailBookingApproved: z.boolean().optional(),
  emailBookingRejected: z.boolean().optional(),
  emailMaintenanceAssigned: z.boolean().optional(),
  emailMaintenanceCompleted: z.boolean().optional(),
  emailMaintenanceOverdue: z.boolean().optional(),
  emailWarrantyExpiry: z.boolean().optional(),
  emailSystemAlerts: z.boolean().optional(),
  emailPasswordChanged: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
});

router.get('/', notificationPreferenceController.getPreferences);
router.put('/', validate(updatePreferenceSchema), notificationPreferenceController.updatePreferences);

export { router as notificationPreferenceRouter };

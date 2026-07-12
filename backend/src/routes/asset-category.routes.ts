import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createAssetCategorySchema,
  updateAssetCategorySchema,
  assetCategoryQuerySchema,
  assetCategoryParamsSchema,
} from '../validators/asset-category.schema';
import * as assetCategoryController from '../controllers/asset-category.controller';
import { ROLES } from '../constants';

const router = Router();

router.use(authenticate);

router.get('/', validate(assetCategoryQuerySchema, 'query'), assetCategoryController.getAll);
router.get('/tree', assetCategoryController.getTree);
router.get('/:id/stats', validate(assetCategoryParamsSchema, 'params'), assetCategoryController.getCategoryStats);
router.get('/:id', validate(assetCategoryParamsSchema, 'params'), assetCategoryController.getById);

router.post(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(createAssetCategorySchema),
  assetCategoryController.create
);

router.put(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER),
  validate(assetCategoryParamsSchema, 'params'),
  validate(updateAssetCategorySchema),
  assetCategoryController.update
);

router.delete(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(assetCategoryParamsSchema, 'params'),
  assetCategoryController.remove
);

export { router as assetCategoryRouter };

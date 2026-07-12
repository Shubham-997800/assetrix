import { Router } from 'express';
import { AssetController } from '../controllers/asset.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createAssetSchema,
  updateAssetSchema,
  assetQuerySchema,
  assetParamsSchema,
  qrCodeParamsSchema,
  changeStatusSchema,
  changeConditionSchema,
  assignAssetSchema,
} from '../validators/asset.schema';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     summary: Get all assets
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across name, assetTag, serialNumber, manufacturer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, ALLOCATED, MAINTENANCE, RETIRED, LOST, STOLEN]
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [EXCELLENT, GOOD, FAIR, POOR, DAMAGED]
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Assets retrieved successfully
 */
router.get('/', validate(assetQuerySchema, 'query'), AssetController.getAll);

/**
 * @swagger
 * /api/v1/assets/stats:
 *   get:
 *     summary: Get asset statistics
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Asset statistics
 */
router.get('/stats', AssetController.getStats);

/**
 * @swagger
 * /api/v1/assets/search:
 *   get:
 *     summary: Search assets
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', AssetController.search);

/**
 * @swagger
 * /api/v1/assets/qr/{qrCode}:
 *   get:
 *     summary: Get asset by QR code
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: qrCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset found
 *       404:
 *         description: Asset not found
 */
router.get('/qr/:qrCode', validate(qrCodeParamsSchema, 'params'), AssetController.getByQrCode);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   get:
 *     summary: Get asset by ID
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Asset retrieved
 *       404:
 *         description: Asset not found
 */
router.get('/:id', validate(assetParamsSchema, 'params'), AssetController.getById);

/**
 * @swagger
 * /api/v1/assets/{id}/history:
 *   get:
 *     summary: Get asset history
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Asset history
 */
router.get('/:id/history', validate(assetParamsSchema, 'params'), AssetController.getHistory);

/**
 * @swagger
 * /api/v1/assets:
 *   post:
 *     summary: Create a new asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               model:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Asset created
 *       422:
 *         description: Validation error
 */
router.post('/', authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), validate(createAssetSchema), AssetController.create);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   put:
 *     summary: Update an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset updated
 *       404:
 *         description: Asset not found
 */
router.put('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), validate(assetParamsSchema, 'params'), validate(updateAssetSchema), AssetController.update);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   delete:
 *     summary: Delete an asset (soft delete)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Asset deleted
 *       400:
 *         description: Asset is allocated
 *       404:
 *         description: Asset not found
 */
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(assetParamsSchema, 'params'), AssetController.delete);

/**
 * @swagger
 * /api/v1/assets/{id}/assign:
 *   post:
 *     summary: Assign asset to a user
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               expectedReturn:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset assigned
 *       400:
 *         description: Asset not available
 */
router.post('/:id/assign', authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), validate(assetParamsSchema, 'params'), validate(assignAssetSchema), AssetController.assign);

/**
 * @swagger
 * /api/v1/assets/{id}/unallocate:
 *   post:
 *     summary: Unallocate/return an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [condition]
 *             properties:
 *               condition:
 *                 type: string
 *                 enum: [EXCELLENT, GOOD, FAIR, POOR, DAMAGED]
 *     responses:
 *       200:
 *         description: Asset unallocated
 */
router.post('/:id/unallocate', authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), validate(assetParamsSchema, 'params'), validate(changeConditionSchema), AssetController.unallocate);

/**
 * @swagger
 * /api/v1/assets/{id}/status:
 *   patch:
 *     summary: Change asset status
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, ALLOCATED, MAINTENANCE, RETIRED, LOST, STOLEN]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authorize('ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), validate(assetParamsSchema, 'params'), validate(changeStatusSchema), AssetController.changeStatus);

/**
 * @swagger
 * /api/v1/assets/{id}/condition:
 *   patch:
 *     summary: Change asset condition
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [condition]
 *             properties:
 *               condition:
 *                 type: string
 *                 enum: [EXCELLENT, GOOD, FAIR, POOR, DAMAGED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Condition updated
 */
router.patch('/:id/condition', validate(assetParamsSchema, 'params'), validate(changeConditionSchema), AssetController.changeCondition);

export { router as assetRouter };

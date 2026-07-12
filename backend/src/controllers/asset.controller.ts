import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AssetService } from '../services/asset.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export class AssetController {
  static async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await AssetService.getAll(req.query as Record<string, string>);
    res.json(successResponse('Assets retrieved successfully', result.items, result.meta));
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.getById(req.params.id as string);
    res.json(successResponse('Asset retrieved successfully', asset));
  }

  static async getByQrCode(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.getByQrCode(req.params.qrCode as string);
    res.json(successResponse('Asset retrieved successfully', asset));
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.create(
      req.body,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.status(HTTP_STATUS.CREATED).json(successResponse('Asset created successfully', asset));
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.update(
      req.params.id as string,
      req.body,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.json(successResponse('Asset updated successfully', asset));
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    await AssetService.delete(req.params.id as string, req.user!.userId, req.ip, req.get('user-agent'));
    res.json(successResponse('Asset deleted successfully'));
  }

  static async assign(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.assign(
      req.params.id as string,
      req.body,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.json(successResponse('Asset assigned successfully', asset));
  }

  static async unallocate(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.unallocate(
      req.params.id as string,
      req.body.condition,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.json(successResponse('Asset unallocated successfully', asset));
  }

  static async changeStatus(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.changeStatus(
      req.params.id as string,
      req.body,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.json(successResponse('Asset status updated successfully', asset));
  }

  static async changeCondition(req: AuthenticatedRequest, res: Response) {
    const asset = await AssetService.changeCondition(
      req.params.id as string,
      req.body,
      req.user!.userId,
      req.ip,
      req.get('user-agent')
    );
    res.json(successResponse('Asset condition updated successfully', asset));
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await AssetService.getHistory(req.params.id as string, page, limit);
    res.json(successResponse('Asset history retrieved successfully', result.items, result.meta));
  }

  static async getStats(req: AuthenticatedRequest, res: Response) {
    const stats = await AssetService.getStats(req.user?.userId);
    res.json(successResponse('Asset statistics retrieved successfully', stats));
  }

  static async search(req: AuthenticatedRequest, res: Response) {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const assets = await AssetService.search(query, limit);
    res.json(successResponse('Search results retrieved successfully', assets));
  }
}

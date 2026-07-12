import { Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '../middleware/auth';
import type {
  CreateUserInput,
  UpdateUserInput,
  ChangeRoleInput,
  ChangeStatusInput,
  ProfileUpdateInput,
} from '../validators/user.schema';

export const UserController = {
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { users, meta } = await UserService.getAll(req.query as any);
    res.status(HTTP_STATUS.OK).json(successResponse('Users retrieved successfully', users, meta));
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.getById(req.params.id as string);
    res.status(HTTP_STATUS.OK).json(successResponse('User retrieved successfully', user));
  },

  async getByEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.getByEmail(req.params.email as string);
    res.status(HTTP_STATUS.OK).json(successResponse('User retrieved successfully', user));
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.create(req.body as CreateUserInput, req.user!.userId);
    res.status(HTTP_STATUS.CREATED).json(successResponse('User created successfully', user));
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.update(
      req.params.id as string,
      req.body as UpdateUserInput,
      req.user!.userId,
      req.ip,
      req.headers['user-agent']
    );
    res.status(HTTP_STATUS.OK).json(successResponse('User updated successfully', user));
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.updateProfile(req.user!.userId, req.body as ProfileUpdateInput);
    res.status(HTTP_STATUS.OK).json(successResponse('Profile updated successfully', user));
  },

  async changeRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.changeRole(
      req.params.id as string,
      req.body as ChangeRoleInput,
      req.user!.userId,
      req.user!.role,
      req.ip,
      req.headers['user-agent']
    );
    res.status(HTTP_STATUS.OK).json(successResponse('User role changed successfully', user));
  },

  async changeStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await UserService.changeStatus(
      req.params.id as string,
      req.body as ChangeStatusInput,
      req.user!.userId,
      req.ip,
      req.headers['user-agent']
    );
    res.status(HTTP_STATUS.OK).json(successResponse('User status changed successfully', user));
  },

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await UserService.delete(
      req.params.id as string,
      req.user!.userId,
      req.ip,
      req.headers['user-agent']
    );
    res.status(HTTP_STATUS.OK).json(successResponse('User deleted successfully', result));
  },

  async getDirectReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    const reports = await UserService.getDirectReports(req.params.id as string);
    res.status(HTTP_STATUS.OK).json(successResponse('Direct reports retrieved successfully', reports));
  },
};

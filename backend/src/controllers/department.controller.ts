import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { HTTP_STATUS } from '../constants';
import { successResponse } from '../utils/response';
import * as departmentService from '../services/department.service';
import { CreateDepartmentInput, UpdateDepartmentInput, DepartmentQueryInput } from '../validators/department.schema';

export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query as unknown as DepartmentQueryInput;
  const { departments, meta } = await departmentService.getAll(query);
  res.status(HTTP_STATUS.OK).json(successResponse('Departments retrieved successfully', departments, meta));
};

export const getById = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const department = await departmentService.getById(id);
  res.status(HTTP_STATUS.OK).json(successResponse('Department retrieved successfully', department));
};

export const getTree = async (_req: AuthenticatedRequest, res: Response) => {
  const tree = await departmentService.getTree();
  res.status(HTTP_STATUS.OK).json(successResponse('Department tree retrieved successfully', tree));
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body as CreateDepartmentInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const department = await departmentService.create(data, userId, ipAddress, userAgent);
  res.status(HTTP_STATUS.CREATED).json(successResponse('Department created successfully', department));
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const data = req.body as UpdateDepartmentInput;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const department = await departmentService.update(id, data, userId, ipAddress, userAgent);
  res.status(HTTP_STATUS.OK).json(successResponse('Department updated successfully', department));
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  const result = await departmentService.remove(id, userId, ipAddress, userAgent);
  res.status(HTTP_STATUS.OK).json(successResponse('Department deleted successfully', result));
};

export const getDepartmentStats = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const stats = await departmentService.getDepartmentStats(id);
  res.status(HTTP_STATUS.OK).json(successResponse('Department statistics retrieved successfully', stats));
};

import { HTTP_STATUS } from "../constants";

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  statusCode?: number;
  errors?: string[];
}

export const successResponse = <T>(message: string, data?: T, meta?: PaginationMeta): ApiResponse<T> => ({
  success: true,
  message,
  ...(data !== undefined && { data }),
  ...(meta && { meta }),
});

export const errorResponse = (message: string, statusCode: number, errors?: string[]): ApiResponse => ({
  success: false,
  message,
  statusCode,
  ...(errors && errors.length > 0 && { errors }),
});

export const paginatedMeta = (
  totalItems: number,
  currentPage: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return {
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export class AppError extends Error {
  public statusCode: number;
  public errors?: string[];
  public isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors?: string[]) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

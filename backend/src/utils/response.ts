import { ApiResponse, PaginationMeta, ApiErrorResponse } from '../types';

export const successResponse = <T>(message: string, data?: T, meta?: PaginationMeta): ApiResponse<T> => ({
  success: true,
  message,
  ...(data !== undefined && { data }),
  ...(meta && { meta }),
});

export const errorResponse = (message: string, statusCode: number, errors?: string[]): ApiErrorResponse => ({
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
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

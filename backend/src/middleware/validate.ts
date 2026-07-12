import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response';
import { HTTP_STATUS } from '../constants';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(
          errorResponse('Validation failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, messages)
        );
        return;
      }
      next(error);
    }
  };
};

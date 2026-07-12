import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { HTTP_STATUS, ALLOWED_FILE_TYPES } from '../constants';
import { errorResponse } from '../utils/response';
import { generateId } from '../utils';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${generateId()}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (Object.keys(ALLOWED_FILE_TYPES).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export const handleUploadError = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse('File too large', HTTP_STATUS.BAD_REQUEST)
      );
      return;
    }
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse(err.message, HTTP_STATUS.BAD_REQUEST)
    );
    return;
  }
  if (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse(err.message, HTTP_STATUS.BAD_REQUEST)
    );
    return;
  }
  next();
};

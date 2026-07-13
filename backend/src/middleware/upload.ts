import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { HTTP_STATUS, ALLOWED_FILE_TYPES, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';
import { errorResponse } from '../utils/response';
import { generateId } from '../utils';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedExt = (ALLOWED_FILE_TYPES as Record<string, string>)[file.mimetype] || ext;
    cb(null, `${generateId()}${sanitizedExt}`);
  },
});

const ALLOWED_EXTENSIONS: Set<string> = new Set(Object.values(ALLOWED_FILE_TYPES));

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error(`File type "${file.mimetype}" is not allowed. Accepted types: images (JPEG, PNG, GIF, WebP), documents (PDF, DOC, DOCX, XLS, XLSX).`));
    return;
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    cb(new Error(`File extension "${ext}" is not allowed.`));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize || MAX_FILE_SIZE_BYTES,
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

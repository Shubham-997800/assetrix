import multer from "multer";
import { AppError } from "../utils/response";
import { ALLOWED_MIME_TYPES, HTTP_STATUS, MAX_FILE_SIZE_BYTES } from "../constants";

const storage = multer.memoryStorage();

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype as (typeof ALLOWED_MIME_TYPES)[number])) {
    cb(new AppError(`File type '${file.mimetype}' is not allowed`, HTTP_STATUS.BAD_REQUEST));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

export const uploadSingle = (field: string) => upload.single(field);
export const uploadMultiple = (field: string, maxCount = 10) => upload.array(field, maxCount);

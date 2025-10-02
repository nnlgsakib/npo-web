import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../log';

// Directory to store uploaded files
export const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(process.cwd(), 'uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info('created upload directory', { uploadDir });
} else {
  logger.debug('upload directory exists', { uploadDir });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.debug('upload destination', { reqId: (req as any).reqId, uploadDir, field: file.fieldname });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const name = `${ts}-${safeOriginal}`;
    logger.debug('computed upload filename', { name, type: file.mimetype, size: (file as any).size });
    cb(null, name);
  },
});

// Accept only common image types; cap size at < 5MB
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    logger.warn('rejected upload: not image', { type: file.mimetype, name: file.originalname });
    return cb(new Error('Only image uploads are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

import express from 'express';
import { uploadFile } from '../controllers/FileUploadController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.post('/', verifyToken, uploadImage.single('file'), uploadFile);

export default router;
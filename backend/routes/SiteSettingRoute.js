// SiteSettingRoute.js
import express from 'express';
import { 
  getSiteSettings, 
  getSiteSettingByKey, 
  updateSiteSetting 
} from '../controllers/SiteSettingController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.get('/', getSiteSettings);
router.get('/:key', getSiteSettingByKey);
router.put('/:key', verifyToken, uploadImage.single('image'), updateSiteSetting);

export default router;
import express from 'express';
import { 
  getPromotions, 
  getPromotion, 
  createPromotion, 
  updatePromotion, 
  deletePromotion 
} from '../controllers/PromotionController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.get('/', getPromotions);
router.get('/:id', getPromotion);
router.post('/', verifyToken, uploadImage.single('image'), createPromotion);
router.put('/:id', verifyToken, uploadImage.single('image'), updatePromotion);
router.delete('/:id', verifyToken, deletePromotion);

export default router;
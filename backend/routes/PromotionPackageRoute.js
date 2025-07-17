import express from 'express';
import { 
  getPromotionPackages, 
  createPromotionPackage, 
  deletePromotionPackage 
} from '../controllers/PromotionPackageController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/promotion/:promotionId', getPromotionPackages);
router.post('/', verifyToken, createPromotionPackage);
router.delete('/:promotion_id/:package_id', verifyToken, deletePromotionPackage);

export default router;
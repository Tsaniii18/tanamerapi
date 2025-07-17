import express from 'express';
import { 
  getPackageItems, 
  createPackageItem, 
  updatePackageItem, 
  deletePackageItem 
} from '../controllers/PackageItemController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/package/:packageId', getPackageItems);
router.post('/', verifyToken, createPackageItem);
router.put('/:id', verifyToken, updatePackageItem);
router.delete('/:id', verifyToken, deletePackageItem);

export default router;
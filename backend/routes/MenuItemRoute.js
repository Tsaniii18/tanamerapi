import express from 'express';
import { 
  getMenuItems, 
  getMenuItem, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../controllers/MenuItemController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.post('/', verifyToken, uploadImage.single('image'), createMenuItem);
router.put('/:id', verifyToken, uploadImage.single('image'), updateMenuItem);
router.delete('/:id', verifyToken, deleteMenuItem);

export default router;
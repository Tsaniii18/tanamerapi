import express from 'express';
import { 
  getSlides, 
  createSlide, 
  updateSlide, 
  deleteSlide 
} from '../controllers/SlideController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.get('/', getSlides);
router.post('/', verifyToken, uploadImage.single('image'), createSlide);
router.put('/:id', verifyToken, uploadImage.single('image'), updateSlide);
router.delete('/:id', verifyToken, deleteSlide);

export default router;
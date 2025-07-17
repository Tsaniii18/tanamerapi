import express from 'express';
import { 
  getPackages, 
  getPackagesByType,
  getPackage, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/PackageController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';
import { uploadImage } from '../middleware/FileUpload.js';

const router = express.Router();

router.get('/', getPackages);
router.get('/type/:type', getPackagesByType);
router.get('/:id', getPackage);
router.post('/', verifyToken, uploadImage.single('image'), createPackage);
router.put('/:id', verifyToken, uploadImage.single('image'), updatePackage);
router.delete('/:id', verifyToken, deletePackage);

export default router;
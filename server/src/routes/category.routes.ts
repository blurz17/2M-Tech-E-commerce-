// server/src/routes/category.routes.ts
import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getAllCategoriesAdmin,
  getCategory,
  updateCategory,
  deleteCategory,
  permanentDeleteCategory
} from '../controllers/category.controller';
import { authenticateUser, adminOnly } from '../middleware/auth.middleware';
import { uploadImage } from '../utils/cloudinary'; // Use Cloudinary upload instead

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Admin routes
router.get('/admin/all', authenticateUser, adminOnly, getAllCategoriesAdmin);
router.post('/', authenticateUser, adminOnly, uploadImage('image'), createCategory);
router.put('/:id', authenticateUser, adminOnly, uploadImage('image'), updateCategory);
router.delete('/:id', authenticateUser, adminOnly, deleteCategory);
router.delete('/permanent/:id', authenticateUser, adminOnly, permanentDeleteCategory);

export default router;

//server\src\routes\category.routes.ts

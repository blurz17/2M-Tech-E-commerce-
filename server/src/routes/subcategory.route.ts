import { Router } from 'express';
import express from 'express';
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
  permanentDeleteSubcategory
} from '../controllers/subcategory.controller';
import { uploadImage } from '../utils/cloudinary';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';
const router = express.Router();

// Public routes
router.get('/all', getAllSubcategories);
router.get('/category/:categoryId', getSubcategoriesByCategory);
router.get('/:id', getSubcategory);

// Admin routes
router.post('/new', authenticateUser,adminOnly, uploadImage('image'), createSubcategory);
router.put('/:id',authenticateUser, adminOnly,  uploadImage('image'), updateSubcategory);
router.delete('/:id',authenticateUser, adminOnly, deleteSubcategory);
router.delete('/permanent/:id',authenticateUser, adminOnly, permanentDeleteSubcategory);

export default router;
import express from 'express';
import {
    createBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    getBrandsForDropdown,
    updateBrand
} from '../controllers/brand.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';
import { uploadImage } from '../utils/cloudinary';

const router = express.Router();

// Public routes
router.get('/all', getAllBrands);
router.get('/dropdown', getBrandsForDropdown);
router.get('/:id', getBrandById);

// Admin only routes
router.post('/new',authenticateUser, adminOnly, uploadImage('image'), createBrand);
router.put('/:id', authenticateUser, adminOnly, uploadImage('image'), updateBrand);
router.delete('/:id',authenticateUser, adminOnly, deleteBrand);

export default router;
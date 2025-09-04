// server/src/routes/banner.routes.ts
import express from 'express';
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
} from '../controllers/banner.controller';
import { uploadImage } from '../utils/cloudinary';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllBanners);
router.get('/:id', getBannerById);

// Admin-only routes
router.post('/new', authenticateUser, adminOnly, uploadImage('image'), createBanner);
router.put('/:id', authenticateUser, adminOnly, uploadImage('image'), updateBanner);
router.delete('/:id', authenticateUser, adminOnly, deleteBanner);
router.patch('/toggle/:id', authenticateUser, adminOnly, toggleBannerStatus);

export default router;
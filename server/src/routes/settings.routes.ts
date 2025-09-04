import express from 'express';
import { getSettings, updateSettings,  } from '../controllers/settings.controller';
import { authenticateUser , adminOnly} from '../middleware/auth.middleware';
import { uploadImage } from '../utils/cloudinary';

const router = express.Router();

// Public route - get settings (for frontend constants)
router.get('/', getSettings);

// Protected admin routes
router.put('/', authenticateUser,adminOnly, uploadImage('logo'), updateSettings);

export default router;
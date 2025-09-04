import express from 'express';
import { 
    login, 
    signup, 
    getMe, 
    updateProfile, 
    logoutUser, 
    getAllUsers, 
    getUser 
} from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { uploadImage } from '../utils/cloudinary';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.get('/me', authenticateUser, getMe);
router.put('/update-profile', authenticateUser, uploadImage('photo'), updateProfile);
router.post('/logout', logoutUser);

router.get('/all', authenticateUser, getAllUsers);
router.get('/:id', authenticateUser, getUser);

export default router;
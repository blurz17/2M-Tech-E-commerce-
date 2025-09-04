import express from 'express';
import {
    getAllShippingTiers,
    createShippingTier,
    updateShippingTier,
    deleteShippingTier,
    calculateShippingCost
} from '../controllers/shippingTier.controller';
import { authenticateUser , adminOnly} from '../middleware/auth.middleware';

const router = express.Router();

// Public route for calculating shipping cost
router.get('/calculate', calculateShippingCost);

// Public route for getting all active shipping tiers
router.get('/', getAllShippingTiers);

// Admin-only routes
router.post('/', authenticateUser,adminOnly, createShippingTier);
router.put('/:id', authenticateUser, adminOnly, updateShippingTier);
router.delete('/:id', authenticateUser, adminOnly, deleteShippingTier);

export default router;
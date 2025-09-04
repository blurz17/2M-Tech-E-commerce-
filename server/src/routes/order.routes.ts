// server/src/routes/order.routes.ts
import express from 'express';
import {
    deleteOrder,
    getAllOrders,
    getOrder,
    getUserOrders,
    newOrder,
    updateOrderStatus,
    testTelegram  // Add this import
} from '../controllers/order.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/test-telegram', testTelegram);

// Authenticated user routes
router.post('/new', authenticateUser, newOrder);
router.get('/my', authenticateUser, getUserOrders);

// Admin-only routes
router.get('/all', authenticateUser, adminOnly, getAllOrders);
router.delete('/delete/:id', authenticateUser, adminOnly, deleteOrder);
router.get('/:id', authenticateUser, getOrder);

// Fixed: Changed from PUT /:id to PUT /update-status/:id to match client expectation
router.put('/update-status/:id', authenticateUser, adminOnly, updateOrderStatus);

export default router;

// server/src/routes/telegram.routes.ts
import express from 'express';
import {
    handleTelegramWebhook,
    setupTelegramWebhook,
    deleteTelegramWebhook,
    testGroupForwarding,
    getTelegramWebhookInfo
} from '../controllers/telegram.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Public webhook endpoint (no authentication needed - Telegram will call this)
router.post('/webhook', handleTelegramWebhook);

// Admin-only routes for webhook management
router.post('/setup-webhook', authenticateUser, adminOnly, setupTelegramWebhook);
router.delete('/webhook', authenticateUser, adminOnly, deleteTelegramWebhook);
router.get('/webhook-info', authenticateUser, adminOnly, getTelegramWebhookInfo);

// Test routes
router.post('/test-forwarding', authenticateUser, adminOnly, testGroupForwarding);

export default router;

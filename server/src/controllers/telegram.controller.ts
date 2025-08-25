// server/src/controllers/telegram.controller.ts
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { telegramService } from "../services/telegram.service";
import { ApiError } from "../utils/ApiError";

// Webhook endpoint to receive messages from Telegram
export const handleTelegramWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log('🔔 Telegram webhook received:', JSON.stringify(req.body, null, 2));

    try {
        const update = req.body;

        // Handle different types of updates
        if (update.message) {
            // Forward the message to the group
            const result = await telegramService.forwardMessageToGroup(update);
            
            if (result) {
                console.log('✅ Message forwarded to group successfully');
            } else {
                console.error('❌ Failed to forward message to group');
            }
        } else if (update.callback_query) {
            // Handle callback queries (button presses) if needed
            console.log('📱 Callback query received:', update.callback_query);
        } else {
            console.log('ℹ️ Received update type not handled:', Object.keys(update));
        }

        // Always respond with 200 OK to Telegram
        res.status(200).json({ ok: true });
    } catch (error: any) {
        console.error('❌ Webhook processing error:', error.message);
        // Still respond with 200 to avoid Telegram retrying
        res.status(200).json({ ok: true });
    }
});

// Setup webhook endpoint
export const setupTelegramWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { webhookUrl } = req.body;

    if (!webhookUrl) {
        return next(new ApiError(400, 'Webhook URL is required'));
    }

    const result = await telegramService.setupWebhook(webhookUrl);

    if (result.success) {
        res.status(200).json({
            success: true,
            message: 'Webhook set up successfully',
            data: result.data
        });
    } else {
        return next(new ApiError(500, `Failed to setup webhook: ${result.error}`));
    }
});

// Delete webhook endpoint
export const deleteTelegramWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await telegramService.deleteWebhook();

    if (result.success) {
        res.status(200).json({
            success: true,
            message: 'Webhook deleted successfully',
            data: result.data
        });
    } else {
        return next(new ApiError(500, `Failed to delete webhook: ${result.error}`));
    }
});

// Test group forwarding
export const testGroupForwarding = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log('🧪 Testing group forwarding...');
    
    // Create a mock message for testing
    const mockMessageData = {
        message: {
            message_id: 999999,
            from: {
                id: 123456789,
                first_name: "Test",
                last_name: "User",
                username: "testuser"
            },
            chat: {
                id: 123456789,
                type: "private"
            },
            date: Math.floor(Date.now() / 1000),
            text: "This is a test message to verify group forwarding functionality!"
        }
    };

    const result = await telegramService.forwardMessageToGroup(mockMessageData);
    
    if (result) {
        res.status(200).json({
            success: true,
            message: 'Test message forwarded to group successfully'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Failed to forward test message to group'
        });
    }
});

// Get webhook info
export const getTelegramWebhookInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // This would require adding a method to the service to get webhook info
        const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
        const data = await response.json();

        res.status(200).json({
            success: true,
            data: data.result
        });
    } catch (error: any) {
        return next(new ApiError(500, `Failed to get webhook info: ${error.message}`));
    }
});

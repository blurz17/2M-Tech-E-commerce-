// server/src/controllers/telegram.debug.ts
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import axios from 'axios';

export const debugTelegram = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 TELEGRAM DEBUG SESSION STARTED');
    console.log('='.repeat(50));
    
    const results: any = {
        timestamp: new Date().toISOString(),
        environment: {},
        botInfo: null,
        webhookInfo: null,
        chatInfo: null,
        testMessage: null,
        errors: []
    };

    // 1. Check Environment Variables
    console.log('1️⃣ Checking Environment Variables...');
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    results.environment = {
        TELEGRAM_BOT_TOKEN: botToken ? `✅ Present (${botToken.substring(0, 10)}...)` : '❌ Missing',
        TELEGRAM_CHAT_ID: chatId ? `✅ Present (${chatId})` : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV || 'undefined'
    };

    console.log('Environment Check:', results.environment);

    if (!botToken || !chatId) {
        results.errors.push('Missing required environment variables');
        return res.json(results);
    }

    const baseUrl = `https://api.telegram.org/bot${botToken}`;

    try {
        // 2. Test Bot Info
        console.log('2️⃣ Getting Bot Information...');
        const botResponse = await axios.get(`${baseUrl}/getMe`);
        results.botInfo = {
            success: botResponse.data.ok,
            data: botResponse.data.result
        };
        console.log('Bot Info:', results.botInfo);

    } catch (error: any) {
        console.error('❌ Bot Info Error:', error.message);
        results.botInfo = { success: false, error: error.message };
        results.errors.push(`Bot info failed: ${error.message}`);
    }

    try {
        // 3. Get Webhook Info
        console.log('3️⃣ Getting Webhook Information...');
        const webhookResponse = await axios.get(`${baseUrl}/getWebhookInfo`);
        results.webhookInfo = {
            success: webhookResponse.data.ok,
            data: webhookResponse.data.result
        };
        console.log('Webhook Info:', results.webhookInfo);

    } catch (error: any) {
        console.error('❌ Webhook Info Error:', error.message);
        results.webhookInfo = { success: false, error: error.message };
        results.errors.push(`Webhook info failed: ${error.message}`);
    }

    try {
        // 4. Test Chat Access
        console.log('4️⃣ Testing Chat Access...');
        const chatResponse = await axios.post(`${baseUrl}/getChat`, {
            chat_id: chatId
        });
        results.chatInfo = {
            success: chatResponse.data.ok,
            data: chatResponse.data.result
        };
        console.log('Chat Info:', results.chatInfo);

    } catch (error: any) {
        console.error('❌ Chat Info Error:', error.message);
        results.chatInfo = { success: false, error: error.message };
        results.errors.push(`Chat access failed: ${error.message}`);
    }

    try {
        // 5. Send Test Message
        console.log('5️⃣ Sending Test Message...');
        const testMessageText = `🧪 <b>DEBUG TEST MESSAGE</b>

🤖 Bot: ${results.botInfo?.data?.username || 'Unknown'}
📍 Chat ID: ${chatId}
⏰ Time: ${new Date().toLocaleString()}
🌐 Environment: ${process.env.NODE_ENV || 'development'}

<i>This is an automated test message to verify Telegram integration.</i>

#DebugTest #${Date.now()}`;

        const messageResponse = await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: testMessageText,
            parse_mode: 'HTML'
        });

        results.testMessage = {
            success: messageResponse.data.ok,
            data: messageResponse.data.result,
            sentText: testMessageText
        };
        console.log('✅ Test Message Result:', results.testMessage);

    } catch (error: any) {
        console.error('❌ Test Message Error:', error.response?.data || error.message);
        results.testMessage = { 
            success: false, 
            error: error.message,
            response: error.response?.data,
            status: error.response?.status
        };
        results.errors.push(`Test message failed: ${error.message}`);
    }

    // 6. Final Analysis
    console.log('6️⃣ Final Analysis...');
    const analysis = [];
    
    if (!results.botInfo?.success) {
        analysis.push('❌ Bot token is invalid or bot doesn\'t exist');
    } else {
        analysis.push('✅ Bot token is valid');
    }

    if (!results.chatInfo?.success) {
        analysis.push('❌ Bot cannot access the chat/group (wrong chat ID or bot not added to group)');
    } else {
        analysis.push('✅ Bot has access to the chat/group');
    }

    if (!results.testMessage?.success) {
        analysis.push('❌ Bot cannot send messages to the group');
    } else {
        analysis.push('✅ Bot can send messages to the group');
    }

    results.analysis = analysis;
    results.summary = results.errors.length === 0 ? '✅ All tests passed!' : `❌ ${results.errors.length} error(s) found`;

    console.log('='.repeat(50));
    console.log('🏁 DEBUG SESSION COMPLETED');
    console.log('Summary:', results.summary);
    console.log('Analysis:', analysis);
    
    return res.json(results);
});

export const quickTest = asyncHandler(async (req: Request, res: Response) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(400).json({
            success: false,
            message: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables'
        });
    }

    try {
        const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: `🚀 Quick Test Message\n\nTime: ${new Date().toLocaleString()}\nFrom: Express Server\n\n#QuickTest`,
            parse_mode: 'HTML'
        });

        if (response.data.ok) {
            res.json({
                success: true,
                message: 'Test message sent successfully!',
                messageId: response.data.result.message_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to send message',
                error: response.data
            });
        }
    } catch (error: any) {
        console.error('Quick test error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error sending test message',
            error: error.response?.data || error.message
        });
    }
});

export const webhookTest = asyncHandler(async (req: Request, res: Response) => {
    console.log('🎯 WEBHOOK TEST - Simulating incoming message');
    
    const mockUpdate = {
        update_id: 999999,
        message: {
            message_id: 999999,
            from: {
                id: 123456789,
                is_bot: false,
                first_name: "Test",
                last_name: "User",
                username: "testuser"
            },
            chat: {
                id: 123456789,
                first_name: "Test",
                last_name: "User",
                username: "testuser",
                type: "private"
            },
            date: Math.floor(Date.now() / 1000),
            text: "This is a test message to check webhook forwarding!"
        }
    };

    // Import and use the webhook handler
    try {
        const { telegramService } = await import('../services/telegram.service');
        const result = await telegramService.forwardMessageToGroup(mockUpdate);
        
        res.json({
            success: true,
            message: 'Webhook test completed',
            mockUpdate,
            forwardingResult: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Webhook test failed',
            error: error.message
        });
    }
});

export const getChatUpdates = asyncHandler(async (req: Request, res: Response) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
        return res.status(400).json({
            success: false,
            message: 'Missing TELEGRAM_BOT_TOKEN'
        });
    }

    try {
        const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?limit=10`);
        
        res.json({
            success: true,
            updates: response.data.result,
            count: response.data.result.length
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

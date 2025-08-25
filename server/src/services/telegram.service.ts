// server/src/services/telegram.service.ts
import axios from 'axios';
import { OrderItemType, ShippingInfoType } from '../types/types';

interface OrderNotificationData {
    orderId: string;
    orderItems: OrderItemType[];
    shippingInfo: ShippingInfoType;
    total: number;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    customerEmail: string;
    customerName: string;
}

class TelegramService {
    private botToken: string;
    private chatId: string; // This should be your GROUP chat ID
    private apiUrl: string;

    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = process.env.TELEGRAM_CHAT_ID || ''; // Make sure this is your GROUP ID, not bot ID
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
        
        console.log('🤖 Telegram Service initialized:');
        console.log('Bot Token:', this.botToken ? `✅ Set (${this.botToken.substring(0, 10)}...)` : '❌ Missing');
        console.log('Chat ID:', this.chatId ? `✅ Set (${this.chatId})` : '❌ Missing');
    }

    isConfigured(): boolean {
        return !!(this.botToken && this.chatId);
    }

    // Send a message to the group
    async sendMessage(text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
        if (!this.isConfigured()) {
            console.error('❌ Telegram service not configured');
            return false;
        }

        try {
            console.log(`📤 Sending message to chat ID: ${this.chatId}`);
            console.log(`📝 Message length: ${text.length} characters`);

            const response = await axios.post(`${this.apiUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: text,
                parse_mode: parseMode,
                disable_web_page_preview: true
            });

            if (response.data.ok) {
                console.log('✅ Message sent successfully to group');
                return true;
            } else {
                console.error('❌ Telegram API error:', response.data);
                return false;
            }
        } catch (error: any) {
            console.error('❌ Failed to send Telegram message:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                chatId: this.chatId,
                apiUrl: this.apiUrl
            });
            return false;
        }
    }

    // Send order notification to the group
    async sendOrderNotification(data: OrderNotificationData): Promise<boolean> {
        console.log('📱 Preparing order notification for Telegram...');

        const orderItemsList = data.orderItems
            .map((item, index) => 
                `${index + 1}. <b>${item.name}</b>\n   Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
            )
            .join('\n\n');

        const message = `
🛒 <b>NEW ORDER RECEIVED!</b>

📋 <b>Order ID:</b> <code>${data.orderId}</code>

👤 <b>Customer Details:</b>
• Name: ${data.customerName}
• Email: ${data.customerEmail}

📦 <b>Items Ordered:</b>
${orderItemsList}

📍 <b>Shipping Address:</b>
${data.shippingInfo.address}
${data.shippingInfo.city}, ${data.shippingInfo.state}
${data.shippingInfo.country}
📞 ${data.shippingInfo.phone}

💰 <b>Order Summary:</b>
• Subtotal: $${data.subtotal.toFixed(2)}
• Tax: $${data.tax.toFixed(2)}
• Shipping: $${data.shippingCharges.toFixed(2)}
• Discount: -$${data.discount.toFixed(2)}
• <b>Total: $${data.total.toFixed(2)}</b>

⏰ Order Time: ${new Date().toLocaleString()}

#NewOrder #Order${data.orderId.replace(/[^a-zA-Z0-9]/g, '')}
        `.trim();

        return await this.sendMessage(message);
    }

    // Send order status update to the group
    async sendOrderStatusUpdate(orderId: string, status: string, customerName: string): Promise<boolean> {
        console.log('📱 Preparing order status update for Telegram...');

        const statusEmoji = {
            'Pending': '⏳',
            'Processing': '🔄',
            'Shipped': '🚚',
            'Delivered': '✅'
        }[status] || '📋';

        const message = `
${statusEmoji} <b>ORDER STATUS UPDATE</b>

📋 <b>Order ID:</b> <code>${orderId}</code>
👤 <b>Customer:</b> ${customerName}
📊 <b>New Status:</b> <b>${status}</b>

⏰ Updated: ${new Date().toLocaleString()}

#OrderUpdate #Order${orderId.replace(/[^a-zA-Z0-9]/g, '')}
        `.trim();

        return await this.sendMessage(message);
    }

    // Forward messages from private chat to group
    async forwardMessageToGroup(update: any): Promise<boolean> {
        if (!update.message) {
            console.log('⚠️ No message to forward');
            return false;
        }

        const message = update.message;
        const from = message.from;
        
        console.log('📨 Forwarding message to group from user:', {
            userId: from.id,
            username: from.username,
            firstName: from.first_name,
            messageType: message.text ? 'text' : Object.keys(message).find(key => key !== 'message_id' && key !== 'from' && key !== 'chat' && key !== 'date')
        });

        try {
            // Create a formatted message for the group
            let forwardedMessage = '';
            
            // User info header
            const userName = from.username ? `@${from.username}` : `${from.first_name || 'Unknown'} ${from.last_name || ''}`.trim();
            forwardedMessage += `💬 <b>Message from customer:</b> ${userName}\n`;
            forwardedMessage += `👤 <b>User ID:</b> <code>${from.id}</code>\n\n`;

            // Message content
            if (message.text) {
                forwardedMessage += `📝 <b>Message:</b>\n${message.text}`;
            } else if (message.photo) {
                forwardedMessage += `📸 <b>Photo message</b>`;
                if (message.caption) {
                    forwardedMessage += `\n📝 <b>Caption:</b> ${message.caption}`;
                }
            } else if (message.document) {
                forwardedMessage += `📄 <b>Document:</b> ${message.document.file_name || 'Unknown file'}`;
                if (message.caption) {
                    forwardedMessage += `\n📝 <b>Caption:</b> ${message.caption}`;
                }
            } else if (message.contact) {
                forwardedMessage += `👤 <b>Contact shared:</b> ${message.contact.first_name} ${message.contact.last_name || ''}`;
                if (message.contact.phone_number) {
                    forwardedMessage += `\n📞 ${message.contact.phone_number}`;
                }
            } else {
                forwardedMessage += `📨 <b>Media message received</b>`;
            }

            forwardedMessage += `\n\n⏰ ${new Date().toLocaleString()}`;

            // Send formatted message to group
            const success = await this.sendMessage(forwardedMessage);

            // If it's a media message, try to forward it as well
            if (success && (message.photo || message.document || message.voice || message.video)) {
                try {
                    await axios.post(`${this.apiUrl}/forwardMessage`, {
                        chat_id: this.chatId,
                        from_chat_id: message.chat.id,
                        message_id: message.message_id
                    });
                    console.log('✅ Media also forwarded to group');
                } catch (mediaError) {
                    console.error('⚠️ Could not forward media, but text message was sent:', mediaError);
                }
            }

            return success;
        } catch (error: any) {
            console.error('❌ Failed to forward message to group:', error.message);
            return false;
        }
    }

    // Setup webhook
    async setupWebhook(webhookUrl: string): Promise<{success: boolean, data?: any, error?: string}> {
        try {
            console.log(`🔗 Setting up webhook: ${webhookUrl}`);
            
            const response = await axios.post(`${this.apiUrl}/setWebhook`, {
                url: webhookUrl,
                drop_pending_updates: true
            });

            if (response.data.ok) {
                console.log('✅ Webhook setup successful');
                return { success: true, data: response.data.result };
            } else {
                console.error('❌ Webhook setup failed:', response.data);
                return { success: false, error: response.data.description };
            }
        } catch (error: any) {
            console.error('❌ Webhook setup error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Delete webhook
    async deleteWebhook(): Promise<{success: boolean, data?: any, error?: string}> {
        try {
            console.log('🗑️ Deleting webhook...');
            
            const response = await axios.post(`${this.apiUrl}/deleteWebhook`, {
                drop_pending_updates: true
            });

            if (response.data.ok) {
                console.log('✅ Webhook deleted successfully');
                return { success: true, data: response.data.result };
            } else {
                console.error('❌ Webhook deletion failed:', response.data);
                return { success: false, error: response.data.description };
            }
        } catch (error: any) {
            console.error('❌ Webhook deletion error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Test bot connection
    async testConnection(): Promise<boolean> {
        try {
            console.log('🧪 Testing bot connection...');
            
            const response = await axios.get(`${this.apiUrl}/getMe`);
            
            if (response.data.ok) {
                console.log('✅ Bot connection successful:', {
                    botName: response.data.result.username,
                    botId: response.data.result.id
                });
                return true;
            } else {
                console.error('❌ Bot connection failed:', response.data);
                return false;
            }
        } catch (error: any) {
            console.error('❌ Bot connection test error:', error.message);
            return false;
        }
    }

// Add these debug methods to your telegram.service.ts

// Method to get updates and find your group chat ID
async getUpdates(): Promise<any> {
    try {
        console.log('📡 Getting recent updates to find group chat ID...');
        
        const response = await axios.get(`${this.apiUrl}/getUpdates`);
        
        if (response.data.ok) {
            console.log('📨 Recent updates:', JSON.stringify(response.data.result, null, 2));
            
            // Look for group messages
            response.data.result.forEach((update: any, index: number) => {
                if (update.message?.chat?.type === 'group' || update.message?.chat?.type === 'supergroup') {
                    console.log(`🏢 Found Group Chat #${index + 1}:`, {
                        chatId: update.message.chat.id,
                        title: update.message.chat.title,
                        type: update.message.chat.type
                    });
                }
            });
            
            return response.data.result;
        } else {
            console.error('❌ Failed to get updates:', response.data);
            return null;
        }
    } catch (error: any) {
        console.error('❌ Get updates error:', error.message);
        return null;
    }
}

// Method to test if bot can send to a specific chat
async testSendToChat(chatId: string, message: string = 'Test message from bot 🤖'): Promise<boolean> {
    try {
        console.log(`🧪 Testing send message to chat: ${chatId}`);
        
        const response = await axios.post(`${this.apiUrl}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });

        if (response.data.ok) {
            console.log('✅ Test message sent successfully!');
            console.log('📨 Message details:', response.data.result);
            return true;
        } else {
            console.error('❌ Failed to send test message:', response.data);
            return false;
        }
    } catch (error: any) {
        console.error('❌ Test send error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return false;
    }
}

// Enhanced method to get comprehensive bot info
async getBotStatus(): Promise<any> {
    try {
        console.log('🤖 Getting comprehensive bot status...');
        
        // Get bot info
        const botResponse = await axios.get(`${this.apiUrl}/getMe`);
        
        if (!botResponse.data.ok) {
            console.error('❌ Bot info failed:', botResponse.data);
            return null;
        }
        
        const botInfo = botResponse.data.result;
        console.log('🤖 Bot Info:', {
            id: botInfo.id,
            username: botInfo.username,
            firstName: botInfo.first_name,
            canJoinGroups: botInfo.can_join_groups,
            canReadAllGroupMessages: botInfo.can_read_all_group_messages,
            supportsInlineQueries: botInfo.supports_inline_queries
        });

        // Test current chat
        if (this.chatId) {
            console.log(`🔍 Testing current chat ID: ${this.chatId}`);
            await this.getChatInfo();
        }

        return botInfo;
    } catch (error: any) {
        console.error('❌ Bot status error:', error.message);
        return null;
    }
}



    

    // Get chat info (useful for debugging)
    async getChatInfo(): Promise<any> {
        try {
            console.log(`🔍 Getting chat info for: ${this.chatId}`);
            
            const response = await axios.post(`${this.apiUrl}/getChat`, {
                chat_id: this.chatId
            });

            if (response.data.ok) {
                console.log('✅ Chat info retrieved:', {
                    type: response.data.result.type,
                    title: response.data.result.title,
                    id: response.data.result.id
                });
                return response.data.result;
            } else {
                console.error('❌ Failed to get chat info:', response.data);
                return null;
            }
        } catch (error: any) {
            console.error('❌ Get chat info error:', error.message);
            return null;
        }
    }
}

// Export singleton instance
export const telegramService = new TelegramService();

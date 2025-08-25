// server/src/controllers/order.controller.ts
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Order from "../models/order.model";
import { NewOrderRequestBody, RequestWithUser } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { reduceStock } from "../utils/utils";
import { telegramService } from "../services/telegram.service";
import User, { IUser } from "../models/user.model";

// Create New Order
export const newOrder = asyncHandler(async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
    console.log('🚀 Order creation started');
    console.log('Order request body:', JSON.stringify(req.body, null, 2));

    const { orderItems, shippingInfo, discount, shippingCharges, subTotal, tax, total } = req.body;

    // Validation (keeping your existing validation)
    if (!orderItems || orderItems.length === 0) {
        return next(new ApiError(400, 'Order items are required'));
    }

    if (!shippingInfo) {
        return next(new ApiError(400, 'Shipping information is required'));
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.country) {
        return next(new ApiError(400, 'Complete shipping address is required'));
    }

    if (typeof shippingCharges !== 'number' || shippingCharges < 0) {
        return next(new ApiError(400, 'Valid shipping charges are required'));
    }

    if (typeof subTotal !== 'number' || subTotal <= 0) {
        return next(new ApiError(400, 'Valid subtotal is required'));
    }

    if (typeof tax !== 'number' || tax < 0) {
        return next(new ApiError(400, 'Valid tax amount is required'));
    }

    if (typeof total !== 'number' || total <= 0) {
        return next(new ApiError(400, 'Valid total amount is required'));
    }

    const user = (req as RequestWithUser).user as IUser;

    if (!user || !user._id) {
        return next(new ApiError(401, 'User authentication required'));
    }

    console.log('👤 User data:', {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    });

    try {
        const order = new Order({
            orderItems,
            shippingInfo,
            discount: discount || 0,
            shippingCharges,
            subtotal: subTotal,
            tax,
            total,
            user: user._id
        });

        // Reduce stock
        await reduceStock(orderItems);

        const newOrder = await order.save();
        console.log('✅ Order saved successfully:', newOrder._id);

        // Enhanced Telegram notification with comprehensive debugging
        console.log('📱 Starting Telegram notification process...');
        
        // Check environment variables
        console.log('🔍 Environment variables check:');
        console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? `✅ Set (${process.env.TELEGRAM_BOT_TOKEN.substring(0, 10)}...)` : '❌ Missing');
        console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? `✅ Set (${process.env.TELEGRAM_CHAT_ID})` : '❌ Missing');
        
        // Check if Telegram service is configured
        if (!telegramService.isConfigured()) {
            console.error('❌ Telegram service not configured');
            console.log('Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your environment variables');
        } else {
            console.log('✅ Telegram service is configured');
            
            try {
                const notificationData = {
                    orderId: newOrder._id.toString(),
                    orderItems,
                    shippingInfo,
                    total,
                    subtotal: subTotal,
                    tax,
                    shippingCharges,
                    discount: discount || 0,
                    customerEmail: user.email,
                    customerName: user.name
                };

                console.log('📋 Prepared notification data:', {
                    orderId: notificationData.orderId,
                    customerName: notificationData.customerName,
                    customerEmail: notificationData.customerEmail,
                    total: notificationData.total,
                    itemCount: orderItems.length,
                    shippingCity: shippingInfo.city,
                    shippingCountry: shippingInfo.country
                });

                console.log('📤 Sending Telegram notification...');
                const telegramResult = await telegramService.sendOrderNotification(notificationData);
                
                if (telegramResult) {
                    console.log('✅ Telegram notification sent successfully');
                } else {
                    console.error('❌ Telegram notification failed - check service logs');
                }
            } catch (telegramError: any) {
                console.error('❌ Telegram notification error:', {
                    message: telegramError.message,
                    stack: telegramError.stack?.substring(0, 500),
                    response: telegramError.response?.data,
                    status: telegramError.response?.status,
                    url: telegramError.config?.url
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: newOrder._id
        });

    } catch (error: any) {
        console.error('❌ Order creation error:', {
            message: error.message,
            stack: error.stack?.substring(0, 500)
        });
        return next(new ApiError(500, 'Failed to create order: ' + error.message));
    }
});

// Fixed update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id; // Get from params, not body
    const { status } = req.body; // Only status from body
    
    console.log('🔄 Updating order status:', { orderId, status });

    if (!status) {
        return next(new ApiError(400, 'Status is required'));
    }

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
        return next(new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
        return next(new ApiError(404, 'Order not found'));
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    console.log(`✅ Order ${orderId} status updated from ${oldStatus} to ${status}`);

    // Send Telegram notification for status update
    try {
        if (telegramService.isConfigured()) {
            console.log('📱 Sending Telegram status update...');
            const user = order.user as unknown as IUser;
            const result = await telegramService.sendOrderStatusUpdate(
                orderId,
                status,
                user?.name || user?.email || 'Unknown Customer'
            );
            
            if (result) {
                console.log('✅ Telegram status update sent successfully');
            } else {
                console.error('❌ Telegram status update failed');
            }
        } else {
            console.log('⚠️ Telegram not configured, skipping status update notification');
        }
    } catch (telegramError: any) {
        console.error('❌ Telegram status update error:', {
            message: telegramError.message,
            stack: telegramError.stack?.substring(0, 500)
        });
    }

    res.status(200).json({ 
        success: true, 
        message: `Order status updated from ${oldStatus} to ${status}` 
    });
});

// Test Telegram endpoint - Add this for debugging
export const testTelegram = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log('🧪 Testing Telegram service...');
    
    try {
        // Check configuration
        if (!telegramService.isConfigured()) {
            return res.status(400).json({
                success: false,
                message: 'Telegram service not configured',
                env: {
                    botToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Missing',
                    chatId: process.env.TELEGRAM_CHAT_ID ? 'Set' : 'Missing'
                }
            });
        }

        // Send test message
        const testData = {
            orderId: 'TEST-' + Date.now(),
            orderItems: [
                {
                    name: 'Test Product',
                    price: 99.99,
                    quantity: 1,
                    photo: 'test.jpg',
                    productId: 'test-id'
                }
            ],
            shippingInfo: {
                address: '123 Test Street',
                city: 'Test City',
                country: 'Test Country',
                phone: '+1234567890',
                state: 'Test State'
            },
            total: 109.99,
            subtotal: 99.99,
            tax: 10.00,
            shippingCharges: 0,
            discount: 0,
            customerEmail: 'test@example.com',
            customerName: 'Test Customer'
        };

        const result = await telegramService.sendOrderNotification(testData);
        
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Test Telegram notification sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test Telegram notification'
            });
        }
    } catch (error: any) {
        console.error('❌ Test Telegram error:', error);
        res.status(500).json({
            success: false,
            message: 'Telegram test failed: ' + error.message
        });
    }
});

// Rest of your existing functions...
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) return next(new ApiError(404, 'Order not found'));

    await order.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;

    const orders = await Order.find({ user: user._id });

    return res.status(200).json({
        success: true,
        orders
    });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find().populate('user', 'name email');

    return res.status(200).json({
        success: true,
        orders
    });
});

export const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) return next(new ApiError(404, 'Order not found'));

    return res.status(200).json({
        success: true,
        order
    });
});

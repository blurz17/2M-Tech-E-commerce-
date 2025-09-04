import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db.config';
import firebaseApp from './config/firebase.config';
import authRoutes from './routes/auth.routes';
import couponRoutes from './routes/coupon.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.route';
import statsRoutes from './routes/stats.route';
import subcategoryRoutes from './routes/subcategory.route';
import { apiErrorMiddleware } from './utils/ApiError';
import winston from 'winston';
import telegramRoutes from './routes/telegram.routes';
import categoryRoutes from './routes/category.routes';
import brandRoutes from './routes/brand.routes';
import currencyRoutes from './routes/currency.routes';
import pageRoutes from './routes/page.routes';
import settingsRoutes from './routes/settings.routes';
import shippingTierRoutes from './routes/shippingTier.routes';
import bannerRoutes from './routes/banner.routes';
// Initialize Firebase
try {
  firebaseApp.firestore();
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const app: Application = express();

const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to database with error handling
connectDB().catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// CORS configuration
// CORS configuration - Updated for Vercel deployment
// Enhanced CORS configuration - Replace the existing corsOptions in your index.ts
const corsOptions = {
  credentials: true,
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    console.log('CORS Origin check:', origin);
    
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      
      'https://2-m-technology-git-main-john7ljs-projects.vercel.app',
      'https://2-m-technology-i0q9elm6m-john7ljs-projects.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
            'http://localhost:5175',

      process.env.CLIENT_URL,
    ].filter(Boolean);
    
    // For development
    if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) {
      return callback(null, true);
    }
    
    // For Vercel preview deployments
    if (origin?.includes('vercel.app') && origin?.includes('2-m')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
    'Set-Cookie',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional middleware for handling preflight requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie,Set-Cookie');
    res.status(204).send();
  } else {
    next();
  }
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/api/v1/categories', categoryRoutes);

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(compression());
app.use(mongoSanitize());

// Rate limiting - more lenient for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 100, // Higher limit for production
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/';
  }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/telegram', telegramRoutes);
app.use('/api/v1/categories', categoryRoutes); // Move this with other routes
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/subcategory',subcategoryRoutes);
app.use('/api/v1/currencies', currencyRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/shippingTiers', shippingTierRoutes);
app.use('/api/v1/banners', bannerRoutes);

app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Handle root route and static files
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  
  // Check if client build directory exists
  const clientExists = fs.existsSync(clientPath) && fs.existsSync(path.join(clientPath, 'index.html'));
  
  if (clientExists) {
    console.log('Client build found, serving static files');
    app.use(express.static(clientPath));
    
    // Handle client-side routing
    app.get('*', (req: Request, res: Response) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          success: false,
          message: 'API endpoint not found'
        });
      }
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  } else {
    console.log('Client build not found, serving API only');
    // Root endpoint for API-only deployment
    app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'API is running... 🚀 [Production Mode - API Only]',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        endpoints: {
          auth: '/api/v1/auth',
          products: '/api/v1/products',
          orders: '/api/v1/orders',
          coupons: '/api/v1/coupons',
          payments: '/api/v1/payments',
          stats: '/api/v1/stats'
        }
      });
    });
    
    // Catch-all for non-API routes in API-only mode
    app.get('*', (req: Request, res: Response) => {
      if (!req.path.startsWith('/api/')) {
        res.status(404).json({
          success: false,
          message: 'This is an API-only deployment. Frontend not available.',
          availableEndpoints: {
            auth: '/api/v1/auth',
            products: '/api/v1/products',
            orders: '/api/v1/orders',
            coupons: '/api/v1/coupons',
            payments: '/api/v1/payments',
            stats: '/api/v1/stats'
          }
        });
      }
    });
  }
} else {
  app.get('/', (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'API is running... 🚀 [Development Mode]',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/v1/auth',
        products: '/api/v1/products',
        orders: '/api/v1/orders',
        coupons: '/api/v1/coupons',
        payments: '/api/v1/payments',
        stats: '/api/v1/stats'
      }
    });
  });
}



// Add this route in your server/src/index.ts after other routes
app.get('/api/debug', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is connected!',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    origin: req.get('origin'),
    referer: req.get('referer')
  });
});



// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error details
  winston.error('Global error handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});

app.use(apiErrorMiddleware);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });









// Add these debug routes to your server/src/index.ts (after other routes)

// Test cookie functionality
app.get('/api/test-cookie', (req: Request, res: Response) => {
  const testValue = `test-${Date.now()}`;
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    maxAge: 1000 * 60 * 5, // 5 minutes
    path: '/'
  };
  
  res.cookie('testCookie', testValue, cookieOptions);
  
  res.json({
    success: true,
    message: 'Test cookie set',
    cookieValue: testValue,
    cookieOptions,
    environment: process.env.NODE_ENV,
    origin: req.get('origin'),
    userAgent: req.get('user-agent')
  });
});

// Check if cookies are received
app.get('/api/check-cookie', (req: Request, res: Response) => {
  res.json({
    success: true,
    cookies: req.cookies,
    headers: {
      cookie: req.get('cookie'),
      origin: req.get('origin'),
      referer: req.get('referer')
    },
    environment: process.env.NODE_ENV
  });
});

// Test authentication flow
app.post('/api/test-auth', (req: Request, res: Response) => {
  const { testToken } = req.body;
  
  res.cookie('testAuthToken', testToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    maxAge: 1000 * 60 * 60, // 1 hour
    path: '/'
  });
  
  res.json({
    success: true,
    message: 'Test auth token set',
    receivedToken: testToken,
    environment: process.env.NODE_ENV
  });
});

  
}

// Export for Vercel
export default app;

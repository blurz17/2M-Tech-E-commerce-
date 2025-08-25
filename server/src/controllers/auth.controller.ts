import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import User, { IUser } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { RequestWithUser, User as UserInterface } from '../types/types';

// Enhanced cookie options for production
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
        httpOnly: true,
        secure: isProduction, // Only use secure in production
        sameSite: isProduction ? 'none' as const : 'lax' as const, // 'none' for cross-origin in production
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        domain: isProduction ? undefined : undefined, // Let browser handle domain
        path: '/'
    };
};

// Login 
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;
    
    console.log('Login attempt - Environment:', process.env.NODE_ENV);
    console.log('Origin:', req.get('origin'));
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid } = decodedToken;

        // Check if user exists in MongoDB
        const user: IUser | null = await User.findOne({ uid });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Set cookie with proper options
        const cookieOptions = getCookieOptions();
        res.cookie('token', idToken, cookieOptions);

        // Also set CORS headers explicitly
        res.header('Access-Control-Allow-Credentials', 'true');
        
        return res.status(200).json({ 
            message: 'Login successful', 
            user,
            debug: {
                cookieSet: true,
                environment: process.env.NODE_ENV,
                cookieOptions: cookieOptions
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(401).json({ 
            message: 'Invalid token',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { idToken, name, gender, dob } = req.body;
    
    console.log('Signup attempt - Environment:', process.env.NODE_ENV);
    console.log('Origin:', req.get('origin'));
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, picture } = decodedToken;

        // Check if user exists in MongoDB
        let user: IUser | null = await User.findOne({ uid });

        if (!user) {
            // If user doesn't exist, create a new user
            user = new User({
                uid,
                email,
                name,
                photoURL: picture,
                provider: decodedToken.firebase.sign_in_provider,
                gender,
                dob
            });

            await user.save();
        }

        // Set cookie with proper options
        const cookieOptions = getCookieOptions();
        res.cookie('token', idToken, cookieOptions);
        
        // Also set CORS headers explicitly
        res.header('Access-Control-Allow-Credentials', 'true');

        return res.status(200).json({ 
            message: 'Signup successful', 
            user,
            debug: {
                cookieSet: true,
                environment: process.env.NODE_ENV,
                cookieOptions: cookieOptions
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(401).json({ 
            message: 'Invalid token',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export const getMe = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user) {
        return res.status(200).json({ user: req.user });
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});

export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cookieOptions = getCookieOptions();
    
    // Clear cookie with same options used to set it
    res.clearCookie('token', {
        ...cookieOptions,
        maxAge: 0
    });
    
    return res.status(200).json({
        message: 'Logout successful'
    });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) {
        return res.status(404).json({
            success: false,
            message: 'No users found',
        });
    }
    return res.status(200).json({
        success: true,
        users,
    });
});

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `No user found with id: ${id}`,
        });
    }
    return res.status(200).json({
        success: true,
        user,
    });
});

import { Request, Response, NextFunction } from 'express';
import User from '../../../models/user.model';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import { admin } from '../../../config/firebase.config';

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

export const adminLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;

    if (!idToken) {
        return next(new ApiError(400, 'ID token is required'));
    }

    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error: any) {
        console.error('Firebase Verify Error:', error.message);
        return next(new ApiError(401, 'Invalid or expired token: ' + error.message));
    }

    const { uid, email } = decodedToken;
    console.log(`Login attempt for UID: ${uid}, Email: ${email}`);

    let user = await User.findOne({ uid });

    // Fallback for migrated users (different Firebase Project UIDs)
    if (!user && email) {
        user = await User.findOne({ email });
        if (user) {
            user.uid = uid; // Sync the new Firebase UID
            await user.save();
        }
    }

    if (!user) {
        console.warn(`User not found in DB for UID: ${uid}`);
        return next(new ApiError(401, 'User not found in database. Please contact system administrator.'));
    }

    if (user.role !== 'admin') {
        console.warn(`Access denied: User ${email} has role ${user.role}`);
        return next(new ApiError(403, 'Unauthorized: Admin access only'));
    }

    console.log(`Admin ${email} logged in successfully`);
    res.cookie('token', idToken, getCookieOptions());

    return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        user,
        token: idToken,
    });
});

export const getMe = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user });
    } else {
        return next(new ApiError(404, 'User not found'));
    }
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

export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(404, `No user found with id: ${id}`));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
export const logoutAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cookieOptions = getCookieOptions();

    // Clear cookie with same options used to set it
    res.clearCookie('token', {
        ...cookieOptions,
        maxAge: 0
    });

    return res.status(200).json({
        success: true,
        message: 'Admin logout successful'
    });
});

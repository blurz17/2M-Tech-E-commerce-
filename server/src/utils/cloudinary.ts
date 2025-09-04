// server/src/utils/cloudinary.ts
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.config';
import { ApiError } from './ApiError';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'CyberParticles',
        format: async () => 'jpg',
        // Generate unique public_id for each file
        public_id: (req: Request, file: Express.Multer.File) => {
            // Use original filename + timestamp + random string for uniqueness
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
            return `product_${fileName}_${timestamp}_${randomString}`;
        },
    } as any,
});

// Configure multer with file validation
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 5 files
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// For single image upload (backward compatibility)
const uploadImage = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const uploadSingle = upload.single(fieldName);
        uploadSingle(req, res, (err: any) => {
            if (err) {
                console.error('Single image upload error:', err);
                return next(new ApiError(400, err.message || 'Image upload failed'));
            }
            next();
        });
    };
};

// For multiple images upload with better error handling
const uploadMultipleImages = (fieldName: string, maxCount: number = 10) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const uploadMultiple = upload.array(fieldName, maxCount);
        uploadMultiple(req, res, (err: any) => {
            if (err) {
                console.error('Multiple images upload error:', err);
                let errorMessage = 'Images upload failed';
                
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File size too large. Maximum 10MB per file.';
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    errorMessage = `Too many files. Maximum ${maxCount} files allowed.`;
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Unexpected file field name.';
                }
                
                return next(new ApiError(400, errorMessage));
            }
            
            // Log successful upload for debugging
            const files = req.files as Express.Multer.File[];
            console.log(`Successfully received ${files?.length || 0} files for upload`);
            
            next();
        });
    };
};

const deleteImage = async (publicId: string) => {
    try {
        if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`Image deleted: ${publicId}`, result);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

const deleteMultipleImages = async (publicIds: string[]) => {
    try {
        if (publicIds && publicIds.length > 0) {
            const deletePromises = publicIds.map(async (id) => {
                try {
                    const result = await cloudinary.uploader.destroy(id);
                    console.log(`Image deleted: ${id}`, result);
                    return result;
                } catch (error) {
                    console.error(`Error deleting image ${id}:`, error);
                    return null;
                }
            });
            
            await Promise.allSettled(deletePromises);
        }
    } catch (error) {
        console.error('Error deleting multiple images:', error);
    }
};

export { uploadImage, uploadMultipleImages, deleteImage, deleteMultipleImages };

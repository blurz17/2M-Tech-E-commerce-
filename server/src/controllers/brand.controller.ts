import { NextFunction, Request, Response } from 'express';
import { Brand } from '../models/brand.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { deleteImage } from '../utils/cloudinary';

// @desc    Create a new brand
// @route   POST /api/v1/brands/new
// @access  Admin
export const createBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const file = req.file as Express.Multer.File;

    if (!name) {
        return next(new ApiError(400, 'Brand name is required'));
    }

    if (!file) {
        return next(new ApiError(400, 'Brand image is required'));
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingBrand) {
        return next(new ApiError(400, 'Brand with this name already exists'));
    }

    const brand = await Brand.create({
        name: name.trim(),
        image: file.path,
        imagePublicId: file.filename
    });

    res.status(201).json({
        success: true,
        message: 'Brand created successfully',
        brand
    });
});

// @desc    Get all brands
// @route   GET /api/v1/brands/all
// @access  Public
export const getAllBrands = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [brands, totalBrands] = await Promise.all([
        Brand.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Brand.countDocuments({})
    ]);

    const totalPages = Math.ceil(totalBrands / limit);

    res.status(200).json({
        success: true,
        brands,
        totalBrands,
        totalPages,
        currentPage: page
    });
});

// @desc    Get brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
        return next(new ApiError(404, 'Brand not found'));
    }

    res.status(200).json({
        success: true,
        brand
    });
});

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Admin
export const updateBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file as Express.Multer.File;

    const brand = await Brand.findById(id);

    if (!brand) {
        return next(new ApiError(404, 'Brand not found'));
    }

    // Check if another brand has the same name (excluding current brand)
    if (name && name !== brand.name) {
        const existingBrand = await Brand.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id }
        });
        if (existingBrand) {
            return next(new ApiError(400, 'Brand with this name already exists'));
        }
        brand.name = name.trim();
    }

    // Update image if new file is provided
    if (file) {
        // Delete old image from Cloudinary
        if (brand.imagePublicId) {
            await deleteImage(brand.imagePublicId);
        }
        
        brand.image = file.path;
        brand.imagePublicId = file.filename;
    }

    await brand.save();

    res.status(200).json({
        success: true,
        message: 'Brand updated successfully',
        brand
    });
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Admin
export const deleteBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
        return next(new ApiError(404, 'Brand not found'));
    }

    // Delete image from Cloudinary
    if (brand.imagePublicId) {
        await deleteImage(brand.imagePublicId);
    }

    await Brand.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Brand deleted successfully'
    });
});

// @desc    Get brands for dropdown (simple list with images)
// @route   GET /api/v1/brands/dropdown
// @access  Public
export const getBrandsForDropdown = asyncHandler(async (req: Request, res: Response) => {
    const brands = await Brand.find({}, 'name _id image').sort({ name: 1 });

    res.status(200).json({
        success: true,
        brands
    });
});
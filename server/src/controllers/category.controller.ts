import { Request, Response } from 'express';
import { Category } from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { deleteImage } from '../utils/cloudinary';

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (imageUrl: string): string | null => {
  try {
    if (!imageUrl) return null;
    
    const matches = imageUrl.match(/\/([^\/]+)\.(?:jpg|jpeg|png|gif|webp)$/i);
    if (matches && matches[1]) {
      const pathMatches = imageUrl.match(/\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|gif|webp)$/i);
      return pathMatches ? pathMatches[1] : matches[1];
    }
    return null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// Create new category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  // Check if category already exists
  const existingCategory = await Category.findOne({
    name: name.trim()
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = (req.file as any).path;
    console.log('Image uploaded to Cloudinary:', imageUrl);
  }

  // Create category data
  const categoryData = {
    name: name.trim(),
    image: imageUrl
  };

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category
  });
});

// Get all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get all categories (including inactive) - Admin only
export const getAllCategoriesAdmin = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    categories
  });
});

// Get single category
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, 'Category ID is required');
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json({
    success: true,
    category
  });
});

// Update category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  if (!id) {
    throw new ApiError(400, 'Category ID is required');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check for duplicate names (excluding current category)
  if (name && name.trim()) {
    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      name: name.trim()
    });
    
    if (existingCategory) {
      throw new ApiError(400, 'Category with this name already exists');
    }
  }

  let imageUrl = category.image;
  if (req.file) {
    // Delete old image if it exists
    if (category.image) {
      const oldPublicId = extractPublicId(category.image);
      if (oldPublicId) {
        console.log('Deleting old image with public_id:', oldPublicId);
        await deleteImage(oldPublicId);
      }
    }
    
    imageUrl = (req.file as any).path;
    console.log('New image uploaded to Cloudinary:', imageUrl);
  }

  // Update category
  const updateData: any = {};
  
  if (name !== undefined) updateData.name = name.trim();
  if (imageUrl !== category.image) updateData.image = imageUrl;
  if (isActive !== undefined) updateData.isActive = isActive;

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    category: updatedCategory
  });
});

// Delete category (soft delete)
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Category ID is required');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if category is used by any products
  try {
    const Product = require('../models/product.model').Product;
    const productsCount = await Product.countDocuments({ category: category.value });

    if (productsCount > 0) {
      throw new ApiError(400, `Cannot delete category. ${productsCount} products are using this category`);
    }
  } catch (error) {
    console.log('Product model not found, continuing with category deletion');
  }

  await Category.findByIdAndUpdate(id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// Permanent delete category
export const permanentDeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Category ID is required');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if category is used by any products
  try {
    const Product = require('../models/product.model').Product;
    const productsCount = await Product.countDocuments({ category: category.value });

    if (productsCount > 0) {
      throw new ApiError(400, `Cannot delete category. ${productsCount} products are using this category`);
    }
  } catch (error) {
    console.log('Product model not found, continuing with category deletion');
  }

  // Delete image from Cloudinary if it exists
  if (category.image) {
    const publicId = extractPublicId(category.image);
    if (publicId) {
      console.log('Deleting image with public_id:', publicId);
      await deleteImage(publicId);
    }
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Category permanently deleted'
  });
});

import { Request, Response } from 'express';
import { Subcategory } from '../models/subcategory.model';
import { Category } from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { deleteImage } from '../utils/cloudinary';
import mongoose from 'mongoose';

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

// Create new subcategory
export const createSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, parentCategory } = req.body;

  // Validate required fields
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Subcategory name is required');
  }

  if (!parentCategory) {
    throw new ApiError(400, 'Parent category is required');
  }

  // Validate parent category exists
  if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
    throw new ApiError(400, 'Invalid parent category ID');
  }

  const categoryExists = await Category.findById(parentCategory);
  if (!categoryExists) {
    throw new ApiError(404, 'Parent category not found');
  }

  // Check if subcategory already exists in this category
  const existingSubcategory = await Subcategory.findOne({
    name: name.trim(),
    parentCategory
  });

  if (existingSubcategory) {
    throw new ApiError(400, 'Subcategory with this name already exists in this category');
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = (req.file as any).path;
  }

  const subcategoryData = {
    name: name.trim(),
    description: description?.trim(),
    parentCategory,
    image: imageUrl
  };

  const subcategory = await Subcategory.create(subcategoryData);
  const populatedSubcategory = await Subcategory.findById(subcategory._id)
    .populate('parentCategory', 'name _id');

  res.status(201).json({
    success: true,
    message: 'Subcategory created successfully',
    subcategory: populatedSubcategory
  });
});

// Get all subcategories
export const getAllSubcategories = asyncHandler(async (req: Request, res: Response) => {
  const subcategories = await Subcategory.find({ isActive: true })
    .populate('parentCategory', 'name _id')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    subcategories
  });
});

// Get subcategories by category
export const getSubcategoriesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const subcategories = await Subcategory.find({ 
    parentCategory: categoryId, 
    isActive: true 
  }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    subcategories
  });
});

// Get single subcategory
export const getSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid subcategory ID');
  }

  const subcategory = await Subcategory.findById(id)
    .populate('parentCategory', 'name _id');

  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  res.status(200).json({
    success: true,
    subcategory
  });
});

// Update subcategory
export const updateSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, parentCategory, isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid subcategory ID');
  }

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  // Validate parent category if provided
  if (parentCategory && parentCategory !== subcategory.parentCategory.toString()) {
    if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
      throw new ApiError(400, 'Invalid parent category ID');
    }

    const categoryExists = await Category.findById(parentCategory);
    if (!categoryExists) {
      throw new ApiError(404, 'Parent category not found');
    }
  }

  // Check for duplicate names in the same category
  if (name && name.trim()) {
    const existingSubcategory = await Subcategory.findOne({
      _id: { $ne: id },
      name: name.trim(),
      parentCategory: parentCategory || subcategory.parentCategory
    });

    if (existingSubcategory) {
      throw new ApiError(400, 'Subcategory with this name already exists in this category');
    }
  }

  let imageUrl = subcategory.image;
  if (req.file) {
    // Delete old image if it exists
    if (subcategory.image) {
      const oldPublicId = extractPublicId(subcategory.image);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    }
    imageUrl = (req.file as any).path;
  }

  // Update subcategory
  const updateData: any = {};
  
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description?.trim();
  if (parentCategory !== undefined) updateData.parentCategory = parentCategory;
  if (imageUrl !== subcategory.image) updateData.image = imageUrl;
  if (isActive !== undefined) updateData.isActive = isActive;

  const updatedSubcategory = await Subcategory.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('parentCategory', 'name _id');

  res.status(200).json({
    success: true,
    message: 'Subcategory updated successfully',
    subcategory: updatedSubcategory
  });
});

// Delete subcategory (soft delete)
export const deleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid subcategory ID');
  }

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  // Check if subcategory is used by any products
  try {
    const Product = require('../models/product.model').Product;
    const productsCount = await Product.countDocuments({ 
      subcategories: subcategory._id 
    });

    if (productsCount > 0) {
      throw new ApiError(400, `Cannot delete subcategory. ${productsCount} products are using this subcategory`);
    }
  } catch (error) {
    console.log('Product model not found, continuing with subcategory deletion');
  }

  await Subcategory.findByIdAndUpdate(id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Subcategory deleted successfully'
  });
});

// Permanent delete subcategory
export const permanentDeleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid subcategory ID');
  }

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  // Check if subcategory is used by any products
  try {
    const Product = require('../models/product.model').Product;
    const productsCount = await Product.countDocuments({ 
      subcategories: subcategory._id 
    });

    if (productsCount > 0) {
      throw new ApiError(400, `Cannot delete subcategory. ${productsCount} products are using this subcategory`);
    }
  } catch (error) {
    console.log('Product model not found, continuing with subcategory deletion');
  }

  // Delete image from Cloudinary if it exists
  if (subcategory.image) {
    const publicId = extractPublicId(subcategory.image);
    if (publicId) {
      await deleteImage(publicId);
    }
  }

  await Subcategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Subcategory permanently deleted'
  });
});
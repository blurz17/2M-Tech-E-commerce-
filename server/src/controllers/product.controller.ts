import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import { Subcategory } from "../models/subcategory.model";
import { Brand } from "../models/brand.model";
import {  NewProductBody, SearchProductsQuery } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Banner } from "../models/banner.model"; // Add this import

import { deleteMultipleImages } from "../utils/cloudinary";
import { ProductService } from "../services/product.service";
import mongoose from "mongoose";
import { getDefaultCurrencySymbol } from "../utils/helper";

getDefaultCurrencySymbol ;

export const createNewProduct = asyncHandler(
    async (req: Request<{}, {}, NewProductBody>, res: Response, next) => {
        const { name, categories, subcategories, brand, price, discount = 0, stock, description, status = true } = req.body;
        
        // Validate required fields
        if (!name || !categories || !brand || !price || !stock || !description) {
            return next(new ApiError(400, "Please fill all required fields"));
        }

        // Validate discount
        if (discount < 0 || discount > 100) {
            return next(new ApiError(400, "Discount must be between 0 and 100"));
        }

        // Parse categories and subcategories if they're strings
        const categoryIds = Array.isArray(categories) ? categories : JSON.parse(categories);
        const subcategoryIds = subcategories ? 
            (Array.isArray(subcategories) ? subcategories : JSON.parse(subcategories)) : [];

        // Validate categories
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            return next(new ApiError(400, "At least one category is required"));
        }

        // Validate all category IDs
        for (const categoryId of categoryIds) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return next(new ApiError(400, "Invalid category ID"));
            }
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                return next(new ApiError(400, `Category not found: ${categoryId}`));
            }
        }

        // Validate subcategories if provided
        for (const subcategoryId of subcategoryIds) {
            if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
                return next(new ApiError(400, "Invalid subcategory ID"));
            }
            const subcategoryExists = await Subcategory.findById(subcategoryId);
            if (!subcategoryExists) {
                return next(new ApiError(400, `Subcategory not found: ${subcategoryId}`));
            }
        }

        // Validate brand exists
        if (!mongoose.Types.ObjectId.isValid(brand)) {
            return next(new ApiError(400, "Invalid brand ID"));
        }

        const brandExists = await Brand.findById(brand);
        if (!brandExists) {
            return next(new ApiError(400, "Brand not found"));
        }

        // Get default currency symbol
        const currencySymbol = await getDefaultCurrencySymbol();

        // Process uploaded files
        const photoData = await ProductService.processUploadedFiles(req.files as Express.Multer.File[]);

        // Calculate net price
        const priceValue = Number(price);
        const discountValue = Number(discount);
        const netPrice = priceValue - ((priceValue * discountValue) / 100);
  
        try {
            const product = await Product.create({
                name: name.trim(),
                categories: categoryIds.map(id => new mongoose.Types.ObjectId(id)),
                subcategories: subcategoryIds.map(id => new mongoose.Types.ObjectId(id)),
                brand: new mongoose.Types.ObjectId(brand),
                description: description.trim(),
                price: priceValue,
                discount: discountValue,
                netPrice: netPrice,
                stock: Number(stock),
                photos: photoData.photos,
                photoPublicIds: photoData.photoPublicIds,
                currencySymbol,
                status: typeof status === 'string' ? status === 'true' : Boolean(status)

            });

            // Populate for response
            const populatedProduct = await Product.findById(product._id)
                .populate('categories', 'name _id')
                .populate('subcategories', 'name _id')
                .populate('brand', 'name _id');

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: populatedProduct
            });
        } catch (error) {
            // Cleanup uploaded images on failure
            if (photoData.photoPublicIds.length > 0) {
                await deleteMultipleImages(photoData.photoPublicIds).catch(console.error);
            }
            return next(new ApiError(500, "Failed to create product"));
        }
    }
);

// Update product
const updateProductDiscounts = async (bannerProducts: any[]) => {
  for (const bannerProduct of bannerProducts) {
    const product = await Product.findById(bannerProduct.product);
    if (product) {
      // Update the product's discount directly
      product.discount = bannerProduct.discountPercentage;
      
      // Recalculate net price
      product.netPrice = product.price - ((product.price * bannerProduct.discountPercentage) / 100);
      
      await product.save();
    }
  }
};

// NEW: Helper function to sync product discount to banners
const syncProductDiscountToBanners = async (productId: string, newDiscount: number) => {
  try {
    // Find all banners that contain this product
    const bannersWithProduct = await Banner.find({
      'products.product': productId,
      isActive: true // Only sync active banners
    });

    // Update the discount in each banner
    for (const banner of bannersWithProduct) {
      let updated = false;
      banner.products = banner.products.map(bannerProduct => {
        if (bannerProduct.product.toString() === productId) {
          bannerProduct.discountPercentage = newDiscount;
          updated = true;
        }
        return bannerProduct;
      });

      if (updated) {
        await banner.save();
      }
    }

    console.log(`Updated discount in ${bannersWithProduct.length} banners for product ${productId}`);
  } catch (error) {
    console.error('Error syncing product discount to banners:', error);
  }
};

// UPDATED: Complete updateProduct function with banner synchronization
export const updateProduct = asyncHandler(
    async (req: Request, res: Response, next) => {
        const id = req.params.id;
        const { name, categories, subcategories, brand, price, discount, stock, description, status } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Store the old discount for comparison
        const oldDiscount = product.discount;

        // Validate discount if provided
        if (discount !== undefined) {
            if (discount < 0 || discount > 100) {
                return next(new ApiError(400, "Discount must be between 0 and 100"));
            }
            product.discount = Number(discount);
        }

        // Validate brand if provided
        if (brand) {
            if (!mongoose.Types.ObjectId.isValid(brand)) {
                return next(new ApiError(400, "Invalid brand ID"));
            }
            
            const brandExists = await Brand.findById(brand);
            if (!brandExists) {
                return next(new ApiError(400, "Brand not found"));
            }
            
            product.brand = new mongoose.Types.ObjectId(brand);
        }

        // Update categories if provided
        if (categories) {
            const categoryIds = Array.isArray(categories) ? categories : JSON.parse(categories);
            
            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                return next(new ApiError(400, "At least one category is required"));
            }

            // Validate all category IDs
            for (const categoryId of categoryIds) {
                if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                    return next(new ApiError(400, "Invalid category ID"));
                }
                const categoryExists = await Category.findById(categoryId);
                if (!categoryExists) {
                    return next(new ApiError(400, `Category not found: ${categoryId}`));
                }
            }

            product.categories = categoryIds.map(id => new mongoose.Types.ObjectId(id));
        }

        // Update subcategories if provided
        if (subcategories !== undefined) {
            const subcategoryIds = subcategories ? 
                (Array.isArray(subcategories) ? subcategories : JSON.parse(subcategories)) : [];

            // Validate subcategories if provided
            for (const subcategoryId of subcategoryIds) {
                if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
                    return next(new ApiError(400, "Invalid subcategory ID"));
                }
                const subcategoryExists = await Subcategory.findById(subcategoryId);
                if (!subcategoryExists) {
                    return next(new ApiError(400, `Subcategory not found: ${subcategoryId}`));
                }
            }

            product.subcategories = subcategoryIds.map(id => new mongoose.Types.ObjectId(id));
        }

        // Handle image updates
        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
            const photoData = await ProductService.processUploadedFiles(req.files as Express.Multer.File[]);
            const oldPhotoPublicIds = product.photoPublicIds || [];
            
            // Update with new images
            product.photos = photoData.photos;
            product.photoPublicIds = photoData.photoPublicIds;
            
            // Cleanup old images
            if (oldPhotoPublicIds.length > 0) {
                deleteMultipleImages(oldPhotoPublicIds).catch(console.error);
            }
        }

        // Update other fields
        if (name) product.name = name.trim();
        if (price) product.price = Number(price);
        if (stock !== undefined) product.stock = Number(stock);
        if (description) product.description = description.trim();
        
        // Handle status correctly
        if (status !== undefined) {
            // Handle string "false" correctly
            product.status = status === 'true' || status === true;
        }

        // Save the updated product
        const updatedProduct = await product.save();

        // NEW: Sync discount to banners if discount was changed
        if (discount !== undefined && Number(discount) !== oldDiscount) {
            await syncProductDiscountToBanners(id, Number(discount));
        }

        // Populate the product for response
        const populatedProduct = await Product.findById(updatedProduct._id)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id');

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: populatedProduct
        });
    }
);
// Get latest products - WITH CONDITIONAL STATUS FILTER
export const getLatestProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const limit = Math.min(Number(req.query.limit) || 1, 100);
        const includeUnpublished = req.query.includeUnpublished === 'true';
        
        // Build query - only filter by status if not admin request
        const query = includeUnpublished ? {} : { status: true };
        
        const products = await Product.find(query)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id')
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).json({
            success: true,
            products,
            totalReturned: products.length
        });
    }
);

// Get all categories and subcategories
export const getAllCategories = asyncHandler(
    async (req: Request, res: Response) => {
        const [categories, subcategories] = await Promise.all([
            Category.find({ isActive: true }).select('name value'),
            Subcategory.find({ isActive: true }).populate('parentCategory', 'name _id').select('name value parentCategory')
        ]);

        return res.status(200).json({
            success: true,
            categories,
            subcategories
        });
    }
);

// Get all products with filtering and pagination - WITH CONDITIONAL STATUS FILTER
export const getAllProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const category = req.query.category as string;
        const subcategory = req.query.subcategory as string;
        const brand = req.query.brand as string;
        const includeUnpublished = req.query.includeUnpublished === 'true';
        
        const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : null;
        const sort = ProductService.buildSortQuery(sortBy);
        let query = await ProductService.buildFilterQuery({ category, subcategory, brand });
        
        // Add status filter only if not admin request
        if (!includeUnpublished) {
            query.status = true;
        }

        const [totalProducts, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('categories', 'name _id')
                .populate('subcategories', 'name _id')
                .populate('brand', 'name _id')
                .sort(sort)
                .skip(skip)
                .limit(limit)
        ]);

        return res.status(200).json({
            success: true,
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page
        });
    }
);

// Get product details - NO STATUS FILTER (so admin can see unpublished products)
export const getProductDetails = asyncHandler(
    async (req: Request, res: Response, next) => {
        const product = await Product.findById(req.params.id)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id image');
            
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res.status(200).json({
            success: true,
            product
        });
    }
);

// Search products - WITH CONDITIONAL STATUS FILTER
export const searchProducts = asyncHandler(
    async (req: Request<{}, {}, {}, SearchProductsQuery>, res: Response) => {
        const { page = '1' } = req.query;
        const limit = Number(process.env.PRODUCTS_PER_PAGE);
        const skip = (Number(page) - 1) * limit;
        const includeUnpublished = req.query.includeUnpublished === 'true';

        let query = await ProductService.buildSearchQuery(req.query);
        
        // Add status filter only if not admin request
        if (!includeUnpublished) {
            query.status = true;
        }
        
        const sort = ProductService.buildSortQuery({ 
            id: req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? 'price' : '', 
            desc: req.query.sort === 'desc' 
        });

        const [products, totalProducts] = await Promise.all([
            Product.find(query)
                .populate('categories', 'name _id')
                .populate('subcategories', 'name _id')
                .populate('brand', 'name _id')
                .sort(sort)
                .limit(limit)
                .skip(skip),
            Product.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            products,
            totalPage: Math.ceil(totalProducts / limit),
            totalProducts
        });
    }
);

// Delete product
export const deleteProduct = asyncHandler(
    async (req: Request, res: Response, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Delete images from cloudinary
        if (product.photoPublicIds && product.photoPublicIds.length > 0) {
            await deleteMultipleImages(product.photoPublicIds);
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
);

// Toggle featured status
export const toggleFeaturedStatus = asyncHandler(
    async (req: Request, res: Response, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        product.featured = !product.featured;
        await product.save();

        const populatedProduct = await Product.findById(product._id)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id');

        return res.status(200).json({
            success: true,
            message: "Product featured status updated successfully",
            product: populatedProduct
        });
    }
);

// Toggle published status (new endpoint)
export const togglePublishedStatus = asyncHandler(
    async (req: Request, res: Response, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        product.status = !product.status;
        await product.save();

        const populatedProduct = await Product.findById(product._id)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id');

        return res.status(200).json({
            success: true,
            message: `Product ${product.status ? 'published' : 'unpublished'} successfully`,
            product: populatedProduct
        });
    }
);

// Get featured products - WITH CONDITIONAL STATUS FILTER
export const getFeaturedProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const includeUnpublished = req.query.includeUnpublished === 'true';
        
        // Build query - featured products with conditional status filter
        const query = includeUnpublished 
            ? { featured: true } 
            : { featured: true, status: true };
            
        const products = await Product.find(query)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id');
            
        return res.status(200).json({
            success: true,
            products
        });
    }
);

// Get products by category - WITH CONDITIONAL STATUS FILTER
export const getProductsByCategory = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { categoryId } = req.params;
        const limit = Math.min(Number(req.query.limit) || 20, 500);
        const includeUnpublished = req.query.includeUnpublished === 'true';

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return next(new ApiError(400, "Invalid category ID"));
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // Build query with conditional status filter
        const query = includeUnpublished 
            ? { categories: categoryId }
            : { categories: categoryId, status: true };

        const products = await Product.find(query)
        .populate('categories', 'name _id')
        .populate('subcategories', 'name _id')
        .populate('brand', 'name _id')
        .sort({ createdAt: -1 })
        .limit(limit);

        return res.status(200).json({
            success: true,
            products,
            category: category.name,
            totalReturned: products.length
        });
    }
);

// Get products by subcategory - WITH CONDITIONAL STATUS FILTER
export const getProductsBySubcategory = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { subcategoryId } = req.params;
        const limit = Math.min(Number(req.query.limit) || 20, 500);
        const includeUnpublished = req.query.includeUnpublished === 'true';

        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return next(new ApiError(400, "Invalid subcategory ID"));
        }

        const subcategory = await Subcategory.findById(subcategoryId).populate('parentCategory', 'name');
        if (!subcategory) {
            return next(new ApiError(404, "Subcategory not found"));
        }

        // Build query with conditional status filter
        const query = includeUnpublished 
            ? { subcategories: subcategoryId }
            : { subcategories: subcategoryId, status: true };

        const products = await Product.find(query)
        .populate('categories', 'name _id')
        .populate('subcategories', 'name _id')
        .populate('brand', 'name _id')
        .sort({ createdAt: -1 })
        .limit(limit);

        return res.status(200).json({
            success: true,
            products,
            subcategory: subcategory.name,
            parentCategory: subcategory.parentCategory,
            totalReturned: products.length
        });
    }
);

// Get products by brand - WITH CONDITIONAL STATUS FILTER
export const getProductsByBrand = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { brandId } = req.params;
        const limit = Math.min(Number(req.query.limit) );
        const includeUnpublished = req.query.includeUnpublished === 'true';

        if (!mongoose.Types.ObjectId.isValid(brandId)) {
            return next(new ApiError(400, "Invalid brand ID"));
        }

        const brand = await Brand.findById(brandId);
        if (!brand) {
            return next(new ApiError(404, "Brand not found"));
        }

        // Build query with conditional status filter
        const query = includeUnpublished 
            ? { brand: brandId }
            : { brand: brandId, status: true };

        const products = await Product.find(query)
            .populate('categories', 'name _id')
            .populate('subcategories', 'name _id')
            .populate('brand', 'name _id')
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).json({
            success: true,
            products,
            brand: brand.name,
            totalReturned: products.length
        });
    }
);
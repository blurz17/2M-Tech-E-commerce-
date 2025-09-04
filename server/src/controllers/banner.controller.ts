import { Request, Response } from "express";
import { Banner } from "../models/banner.model";
import { Product } from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteImage } from "../utils/cloudinary";
import mongoose from "mongoose";

// Helper function to update product discounts from banner
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

// Create new banner
export const createBanner = asyncHandler(
  async (req: Request, res: Response, next) => {
    const { name, description, products, isActive } = req.body;
    
    if (!name || !description) {
      return next(new ApiError(400, "Name and description are required"));
    }

    if (!req.file || !req.file.path || !req.file.filename) {
      return next(new ApiError(400, "Banner image is required"));
    }

    // Parse products if it's a string
    const bannerProducts = products ? JSON.parse(products) : [];
    
    // Validate products
    for (const product of bannerProducts) {
      if (!mongoose.Types.ObjectId.isValid(product.product)) {
        return next(new ApiError(400, "Invalid product ID"));
      }
      
      const productExists = await Product.findById(product.product);
      if (!productExists) {
        return next(new ApiError(400, `Product not found: ${product.product}`));
      }
      
      if (product.discountPercentage < 0 || product.discountPercentage > 100) {
        return next(new ApiError(400, "Discount percentage must be between 0 and 100"));
      }
    }

    try {
      const banner = await Banner.create({
        name: name.trim(),
        description: description.trim(),
        image: req.file.path,
        imagePublicId: req.file.filename,
        products: bannerProducts,
        isActive: isActive === 'true' || isActive === true
      });

      // Update product discounts directly
      if (banner.isActive && bannerProducts.length > 0) {
        await updateProductDiscounts(bannerProducts);
      }

      const populatedBanner = await Banner.findById(banner._id)
        .populate({
          path: 'products.product',
          select: 'name price netPrice discount photos brand categories stock status',
          populate: {
            path: 'brand categories',
            select: 'name'
          }
        });

      return res.status(201).json({
        success: true,
        message: "Banner created successfully",
        banner: populatedBanner
      });
    } catch (error) {
      // Cleanup uploaded image on failure
      if (req.file?.filename) {
        await deleteImage(req.file.filename).catch(console.error);
      }
      return next(new ApiError(500, "Failed to create banner"));
    }
  }
);

// Update banner
export const updateBanner = asyncHandler(
  async (req: Request, res: Response, next) => {
    const { id } = req.params;
    const { name, description, products, isActive } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return next(new ApiError(404, "Banner not found"));
    }

    // Handle image update
    if (req.file && req.file.path && req.file.filename) {
      const oldImagePublicId = banner.imagePublicId;
      
      banner.image = req.file.path;
      banner.imagePublicId = req.file.filename;
      
      // Delete old image
      if (oldImagePublicId) {
        deleteImage(oldImagePublicId).catch(console.error);
      }
    }

    // Parse and validate products if provided
    let newProducts = banner.products;
    if (products) {
      newProducts = JSON.parse(products);
      
      for (const product of newProducts) {
        if (!mongoose.Types.ObjectId.isValid(product.product)) {
          return next(new ApiError(400, "Invalid product ID"));
        }
        
        const productExists = await Product.findById(product.product);
        if (!productExists) {
          return next(new ApiError(400, `Product not found: ${product.product}`));
        }
        
        if (product.discountPercentage < 0 || product.discountPercentage > 100) {
          return next(new ApiError(400, "Discount percentage must be between 0 and 100"));
        }
      }
    }

    // Update banner fields
    if (name) banner.name = name.trim();
    if (description) banner.description = description.trim();
    banner.products = newProducts;
    
    const newIsActive = isActive === 'true' || isActive === true;
    banner.isActive = newIsActive;

    await banner.save();

    // Update product discounts if banner is active
    if (newIsActive && newProducts.length > 0) {
      await updateProductDiscounts(newProducts);
    }

    const populatedBanner = await Banner.findById(banner._id)
      .populate({
        path: 'products.product',
        select: 'name price netPrice discount photos brand categories stock status',
        populate: {
          path: 'brand categories',
          select: 'name'
        }
      });

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner: populatedBanner
    });
  }
);

// Get all banners
export const getAllBanners = asyncHandler(
  async (req: Request, res: Response) => {
    const includeInactive = req.query.includeInactive === 'true';
    
    const query = includeInactive ? {} : { isActive: true };
    
    const banners = await Banner.find(query)
      .populate({
        path: 'products.product',
        select: 'name price netPrice discount photos brand categories stock status',
        populate: {
          path: 'brand categories',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      banners
    });
  }
);

// Get banner by ID
export const getBannerById = asyncHandler(
  async (req: Request, res: Response, next) => {
    const banner = await Banner.findById(req.params.id)
      .populate({
        path: 'products.product',
        select: 'name price netPrice discount photos brand categories stock status',
        populate: {
          path: 'brand categories',
          select: 'name'
        }
      });

    if (!banner) {
      return next(new ApiError(404, "Banner not found"));
    }

    return res.status(200).json({
      success: true,
      banner
    });
  }
);

// Delete banner
export const deleteBanner = asyncHandler(
  async (req: Request, res: Response, next) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return next(new ApiError(404, "Banner not found"));
    }

    // Delete image from cloudinary
    if (banner.imagePublicId) {
      deleteImage(banner.imagePublicId).catch(console.error);
    }

    await banner.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully"
    });
  }
);

// Toggle banner status
export const toggleBannerStatus = asyncHandler(
  async (req: Request, res: Response, next) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return next(new ApiError(404, "Banner not found"));
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    // Update product discounts if banner is now active
    if (banner.isActive && banner.products.length > 0) {
      await updateProductDiscounts(banner.products);
    }

    const populatedBanner = await Banner.findById(banner._id)
      .populate({
        path: 'products.product',
        select: 'name price netPrice discount photos brand categories stock status',
        populate: {
          path: 'brand categories',
          select: 'name'
        }
      });

    return res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      banner: populatedBanner
    });
  }
);



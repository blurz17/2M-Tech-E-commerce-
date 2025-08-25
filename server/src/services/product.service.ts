import { ApiError } from "../utils/ApiError";
import { CategoryService } from "./category.service";
import { SearchProductsQuery } from "../types/types";
import { Brand } from "../models/brand.model";
import { Category } from "../models/category.model";
import { Subcategory } from "../models/subcategory.model";
import mongoose from "mongoose";

interface PhotoData {
    photos: string[];
    photoPublicIds: string[];
}

interface FilterQuery {
    category?: string;
    subcategory?: string;
    brand?: string;
}

interface SearchQuery extends FilterQuery {
    search?: string;
    price?: string;
}

export class ProductService {
    /**
     * Process uploaded files and validate them
     */
    static async processUploadedFiles(files: Express.Multer.File[]): Promise<PhotoData> {
        if (!files || files.length === 0) {
            throw new ApiError(400, "Please upload at least one photo");
        }

        if (files.length > 5) {
            throw new ApiError(400, "Maximum 5 images allowed");
        }

        const photosData: { url: string; publicId: string }[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.path || !file.filename) {
                throw new ApiError(400, `File upload failed for: ${file.originalname}`);
            }

            photosData.push({
                url: file.path,
                publicId: file.filename
            });
        }

        return {
            photos: photosData.map(photo => photo.url),
            photoPublicIds: photosData.map(photo => photo.publicId)
        };
    }

    /**
     * Build sort query from sortBy parameter
     */
    static buildSortQuery(sortBy: any): Record<string, 1 | -1> {
        if (!sortBy || !sortBy.id) {
            return {};
        }

        return {
            [sortBy.id]: sortBy.desc ? -1 : 1
        };
    }

    /**
     * Build filter query for products with categories, subcategories, and brand support
     */
    static async buildFilterQuery(filters: FilterQuery): Promise<Record<string, any>> {
        const query: Record<string, any> = {};
        
        // Category filter - now searches in categories array
        if (filters.category) {
            if (mongoose.Types.ObjectId.isValid(filters.category)) {
                query.categories = filters.category;
            } else {
                // Search by category name
                const category = await Category.findOne({ 
                    $or: [
                        { name: { $regex: filters.category, $options: 'i' } },
                        { value: { $regex: filters.category, $options: 'i' } }
                    ]
                });
                if (category) {
                    query.categories = category._id;
                }
            }
        }

        // Subcategory filter
        if (filters.subcategory) {
            if (mongoose.Types.ObjectId.isValid(filters.subcategory)) {
                query.subcategories = filters.subcategory;
            } else {
                // Search by subcategory name
                const subcategory = await Subcategory.findOne({ 
                    $or: [
                        { name: { $regex: filters.subcategory, $options: 'i' } },
                        { value: { $regex: filters.subcategory, $options: 'i' } }
                    ]
                });
                if (subcategory) {
                    query.subcategories = subcategory._id;
                }
            }
        }

        // Brand filter
        if (filters.brand) {
            if (mongoose.Types.ObjectId.isValid(filters.brand)) {
                query.brand = filters.brand;
            } else {
                const brandDoc = await Brand.findOne({ 
                    name: { $regex: filters.brand, $options: 'i' } 
                });
                if (brandDoc) {
                    query.brand = brandDoc._id;
                }
            }
        }

        return query;
    }

    /**
     * Build search query with multiple filters including categories, subcategories, and brand
     */
    static async buildSearchQuery(searchParams: SearchProductsQuery): Promise<Record<string, any>> {
        const { search, category, subcategory, brand, price } = searchParams;
        const query: Record<string, any> = {};

        // Text search
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Category filter
        if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.categories = category;
            } else {
                const categoryDoc = await Category.findOne({ 
                    $or: [
                        { name: { $regex: category, $options: 'i' } },
                        { value: { $regex: category, $options: 'i' } }
                    ]
                });
                if (categoryDoc) {
                    query.categories = categoryDoc._id;
                }
            }
        }

        // Subcategory filter
        if (subcategory) {
            if (mongoose.Types.ObjectId.isValid(subcategory)) {
                query.subcategories = subcategory;
            } else {
                const subcategoryDoc = await Subcategory.findOne({ 
                    $or: [
                        { name: { $regex: subcategory, $options: 'i' } },
                        { value: { $regex: subcategory, $options: 'i' } }
                    ]
                });
                if (subcategoryDoc) {
                    query.subcategories = subcategoryDoc._id;
                }
            }
        }

        // Brand filter
        if (brand) {
            if (mongoose.Types.ObjectId.isValid(brand)) {
                query.brand = brand;
            } else {
                const brandDoc = await Brand.findOne({ 
                    name: { $regex: brand, $options: 'i' } 
                });
                if (brandDoc) {
                    query.brand = brandDoc._id;
                }
            }
        }

        // Price range filter
        if (price) {
            const [min, max] = price.split(',').map(Number);
            query.price = {};
            if (!isNaN(min)) query.price.$gte = min;
            if (!isNaN(max)) query.price.$lte = max;
        }

        return query;
    }

    /**
     * Format product response for API
     */
    static formatProductResponse(product: any) {
        return {
            _id: product._id,
            name: product.name,
            categories: product.categories,
            subcategories: product.subcategories,
            brand: product.brand,
            description: product.description,
            price: product.price,
            stock: product.stock,
            photos: product.photos,
            photoCount: product.photos.length,
            createdAt: product.createdAt
        };
    }

    /**
     * Validate product data before save including categories, subcategories, and brand
     */
    static async validateProductData(data: any) {
        const errors: string[] = [];

        if (!data.name?.trim()) {
            errors.push("Product name is required");
        }

        if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
            errors.push("At least one category is required");
        } else {
            // Validate all category IDs
            for (const categoryId of data.categories) {
                if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                    errors.push("Invalid category ID");
                } else {
                    const categoryExists = await Category.findById(categoryId);
                    if (!categoryExists) {
                        errors.push(`Category not found: ${categoryId}`);
                    }
                }
            }
        }

        // Validate subcategories if provided
        if (data.subcategories && Array.isArray(data.subcategories)) {
            for (const subcategoryId of data.subcategories) {
                if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
                    errors.push("Invalid subcategory ID");
                } else {
                    const subcategoryExists = await Subcategory.findById(subcategoryId);
                    if (!subcategoryExists) {
                        errors.push(`Subcategory not found: ${subcategoryId}`);
                    }
                }
            }
        }

        if (!data.brand?.trim()) {
            errors.push("Brand is required");
        } else {
            // Validate brand exists
            if (!mongoose.Types.ObjectId.isValid(data.brand)) {
                errors.push("Invalid brand ID");
            } else {
                const brandExists = await Brand.findById(data.brand);
                if (!brandExists) {
                    errors.push("Brand not found");
                }
            }
        }

        if (!data.price || data.price <= 0) {
            errors.push("Valid price is required");
        }

        if (!data.stock || data.stock < 0) {
            errors.push("Valid stock quantity is required");
        }

        if (!data.description?.trim()) {
            errors.push("Description is required");
        }

        if (errors.length > 0) {
            throw new ApiError(400, errors.join(", "));
        }
    }

    /**
     * Validate brand exists
     */
    static async validateBrandExists(brandId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(brandId)) {
            return false;
        }
        
        const brand = await Brand.findById(brandId);
        return !!brand;
    }

    /**
     * Validate category exists
     */
    static async validateCategoryExists(categoryId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return false;
        }
        
        const category = await Category.findById(categoryId);
        return !!category;
    }

    /**
     * Validate subcategory exists
     */
    static async validateSubcategoryExists(subcategoryId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return false;
        }
        
        const subcategory = await Subcategory.findById(subcategoryId);
        return !!subcategory;
    }
}
// server/src/models/product.model.ts
import mongoose from "mongoose";

// Updated IProduct interface with status
export interface IProduct {
  _id?: string;
  name: string;
  categories: mongoose.Types.ObjectId[];
  subcategories?: mongoose.Types.ObjectId[];
  brand: mongoose.Types.ObjectId;
  description: string;
  price: number;
  discount: number; // Discount percentage (e.g., 10 for 10%)
  netPrice: number; // Calculated price after discount
  stock: number;
  photos: string[];
  photoPublicIds: string[];
  currencySymbol?: string;
  featured?: boolean;
  status: boolean; // New field: true = published, false = unpublished
  createdAt?: Date;  
  updatedAt?: Date;  
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    photos: [{
        type: String,
        required: [true, "At least one product photo is required"]
    }],
    photoPublicIds: [{
        type: String,
    }],
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 // Maximum 100% discount
    },
    netPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"]
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "At least one category is required"]
    }],
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, "Product brand is required"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    currencySymbol: {
        type: String,
        default: "$"
    },
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true, // Default is published
        required: true
    }
}, { timestamps: true });

// Pre-save middleware to calculate netPrice
productSchema.pre('save', function(next) {
    if (this.isModified('price') || this.isModified('discount')) {
        this.netPrice = this.price - ((this.price * this.discount) / 100);
    }
    next();
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
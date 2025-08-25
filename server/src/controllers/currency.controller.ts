// server/src/controllers/currency.controller.ts
import { Request, Response } from "express";
import { Currency } from "../models/currency.model";
import { Product } from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Get all currencies
export const getAllCurrencies = asyncHandler(
    async (req: Request, res: Response) => {
        const currencies = await Currency.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            currencies
        });
    }
);

// Get default currency
export const getDefaultCurrency = asyncHandler(
    async (req: Request, res: Response) => {
        const defaultCurrency = await Currency.findOne({ isDefault: true });
        
        return res.status(200).json({
            success: true,
            currency: defaultCurrency
        });
    }
);

// Create new currency
export const createCurrency = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { symbol } = req.body;
        
        if (!symbol) {
            return next(new ApiError(400, "Currency symbol is required"));
        }

        // Check if currency already exists
        const existingCurrency = await Currency.findOne({ symbol: symbol.trim() });
        if (existingCurrency) {
            return next(new ApiError(400, "Currency symbol already exists"));
        }

        const currency = await Currency.create({
            symbol: symbol.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Currency created successfully",
            currency
        });
    }
);

// Set default currency and update all products
export const setDefaultCurrency = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { currencyId } = req.params;
        
        const currency = await Currency.findById(currencyId);
        if (!currency) {
            return next(new ApiError(404, "Currency not found"));
        }

        // Update all currencies to not default
        await Currency.updateMany({}, { isDefault: false });
        
        // Set the selected currency as default
        currency.isDefault = true;
        await currency.save();

        // Update all products with the new currency symbol
        await Product.updateMany(
            {},
            { currencySymbol: currency.symbol }
        );

        return res.status(200).json({
            success: true,
            message: "Default currency updated successfully",
            currency
        });
    }
);

// Delete currency
export const deleteCurrency = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { currencyId } = req.params;
        
        const currency = await Currency.findById(currencyId);
        if (!currency) {
            return next(new ApiError(404, "Currency not found"));
        }

        if (currency.isDefault) {
            return next(new ApiError(400, "Cannot delete default currency"));
        }

        await currency.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Currency deleted successfully"
        });
    }
);
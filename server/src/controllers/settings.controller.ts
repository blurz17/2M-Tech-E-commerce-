// server\src\controllers\settings.controller.ts
import { Request, Response } from 'express';
import Settings from '../models/settings.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { cloudinary } from '../config/cloudinary.config';

// Get settings
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
        settings = await Settings.create({});
    }

    res.status(200).json({
        success: true,
        settings
    });
});

// Update settings
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const {
        companyName,
        phone,
        email,
        address,
        website,
        description,
        metaTitle,
        metaDescription,
        metaKeywords,
        facebook,
        instagram,
        twitter,
        linkedin,
        whatsapp,
        timezone,
        language,
    } = req.body;

    let settings = await Settings.findOne();
    
    // If no settings exist, create new ones
    if (!settings) {
        settings = new Settings();
    }

    // Handle logo upload - FIXED: Use CloudinaryStorage properly
    let logoUrl = settings.logo;
    if (req.file) {
        try {
            // With CloudinaryStorage, the file is already uploaded
            // Access the secure_url from the uploaded file
            logoUrl = (req.file as any).path; // Cloudinary returns the URL in the path property
            
            console.log('Logo uploaded successfully:', logoUrl);
        } catch (error) {
            console.error('Logo upload error:', error);
            throw new ApiError(400, 'Failed to upload logo image');
        }
    }

    // Update settings
    settings.companyName = companyName || settings.companyName;
    settings.logo = logoUrl;
    settings.phone = phone || settings.phone;
    settings.email = email || settings.email;
    settings.address = address || settings.address;
    settings.website = website || settings.website;
    settings.description = description || settings.description;
    settings.metaTitle = metaTitle || settings.metaTitle;
    settings.metaDescription = metaDescription || settings.metaDescription;
    settings.metaKeywords = metaKeywords || settings.metaKeywords;
    settings.facebook = facebook || settings.facebook;
    settings.instagram = instagram || settings.instagram;
    settings.twitter = twitter || settings.twitter;
    settings.linkedin = linkedin || settings.linkedin;
    settings.whatsapp = whatsapp || settings.whatsapp;    settings.timezone = timezone || settings.timezone;
    settings.language = language || settings.language;
    

    await settings.save();

    res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        settings
    });
});


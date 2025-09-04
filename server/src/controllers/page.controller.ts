// server/src/controllers/page.controller.ts
import { Request, Response } from 'express';
import { Page } from '../models/page.model';

// Get all pages (admin only)
export const getAllPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
};

// Get single page by slug (public)
// Replace your getPageBySlug function with this temporarily for debugging
export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const requestedSlug = req.params.slug;
    console.log('🔍 Looking for page with slug:', requestedSlug);
    
    // First, let's see if ANY page with this slug exists (published or not)
    const anyPage = await Page.findOne({ slug: requestedSlug });
    console.log('📄 Found any page:', anyPage ? 'Yes' : 'No');
    
    if (anyPage) {
      console.log('📋 Page details:', {
        title: anyPage.title,
        slug: anyPage.slug,
        isPublished: anyPage.isPublished
      });
    }
    
    // Now look for published page only
    const page = await Page.findOne({ 
      slug: requestedSlug, 
      isPublished: true 
    });
    
    console.log('✅ Found published page:', page ? 'Yes' : 'No');
    
    if (!page) {
      return res.status(404).json({ 
        message: 'Page not found',
        debug: {
          requestedSlug,
          foundAnyPage: !!anyPage,
          pageIsPublished: anyPage?.isPublished || false
        }
      });
    }
    
    res.json(page);
  } catch (error) {
    console.error('❌ Error fetching page:', error);
    res.status(500).json({ message: 'Error fetching page' });
  }
};

// Create new page (admin only)
export const createPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    
    const page = new Page({
      title,
      slug,
      content,
      isPublished
    });
    
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error creating page' });
  }
};

// Update page (admin only)
export const updatePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page' });
  }
};

// Delete page (admin only)
export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page' });
  }
};
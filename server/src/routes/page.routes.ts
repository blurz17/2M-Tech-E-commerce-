// server/src/routes/page.routes.ts
import express from 'express';
import {
  getAllPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
} from '../controllers/page.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/:slug', getPageBySlug);

// Admin routes (add your auth middleware here)
router.get('/',authenticateUser,adminOnly, getAllPages);
router.post('/',authenticateUser,adminOnly, createPage);
router.put('/:id',authenticateUser,adminOnly, updatePage);
router.delete('/:id',authenticateUser,adminOnly, deletePage);

export default router;
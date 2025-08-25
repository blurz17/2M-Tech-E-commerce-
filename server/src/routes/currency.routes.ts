// server/src/routes/currency.routes.ts
import express from 'express';
import {
    createCurrency,
    deleteCurrency,
    getAllCurrencies,
    getDefaultCurrency,
    setDefaultCurrency
} from '../controllers/currency.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/default', getDefaultCurrency);

// Admin-only routes
router.get('/', authenticateUser, adminOnly, getAllCurrencies);
router.post('/new', authenticateUser, adminOnly, createCurrency);
router.patch('/default/:currencyId', authenticateUser, adminOnly, setDefaultCurrency);
router.delete('/:currencyId', authenticateUser, adminOnly, deleteCurrency);

export default router;
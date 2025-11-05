import { Router } from 'express';
import { createPurchase, getUserPurchases } from '../controllers/purchaseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All purchase routes require authentication
router.post('/', authMiddleware, createPurchase);
router.get('/my-purchases', authMiddleware, getUserPurchases);

export default router;

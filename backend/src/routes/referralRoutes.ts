import { Router } from 'express';
import { getDashboardData, validateReferralCode } from '../controllers/referralController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protected routes
router.get('/dashboard', authMiddleware, getDashboardData);

// Public route for validation
router.get('/validate/:code', validateReferralCode);

export default router;

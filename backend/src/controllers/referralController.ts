import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Referral from '../models/Referral';
import User from '../models/User';

const PURCHASE_REFERRER_COINS = 10;

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get user with referral code
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get all referrals where this user is the referrer
    const referrals = await Referral.find({ referrer: userId })
      .populate('referred', 'name email hasPurchased createdAt')
      .sort({ createdAt: -1 });

    // Calculate metrics
    const totalReferred = referrals.length;
    const convertedUsers = referrals.filter(r => r.status === 'converted').length;
    const totalCreditsEarned = user.credits;

    // Format referred users data
    const referredUsers = referrals.map(r => ({
      id: (r.referred as any)._id,
      name: (r.referred as any).name,
      email: (r.referred as any).email,
      status: r.status,
      hasPurchased: (r.referred as any).hasPurchased,
      joinedAt: r.createdAt,
      convertedAt: r.convertedAt,
      coinsEarnedFromPurchase: r.status === 'converted' ? PURCHASE_REFERRER_COINS : 0,
    }));

    res.json({
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?r=${user.referralCode}`,
      metrics: {
        totalReferred,
        convertedUsers,
        totalCreditsEarned,
      },
      referredUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error });
  }
};

export const validateReferralCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const referrer = await User.findOne({ referralCode: code.toUpperCase() })
      .select('name referralCode');

    if (!referrer) {
      res.status(404).json({ message: 'Invalid referral code', valid: false });
      return;
    }

    res.json({
      valid: true,
      referrer: {
        name: referrer.name,
        code: referrer.referralCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate referral code', error });
  }
};

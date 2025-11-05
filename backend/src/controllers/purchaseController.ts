import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Purchase from '../models/Purchase';
import Course from '../models/Course';
import User from '../models/User';
import Referral from '../models/Referral';
import mongoose from 'mongoose';

const PURCHASE_REFERRER_COINS = 10; // referrer on friend's first purchase
const COURSE_COST_COINS = 10; // cost of each course in coins

export const createPurchase = async (req: AuthRequest, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ user: userId, course: courseId });
    if (existingPurchase) {
      await session.abortTransaction();
      res.status(400).json({ message: 'Course already purchased' });
      return;
    }

    // Get user
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user has enough coins
    if (user.credits < COURSE_COST_COINS) {
      await session.abortTransaction();
      res.status(400).json({ message: 'Insufficient coins. You need 10 coins to purchase this course.' });
      return;
    }

    const isFirstPurchase = !user.hasPurchased;
    let coinsAwarded = 0;

    // Handle referral coins for first purchase only (award to referrer)
    if (isFirstPurchase && user.referredBy) {
      const referral = await Referral.findOne({
        referrer: user.referredBy,
        referred: userId,
      }).session(session);

      if (referral && !referral.purchaseAwarded) {
        // Award 10 coins to referrer on friend's first purchase
        await User.findByIdAndUpdate(
          user.referredBy,
          { $inc: { credits: PURCHASE_REFERRER_COINS } },
          { session }
        );

        // Update referral record
        referral.status = 'converted';
        referral.purchaseAwarded = true;
        referral.convertedAt = new Date();
        await referral.save({ session });

        coinsAwarded = 0;
      }
    }

    // Deduct coins from user and mark purchase
    user.credits -= COURSE_COST_COINS;
    user.hasPurchased = true;
    await user.save({ session });

    // Create purchase record
    const purchase = new Purchase({
      user: userId,
      course: courseId,
      amount: COURSE_COST_COINS,
      creditsEarned: coinsAwarded,
      isFirstPurchase,
    });
    await purchase.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: 'Purchase successful',
      purchase: {
        id: purchase._id,
        course: course.title,
        amount: COURSE_COST_COINS,
        creditsEarned: coinsAwarded,
        remainingCoins: user.credits,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Purchase failed', error });
  } finally {
    session.endSession();
  }
};

export const getUserPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const purchases = await Purchase.find({ user: userId })
      .populate('course')
      .sort({ purchaseDate: -1 });

    res.json({ purchases });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch purchases', error });
  }
};

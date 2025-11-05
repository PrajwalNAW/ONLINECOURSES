import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Referral from '../models/Referral';
import { generateReferralCode } from '../utils/referralCode';

const SIGNUP_REFERRER_COINS = 8; // coins to referrer on friend signup
const SIGNUP_FRIEND_COINS = 4; // coins to friend on signup

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, referralCode: referredByCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = await User.findOne({ referralCode });
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode });
    }

    // Check if referred by someone
    let referrerId = null as any;
    if (referredByCode) {
      const referrer = await User.findOne({ referralCode: referredByCode.toUpperCase() });
      if (referrer) {
        referrerId = referrer._id;
      }
    }

    // Create new user
    const user = new User({ 
      email, 
      password, 
      name, 
      referralCode,
      referredBy: referrerId || null 
    });
    await user.save();

    // Create referral record if user was referred and award signup coins to referrer
    if (referrerId) {
      const referral = new Referral({
        referrer: referrerId,
        referred: user._id,
      });
      await referral.save();

      // Award 8 coins to referrer and 4 to friend on signup
      await User.findByIdAndUpdate(referrerId, { $inc: { credits: SIGNUP_REFERRER_COINS } });
      await User.findByIdAndUpdate(user._id, { $inc: { credits: SIGNUP_FRIEND_COINS } });
      referral.signupAwarded = true;
      await referral.save();
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        credits: user.credits,
        hasPurchased: user.hasPurchased,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get current user
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

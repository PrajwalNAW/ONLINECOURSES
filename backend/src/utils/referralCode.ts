import { customAlphabet } from 'nanoid';

// Generate referral code using uppercase letters and numbers
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const generateReferralCode = (): string => {
  return nanoid();
};

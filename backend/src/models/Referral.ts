import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referred: mongoose.Types.ObjectId;
  status: 'pending' | 'converted';
  signupAwarded: boolean; // 5 coins to referrer when friend signs up
  purchaseAwarded: boolean; // 10 coins to referrer + 4 to friend on first purchase
  convertedAt?: Date;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referred: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'converted'],
    default: 'pending',
  },
  signupAwarded: {
    type: Boolean,
    default: false,
  },
  purchaseAwarded: {
    type: Boolean,
    default: false,
  },
  convertedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
referralSchema.index({ referrer: 1 });
referralSchema.index({ referred: 1 });

export default mongoose.model<IReferral>('Referral', referralSchema);

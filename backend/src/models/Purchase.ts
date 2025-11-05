import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  creditsEarned: number;
  isFirstPurchase: boolean;
  purchaseDate: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  creditsEarned: {
    type: Number,
    default: 0,
  },
  isFirstPurchase: {
    type: Boolean,
    default: false,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

// Index to prevent duplicate purchases
purchaseSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IPurchase>('Purchase', purchaseSchema);

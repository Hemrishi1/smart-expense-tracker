import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  limit: number;
  month: number; // 1-12
  year: number;
}

const budgetSchema = new Schema<IBudget>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    limit: {
      type: Number,
      required: [true, 'Please add a budget limit'],
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Prevent multiple budgets for same category in same month/year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', budgetSchema);

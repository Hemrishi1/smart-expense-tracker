import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  paymentMethod?: string;
  location?: string;
  receipt?: string; // Cloudinary URL
  priority?: 'low' | 'medium' | 'high';
  status?: 'cleared' | 'pending';
  tags?: string[];
  isRecurring: boolean;
}

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Food', 'Shopping', 'Bills', 'Travel', 'Health', 'Entertainment', 'Education', 'Rent', 'Fuel', 'Investment', 'Miscellaneous'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    receipt: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['cleared', 'pending'],
      default: 'cleared',
    },
    tags: {
      type: [String],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IExpense>('Expense', expenseSchema);

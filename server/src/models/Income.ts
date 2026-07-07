import mongoose, { Document, Schema } from 'mongoose';

export interface IIncome extends Document {
  user: mongoose.Types.ObjectId;
  source: string;
  amount: number;
  date: Date;
  description?: string;
}

const incomeSchema = new Schema<IIncome>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    source: {
      type: String,
      required: [true, 'Please add a source'],
      enum: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IIncome>('Income', incomeSchema);

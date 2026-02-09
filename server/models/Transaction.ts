import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txId: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'CREDIT' | 'DEBIT';
  flatId?: number;
  createdBy?: string;
  proofUrl?: string;
  timestamp: number;
}

const TransactionSchema = new Schema<ITransaction>({
  txId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  flatId: { type: Number },
  createdBy: { type: String },
  proofUrl: { type: String },
  timestamp: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

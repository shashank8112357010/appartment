import mongoose, { Schema, Document } from 'mongoose';

export interface IApartment extends Document {
  id: number;
  floor: string;
  owner: string;
  phone: string;
  status: string;
  lastPayment: string;
  amount: number;
  type: 'neutral' | 'advance' | 'due';
  advance: number;
  pending: number;
  deposit: number;
}

const ApartmentSchema = new Schema<IApartment>({
  id: { type: Number, required: true, unique: true },
  floor: { type: String, required: true },
  owner: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: '' },
  lastPayment: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['neutral', 'advance', 'due'], default: 'neutral' },
  advance: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Apartment || mongoose.model<IApartment>('Apartment', ApartmentSchema);

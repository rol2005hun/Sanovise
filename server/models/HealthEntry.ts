import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthEntry extends Document {
    userId: string;
    date: string;
    pulse?: number | null;
    systolic?: number | null;
    diastolic?: number | null;
    steps?: number | null;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const HealthEntrySchema = new Schema<IHealthEntry>(
    {
        userId: { type: String, required: true, index: true },
        date: { type: String, required: true },
        pulse: { type: Number, default: null },
        systolic: { type: Number, default: null },
        diastolic: { type: Number, default: null },
        steps: { type: Number, default: null },
        notes: { type: String, default: '' }
    },
    { timestamps: true }
);

export default mongoose.models.HealthEntry || mongoose.model<IHealthEntry>('HealthEntry', HealthEntrySchema);
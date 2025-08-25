// server/src/models/currency.model.ts
import mongoose from "mongoose";

export interface ICurrency {
  _id?: string;
  symbol: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const currencySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: [true, "Currency symbol is required"],
        unique: true,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure only one default currency exists
currencySchema.pre('save', async function(next) {
    if (this.isDefault) {
        await mongoose.model('Currency').updateMany(
            { _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

export const Currency = mongoose.model<ICurrency>("Currency", currencySchema);
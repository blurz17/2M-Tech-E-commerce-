import mongoose, { Document, Schema } from 'mongoose';

export interface IShippingTier extends Document {
    _id: string;
    minOrderValue: number;
    maxOrderValue: number;
    shippingCost: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShippingTierSchema: Schema = new Schema({
    minOrderValue: {
        type: Number,
        required: [true, 'Minimum order value is required'],
        min: [0, 'Minimum order value cannot be negative']
    },
    maxOrderValue: {
        type: Number,
        required: [true, 'Maximum order value is required'],
        min: [0, 'Maximum order value cannot be negative'],
        validate: {
            validator: function(this: IShippingTier, value: number) {
                return value > this.minOrderValue;
            },
            message: 'Maximum order value must be greater than minimum order value'
        }
    },
    shippingCost: {
        type: Number,
        required: [true, 'Shipping cost is required'],
        min: [0, 'Shipping cost cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
ShippingTierSchema.index({ minOrderValue: 1, maxOrderValue: 1 });

export default mongoose.model<IShippingTier>('ShippingTier', ShippingTierSchema);
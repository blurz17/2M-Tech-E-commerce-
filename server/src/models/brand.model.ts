import mongoose from "mongoose";

export interface IBrand {
  _id?: string;
  name: string;
  image: string;
  imagePublicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Brand image is required"]
    },
    imagePublicId: {
        type: String,
        required: [true, "Brand image public ID is required"]
    }
}, { timestamps: true });

export const Brand = mongoose.model<IBrand>("Brand", brandSchema);
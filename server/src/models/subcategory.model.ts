import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategory extends Document {
  _id: string;
  name: string;
  value: string; // URL-friendly version
  description?: string;
  image?: string;
  parentCategory: mongoose.Types.ObjectId; // Reference to Category
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>({
  name: {
    type: String,
    required: [true, 'Subcategory name is required'],
    trim: true,
    maxlength: [50, 'Subcategory name cannot exceed 50 characters']
  },
  value: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Subcategory value must contain only lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    type: String,
    default: null
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Parent category is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create URL-friendly value from name
subcategorySchema.pre('validate', function(next) {
  if (this.name && (!this.value || this.isModified('name'))) {
    this.value = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
  }
  next();
});

// Indexes for better performance
subcategorySchema.index({ value: 1 });
subcategorySchema.index({ name: 1 });
subcategorySchema.index({ parentCategory: 1 });
subcategorySchema.index({ isActive: 1 });

export const Subcategory = mongoose.model<ISubcategory>('Subcategory', subcategorySchema);
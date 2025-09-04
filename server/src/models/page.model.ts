// server/src/models/page.model.ts
import mongoose from 'mongoose';
export interface Ipage {
_id?: string;
  title: string; 
  slug:string;
  content:string;
  isPublished : boolean;
  createdAt?: Date;  
  updatedAt?: Date;  
}
const pageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  isPublished: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

export const Page =mongoose.model<Ipage>("page", pageSchema);
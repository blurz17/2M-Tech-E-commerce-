// src/components/admin/AddProduct/components/MainPhotoDisplay.tsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { MainPhotoDisplayProps } from '../types';

const MainPhotoDisplay: React.FC<MainPhotoDisplayProps> = ({ photoPreview }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
      <div className="p-8 bg-gray-50 border-b">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img 
              src={photoPreview} 
              alt="Main Product" 
              className="w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-white" 
            />
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
              <FaStar className="w-4 h-4 mr-2" />
              <span className="font-semibold text-sm">Main Photo</span>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm">This will be your product's primary image</p>
        </div>
      </div>
    </div>
  );
};

export default MainPhotoDisplay;
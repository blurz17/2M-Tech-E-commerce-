// src/components/admin/AddProduct/components/ProductHeader.tsx
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const ProductHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <FaPlus className="mr-3" />
          Add New Product
        </h1>
        <p className="text-blue-100 mt-2">Create and manage your product inventory</p>
      </div>
    </div>
  );
};

export default ProductHeader;
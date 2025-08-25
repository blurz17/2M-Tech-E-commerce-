import { useState, ChangeEvent } from 'react';
import { ProductFormData } from '../types';

export const useProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    categories: [],
    subcategories: [],
    brand: '',
    description: '',
    stock: 0,
    price: 0,
    discount: 0, // Added discount field
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' || name === 'discount' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    setFormData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
  };

  const handleSubcategoryChange = (selectedSubcategories: string[]) => {
    setFormData(prev => ({
      ...prev,
      subcategories: selectedSubcategories
    }));
  };

  // New handler for WYSIWYG description
  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categories: [],
      subcategories: [],
      brand: '',
      description: '',
      stock: 0,
      price: 0,
      discount: 0, // Reset discount
    });
  };

  return {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleDescriptionChange,
    resetForm,
    setFormData
  };
};


// admin/src/components/admin/AddProduct/hooks/useProductForm.ts
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
    discount: 0,
    status: true, // Default to published
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : name === 'stock' || name === 'price' || name === 'discount' 
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

  // Dedicated status handler
  const handleStatusChange = (status: boolean) => {
    setFormData(prev => ({
      ...prev,
      status
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
      discount: 0,
      status: true, // Reset to published
    });
  };

  return {
    formData,
    handleInputChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleDescriptionChange,
    handleStatusChange,
    resetForm,
    setFormData
  };
};
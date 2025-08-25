import React, { ChangeEvent, FormEvent, useEffect, useState, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaImage, FaCheck, FaStar } from 'react-icons/fa';
import { useDeleteProductMutation, useFeatureProductMutation, useProductDetailsQuery, useUpdateProductMutation } from '../../redux/api/product.api';
import { useGetAllCategoriesQuery } from '../../redux/api/category.api';
import { useGetAllSubcategoriesQuery } from '../../redux/api/subcategory.api';
import { useGetBrandsForDropdownQuery } from '../../redux/api/brand.api';
import { CustomError } from '../../types/api-types';
import { notify } from '../../utils/util';
import SkeletonLoader from '../common/SkeletonLoader';
import WysiwygEditor from '../common/WysiwygEditor/WysiwygEditor';
import BackButton from '../common/BackBtn';
import Loader from '../common/Loader';

interface FormData {
    name: string;
    categories: string[];
    subcategories: string[];
    brand: string;
    description: string;
    stock: number;
    price: number;
    discount: number; // Added discount field
}

const AdminManageProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    // API hooks
    const { data, isLoading, isError, error } = useProductDetailsQuery(productId!);
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const { data: subcategoriesData, isLoading: subcategoriesLoading } = useGetAllSubcategoriesQuery();
    const { data: brandsData, isLoading: brandsLoading } = useGetBrandsForDropdownQuery();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();

    // State
    const [formData, setFormData] = useState<FormData>({
        name: '', categories: [], subcategories: [], brand: '', description: '', stock: 0, price: 0, discount: 0 // Added discount
    });
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [newPhotosPreviews, setNewPhotosPreviews] = useState<string[]>([]);
    const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState<number>(0);
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    // Extract data
    const product = data?.product;
    const categoriesList = categoriesData?.categories || [];
    const subcategoriesList = subcategoriesData?.subcategories || [];
    const brandsList = brandsData?.brands || [];

    // Calculate net price based on price and discount
    const netPrice = useMemo(() => {
        if (formData.price && formData.discount >= 0) {
            return formData.price - ((formData.price * formData.discount) / 100);
        }
        return formData.price;
    }, [formData.price, formData.discount]);

    // Calculate discount amount
    const discountAmount = useMemo(() => {
        if (formData.price && formData.discount > 0) {
            return (formData.price * formData.discount) / 100;
        }
        return 0;
    }, [formData.price, formData.discount]);

    // Filter subcategories based on selected categories
    const filteredSubcategories = subcategoriesList.filter(sub => 
        formData.categories.includes(sub.parentCategory._id)
    );

    // Initialize form data when product loads
    useEffect(() => {
        if (product && !isLoading) {
            let categoryIds: string[] = [];
            if (Array.isArray(product.categories)) {
                categoryIds = product.categories.map((cat: any) => {
                    if (typeof cat === 'string') return cat;
                    if (typeof cat === 'object' && cat._id) return cat._id;
                    return String(cat);
                });
            }
            
            let subcategoryIds: string[] = [];
            if (Array.isArray(product.subcategories)) {
                subcategoryIds = product.subcategories.map((sub: any) => {
                    if (typeof sub === 'string') return sub;
                    if (typeof sub === 'object' && sub._id) return sub._id;
                    return String(sub);
                });
            }
            
            let brandId = '';
            if (product.brand) {
                if (typeof product.brand === 'string') {
                    brandId = product.brand;
                } else if (typeof product.brand === 'object' && product.brand._id) {
                    brandId = product.brand._id;
                }
            }
            
            setFormData({
                name: product.name || '',
                categories: categoryIds,
                subcategories: subcategoryIds,
                brand: brandId,
                description: product.description || '',
                stock: Number(product.stock) || 0,
                price: Number(product.price) || 0,
                discount: Number(product.discount) || 0, // Initialize discount from product data
            });
            
            setExistingPhotos(product.photos || []);
            setIsFeatured(Boolean(product.featured));
            setMainPhotoIndex(0);
        }
    }, [product, isLoading]);

    // Clean invalid subcategories when categories change
    useEffect(() => {
        if (formData.categories.length === 0) {
            setFormData(prev => ({ ...prev, subcategories: [] }));
        } else {
            const validSubcategories = formData.subcategories.filter(subId =>
                filteredSubcategories.some(sub => sub._id === subId)
            );
            if (validSubcategories.length !== formData.subcategories.length) {
                setFormData(prev => ({ ...prev, subcategories: validSubcategories }));
            }
        }
    }, [formData.categories, filteredSubcategories]);

    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' || name === 'price' || name === 'discount' // Added discount to numeric fields
                ? parseFloat(value) || 0 
                : value
        }));
    };

    // Handle array toggles (categories/subcategories)
    const handleArrayToggle = (field: 'categories' | 'subcategories', id: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(id) 
                ? prev[field].filter(item => item !== id)
                : [...prev[field], id]
        }));
    };

    // Handle description change
    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    // Handle image upload
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const previews: string[] = [];
        let loadedCount = 0;
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    previews.push(reader.result);
                    loadedCount++;
                    
                    if (loadedCount === files.length) {
                        setNewPhotos(prev => [...prev, ...files]);
                        setNewPhotosPreviews(prev => [...prev, ...previews]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    // Photo management
    const removePhoto = (index: number, isExisting: boolean) => {
        if (isExisting) {
            setPhotosToDelete(prev => [...prev, index]);
            setExistingPhotos(prev => prev.filter((_, i) => i !== index));
            if (index === mainPhotoIndex) setMainPhotoIndex(0);
            else if (index < mainPhotoIndex) setMainPhotoIndex(prev => prev - 1);
        } else {
            setNewPhotos(prev => prev.filter((_, i) => i !== index));
            setNewPhotosPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const setAsMainPhoto = (index: number, isExisting: boolean) => {
        setMainPhotoIndex(isExisting ? index : existingPhotos.length + index);
    };

    // Form submission
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validations = [
            [!formData.name.trim(), 'Product name is required'],
            [formData.categories.length === 0, 'Please select at least one category'],
            [!formData.brand, 'Please select a brand'],
            [!formData.description.trim(), 'Product description is required'],
            [formData.price <= 0, 'Please enter a valid price'],
            [formData.discount < 0 || formData.discount > 100, 'Discount must be between 0 and 100%'], // Added discount validation
            [existingPhotos.length === 0 && newPhotos.length === 0, 'Please add at least one product image']
        ] as const;

        for (const [condition, message] of validations) {
            if (condition) {
                notify(message, 'error');
                return;
            }
        }

        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'categories' || key === 'subcategories') {
                if (Array.isArray(value) && value.length > 0) {
                    submitFormData.append(key, JSON.stringify(value));
                }
            } else {
                submitFormData.append(key, value.toString().trim());
            }
        });

        submitFormData.append('mainPhotoIndex', mainPhotoIndex.toString());
        newPhotos.forEach(photo => submitFormData.append('photos', photo));
        if (photosToDelete.length > 0) {
            submitFormData.append('photosToDelete', JSON.stringify(photosToDelete));
        }

        try {
            await updateProduct({ formData: submitFormData, productId: product!._id }).unwrap();
            notify('Product updated successfully', 'success');
            navigate('/admin/products');
        } catch (error) {
            const err = error as CustomError;
            notify(err?.data?.message || 'Failed to update product', 'error');
        }
    };

    // Delete product
    const deleteHandler = async () => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }
        
        try {
            await deleteProduct({ productId: product!._id }).unwrap();
            notify('Product deleted successfully', 'success');
            navigate('/admin/products');
        } catch (error) {
            const err = error as CustomError;
            notify(err?.data?.message || 'Failed to delete product', 'error');
        }
    };

    // Toggle feature
    const handleFeatureToggle = async () => {
        try {
            await featureProduct({ productId: product!._id }).unwrap();
            setIsFeatured(prev => !prev);
            notify('Product featured status updated successfully', 'success');
        } catch (error) {
            notify('Failed to update product featured status', 'error');
        }
    };

    // Handle errors
    useEffect(() => {
        if (isError && error) {
            const err = error as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isError, error]);

    if (isError) return <Navigate to="/404" />;
    if (isLoading || categoriesLoading || subcategoriesLoading || brandsLoading) {
        return <SkeletonLoader rows={10} />;
    }
    if (!product) return <div className="flex justify-center items-center min-h-screen"><div className="text-gray-500">Product not found</div></div>;

    const allPhotos = [...existingPhotos, ...newPhotosPreviews];
    const mainPhoto = allPhotos[mainPhotoIndex];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <BackButton />
                
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white flex items-center">
                                    <FaPlus className="mr-3" />
                                    Manage Product
                                </h1>
                                <p className="text-purple-100 mt-2">Update your product information and settings</p>
                            </div>
                            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isFeatured ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                <span className="text-white font-medium">{isFeatured ? 'Featured' : 'Not Featured'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Photo */}
                {mainPhoto && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="p-8 bg-gray-50 border-b">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <img src={mainPhoto} alt="Main Product" className="w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-white" />
                                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
                                        <FaStar className="w-4 h-4 mr-2" />
                                        <span className="font-semibold text-sm">Main Photo</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-4 text-sm">This is your product's primary image</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Gallery */}
                {allPhotos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <FaImage className="text-purple-600 w-4 h-4" />
                            </div>
                            Product Images ({allPhotos.length})
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* Existing Photos */}
                            {existingPhotos.map((photo, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img 
                                        src={photo} 
                                        alt={`Product ${index + 1}`}
                                        className={`w-full h-32 object-cover rounded-xl border-2 cursor-pointer transition-all ${
                                            mainPhotoIndex === index ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => setAsMainPhoto(index, true)}
                                    />
                                    
                                    {mainPhotoIndex === index && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1">
                                            <FaStar className="w-3 h-3" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                            <button
                                                onClick={() => setAsMainPhoto(index, true)}
                                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Set as main"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => removePhoto(index, true)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Remove image"
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* New Photos */}
                            {newPhotosPreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img 
                                        src={preview} 
                                        alt={`New ${index + 1}`}
                                        className={`w-full h-32 object-cover rounded-xl border-2 cursor-pointer transition-all ${
                                            mainPhotoIndex === existingPhotos.length + index ? 'border-yellow-400 shadow-lg' : 'border-green-300 hover:border-green-400'
                                        }`}
                                        onClick={() => setAsMainPhoto(index, false)}
                                    />
                                    
                                    <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                                        NEW
                                    </div>
                                    
                                    {mainPhotoIndex === existingPhotos.length + index && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1">
                                            <FaStar className="w-3 h-3" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                            <button
                                                onClick={() => setAsMainPhoto(index, false)}
                                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Set as main"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => removePhoto(index, false)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Remove image"
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-blue-600 font-bold">1</span>
                                </div>
                                Basic Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Brand <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    >
                                        <option value="">Select a brand</option>
                                        {brandsList.map((brand) => (
                                            <option key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stock and Price Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Stock <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                                min="0"
                                                placeholder="0"
                                                required
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                units
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Price (EGP) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                required
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                                                EGP
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Discount and Net Price Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Discount (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder="0"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                %
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional: Enter discount percentage (0-100%)
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Net Price (EGP)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={netPrice.toFixed(2)}
                                                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                                                disabled
                                                readOnly
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                                                EGP
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Final price after discount (calculated automatically)
                                        </p>
                                    </div>
                                </div>

                                {/* Price Summary Card */}
                                {(formData.price > 0 || formData.discount > 0) && (
                                    <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-2">💰</span>
                                            Price Summary
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Original Price:</span>
                                                <span className="font-semibold text-gray-800">EGP {formData.price.toFixed(2)}</span>
                                            </div>
                                            {formData.discount > 0 && (
                                                <>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Discount ({formData.discount}%):</span>
                                                        <span className="font-semibold text-red-600">
                                                            -EGP {discountAmount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-blue-300 pt-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-lg font-semibold text-gray-800">Final Price:</span>
                                                            <span className="text-lg font-bold text-green-600">EGP {netPrice.toFixed(2)}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 italic">
                                                            You save EGP {discountAmount.toFixed(2)} ({formData.discount}% off)
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {formData.discount === 0 && (
                                                <div className="text-sm text-gray-500 italic">No discount applied</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Categories */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Categories <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                                        {categoriesList.map((category) => (
                                            <label key={category._id} className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categories.includes(category._id)}
                                                    onChange={() => handleArrayToggle('categories', category._id)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {formData.categories.length > 0 && filteredSubcategories.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategories</label>
                                        <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            {filteredSubcategories.map((subcategory) => (
                                                <label key={subcategory._id} className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.subcategories.includes(subcategory._id)}
                                                        onChange={() => handleArrayToggle('subcategories', subcategory._id)}
                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                    />
                                                    <div className="text-sm">
                                                        <div className="font-medium text-gray-700">{subcategory.name}</div>
                                                        <div className="text-xs text-gray-500">{subcategory.parentCategory.name}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-green-600 font-bold">2</span>
                                </div>
                                Description
                            </h2>
                            
                            <WysiwygEditor
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Describe your product..."
                                height={400}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-purple-600 font-bold">3</span>
                                </div>
                                Add More Images
                            </h2>
                            
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 hover:bg-blue-50 transition-all">
                                <label className="cursor-pointer block">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                            <FaImage className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700 mb-2">Upload More Images</p>
                                            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Ready to update your product?</p>
                                    <p>Make sure all required fields are filled.</p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={deleteHandler}
                                        disabled={isDeleting}
                                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <FaTrash size={14} />
                                                Delete
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleFeatureToggle}
                                        disabled={isFeaturing}
                                        className={`px-6 py-3 ${isFeatured ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold rounded-xl transition-all flex items-center gap-2`}
                                    >
                                        {isFeaturing ? (
                                            <>
                                                <Loader/>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FaStar size={14} />
                                                {isFeatured ? 'Unfeature' : 'Feature'}
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all flex items-center gap-3"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader/>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus size={16} />
                                                Update Product
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminManageProduct;
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAllCategoriesQuery } from '../redux/api/category.api';
import { useLatestProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import Loader from '../components/common/Loader';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  // State for filters and sorting
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch categories and products - INCREASED LIMIT TO GET ALL PRODUCTS
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const { data: productsData, isLoading: productsLoading } = useLatestProductsQuery({ limit: 500 });

  const categories = categoriesData?.categories || [];
  const allProducts = productsData?.products || [];

  // declarations for add to cart 
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) || [];
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const handleAddToCart = useCallback((event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (product.stock === 0) return;
    
    const cartItemData = {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity: 1,
    stock: product.stock,
    photo: product.photos[0] || '/placeholder-product.jpg',
    brand: typeof product.brand === 'object' ? product.brand : { _id: '', name: product.brand },
};
    dispatch(addToCart(cartItemData));
  }, [dispatch]);

  const handleIncrement = useCallback((event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    const cartItem = safeCartItems.find(item => item.productId === product._id);
    if (cartItem && cartItem.quantity < product.stock) {
      dispatch(incrementCartItem(product._id));
    }
  }, [safeCartItems, dispatch]);

  const handleDecrement = useCallback((event: React.MouseEvent, productId: string) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(decrementCartItem(productId));
  }, [dispatch]);

  // Helper function to create consistent slugs
  const createSlug = (text: string): string => {
    return text.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Find current category with improved matching
  const currentCategory = useMemo(() => {
    if (!categorySlug || !categories.length) return null;
    
    // Try to find category by matching slug with both name and value
    return categories.find(cat => {
      const nameSlug = createSlug(cat.name);
      const valueSlug = createSlug(cat.value);
      return nameSlug === categorySlug || valueSlug === categorySlug;
    });
  }, [categories, categorySlug]);

  // SIMPLIFIED and MORE ROBUST category matching
  const categoryProducts = useMemo(() => {
    if (!currentCategory || !allProducts.length) return [];
    
    // Create all possible variations to match against
    const categoryVariations = [
      currentCategory.name.toLowerCase().trim(),
      currentCategory.value.toLowerCase().trim(),
      createSlug(currentCategory.name),
      createSlug(currentCategory.value),
      // Add singular/plural variations
      currentCategory.name.toLowerCase().trim().replace(/s$/, ''), // Remove trailing 's'
      currentCategory.name.toLowerCase().trim() + 's', // Add trailing 's'
    ].filter(Boolean); // Remove any empty strings
    
    console.log('Category Variations to Match:', categoryVariations);
    
    const filtered = allProducts.filter(product => {
      const productCategory = product.category.toLowerCase().trim();
      
      // Check exact matches first
      const exactMatch = categoryVariations.includes(productCategory);
      
      // Check partial matches (category contains any variation or vice versa)
      const partialMatch = categoryVariations.some(variation => 
        productCategory.includes(variation) || variation.includes(productCategory)
      );
      
      // Also check if product category slug matches any category variation
      const productCategorySlug = createSlug(productCategory);
      const slugMatch = categoryVariations.includes(productCategorySlug);
      
      const matches = exactMatch || partialMatch || slugMatch;
      
      if (matches) {
        console.log(`✓ Product "${product.name}" (category: "${product.category}") matches category "${currentCategory.name}"`);
      }
      
      return matches;
    });
    
    return filtered;
  }, [allProducts, currentCategory]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = categoryProducts.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [categoryProducts, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, priceRange, categorySlug]);

  // Loading state
  if (categoriesLoading || productsLoading) {
    return <Loader />;
  }

  // Category not found
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Category Not Found</h1>
          <p className="text-purple-600 mb-4">The category you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-purple-600">
            <Link to="/" className="hover:text-purple-800 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/" className="hover:text-purple-800 transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-purple-900 font-medium">{currentCategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            {currentCategory.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white bg-opacity-20 flex-shrink-0 border-2 border-purple-300">
                <img 
                  src={currentCategory.image} 
                  alt={currentCategory.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
              <p className="text-purple-100 mb-4">{currentCategory.description || `Explore our ${currentCategory.name.toLowerCase()} collection`}</p>
              <div className="flex items-center space-x-4 text-sm text-purple-200">
                <span>{filteredProducts.length} products</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Filters</h3>
              
              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-700 mb-2">Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="featured">Featured</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-sm text-purple-600">
                    <span>LE {priceRange[0]}</span>
                    <span>LE {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Other Categories */}
              <div>
                <h4 className="text-sm font-medium text-purple-700 mb-3">Other Categories</h4>
                <div className="space-y-2">
                  {categories
                    .filter(cat => cat._id !== currentCategory._id)
                    .slice(0, 5)
                    .map(category => (
                      <Link
                        key={category._id}
                        to={`/category/${createSlug(category.name)}`}
                        className="block text-sm text-purple-600 hover:text-purple-800 transition-colors hover:bg-purple-50 p-1 rounded"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-purple-900">
                  {filteredProducts.length} Products Found
                </h2>
                <p className="text-sm text-purple-600 mt-1">
                  Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {paginatedProducts.map((product: Product) => {
                  const cartItem = safeCartItems.find(item => item.productId === product._id);
                  const isOutOfStock = product.stock === 0;
                  
                  return (
                    <Link 
                      key={product._id} 
                      to={`/product/${product._id}`} // Navigate to product detail page
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-purple-100 block"
                    >
                      <div className="aspect-square bg-purple-50 relative overflow-hidden">
                        <img
                          src={product.photos[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                            isOutOfStock ? 'grayscale opacity-75' : ''
                          }`}
                        />
                        {product.featured && (
                          <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            FEATURED
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            {product.stock} left
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            SOLD OUT
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium text-purple-900 mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                        <div className="mb-3">
                          <span className="inline-block bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-lg">
                            {product.category}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-lg sm:text-xl font-light text-purple-900">
                            LE {product.price.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Cart Section - FIXED FOR MOBILE */}
                        <div className="space-y-2">
                          {/* Add to Cart */}
                          {cartItem && cartItem.quantity > 0 ? (
                            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                              <button
                                onClick={(e) => handleDecrement(e, product._id)}
                                className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-purple-600 hover:bg-red-500 hover:text-white transition-colors duration-200 flex-shrink-0"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="font-semibold text-purple-800 px-2 text-sm flex-shrink-0">{cartItem.quantity}</span>
                              
                              <button
                                onClick={(e) => handleIncrement(e, product)}
                                disabled={cartItem.quantity >= product.stock}
                                className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-purple-600 hover:bg-green-500 hover:text-white transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={isOutOfStock}
                              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isOutOfStock
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {isOutOfStock ? (
                                <span className="text-xs sm:text-sm">Out of Stock</span>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm whitespace-nowrap">Add to Cart</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          {/* View Details Button */}
                          <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm text-center hover:bg-purple-200 transition-colors">
                            View Details
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-purple-900 mb-2">No products found</h3>
                <p className="text-purple-600 mb-4">
                  No products match the category "{currentCategory.name}". 
                  This might be due to category naming mismatches.
                </p>
                
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles for purple theme */}
      <style>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }
        
        .slider-purple::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
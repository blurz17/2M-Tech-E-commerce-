import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

import React, { useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetAllCategoriesQuery } from '../redux/api/category.api';
import { useGetSubcategoriesByCategoryQuery } from '../redux/api/subcategory.api';
import { useLatestProductsQuery } from '../redux/api/product.api';
import { useGetBrandsForDropdownQuery } from '../redux/api/brand.api';
import { Product } from '../types/api-types';
import Loader from '../components/common/Loader';
import ProductFilters, {  } from '../components/filters/ProductFilters';
import MobileFilterDrawer from '../components/filters/MobileFilterDrawer';
import { useProductFilters } from '../components/filters/useProductFilters';

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams<{ 
    categorySlug: string; 
    subcategorySlug?: string; 
  }>();
  

  const productsPerPage = 12;

  // Fetch data
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const { data: productsData, isLoading: productsLoading } = useLatestProductsQuery({ limit: 500 });
  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsForDropdownQuery();

  const categories = categoriesData?.categories || [];
  const allProducts = productsData?.products || [];
  const brands = brandsData?.brands || [];

  // Cart functionality
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
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Find current category
  const currentCategory = useMemo(() => {
    if (!categorySlug || !categories.length) return null;
    
    return categories.find(cat => {
      const nameSlug = createSlug(cat.name);
      const valueSlug = createSlug(cat.value);
      return nameSlug === categorySlug || valueSlug === categorySlug;
    });
  }, [categories, categorySlug]);

  // Fetch subcategories if we have a category
  const { data: subcategoriesData, isLoading: subcategoriesLoading } = useGetSubcategoriesByCategoryQuery(
    currentCategory?._id || '',
    { skip: !currentCategory?._id }
  );

  const subcategories = subcategoriesData?.subcategories || [];

  // Find current subcategory if subcategorySlug exists
  const currentSubcategory = useMemo(() => {
    if (!subcategorySlug || !subcategories.length) return null;
    
    return subcategories.find(subcat => {
      const nameSlug = createSlug(subcat.name);
      const valueSlug = createSlug(subcat.value);
      return nameSlug === subcategorySlug || valueSlug === subcategorySlug;
    });
  }, [subcategories, subcategorySlug]);

  // Filter products based on category/subcategory
  const categoryProducts = useMemo(() => {
    if (!allProducts.length) return [];

    // If we have a specific subcategory, filter by that subcategory only
    if (currentSubcategory) {
      return allProducts.filter(product => {
        if (Array.isArray(product.subcategories)) {
          return product.subcategories.some(subcat => 
            typeof subcat === 'object' 
              ? subcat._id === currentSubcategory._id
              : subcat === currentSubcategory._id
          );
        }
        if (product.subcategory) {
          const productSubcat = typeof product.subcategory === 'object' 
            ? product.subcategory.name || product.subcategory.value 
            : product.subcategory;
          return productSubcat.toLowerCase().includes(currentSubcategory.name.toLowerCase()) ||
                 productSubcat.toLowerCase().includes(currentSubcategory.value.toLowerCase());
        }
        return false;
      });
    }

    // If we only have a category, show all products from that category
    if (currentCategory) {
      return allProducts.filter(product => {
        // Check if product has categories array
        if (Array.isArray(product.categories)) {
          return product.categories.some(cat => 
            typeof cat === 'object' 
              ? cat._id === currentCategory._id
              : cat === currentCategory._id
          );
        }
        // Fallback to single category string match
        if (product.category) {
          const productCat = typeof product.category === 'object' 
            ? product.category.name || product.category.value 
            : product.category;
          return productCat.toLowerCase().includes(currentCategory.name.toLowerCase()) ||
                 productCat.toLowerCase().includes(currentCategory.value.toLowerCase());
        }
        return false;
      });
    }

    return [];
  }, [allProducts, currentCategory, currentSubcategory]);

  // Calculate max price from category products
  const maxPrice = useMemo(() => {
    if (categoryProducts.length === 0) return 50000;
    return Math.ceil(Math.max(...categoryProducts.map(p => p.price)) / 1000) * 1000;
  }, [categoryProducts]);

  // Use the new filter system
  const {
    filters,
    paginatedProducts,
    currentPage: filterCurrentPage,
    totalPages,
    handleFiltersChange,
    handlePageChange,
    totalResults
  } = useProductFilters({
    products: categoryProducts,
    brands: brands.map(brand => ({ 
      _id: brand._id, 
      name: brand.name,
      image: brand.image // FIXED: Include image property
    })),
    categories: categories.map(cat => ({ _id: cat._id, name: cat.name, value: cat.value })),
    subcategories: subcategories.map(sub => ({ _id: sub._id, name: sub.name, value: sub.value })),
    maxPrice,
    initialFilters: {
      // If viewing a specific subcategory, pre-select it
      selectedSubcategories: currentSubcategory ? [currentSubcategory._id] : [],
    }
  });

  // Loading state
  if (categoriesLoading || productsLoading || subcategoriesLoading || brandsLoading) {
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
    <>
      <div className="min-h-screen bg-purple-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-purple-600">
              <Link to="/" className="hover:text-purple-800 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/" className="hover:text-purple-800 transition-colors">Collections</Link>
              <span>/</span>
              <Link to={`/category/${categorySlug}`} className="hover:text-purple-800 transition-colors">
                {currentCategory.name}
              </Link>
              {currentSubcategory && (
                <>
                  <span>/</span>
                  <span className="text-purple-900 font-medium">{currentSubcategory.name}</span>
                </>
              )}
            </nav>
          </div>
        </div>

       {/* Big Banner with Category Image */}
            <div 
              className="relative w-full h-72 md:h-[1920] lg:h-[600] bg-gray-200 bg-center bg-cover"
              style={{
                backgroundImage: `url(${currentSubcategory?.image || currentCategory?.image || '/placeholder-banner.jpg'})`,
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3">
                    {currentSubcategory?.name || currentCategory.name}
                  </h1>
                  <p className="text-lg md:text-xl">
                    {currentSubcategory?.description || currentCategory?.description || 
                    `Discover our premium ${(currentSubcategory?.name || currentCategory.name).toLowerCase()} collection`}
                  </p>
                </div>
              </div>
            </div>

        {/* Subcategories Quick Access - Only show when viewing main category */}
        {!subcategorySlug && subcategories.length > 0 && (
          <div className="bg-white border-b border-purple-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Quick Access:</span>
                {subcategories.map(subcategory => (
                  <Link
                    key={subcategory._id}
                    to={`/category/${categorySlug}/${createSlug(subcategory.name)}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full text-sm text-purple-700 transition-colors whitespace-nowrap"
                  >
                    {subcategory.image && (
                      <img src={subcategory.image} alt={subcategory.name} className="w-6 h-6 rounded-full" />
                    )}
                    <span>{subcategory.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
           <div className="hidden lg:block w-72 flex-shrink-0 sticky top-4 self-start">
              <div className="sticky top-4">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  brands={brands.map(brand => ({ 
                    _id: brand._id, 
                    name: brand.name,
                    image: brand.image // FIXED: Include image property
                  }))}
                  categories={categories.map(cat => ({ _id: cat._id, name: cat.name, value: cat.value }))}
                  subcategories={subcategories.map(sub => ({ _id: sub._id, name: sub.name, value: sub.value }))}
                  maxPrice={maxPrice}
                  showSubcategories={subcategories.length > 0} // FIXED: Show when subcategories exist
                  showCategories={false} // Don't show categories in category page
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-purple-900">
                    {totalResults} Products Found
                  </h2>
                  <p className="text-sm text-purple-600 mt-1">
                    Showing {((filterCurrentPage - 1) * productsPerPage) + 1}-{Math.min(filterCurrentPage * productsPerPage, totalResults)} of {totalResults}
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
                        to={`/product/${product._id}`}
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
                            <span className="text-lg sm:text-xl font-light text-purple-900">
                              LE {product.price.toLocaleString()}
                            </span>
                          </div>
                          
                          {/* Cart Section */}
                          <div className="space-y-2">
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
                    No products match your current selection. Try adjusting your filters.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(filterCurrentPage - 1, 1))}
                    disabled={filterCurrentPage === 1}
                    className="px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = filterCurrentPage <= 3 ? i + 1 : filterCurrentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                          filterCurrentPage === pageNum
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(filterCurrentPage + 1, totalPages))}
                    disabled={filterCurrentPage === totalPages}
                    className="px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          filters={filters}
          onFiltersChange={handleFiltersChange}
          brands={brands.map(brand => ({ 
            _id: brand._id, 
            name: brand.name,
            image: brand.image
          }))}
          categories={categories.map(cat => ({ _id: cat._id, name: cat.name, value: cat.value }))}
          subcategories={subcategories.map(sub => ({ _id: sub._id, name: sub.name, value: sub.value }))}
          maxPrice={maxPrice}
          showSubcategories={subcategories.length > 0} // FIXED: Show when subcategories exist
          showCategories={false}
          totalResults={totalResults}
        />
      </div>
    </>
  );
};

export default CategoryPage;
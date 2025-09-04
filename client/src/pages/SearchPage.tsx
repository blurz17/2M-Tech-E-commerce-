import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Search, 
  X, 
  Grid, 
  List, 
  Star, 
  ShoppingCart, 
  Package,
  AlertCircle
} from 'lucide-react';
import { useSearchProductsQuery } from '../redux/api/product.api';
import { addToCart } from '../redux/reducers/cart.reducer';
import { Product } from '../types/api-types';
import Loader from '../components/common/Loader';
import { useConstants } from '../hooks/useConstants';

// Brand display component - Same as in SingleProduct
const BrandDisplay: React.FC<{ brand: any; isCompact?: boolean }> = ({ brand, isCompact = false }) => {
  if (!brand) return null;
  
  const brandName = typeof brand === 'object' ? brand.name : brand;
  const brandImage = typeof brand === 'object' ? brand.image : null;
  
  return (
    <div className="flex items-center gap-1 mb-1">
      {brandImage && (
        <img 
          src={brandImage} 
          alt={brandName}
          className={`rounded object-cover ${isCompact ? 'w-4 h-4' : 'w-6 h-6'}`}
        />
      )}
      <span className="text-xs text-gray-500 uppercase font-medium tracking-wide">
        {brandName}
      </span>
    </div>
  );
};

// Enhanced price display component for product cards
const ProductCardPriceDisplay: React.FC<{ 
  originalPrice: number; 
  netPrice?: number; 
  discount?: number;
  currencySymbol?: string;
  isCompact?: boolean;
}> = ({ originalPrice, netPrice, discount = 0, currencySymbol = 'LE', isCompact = false }) => {
  const hasDiscount = discount > 0;
  const finalPrice = netPrice || (hasDiscount ? originalPrice - (originalPrice * discount / 100) : originalPrice);
  
  if (hasDiscount) {
    return (
      <div className="space-y-1">
        {/* Discount Badge - Only show if not compact */}
        {!isCompact && (
          <div className="flex items-center gap-1">
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              -{discount}% OFF
            </span>
          </div>
        )}
        
        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className={`font-bold text-red-600 ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {currencySymbol} {finalPrice.toLocaleString()}
          </span>
          <span className={`text-gray-500 line-through ${isCompact ? 'text-sm' : 'text-base'}`}>
            {currencySymbol} {originalPrice.toLocaleString()}
          </span>
        </div>
        
        {/* Discount percentage in compact mode */}
        {isCompact && (
          <div className="text-xs text-red-600 font-medium">
            Save {discount}%
          </div>
        )}
      </div>
    );
  }

  // No discount - show regular price
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-purple-600 ${isCompact ? 'text-lg' : 'text-xl'}`}>
        {currencySymbol} {finalPrice.toLocaleString()}
      </span>
    </div>
  );
};

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currencySymbol} = useConstants();
  
  // State management
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // API queries - Fixed the query parameters
  const { 
    data: searchResults, 
    isLoading, 
    error,
    isFetching
  } = useSearchProductsQuery({
    search: searchQuery,
    page: currentPage,
    price: '', // Provide default empty string
    category: '', // Provide default empty string
    sort: '', // Provide default empty string
    brand: '' // Optional field with default
  }, {
    skip: !searchQuery
  });

  // Update URL params when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [searchQuery, currentPage, setSearchParams]);

  // Handle search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  // Add to cart handler - Updated to use final price
  const handleAddToCart = useCallback((product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Calculate final price considering discount
    const hasDiscount = product.discount && product.discount > 0;
    const finalPrice = product.netPrice || 
      (hasDiscount ? product.price - (product.price * product.discount / 100) : product.price);
    
    const cartItemData = {
      productId: product._id,
      name: product.name,
      price: finalPrice, // Use final price instead of original price
      quantity: 1,
      stock: product.stock,
      photo: product.photos[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      brand: typeof product.brand === 'object' ? product.brand : { _id: '', name: product.brand },
    };
    dispatch(addToCart(cartItemData));
  }, [dispatch]);

  // Navigate to product details
  const handleProductClick = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Truncate text utility
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render pagination
  const renderPagination = () => {
    if (!searchResults || searchResults.totalPages <= 1) return null;

    const totalPages = searchResults.totalPages;
    const current = currentPage;
    const pages = [];

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (current > 4) pages.push('...');

    // Add pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (current < totalPages - 3) pages.push('...');

    // Always show last page if more than 1 page
    if (totalPages > 1) pages.push(totalPages);

    return (
      <div className="flex items-center justify-center space-x-1 mt-8">
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
        >
          Previous
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
              page === current
                ? 'bg-purple-600 text-white border-purple-600'
                : page === '...'
                ? 'cursor-default'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    );
  };

  if (!searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Products</h1>
            <p className="text-gray-600 mb-6">Enter a search term to find products</p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => handleSearchChange(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {searchResults && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>
                  {isLoading || isFetching ? 'Searching...' : 
                    `${searchResults.totalProducts.toLocaleString()} products found for "${searchQuery}"`
                  }
                </span>
              </div>
              
              {searchResults.totalProducts > 0 && (
                <div className="text-xs text-gray-500">
                  Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, searchResults.totalProducts)} of {searchResults.totalProducts} results
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Content */}
        <div className="w-full">
          {isLoading && currentPage === 1 ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
              <p className="text-gray-600 mb-4">There was an error searching for products. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : searchResults?.products && searchResults.products.length > 0 ? (
            <>
              {/* Loading overlay for pagination */}
              <div className="relative">
                {isFetching && currentPage > 1 && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader />
                  </div>
                )}
                
                {/* Products Grid/List */}
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                    : 'space-y-4'
                }>
                  {searchResults.products.map((product: Product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-purple-200 group ${
                        viewMode === 'list' ? 'flex gap-4 p-4' : 'overflow-hidden'
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative bg-gray-100 ${
                        viewMode === 'list' 
                          ? 'w-32 h-32 flex-shrink-0 rounded-lg' 
                          : 'aspect-square'
                      } overflow-hidden`}>
                        <img
                          src={product.photos[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {/* Discount Badge */}
                          {product.discount && product.discount > 0 && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{product.discount}% OFF
                            </div>
                          )}
                          {product.featured && (
                            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Out of Stock
                            </div>
                          )}
                          {product.stock > 0 && product.stock <= 5 && (
                            <div className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Low Stock
                            </div>
                          )}
                        </div>

                        {/* Add to Cart Button - Only show on hover */}
                        {product.stock > 0 && (
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="absolute bottom-2 right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                        {/* Brand */}
                        <BrandDisplay brand={product.brand} isCompact={true} />

                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-200 leading-tight">
                          {viewMode === 'list' 
                            ? truncateText(product.name, 80)
                            : truncateText(product.name, 50)
                          }
                        </h3>

                       {/* Description - Only in list view with WYSIWYG support */}
                        {viewMode === 'list' && product.description && (
                            <div 
                                className="wysiwyg-content prose prose-sm max-w-none text-sm text-gray-600 mb-3 leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                    __html: truncateText(product.description, 360) 
                                }}
                                style={{
                                    fontFamily: 'inherit',
                                    lineHeight: '1.6',
                                    color: '#4B5563' // text-gray-600 equivalent
                                }}
                            />
                        )}

                        {/* Price and Stock Info */}
                        <div className={`flex items-start ${viewMode === 'list' ? 'justify-between' : 'justify-between'} gap-3`}>
                          <div className="flex-1">
                            {/* Enhanced Price Display with Discount */}
                            <ProductCardPriceDisplay
                              originalPrice={product.price}
                              netPrice={product.netPrice}
                              discount={product.discount}
                              currencySymbol={product.currencySymbol || currencySymbol}
                              isCompact={viewMode === 'grid'}
                            />
                            
                            {product.stock > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {product.stock > 10 ? 'In Stock' : `${product.stock} left`}
                              </div>
                            )}
                          </div>
                          
                          {/* Category Tag */}
                          {product.category && (
                            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                              {typeof product.category === 'object' 
                                ? product.category.name 
                                : product.category
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{searchQuery}"
              </p>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  Try:
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using different keywords</li>
                  <li>• Using more general terms</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
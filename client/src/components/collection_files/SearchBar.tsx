import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ShoppingCart, Star, Tag } from 'lucide-react';
import { useSearchProductsQuery } from '../../redux/api/product.api';
import { Product } from '../../types/api-types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/reducers/cart.reducer';
import { useConstants } from '../../hooks/useConstants';

interface HeaderSearchBarProps {
  className?: string;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const {currencySymbol} = useConstants();
  // Debounce search query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Search API call
  const {
    data: searchResults,
    isLoading,
    error
  } = useSearchProductsQuery(
    {
      search: debouncedQuery,
      page: 1,
      price: '',
      category: '',
      sort: ''
    },
    {
      skip: !debouncedQuery || debouncedQuery.length < 2
    }
  );

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show/hide results based on query and focus
  useEffect(() => {
    setShowResults(isSearchFocused && debouncedQuery.length >= 2);
  }, [isSearchFocused, debouncedQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setIsSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setShowResults(false);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setIsSearchFocused(false);
  };

  const handleAddToCart = useCallback((product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    const cartItemData = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      photo: product.photos[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      brand: typeof product.brand === 'object' ? product.brand : { _id: '', name: product.brand },
    };
    dispatch(addToCart(cartItemData));
  }, [dispatch]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className={`w-full ${className}`} ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${
          isSearchFocused 
            ? 'transform scale-105 shadow-lg' 
            : 'shadow-md hover:shadow-lg'
        }`}>
          {/* Search Input Container - Compact for header */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search products..."
              className={`w-full h-10 md:h-12 pl-10 md:pl-12 pr-20 md:pr-24 text-sm md:text-base 
                bg-white/95 backdrop-blur-sm border-2 rounded-lg md:rounded-2xl
                transition-all duration-300 outline-none font-medium
                placeholder:text-gray-400 placeholder:font-normal
                ${isSearchFocused 
                  ? 'border-purple-400 bg-white shadow-inner' 
                  : 'border-gray-200 hover:border-purple-300'
                }`}
            />
            
            {/* Search Icon */}
            <div className={`absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 
              transition-all duration-300 ${
                isSearchFocused ? 'text-purple-600 scale-110' : 'text-gray-400'
              }`}>
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </div>

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 md:right-20 top-1/2 transform -translate-y-1/2 
                  p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                  rounded-full transition-all duration-200 z-10"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            )}

            {/* Search Button - Compact */}
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 
                h-8 md:h-10 px-3 md:px-4 rounded-md md:rounded-xl font-semibold text-xs md:text-sm
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10
                ${searchQuery.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400'
                }`}
            >
              Go
            </button>
          </div>
        </div>

        {/* Real-time Search Results - Positioned for header */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 max-h-80 overflow-hidden z-50">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
                <span className="text-gray-600 text-sm">Searching...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-500 text-sm">Error searching products. Please try again.</p>
              </div>
            ) : searchResults?.products && searchResults.products.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {/* Results Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Found {searchResults.totalProducts} products
                    </p>
                    {searchResults.totalProducts > 20 && (
                      <button
                        onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View all →
                      </button>
                    )}
                  </div>
                </div>

                {/* Products List - Compact for header */}
                <div className="p-1">
                  {searchResults.products.slice(0, 20).map((product: Product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-all duration-200 group"
                    >
                      {/* Product Image - Smaller for header */}
                      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.photos[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.featured && (
                          <div className="absolute top-0.5 left-0.5">
                            <Star className="w-2 h-2 text-purple-600 fill-current" />
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-[10px] font-semibold">OUT</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info - Compact */}
                      <div className="flex-1 ml-3 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Tag className="w-2 h-2 text-purple-500 flex-shrink-0" />
                        </div>
                        <h4 className="font-medium text-gray-900 text-xs leading-tight mb-1 group-hover:text-purple-700 transition-colors duration-200">
                          {truncateText(product.name, 35)}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-600 text-xs">
                            {currencySymbol} {product.price.toLocaleString()}
                          </span>
                          {product.stock > 0 && product.stock <= 5 && (
                            <span className="text-[10px] text-orange-600 font-medium">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button - Smaller */}
                      {product.stock > 0 && (
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="ml-2 w-6 h-6 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                        >
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : debouncedQuery.length >= 2 ? (
              <div className="p-4 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">No products found for "{debouncedQuery}"</p>
                <p className="text-xs text-gray-400">Try different keywords</p>
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

export default HeaderSearchBar;
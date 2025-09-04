import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { Eye, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useConstants } from '../hooks/useConstants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Safe cart items handling
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) || [];
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartItem = safeCartItems.find(item => item.productId === product._id);
  const {currencySymbol} = useConstants();

  // Single image handling (first image only)
  const primaryImage = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  // Stock status
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // Helper functions for displaying data
  const hasDiscount = product.discount > 0;
  const discountPercentage = product.discount;
  const originalPrice = product.price;
  const finalPrice = product.netPrice || (originalPrice - (originalPrice * discountPercentage / 100));

  // Format categories for display
  const getCategories = () => {
    if (!product.categories || product.categories.length === 0) return [];
    
    return product.categories.map(cat => {
      if (typeof cat === 'string') return cat;
      return cat.name || cat.value || '';
    }).filter(Boolean);
  };

  // Format brand name
  const getBrandName = () => {
    if (typeof product.brand === 'object') {
      return product.brand.name;
    }
    return product.brand || '';
  };

  const handleAddToCart = useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      const cartItemData = {
        productId: product._id,
        name: product.name,
        price: finalPrice, // Use net price for cart
        quantity: 1,
        stock: product.stock,
        photo: primaryImage,
        brand: typeof product.brand === 'object' ? product.brand : { _id: '', name: product.brand },
      };
      dispatch(addToCart(cartItemData));
      setIsAddingToCart(false);
    }, 300);
  }, [isOutOfStock, product, primaryImage, finalPrice, dispatch]);

  const handleIncrement = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (cartItem && cartItem.quantity < product.stock) {
      dispatch(incrementCartItem(product._id));
    }
  }, [cartItem, product.stock, product._id, dispatch]);

  const handleDecrement = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(decrementCartItem(product._id));
  }, [product._id, dispatch]);

  const handleNavigateToProduct = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    
    if (
      target.closest('button') || 
      target.closest('[role="button"]') ||
      target.closest('.quick-action-btn')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    navigate(`/product/${product._id}`);
  }, [navigate, product._id]);

  const handleQuickView = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/product/${product._id}`);
  }, [navigate, product._id]);

  const categories = getCategories();
  const brandName = getBrandName();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-purple-100 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigateToProduct}
    >
      {/* Image Container */}
      <div className="aspect-square bg-purple-50 relative overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-gray-600 text-cyan-500 px-6 py-1 rounded-lg text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
        {/* Featured Badge */}
        {product.featured && !isOutOfStock && (
          <div className={`absolute top-3 ${hasDiscount ? 'left-20' : 'left-3'} bg-purple-500 text-gray-200 px-2 py-1 rounded-lg text-xs font-medium`}>
            FEATURED
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
            SOLD OUT
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            {product.stock} left
          </div>
        )}

        {/* Quick View Button */}
        <div className={`absolute top-3 right-3 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } ${isLowStock && !isOutOfStock ? 'top-10' : ''}`}>
          <button
            onClick={handleQuickView}
            className="quick-action-btn w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200 shadow-md"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        {/* Brand Name */}
        {brandName && (
          <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
            {brandName}
          </div>
        )}

        {/* Product Name */}
       <div className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg sm:text-lg" > {product.name} </div>
      
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="mb-3">
          {hasDiscount ? (
            <div className="space-y-1">
              {/* Net Price (After Discount) */}
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-red-600">
                   {currencySymbol} {finalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-red-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Save {discountPercentage}%
                </span>
              </div>
              
              {/* Original Price (Strikethrough) */}
              <div className="text-sm text-gray-500 line-through">
                 {currencySymbol} {originalPrice.toLocaleString()}
              </div>
              
              {/* Savings Amount */}
              <div className="text-xs text-green-600 font-medium">
                You save  {currencySymbol} {(originalPrice - finalPrice).toLocaleString()}
              </div>
            </div>
          ) : (
            <span className="text-lg sm:text-xl font-light text-purple-900">
               {currencySymbol} {finalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Cart Section */}
        <div className="space-y-2">
          {cartItem && cartItem.quantity > 0 ? (
            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-purple-600 hover:bg-red-500 hover:text-white transition-colors duration-200 flex-shrink-0"
              >
                <Minus className="w-3 h-3" />
              </button>
              
              <span className="font-semibold text-purple-800 px-2 text-sm flex-shrink-0">{cartItem.quantity}</span>
              
              <button
                onClick={handleIncrement}
                disabled={cartItem.quantity >= product.stock}
                className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center text-purple-600 hover:bg-green-500 hover:text-white transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-purple-500 text-white cursor-wait'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Adding...</span>
                </>
              ) : isOutOfStock ? (
                <span className="text-xs sm:text-sm">Out of Stock</span>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm whitespace-nowrap">Add to Cart</span>
                </>
              )}
            </button>
          )}
          
          <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm text-center hover:bg-purple-200 transition-colors cursor-pointer">
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
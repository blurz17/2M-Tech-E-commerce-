import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { Eye, ShoppingCart, Plus, Minus } from 'lucide-react';

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

  // Single image handling (first image only)
  const primaryImage = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  // Stock status
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    
    setTimeout(() => {
      const cartItemData = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        photo: primaryImage,
      };
      dispatch(addToCart(cartItemData));
      setIsAddingToCart(false);
    }, 300);
  }, [isOutOfStock, product, primaryImage, dispatch]);

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

  const handleGoToCart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate('/cart');
  }, [navigate]);

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

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigateToProduct}
    >
      {/* Image Container */}
      <div className="aspect-w-1 aspect-h-1 bg-gray-100 relative overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />
        
        {/* Featured Badge */}
        {product.featured && !isOutOfStock && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            FEATURED
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
            OUT OF STOCK
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.stock} left
          </div>
        )}

        {/* Quick View Button */}
        <div className={`absolute top-2 right-2 transition-all duration-300 ${
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
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Price and Cart Section */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-light text-purple-700">LE {product.price.toLocaleString()}</span>
          </div>

          {/* Cart Controls */}
          {cartItem && cartItem.quantity > 0 ? (
            <div className="flex items-center space-x-2">
              {/* Quantity Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white rounded-l-lg transition-colors duration-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <span className="px-3 py-1 text-sm font-semibold">{cartItem.quantity}</span>
                
                <button
                  onClick={handleIncrement}
                  disabled={cartItem.quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white rounded-r-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Go to Cart */}
              <button
                onClick={handleGoToCart}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Cart
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-purple-500 text-white cursor-wait'
                  : 'bg-purple-600 text-white hover:bg-sky-500'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 caret-violet-950" />
                  Add to cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
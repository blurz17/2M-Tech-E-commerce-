import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '../components/common/BackBtn';
import { useProductDetailsQuery } from '../redux/api/product.api';
import { addToCart, decrementCartItem, incrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { wysiwygStyles, ProductSkeleton } from '../components/common/filesRelatedProductDetails';
import RelatedProducts from '../components/RelatedProducts';

const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
    <div className="container mx-auto p-4 my-6">
        <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">Unable to load product details. Please try again.</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    </div>
);

// Stock indicator component
const StockIndicator: React.FC<{ stock: number }> = ({ stock }) => {
    const getStockStatus = () => {
        if (stock <= 0) return { text: 'Out of stock', color: 'text-red-500', bg: 'bg-red-50' };
        if (stock <= 10) return { text: `Only ${stock} left in stock`, color: 'text-orange-500', bg: 'bg-orange-50' };
        return { text: 'In stock', color: 'text-green-500', bg: 'bg-green-50' };
    };

    const status = getStockStatus();
    
    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bg}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
            {status.text}
        </div>
    );
};

// Simplified price display component
const PriceDisplay: React.FC<{ 
    originalPrice: number; 
    netPrice: number; 
    discount: number;
    currencySymbol?: string;
}> = ({ originalPrice, netPrice, discount, currencySymbol = 'LE' }) => {
    const hasDiscount = discount > 0;
    const finalPrice = netPrice || (originalPrice - (originalPrice * discount / 100));
    const savingsAmount = originalPrice - finalPrice;

    if (hasDiscount) {
        return (
            <div className="space-y-2">
                {/* Discount Badge - Smaller and simpler */}
                <div className="inline-block">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{discount}% OFF
                    </span>
                </div>

                {/* Price Section - Cleaner layout */}
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-red-600">
                        {currencySymbol} {finalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                        {currencySymbol} {originalPrice.toLocaleString()}
                    </span>
                </div>

                {/* Savings Amount - Simplified */}
                <div className="text-green-600 font-medium">
                    You save {currencySymbol} {savingsAmount.toLocaleString()}
                </div>
            </div>
        );
    }

    // No discount - show regular price
    return (
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
                {currencySymbol} {finalPrice.toLocaleString()}
            </span>
        </div>
    );
};

// Simplified product info section - cleaner and less overwhelming
const ProductInfoSection: React.FC<{ product: any }> = ({ product }) => {
    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand;
    const categoryName = product.categories && product.categories.length > 0 
        ? (typeof product.categories[0] === 'object' ? product.categories[0].name : product.categories[0])
        : null;

    return (
        <div className="space-y-3 text-sm">
            {/* Category - Simple display */}
            {categoryName && (
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Category:</span>
                    <span className="text-gray-900">{categoryName}</span>
                </div>
            )}

            {/* Brand - Simple display */}
            {brandName && (
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Brand:</span>
                    <span className="text-gray-900">{brandName}</span>
                </div>
            )}

            {/* Featured badge - only if featured */}
            {product.featured && (
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Status:</span>
                    <span className="text-yellow-600 font-medium">⭐ Featured</span>
                </div>
            )}
        </div>
    );
};

// Description section component that renders HTML properly
const ProductDescription: React.FC<{ description: string }> = ({ description }) => {
    if (!description) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-500 italic">No description available for this product.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
            <div 
                className="wysiwyg-content prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    );
};

// Quantity selector component
const QuantitySelector: React.FC<{
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    maxStock: number;
}> = ({ quantity, onIncrement, onDecrement, maxStock }) => (
    <div className="flex items-center bg-gray-50 rounded-lg p-1">
        <button
            onClick={onDecrement}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}
        >
            −
        </button>
        <span className="mx-4 text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
        <button
            onClick={onIncrement}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= maxStock}
        >
            +
        </button>
    </div>
);

// Enhanced Image gallery component with zoom, smooth transitions and arrows
const ImageGallery: React.FC<{
    images: string[];
    productName: string;
    selectedIndex: number;
    onImageSelect: (index: number) => void;
}> = ({ images, productName, selectedIndex, onImageSelect }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const handleImageLoad = () => setImageLoading(false);
    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        setZoomPosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
    };

    const handleImageChange = (index: number) => {
        setImageLoading(true);
        setImageError(false);
        setIsZoomed(false);
        onImageSelect(index);
    };

    const goToPrevious = () => {
        const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
        handleImageChange(newIndex);
    };

    const goToNext = () => {
        const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
        handleImageChange(newIndex);
    };

    return (
        <div className="space-y-4">
            {/* Main Image with Zoom and Arrows */}
            <div className="relative bg-gray-50 rounded-xl overflow-hidden group">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
                
                <div 
                    className="relative cursor-zoom-in h-96 lg:h-[500px] overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                >
                    <img
                        src={images.length > 0 && !imageError ? images[selectedIndex] : '/placeholder-image.jpg'}
                        alt={`${productName} - Image ${selectedIndex + 1}`}
                        className={`w-full h-full object-contain transition-all duration-500 ease-out ${
                            isZoomed ? 'scale-150' : 'scale-100'
                        }`}
                        style={isZoomed ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        } : {}}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                </div>
                
                {/* Navigation Arrows - Only show if more than 1 image */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
                
                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
                
                {/* Zoom indicator */}
                {!imageLoading && !imageError && (
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        🔍 Hover to zoom
                    </div>
                )}
            </div>

            {/* Thumbnail Images with Smooth Transitions */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleImageChange(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ease-out transform hover:scale-105 ${
                                selectedIndex === index 
                                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105' 
                                    : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const SingleProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { data, isLoading, isError, refetch } = useProductDetailsQuery(productId!);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    
    // State for image gallery
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Memoized values for performance
    const cartItem = useMemo(() => 
        cartItems.find(item => item.productId === productId),
        [cartItems, productId]
    );

    const productImages = useMemo(() => 
        data?.product?.photos && data.product.photos.length > 0 ? data.product.photos : [],
        [data?.product?.photos]
    );

    // Get category info for related products
    // Fixed categoryInfo logic in ProductDetails.tsx
const categoryInfo = useMemo(() => {
    console.log('Debug: Product categories:', data?.product?.categories);
    
    if (!data?.product?.categories || data.product.categories.length === 0) return null;
    
    const category = data.product.categories[0];
    console.log('Debug: First category:', category, 'Type:', typeof category);
    
    if (typeof category === 'object' && category !== null) {
        // For populated category objects, use _id
        const id = category._id;
        const name = category.name || category.value;
        
        console.log('Debug: Category object - ID:', id, 'Name:', name);
        
        // Validate that we have a proper ObjectId
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            console.warn('Warning: Invalid category ID format:', id);
            return null;
        }
        
        return { id, name };
    } else if (typeof category === 'string') {
        // For string categories, check if it's a valid ObjectId
        console.log('Debug: Category string:', category);
        
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
        
        if (isObjectId) {
            return { id: category, name: 'Category' }; // Use generic name
        } else {
            console.warn('Warning: Category string is not a valid ObjectId:', category);
            return null;
        }
    }
    
    console.error('Error: Invalid category format:', category);
    return null;
}, [data?.product?.categories]);
    // Memoized handlers
    const handleAddToCart = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        if (!data?.product) return;

        const product = data.product;
        const brandInfo = typeof product.brand === 'object' 
            ? { _id: product.brand._id, name: product.brand.name }
            : product.brand;

        // Use net price for cart
        const finalPrice = product.netPrice || (product.price - (product.price * product.discount / 100));

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: finalPrice, // Use net price instead of original price
            quantity: 1,
            stock: product.stock,
            photo: productImages.length > 0 ? productImages[0] : '/placeholder-image.jpg',
            brand: brandInfo,
        };
        dispatch(addToCart(cartItem));
    }, [data, productImages, dispatch]);

    const handleIncrement = useCallback(() => {
        if (data?.product) {
            dispatch(incrementCartItem(data.product._id));
        }
    }, [data, dispatch]);

    const handleDecrement = useCallback(() => {
        if (data?.product) {
            dispatch(decrementCartItem(data.product._id));
        }
    }, [data, dispatch]);

    const handleGoToCart = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        navigate('/cart');
    }, [navigate]);

    const handleImageSelect = useCallback((index: number) => {
        setSelectedImageIndex(index);
    }, []);

    // Loading state
    if (isLoading) return <ProductSkeleton />;
    
    // Error state
    if (isError) return <ErrorState onRetry={refetch} />;
    
    // No data state
    if (!data?.product) return <ErrorState />;

    const product = data.product;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Include the WYSIWYG styles */}
            <style>{wysiwygStyles}</style>
            
            <div className="container mx-auto px-4 py-6">
                <BackButton />
                
                {/* Main Product Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Images */}
                        <div className="flex-1 p-6 lg:p-8">
                            <ImageGallery
                                images={productImages}
                                productName={product.name}
                                selectedIndex={selectedImageIndex}
                                onImageSelect={handleImageSelect}
                            />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 p-6 lg:p-8 lg:border-l border-gray-200">
                            <div className="space-y-6">
                                {/* Product Title */}
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                        {product.name}
                                    </h1>
                                </div>

                                {/* Simplified Price Display */}
                                <PriceDisplay 
                                    originalPrice={product.price}
                                    netPrice={product.netPrice}
                                    discount={product.discount}
                                    currencySymbol={product.currencySymbol}
                                />

                                {/* Stock Status */}
                                <StockIndicator stock={product.stock} />

                                {/* Simplified Product Info */}
                                <ProductInfoSection product={product} />

                                {/* Cart Actions */}
                                <div className="pt-6 border-t border-gray-200">
                                    {cartItem ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Quantity</span>
                                                <QuantitySelector
                                                    quantity={cartItem.quantity}
                                                    onIncrement={handleIncrement}
                                                    onDecrement={handleDecrement}
                                                    maxStock={product.stock}
                                                />
                                            </div>
                                            <button
                                                onClick={handleGoToCart}
                                                className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                                            >
                                                View Cart
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock <= 0}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                                                product.stock > 0
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description Section */}
                <div className="mb-6">
                    <ProductDescription description={product.description} />
                </div>

                {/* Related Products Section */}
                {categoryInfo && (
                    <RelatedProducts 
                        currentProductId={product._id}
                        categoryId={categoryInfo.id}
                        categoryName={categoryInfo.name}
                    />
                )}
            </div>
        </div>
    );
};

export default SingleProduct;
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useProductDetailsQuery } from '../redux/api/product.api';
import { addToCart, decrementCartItem, incrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { wysiwygStyles,ProductSkeleton } from '../components/common/filesRelatedProductDetails';



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

// Price display component
const PriceDisplay: React.FC<{ price: number }> = ({ price }) => (
    <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">LE {price}</span>
    </div>
);

// Brand display component
const BrandDisplay: React.FC<{ brand: any }> = ({ brand }) => {
    if (!brand) return null;
    
    const brandName = typeof brand === 'object' ? brand.name : brand;
    const brandImage = typeof brand === 'object' ? brand.image : null;
    
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Brand</span>
            <div className="flex items-center gap-2">
                {brandImage && (
                    <img 
                        src={brandImage} 
                        alt={brandName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    {brandName}
                </span>
            </div>
        </div>
    );
};

// Categories display component
const CategoriesDisplay: React.FC<{ categories: any[] }> = ({ categories }) => {
    if (!categories || categories.length === 0) return null;
    
    return (
        <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                {categories.length > 1 ? 'Categories' : 'Category'}
            </span>
            <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => {
                    const categoryName = typeof category === 'object' ? category.name : category;
                    return (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            {categoryName}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Subcategories display component
const SubcategoriesDisplay: React.FC<{ subcategories: any[] }> = ({ subcategories }) => {
    if (!subcategories || subcategories.length === 0) return null;
    
    return (
        <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                {subcategories.length > 1 ? 'Subcategories' : 'Subcategory'}
            </span>
            <div className="flex flex-wrap gap-2">
                {subcategories.map((subcategory, index) => {
                    const subcategoryName = typeof subcategory === 'object' ? subcategory.name : subcategory;
                    return (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                            {subcategoryName}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Product info section component
const ProductInfoSection: React.FC<{ product: any }> = ({ product }) => {
    return (
        <div className="space-y-4">
            {/* Categories */}
            <CategoriesDisplay categories={product.categories} />

            {/* Brand */}
            <BrandDisplay brand={product.brand} />

            {/* Subcategories */}
            <SubcategoriesDisplay subcategories={product.subcategories} />

            {/* Featured badge */}
            {product.featured && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
                        ⭐ Featured Product
                    </span>
                </div>
            )}
        </div>
    );
};

// FIXED: Description section component that renders HTML properly
const ProductDescription: React.FC<{ description: string }> = ({ description }) => {
    if (!description) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-500 italic">No description available for this product.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <div 
                className="wysiwyg-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
                style={{
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    color: '#374151'
                }}
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

// Image gallery component
const ImageGallery: React.FC<{
    images: string[];
    productName: string;
    selectedIndex: number;
    onImageSelect: (index: number) => void;
}> = ({ images, productName, selectedIndex, onImageSelect }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => setImageLoading(false);
    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
                <img
                    src={images.length > 0 && !imageError ? images[selectedIndex] : '/placeholder-image.jpg'}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    className="w-full h-96 lg:h-[500px] object-contain transition-opacity duration-300"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                                selectedIndex === index 
                                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
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

    // Memoized handlers
    const handleAddToCart = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        if (!data?.product) return;

        const product = data.product;
        const brandInfo = typeof product.brand === 'object' 
            ? { _id: product.brand._id, name: product.brand.name }
            : product.brand;

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
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
                
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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

                                {/* Price */}
                                <PriceDisplay price={product.price} />

                                {/* Stock Status */}
                                <StockIndicator stock={product.stock} />

                                {/* Product Info */}
                                <ProductInfoSection 
                                    product={product}
                                />

                                {/* Description - Now renders HTML properly */}
                                <ProductDescription description={product.description} />

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
            </div>
        </div>
    );
};

export default SingleProduct;
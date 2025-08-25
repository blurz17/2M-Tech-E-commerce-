import React, { useState, useCallback, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { useGetAllFeaturedProductsQuery } from '../redux/api/product.api';
import './FeaturedSection.css';

// Type definitions
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    photos: string[];
    stock: number;
}

interface ProductSlideProps {
    product: Product;
    activeImageIndex: number;
    onImageChange: (productId: string, imageIndex: number) => void;
    navigateImage: (productId: string, direction: 'prev' | 'next', photosLength: number) => void;
    getCurrentImage: (productId: string, photos: string[]) => string;
}

interface HighlightItemProps {
    icon: string;
    text: string;
}

const FeaturedSection = () => {
    const { data, isLoading } = useGetAllFeaturedProductsQuery('');
    const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});

    // Memoize products to prevent unnecessary re-renders
    const products = useMemo(() => data?.products || [], [data]);

    // Optimized image change handler
    const handleImageChange = useCallback((productId: string, imageIndex: number) => {
        setActiveImageIndex(prev => ({
            ...prev,
            [productId]: imageIndex
        }));
    }, []);

    // Memoized image navigation
    const navigateImage = useCallback((productId: string, direction: 'prev' | 'next', photosLength: number) => {
        if (photosLength <= 1) return;
        
        setActiveImageIndex(prev => {
            const currentIndex = prev[productId] || 0;
            const newIndex = direction === 'prev' 
                ? (currentIndex === 0 ? photosLength - 1 : currentIndex - 1)
                : (currentIndex === photosLength - 1 ? 0 : currentIndex + 1);
            
            return { ...prev, [productId]: newIndex };
        });
    }, []);

    // Simplified image getter
    const getCurrentImage = useCallback((productId: string, photos: string[]) => {
        if (!photos || photos.length === 0) return '/placeholder-image.jpg';
        const currentIndex = activeImageIndex[productId] || 0;
        return photos[currentIndex] || photos[0];
    }, [activeImageIndex]);

    // Show loading state
    if (isLoading) {
        return (
            <section className="w-full bg-gradient-to-br from-gray-50 to-white">
                <div className="featured-carousel-container">
                    <div className="flex items-center justify-center h-64">
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </section>
        );
    }

    // No products available
    if (!products.length) {
        return null;
    }

    return (
        <section className="w-full bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-7xl mx-auto">
                <div className="featured-carousel-container">
                    <Carousel 
                        showThumbs={false} 
                        showStatus={false} 
                        infiniteLoop 
                        autoPlay
                        interval={8000}
                        transitionTime={500}
                        swipeable
                        emulateTouch
                        showIndicators
                        stopOnHover
                    >
                        {products.map((product: Product) => (
                            <ProductSlide
                                key={product._id}
                                product={product}
                                activeImageIndex={activeImageIndex[product._id] || 0}
                                onImageChange={handleImageChange}
                                navigateImage={navigateImage}
                                getCurrentImage={getCurrentImage}
                            />
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

// Memoized ProductSlide component to prevent unnecessary re-renders
const ProductSlide = React.memo<ProductSlideProps>(({ 
    product, 
    activeImageIndex, 
    onImageChange, 
    navigateImage, 
    getCurrentImage 
}) => {
    const photos = product.photos || [];
    const hasMultipleImages = photos.length > 1;

    return (
        <div className="carousel-slide-container">
            <div className="carousel-content-wrapper">
                <div className="carousel-grid">
                    {/* Product Details Section */}
                    <div className="product-details-section">
                        <div className="product-badge">
                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured Product
                        </div>
                        
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-description">{product.description}</p>
                            
                            <div className="product-price">
                                <span className="price-symbol">EGP </span>
                                <span className="price-amount">{product.price.toLocaleString()}</span>
                            </div>
                            
                            {/* Simplified highlights */}
                            <div className="product-highlights">
                                <HighlightItem icon="✓" text="Premium Quality" />
                                <HighlightItem icon="🚚" text="Fast Delivery" />
                                <HighlightItem icon="⭐" text="Top Rated" />
                            </div>
                            
                            {/* Stock Status */}
                            <div className="stock-status">
                                <div className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    <div className="stock-dot"></div>
                                    <span>
                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="button-group">
                            <Link to={`/product/${product._id}`} className="btn-primary">
                                View Product
                                <svg className="btn-arrow w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link to="/products" className="btn-secondary">
                                Browse All
                            </Link>
                        </div>
                    </div>

                    {/* Optimized Image Section */}
                    <div className="product-image-section">
                        <div className="image-container">
                            <div className="image-wrapper">
                                <div className="main-image-container">
                                    <img
                                        src={getCurrentImage(product._id, photos)}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    
                                    {/* Image Counter */}
                                    {hasMultipleImages && (
                                        <div className="image-counter">
                                            {activeImageIndex + 1} / {photos.length}
                                        </div>
                                    )}
                                    
                                    {/* Navigation Arrows */}
                                    {hasMultipleImages && (
                                        <>
                                            <button
                                                className="image-nav-btn image-nav-prev"
                                                onClick={() => navigateImage(product._id, 'prev', photos.length)}
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                className="image-nav-btn image-nav-next"
                                                onClick={() => navigateImage(product._id, 'next', photos.length)}
                                                aria-label="Next image"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Simplified Thumbnails */}
                                {hasMultipleImages && photos.length <= 5 && (
                                    <div className="image-thumbnails">
                                        <div className="thumbnails-container">
                                            {photos.map((photo, index) => (
                                                <button
                                                    key={index}
                                                    className={`thumbnail-btn ${activeImageIndex === index ? 'active' : ''}`}
                                                    onClick={() => onImageChange(product._id, index)}
                                                    aria-label={`View image ${index + 1}`}
                                                >
                                                    <img
                                                        src={photo}
                                                        alt={`${product.name} ${index + 1}`}
                                                        className="thumbnail-image"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Memoized HighlightItem component
const HighlightItem = React.memo<HighlightItemProps>(({ icon, text }) => (
    <div className="highlight-item">
        <span className="highlight-icon">{icon}</span>
        <span>{text}</span>
    </div>
));

export default FeaturedSection;

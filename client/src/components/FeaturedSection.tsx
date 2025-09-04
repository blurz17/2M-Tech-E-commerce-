import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useGetAllFeaturedProductsQuery } from '../redux/api/product.api';
import './FeaturedSection.css';

const FeaturedSection = () => {
    const { data, isLoading } = useGetAllFeaturedProductsQuery('');
    const [activeImages, setActiveImages] = useState({});
    const navigate = useNavigate(); // Add navigation hook

    const products = data?.products || [];

    const handleImageChange = (productId, imageIndex) => {
        setActiveImages(prev => ({ ...prev, [productId]: imageIndex }));
    };

    const truncateDescription = (description, maxLength = 100) => {
        const textContent = description.replace(/<[^>]*>/g, '');
        return textContent.length > maxLength 
            ? textContent.substring(0, maxLength) + '...' 
            : textContent;
    };

    // Enhanced function to handle button clicks
    const handleViewProductClick = (e, productId) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Force navigation using useNavigate hook
        navigate(`/product/${productId}`);
        
        // Alternative: Force page reload if routing still doesn't work
        // window.location.href = `/product/${productId}`;
    };

    if (isLoading) {
        return (
            <div className="featured-loading">
                <div className="loading-spinner"></div>
                <p>Loading featured products...</p>
            </div>
        );
    }

    if (!products.length) return null;

    return (
        <section className="featured-section">
            <div className="section-header">
                <h2>Featured Products</h2>
            </div>
            
            <div className="carousel-container">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    showIndicators={true}
                    useKeyboardArrows
                    swipeable={false}
                    emulateTouch={false}
                    // Add these props to prevent carousel interference
                    preventMovementUntilSwipeScrollTolerance={true}
                    swipeScrollTolerance={50}
                    onClickItem={() => {
                        // Prevent carousel click handler
                        return false;
                    }}
                >
                    {products.map((product) => {
                        const currentImageIndex = activeImages[product._id] || 0;
                        const currentImage = product.photos?.[currentImageIndex] || product.photos?.[0] || '/placeholder-image.jpg';
                        
                        return (
                            <div key={product._id} className="carousel-slide">
                                <div className="product-slide">
                                    <div className="product-image">
                                        <img src={currentImage} alt={product.name} />
                                        
                                        {product.photos?.length > 1 && (
                                            <div className="image-navigation">
                                                <button 
                                                    className="nav-btn prev"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        const newIndex = currentImageIndex === 0 
                                                            ? product.photos.length - 1 
                                                            : currentImageIndex - 1;
                                                        handleImageChange(product._id, newIndex);
                                                    }}
                                                >
                                                    ‹
                                                </button>
                                                <span className="image-counter">
                                                    {currentImageIndex + 1}/{product.photos.length}
                                                </span>
                                                <button 
                                                    className="nav-btn next"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        const newIndex = currentImageIndex === product.photos.length - 1 
                                                            ? 0 
                                                            : currentImageIndex + 1;
                                                        handleImageChange(product._id, newIndex);
                                                    }}
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="product-content">
                                        <div className="product-info">
                                            <h3 className="product-title">{product.name}</h3>
                                            
                                            <p className="product-description">
                                                {truncateDescription(product.description)}
                                            </p>
                                        </div>
                                        
                                        <div className="product-actions">
                                            {/* Option 1: Using button with onClick */}
                                            <button 
                                                className="view-btn"
                                                onClick={(e) => handleViewProductClick(e, product._id)}
                                                type="button"
                                            >
                                                View Product
                                            </button>
                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Carousel>
            </div>
        </section>
    );
};

export default FeaturedSection;
// client/src/components/BannerSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAllBannersQuery } from '../redux/api/banner.api';

interface BannerSectionProps {
  className?: string;
}

// Skeleton Loader Component
const BannerSkeleton: React.FC = () => {
  return (
    <div className="py-8">
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="min-h-[400px] bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-2xl">
                {/* Title skeleton */}
                <div className="h-12 bg-gray-300 rounded-lg mb-4 animate-pulse" />
                <div className="h-8 bg-gray-300 rounded-lg mb-2 w-3/4 animate-pulse" />
                
                {/* Description skeleton */}
                <div className="h-6 bg-gray-300 rounded mb-2 w-full animate-pulse" />
                <div className="h-6 bg-gray-300 rounded mb-6 w-2/3 animate-pulse" />
                
                {/* Tags skeleton */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="h-10 w-40 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
                </div>
                
                {/* Button skeleton */}
                <div className="h-10 w-40 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Navigation arrows skeleton */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
          
          {/* Dots skeleton */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerSection: React.FC<BannerSectionProps> = ({ className = '' }) => {
  const { data: bannersData, isLoading, isError } = useGetAllBannersQuery();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = bannersData?.banners || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <BannerSkeleton />;
  }

  // Don't show anything if error or no banners
  if (isError || banners.length === 0) {
    return null;
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Banner Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner._id} className="min-w-full relative group">
                <Link to={`/banner/${banner._id}`}>
                  <div 
                    className="relative bg-gray-800 overflow-hidden cursor-pointer min-h-[400px] flex items-center"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${banner.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                          {banner.name}
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                          {banner.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Special Offers
                          </span>
                          <span className="text-white/90 text-sm">
                            {banner.products.length} Products
                          </span>
                        </div>
                        
                        <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                          View Products →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Only show if multiple banners */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator - Only show if multiple banners */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide(index); }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
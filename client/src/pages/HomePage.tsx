// client/src/pages/HomePage.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import FeaturedSection from '../components/FeaturedSection';
import Collections from '../components/Collections';
import NewArrivals from '../components/PopularProduct'; // Keep the import path same but rename the component
import { useLatestProductsQuery } from '../redux/api/product.api';
import Loader from '../components/common/Loader';
import BannerSection from '../components/BannerSection';

const HomePage: React.FC = () => {
    // Fetch latest products for display
    const { data: productData, isLoading: productLoading, isError: productError, refetch } = useLatestProductsQuery({ 
        limit: 24
    });
    
    const products = productData?.products || [];

    const handleRefresh = () => {
        refetch();
    };

    if (productLoading) {
        return <Loader/>;
    }

    if (productError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="text-lg font-medium text-red-600 mb-2">Error loading products</div>
                    <div className="text-gray-500 mb-6">Please try again later</div>
                    
                    <button 
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <div className="text-lg font-medium text-gray-700 mb-2">No products available</div>
                    <div className="text-gray-500 mb-6">Check back later for new arrivals</div>
                    
                    <button 
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

   return (
    <div className="min-h-screen">
        {/* Clean, minimal background */}
        <div className="relative">
                {/* Content */}
                <div className="relative z-10">
                    {/* Banner Section */}
                     <BannerSection />

                    {/* Collections Section */}
                    <Collections />
                    
                    {/* New Arrivals Section */}
                    <NewArrivals 
                        products={products}
                        limit={24}
                        showViewAll={true}
                    />
                    
                    {/* Featured Section */}
                    <FeaturedSection />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
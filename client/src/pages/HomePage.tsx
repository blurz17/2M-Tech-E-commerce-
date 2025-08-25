// client/src/pages/HomePage.tsx
import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import Collections from '../components/Collections';
import PopularProducts from '../components/PopularProduct';
import { useLatestProductsQuery } from '../redux/api/product.api';
import Loader from '../components/common/Loader';
const HomePage: React.FC = () => {
    // Fetch latest products for display
    const { data: productData, isLoading: productLoading, isError: productError } = useLatestProductsQuery({ 
        limit: 8 // Just get 8 products for the homepage
    });
    
    const products = productData?.products || [];

    if (productLoading) {
        return (
           
            <Loader/>
           
        );
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
                    <div className="text-lg font-medium text-red-600">Error loading products</div>
                    <div className="text-gray-500 mt-2">Please try again later</div>
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
                    <div className="text-lg font-medium text-gray-700">No products available</div>
                    <div className="text-gray-500 mt-2">Check back later for new arrivals</div>
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
                    {/* Featured Section */}
                    <FeaturedSection />
                    
                    {/* Collections Section */}
                    <Collections />
                    
                    {/* Popular Products Section */}
                    <PopularProducts 
                        products={products}
                        limit={8}
                        showViewAll={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
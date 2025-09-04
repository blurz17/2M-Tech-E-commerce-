// client/src/pages/BannerPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Tag, Calendar, ShoppingBag } from 'lucide-react';
import {   useGetBannerByIdQuery} from '../redux/api/banner.api';
import Loader from '../components/common/Loader';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/api-types';

const BannerPage: React.FC = () => {
  const { bannerId } = useParams<{ bannerId: string }>();
  const { data: bannerData, isLoading, isError } =   useGetBannerByIdQuery(bannerId!);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !bannerData?.banner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-lg font-medium text-red-600 mb-2">Banner not found</div>
          <div className="text-gray-500 mb-6">The banner you're looking for doesn't exist.</div>
          
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const banner = bannerData.banner;
  const products = banner.products || [];

  // Transform banner products to regular products for ProductCard
  const transformedProducts: Product[] = products.map((bannerProduct: any) => {
    const product = bannerProduct.product;
    const discountPercentage = bannerProduct.discountPercentage || 0;
    
    // Calculate discounted price
    const originalPrice = product.price;
    const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);
    
    return {
      ...product,
      discount: discountPercentage,
      netPrice: discountedPrice,
      price: originalPrice, // Keep original price for comparison
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Header */}
      <div className="relative">
        <div 
          className="relative bg-gradient-to-r from-purple-900 to-purple-700 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '400px'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-20">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {banner.name}
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {banner.description}
              </p>
              
              {/* Banner Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    {products.length} Products
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg animate-pulse">
                  <Tag className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">
                    Special Offers
                  </span>
                </div>
                
                {banner.createdAt && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="text-white">
                      Since {new Date(banner.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {transformedProducts.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>
              <div className="h-px bg-gradient-to-r from-purple-200 to-transparent flex-1 ml-4" />
            </div>
            
            {/* Products Grid using ProductCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {transformedProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                />
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About This Collection
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {banner.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>• Exclusive discounts applied</span>
                <span>• Limited time offers</span>
                <span>• Premium quality products</span>
                <span>• Fast shipping available</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600 mb-8">
              This banner doesn't have any products yet. Check back later for updates.
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerPage;
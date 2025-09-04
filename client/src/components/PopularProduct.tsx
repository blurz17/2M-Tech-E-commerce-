import React from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Sparkles } from 'lucide-react';

interface PopularProductsProps {
  products: Product[];
  selectedCategory?: string;
  limit?: number; // Add optional limit prop
  showViewAll?: boolean; // Add optional prop to control view all button
}

const PopularProducts: React.FC<PopularProductsProps> = ({ 
  products, 
  selectedCategory, 
  limit = 50, 
  showViewAll = true 
}) => {
  // Apply limit only if specified and greater than 0
  const displayedProducts = limit > 0 ? products.slice(0, limit) : products;
  
  // Determine section title based on whether category is selected
  const sectionTitle = selectedCategory 
    ? `New ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(8)} Arrivals`
    : 'New Arrival Products';

  // Handle empty state
  if (products.length === 0) {
    return (
      <section className="container mx-auto my-8 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-purple-900">{sectionTitle}</h2>
          </div>
          {showViewAll && (
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        {/* Empty state */}
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {selectedCategory 
              ? `No new arrivals found in ${selectedCategory}` 
              : 'No new arrivals available'
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory 
              ? 'Try selecting a different category or check back later'
              : 'Check back later for exciting new arrivals'
            }
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto my-8 p-4">
      {/* Header section with title and link to view all products */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">{sectionTitle}</h2>
            {selectedCategory && (
              <p className="text-gray-600 text-sm mt-1">
                Showing {displayedProducts.length} of {products.length} new arrival{products.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        {showViewAll && (
          <Link 
            to={selectedCategory ? `/products?category=${selectedCategory}` : '/products'} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>View All {selectedCategory ? `${selectedCategory} Arrivals` : 'New Arrivals'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Grid for displaying products - Updated for better mobile layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
        {/* Map through the products and display each one using ProductCard component */}
        {displayedProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>

      {/* Enhanced "View All" button if there are more products than displayed */}
      {showViewAll && products.length > displayedProducts.length && (
        <div className="text-center mt-12">
          <div className="inline-flex flex-col items-center gap-3">
            <p className="text-gray-600 font-medium">
              Showing {displayedProducts.length} of {products.length} new arrivals
            </p>
            <Link 
              to={selectedCategory ? `/products?category=${selectedCategory}` : '/products'}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5" />
              <span>Discover All {products.length} {selectedCategory ? `${selectedCategory} ` : ''}New Arrivals</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default PopularProducts;
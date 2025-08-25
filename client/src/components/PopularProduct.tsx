import React from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

interface PopularProductsProps {
  products: Product[];
  selectedCategory?: string;
  limit?: number; // Add optional limit prop
  showViewAll?: boolean; // Add optional prop to control view all button
}

const PopularProducts: React.FC<PopularProductsProps> = ({ 
  products, 
  selectedCategory, 
  limit = 20, // Default to 8 products instead of 5
  showViewAll = true 
}) => {
  // Apply limit only if specified and greater than 0
  const displayedProducts = limit > 0 ? products.slice(0, limit) : products;
  
  // Determine section title based on whether category is selected
  const sectionTitle = selectedCategory 
    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(8)} Products`
    : 'Popular Products';

  // Handle empty state
  if (products.length === 0) {
    return (
      <section className="container mx-auto my-8 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-900">{sectionTitle}</h2>
          {showViewAll && (
            <Link to="/" className="text-purple-900 font-semibold hover:text-purple-700 transition-colors duration-200">
              View all products
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
              ? `No products found in ${selectedCategory}` 
              : 'No products available'
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory 
              ? 'Try selecting a different category or check back later'
              : 'Check back later for new arrivals'
            }
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto my-8 p-4">
      {/* Header section with title and link to view all products */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-purple-900">{sectionTitle}</h2>
          {selectedCategory && (
            <p className="text-gray-600 text-sm mt-1">
              Showing {displayedProducts.length} of {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {showViewAll && (
          <Link 
            to={selectedCategory ? `/products?category=${selectedCategory}` : '/products'} 
            className="text-purple-900 font-semibold hover:text-purple-700 transition-colors duration-200 flex items-center gap-1"
          >
            <span>View all {selectedCategory ? selectedCategory : 'products'}</span>
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

      {/* Show more button if there are more products than displayed */}
      {showViewAll && products.length > displayedProducts.length && (
        <div className="text-center mt-8">
          <Link 
            to={selectedCategory ? `/products?category=${selectedCategory}` : '/products'}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors duration-200"
          >
            <span>View All {products.length} {selectedCategory ? selectedCategory : 'Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default PopularProducts;

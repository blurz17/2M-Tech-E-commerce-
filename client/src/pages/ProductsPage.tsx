// client/src/pages/ProductsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/common/Pagination';
import SkeletonLoader from '../components/common/SkeletonLoader';

import { useAllProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import { Grid, List, Package } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });

  // When category is selected, fetch ALL products for that category (no pagination limit)
  // When no category is selected, use pagination
  const limit = selectedCategory ? 1000 : 50; // Fetch all products for selected category

  // Fetch products with updated query
  const { data, isLoading, isError } = useAllProductsQuery({
    page: selectedCategory ? 1 : currentPage, // Always page 1 when category is selected
    limit,
    sortBy,
    category: selectedCategory || undefined, // Pass category to API if selected
  });

  const products = data?.products || [];
  const totalPages = selectedCategory ? 1 : (data?.totalPages || 1); // Only 1 page when category selected

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (currentPage > 1 && !selectedCategory) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [selectedCategory, currentPage, setSearchParams]);

  // Filter products by category (this is now mainly for exact matching)
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    
    return products.filter(product => {
      const productCategory = product.category.toLowerCase().trim();
      const selectedCat = selectedCategory.toLowerCase().trim();
      
      // Exact match first, then partial match
      return productCategory === selectedCat || 
             productCategory.includes(selectedCat) ||
             selectedCat.includes(productCategory);
    });
  }, [products, selectedCategory]);

  // Paginate filtered products for category view (frontend pagination)
  const productsPerPage = 20;
  const categoryTotalPages = selectedCategory 
    ? Math.ceil(filteredProducts.length / productsPerPage)
    : totalPages;

  const paginatedProducts = useMemo(() => {
    if (!selectedCategory) return filteredProducts;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, selectedCategory]);

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-lg font-medium text-red-600">Error loading products</div>
          <div className="text-gray-500 mt-2">Please try again later</div>
        </div>
      </div>
    );
  }

  const displayProducts = paginatedProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
              : 'All Products'
            }
          </h1>
          <p className="text-gray-600">
            {selectedCategory 
              ? `Discover our ${selectedCategory} collection`
              : 'Discover our complete product collection'
            }
          </p>
        </div>

        {/* Collections Section */}
       

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {selectedCategory && ` in ${selectedCategory}`}
            </div>
            {selectedCategory && (
              <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                Showing all {selectedCategory} products
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Options */}
            <select
              value={`${sortBy.id}-${sortBy.desc}`}
              onChange={(e) => {
                const [id, desc] = e.target.value.split('-');
                setSortBy({ id, desc: desc === 'true' });
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="createdAt-true">Newest First</option>
              <option value="createdAt-false">Oldest First</option>
              <option value="price-false">Price: Low to High</option>
              <option value="price-true">Price: High to Low</option>
              <option value="name-false">Name: A to Z</option>
              <option value="name-true">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {displayProducts.length === 0 ? (
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
                ? 'Try selecting a different category or adjusting your filters'
                : 'Check back later for new arrivals'
              }
            </p>
            {selectedCategory && (
              <button
                onClick={() => handleCategorySelect('')}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <span>View All Products</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
              {displayProducts.map((product: Product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))}
            </div>

            {/* Pagination */}
            {categoryTotalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={categoryTotalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

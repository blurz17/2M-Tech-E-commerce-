// hooks/useProductFilters.ts
import { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types/api-types';
import { FilterState, FilterBrand, FilterCategory, FilterSubcategory } from './ProductFilters';

interface UseProductFiltersProps {
  products: Product[];
  brands: FilterBrand[];
  categories: FilterCategory[];
  subcategories: FilterSubcategory[];
  initialFilters?: Partial<FilterState>;
  maxPrice?: number;
}

export const useProductFilters = ({
  products,

  initialFilters = {},
  maxPrice = 50000
}: UseProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
    priceRange: [0, maxPrice],
    selectedBrands: [],
    selectedCategories: [],
    selectedSubcategories: [],
    showFeaturedOnly: false,
    hasDiscount: false,
    ...initialFilters
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Calculate maximum price from products
  const calculatedMaxPrice = useMemo(() => {
    if (products.length === 0) return maxPrice;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000;
  }, [products, maxPrice]);

  // Update price range if max price changes
  useEffect(() => {
    if (filters.priceRange[1] === maxPrice && calculatedMaxPrice !== maxPrice) {
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], calculatedMaxPrice]
      }));
    }
  }, [calculatedMaxPrice, maxPrice, filters.priceRange]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Featured filter
      if (filters.showFeaturedOnly && !product.featured) {
        return false;
      }

      // Discount filter (you can implement discount logic based on your product structure)
      if (filters.hasDiscount) {
        // Add your discount logic here
        // For example, if you have a discountPrice field:
        // if (!product.discountPrice || product.discountPrice >= product.price) return false;
      }

      // Brand filter
      if (filters.selectedBrands.length > 0) {
        const productBrandId = typeof product.brand === 'object' ? product.brand._id : product.brand;
        if (!filters.selectedBrands.includes(productBrandId)) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategories.length > 0) {
        let hasMatchingCategory = false;
        
        if (Array.isArray(product.categories)) {
          hasMatchingCategory = product.categories.some(cat => {
            const catId = typeof cat === 'object' ? cat._id : cat;
            return filters.selectedCategories.includes(catId);
          });
        } else if (product.category) {
          const catId = typeof product.category === 'object' ? product.category._id : product.category;
          hasMatchingCategory = filters.selectedCategories.includes(catId);
        }
        
        if (!hasMatchingCategory) return false;
      }

      // Subcategory filter
      if (filters.selectedSubcategories.length > 0) {
        let hasMatchingSubcategory = false;
        
        if (Array.isArray(product.subcategories)) {
          hasMatchingSubcategory = product.subcategories.some(subcat => {
            const subcatId = typeof subcat === 'object' ? subcat._id : subcat;
            return filters.selectedSubcategories.includes(subcatId);
          });
        } else if (product.subcategory) {
          const subcatId = typeof product.subcategory === 'object' ? product.subcategory._id : product.subcategory;
          hasMatchingSubcategory = filters.selectedSubcategories.includes(subcatId);
        }
        
        if (!hasMatchingSubcategory) return false;
      }

      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'discount':
        // Add discount sorting logic here
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    filters,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    productsPerPage,
    startIndex,
    maxPrice: calculatedMaxPrice,
    handleFiltersChange,
    handlePageChange,
    totalResults: filteredProducts.length
  };
};
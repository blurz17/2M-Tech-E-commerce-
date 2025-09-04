import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Star, Settings } from 'lucide-react';
import GearPriceControl from './GearPriceControl';

export interface FilterState {
  sortBy: string;
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  showFeaturedOnly: boolean;
  hasDiscount: boolean;
}

export interface FilterBrand {
  _id: string;
  name: string;
  image?: string;
}

export interface FilterCategory {
  _id: string;
  name: string;
  value: string;
}

export interface FilterSubcategory {
  _id: string;
  name: string;
  value: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  brands: FilterBrand[];
  categories: FilterCategory[];
  subcategories: FilterSubcategory[];
  maxPrice?: number;
  showSubcategories?: boolean;
  showCategories?: boolean;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  brands,
  categories,
  subcategories,
  maxPrice = 50000,
  showSubcategories = true,
  showCategories = false,
  className = ''
}) => {
  const [minPriceInput, setMinPriceInput] = useState(filters.priceRange[0].toString());
  const [maxPriceInput, setMaxPriceInput] = useState(filters.priceRange[1].toString());
  const [priceControlMode, setPriceControlMode] = useState<'preset' | 'manual' | 'gear'>('preset');

  // Update input values when filters change externally
  useEffect(() => {
    setMinPriceInput(filters.priceRange[0].toString());
    setMaxPriceInput(filters.priceRange[1].toString());
  }, [filters.priceRange]);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sortBy: 'newest',
      priceRange: [0, maxPrice],
      selectedBrands: [],
      selectedCategories: [],
      selectedSubcategories: [],
      showFeaturedOnly: false,
      hasDiscount: false
    });
    setPriceControlMode('preset');
  };

  const handleCustomPriceChange = () => {
    const minVal = Math.max(0, parseInt(minPriceInput) || 0);
    const maxVal = Math.max(minVal, parseInt(maxPriceInput) || maxPrice);
    
    updateFilters({ 
      priceRange: [minVal, maxVal] 
    });
  };

  const handlePricePreset = (min: number, max: number) => {
    updateFilters({ priceRange: [min, max] });
    setPriceControlMode('preset');
  };

  const handleGearPriceChange = (min: number, max: number) => {
    updateFilters({ priceRange: [min, max] });
  };

  const hasActiveFilters = 
    filters.selectedBrands.length > 0 ||
    filters.selectedCategories.length > 0 ||
    filters.selectedSubcategories.length > 0 ||
    filters.showFeaturedOnly ||
    filters.hasDiscount ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  // Price preset options
  const pricePresets = [
    { label: 'Under LE 1,000', min: 0, max: 1000 },
    { label: 'LE 1,000 - LE 5,000', min: 1000, max: 5000 },
    { label: 'LE 5,000 - LE 10,000', min: 5000, max: 10000 },
    { label: 'LE 10,000 - LE 25,000', min: 10000, max: 25000 },
    { label: 'Above LE 25,000', min: 25000, max: maxPrice }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sort By
          </label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured</option>
              <option value="name">A to Z</option>
              <option value="discount">Best Discount</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Filters
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.showFeaturedOnly}
                onChange={(e) => updateFilters({ showFeaturedOnly: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Featured Products</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.hasDiscount}
                onChange={(e) => updateFilters({ hasDiscount: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">On Sale</span>
            </label>
          </div>
        </div>

        {/* Enhanced Price Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex space-x-1">
              <button
                onClick={() => setPriceControlMode('preset')}
                className={`p-2 rounded-lg transition-colors ${
                  priceControlMode === 'preset' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title="Preset ranges"
              >
                <span className="text-xs">Preset</span>
              </button>
              <button
                onClick={() => setPriceControlMode('gear')}
                className={`p-2 rounded-lg transition-colors ${
                  priceControlMode === 'gear' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title="Gear controls"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPriceControlMode('manual')}
                className={`p-2 rounded-lg transition-colors ${
                  priceControlMode === 'manual' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title="Manual input"
              >
                <span className="text-xs">Manual</span>
              </button>
            </div>
          </div>

          {/* Current Price Display */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-medium text-purple-600">
                LE {filters.priceRange[0].toLocaleString()} - LE {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>

          {/* Price Control Modes */}
          {priceControlMode === 'gear' && (
            <GearPriceControl
              minValue={0}
              maxValue={maxPrice}
              currentMin={filters.priceRange[0]}
              currentMax={filters.priceRange[1]}
              onChange={handleGearPriceChange}
              className="mb-4"
            />
          )}

          {priceControlMode === 'manual' && (
            /* Custom Price Input */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Price (LE)</label>
                  <input
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    onBlur={handleCustomPriceChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomPriceChange()}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Price (LE)</label>
                  <input
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    onBlur={handleCustomPriceChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomPriceChange()}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={maxPrice.toString()}
                    min="0"
                  />
                </div>
              </div>
              <button
                onClick={handleCustomPriceChange}
                className="w-full text-sm bg-purple-100 text-purple-700 py-2.5 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              >
                Apply Price Range
              </button>
            </div>
          )}

          {priceControlMode === 'preset' && (
            /* Price Presets */
            <div className="space-y-2">
              {pricePresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePricePreset(preset.min, preset.max)}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Brands ({brands.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand._id} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.selectedBrands.includes(brand._id)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...filters.selectedBrands, brand._id]
                        : filters.selectedBrands.filter(id => id !== brand._id);
                      updateFilters({ selectedBrands: newBrands });
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {brand.image && (
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-6 h-6 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                      {brand.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {filters.selectedBrands.length > 0 && (
              <button
                onClick={() => updateFilters({ selectedBrands: [] })}
                className="text-xs text-gray-500 hover:text-red-500 mt-2 flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear brands ({filters.selectedBrands.length})</span>
              </button>
            )}
          </div>
        )}

        {/* Categories */}
        {showCategories && categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories ({categories.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <label key={category._id} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
checked={filters.selectedCategories.includes(category.name)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                      ? [...filters.selectedCategories, category.name]
                      : filters.selectedCategories.filter(name => name !== category.name);
                      updateFilters({ selectedCategories: newCategories });
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            {filters.selectedCategories.length > 0 && (
              <button
                onClick={() => updateFilters({ selectedCategories: [] })}
                className="text-xs text-gray-500 hover:text-red-500 mt-2 flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear categories ({filters.selectedCategories.length})</span>
              </button>
            )}
          </div>
        )}

        {/* Subcategories */}
        {showSubcategories && subcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subcategories ({subcategories.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {subcategories.map(subcategory => (
                <label key={subcategory._id} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.selectedSubcategories.includes(subcategory._id)}
                    onChange={(e) => {
                      const newSubcategories = e.target.checked
                        ? [...filters.selectedSubcategories, subcategory._id]
                        : filters.selectedSubcategories.filter(id => id !== subcategory._id);
                      updateFilters({ selectedSubcategories: newSubcategories });
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {subcategory.name}
                  </span>
                </label>
              ))}
            </div>
            {filters.selectedSubcategories.length > 0 && (
              <button
                onClick={() => updateFilters({ selectedSubcategories: [] })}
                className="text-xs text-gray-500 hover:text-red-500 mt-2 flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear subcategories ({filters.selectedSubcategories.length})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
import React, { useState } from 'react';
import { useGetAllCategoriesQuery } from '../redux/api/category.api';

import CategoryGrid from './collection_files/CategoryGrid'
import CollectionsStyles from './collection_files/CollectionsStyles';

const Collections: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetAllCategoriesQuery();
  const [currentTextIndex, ] = useState(0);

  // Dynamic text arrays for loading states
  const loadingTitles = [
    "Loading Collections...",
    "Preparing Your Experience...",
    "Fetching Premium Categories..."
  ];

  const loadingSubTexts = [
    "Please wait while we load our curated selection",
    "Setting up your personalized shopping experience",
    "Organizing our finest categories for you"
  ];

  if (isLoading) {
    return (
      <>
        <section className="w-full py-8 px-4 bg-white mt-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 animate-pulse">
                {loadingTitles[currentTextIndex % loadingTitles.length]}
              </h2>
              <p className="text-gray-600 text-base md:text-lg animate-pulse">
                {loadingSubTexts[currentTextIndex % loadingSubTexts.length]}
              </p>
            </div>
            
            {/* Loading Skeleton for Circular Categories */}
            <div className="flex gap-8 overflow-hidden px-12 py-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex-shrink-0 text-center animate-pulse">
                  <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gray-200 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mx-auto w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CollectionsStyles />
      </>
    );
  }

  if (error) {
    return (
      <>
        <section className="w-full py-8 px-4 bg-white mt-32">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Collections</h2>
            <p className="text-red-600 text-lg">Failed to load categories. Please try again later.</p>
          </div>
        </section>
        <CollectionsStyles />
      </>
    );
  }

  const categories = categoriesData?.categories || [];

  return (
    <>
      <section className="w-full relative bg-white mt-32">
       

        {/* Category Grid Section */}
        <div className="w-full">
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <CollectionsStyles />
    </>
  );
};

export default Collections;
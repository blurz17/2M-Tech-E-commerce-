import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Category } from '../../redux/api/category.api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Navigate to category page
  const handleCategoryClick = (category: Category) => {
    const slug = category.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/category/${slug}`);
  };

  // Filter categories that have images
  const categoriesWithImages = categories.filter(category => category.image);

  if (categoriesWithImages.length === 0) {
    return (
      <section className="w-full py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">No collections available at the moment.</p>
        </div>
      </section>
    );
  }

  // Create triple array for infinite scroll effect
  const infiniteCategories = [
    ...categoriesWithImages,
    ...categoriesWithImages,
    ...categoriesWithImages
  ];

  // Initialize scroll position to middle section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && categoriesWithImages.length > 0) {
      // Calculate item width (including gap)
      const itemWidth = 240; // Approximate width of each item including gap
      const middlePosition = categoriesWithImages.length * itemWidth;
      container.scrollLeft = middlePosition;
    }
  }, [categoriesWithImages]);

  // Handle infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const itemWidth = 240; // Approximate width of each item including gap
      const sectionWidth = categoriesWithImages.length * itemWidth;
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // If scrolled to the beginning (first section), jump to middle section
      if (scrollLeft <= 0) {
        setIsScrolling(true);
        container.scrollLeft = sectionWidth;
        setTimeout(() => setIsScrolling(false), 50);
      }
      // If scrolled to the end (third section), jump to middle section
      else if (scrollLeft >= scrollWidth - clientWidth - 10) {
        setIsScrolling(true);
        container.scrollLeft = sectionWidth;
        setTimeout(() => setIsScrolling(false), 50);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categoriesWithImages.length, isScrolling]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-8 bg-white relative">
      {/* Navigation Arrows */}
      <button
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 border border-gray-300 hover:scale-110"
      >
        <ChevronLeft className="w-7 h-7 text-gray-700" />
      </button>
      
      <button
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all duration-200 border border-gray-300 hover:scale-110"
      >
        <ChevronRight className="w-7 h-7 text-gray-700" />
      </button>

      <div className="max-w-7.5xl mx-auto">
        {/* Categories Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-6"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            paddingLeft: '2rem',
            paddingRight: '2rem'
          }}
        >
          {infiniteCategories.map((category, index) => (
            <div
              key={`${category._id}-${Math.floor(index / categoriesWithImages.length)}`}
              onClick={() => handleCategoryClick(category)}
              className="flex-shrink-0 text-center cursor-pointer group"
              style={{ 
                animationDelay: `${(index % categoriesWithImages.length) * 0.1}s`,
              }}
            >
              {/* Circular Image Container */}
              <div className="relative mx-auto mb-4">
                <div 
                  className="w-44 h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-full flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-gray-200 group-hover:border-blue-300"
                >
                  {/* Product Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
              </div>

              {/* Category Name */}
              <div className="text-center">
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors duration-300 max-w-32 mx-auto">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
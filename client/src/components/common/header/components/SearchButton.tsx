// client/src/components/common/Header/components/SearchButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchButton: React.FC = () => {
  return (
    <Link 
      to="/search" 
      className="flex items-center space-x-2 md:space-x-3 px-4 md:px-5 lg:px-6 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
    >
      <Search className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" />
      <span className="hidden sm:inline">Search</span>
    </Link>
  );
};

export default SearchButton;
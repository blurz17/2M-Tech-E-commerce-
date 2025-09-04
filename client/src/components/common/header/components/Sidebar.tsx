import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  LogOut, 
  ChevronRight,
} from 'lucide-react';
import {FaThLarge} from 'react-icons/fa';
import { navigationItems } from '../constants';
import { User as UserType } from '../types';
import { useGetAllCategoriesQuery } from '../../../../redux/api/category.api';
import { useGetSubcategoriesByCategoryQuery } from '../../../../redux/api/subcategory.api';
import { useConstants } from '../../../../hooks/useConstants';

import SocialMediaSection from './SocialMediaSection';

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onProfileHandler: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onClose,
  user,
  onProfileHandler,
  onLogout
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  // Use constants hook for dynamic values
  const { constants, isLoading: constantsLoading } = useConstants();

  // Fetch categories and subcategories
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Helper function to create consistent slugs (same as CategoryPage)
  const createSlug = (text: string): string => {
    return text.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    setExpandedCategories(newExpandedCategories);
  };

  // Category Item Component
  const CategoryItem: React.FC<{ category: any; index: number }> = ({ category, index }) => {
    const isExpanded = expandedCategories.has(category._id);
    const categorySlug = createSlug(category.name);
    
    // Fetch subcategories for this category
    const { data: subcategoriesData, isLoading: subcategoriesLoading } = useGetSubcategoriesByCategoryQuery(
      category._id,
      { skip: !isExpanded }
    );
    const subcategories = subcategoriesData?.subcategories || [];

    return (
      <motion.div
        key={category._id}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isCategoriesOpen ? 1 : 0, x: 0 }}
        transition={{ duration: 0.2, delay: isCategoriesOpen ? 0.05 * index : 0 }}
      >
        <div className="space-y-1">
          {/* Main Category */}
          <div className="flex items-center">
            <Link
              to={`/category/${categorySlug}`}
              onClick={onClose}
              className="flex-1 flex items-center space-x-3 p-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
            >
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-5 h-5 rounded object-cover flex-shrink-0"
                />
              ) : (
                  <FaThLarge className="w-3 h-3 text-blue-500" />
               
              )}
              <span className="font-medium">{category.name}</span>
            </Link>
            
            <button
              onClick={() => toggleCategoryExpansion(category._id)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors ml-1"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </button>
          </div>

          {/* Subcategories */}
          <div 
            className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            {subcategoriesLoading ? (
              <div className="p-2 text-xs text-slate-400">Loading...</div>
            ) : (
              subcategories.map((subcategory, subIndex) => {
                const subcategorySlug = createSlug(subcategory.name);
                return (
                  <motion.div
                    key={subcategory._id}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: 0 }}
                    transition={{ duration: 0.15, delay: isExpanded ? 0.03 * subIndex : 0 }}
                  >
                    <Link
                      to={`/category/${categorySlug}/${subcategorySlug}`}
                      onClick={onClose}
                      className="flex items-center space-x-2 p-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-purple-25 rounded-md transition-all duration-200 group"
                    >
                      {subcategory.image ? (
                        <img 
                          src={subcategory.image} 
                          alt={subcategory.name}
                          className="w-4 h-4 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-1 h-1 bg-purple-300 rounded-full flex-shrink-0 ml-1"></div>
                      )}
                      <span>{subcategory.name}</span>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Show loading state if constants are loading
  if (constantsLoading) {
    return (
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={onClose}
          />
        )}

        {/* Loading Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-40 flex flex-col overflow-hidden`}
        >
          <div className="animate-pulse p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg mb-2"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay - Works on ALL screen sizes, not just mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar with Smooth Transition */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-40 flex flex-col overflow-hidden`}
        style={{ height: '100vh' }}
        // Prevent clicks inside sidebar from closing it
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8"
                whileHover={{ scale: 1.1, rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <img 
                  src={constants.logo} 
                  alt={`${constants.companyName} Logo`}
                  className="w-full h-full rounded-lg object-cover transition-all duration-500 ease-out hover:brightness-110"
                />
              </motion.div>
              <motion.span 
                className="text-lg font-bold text-purple-600 tracking-tight"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {constants.companyName}
              </motion.span>
            </div>
            <motion.button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-purple-600" />
            </motion.button>
          </div>

          {/* Navigation Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            {/* Main Navigation Items */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                >
                  <Link 
                    to={item.to} 
                    onClick={onClose} 
                    className="flex items-center space-x-3 p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Product Categories Section */}
            <motion.div 
              className="border-t border-gray-100 pt-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {/* Categories Toggle Button */}
              <motion.button
                onClick={toggleCategories}
                className="flex items-center justify-between w-full p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <FaThLarge className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-medium">Product Categories</span>
                </div>
                <motion.div
                  animate={{ rotate: isCategoriesOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </motion.div>
              </motion.button>

              {/* Categories List with Smooth Transition */}
              <div 
               className={`ml-4 mt-2 space-y-1 overflow-y-auto transition-all duration-300 ease-in-out ${
                  isCategoriesOpen 
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
                  >
                    {categoriesLoading ? (
                  <div className="p-2 text-sm text-slate-500">Loading categories...</div>
                ) : categories.length > 0 ? (
                  categories.map((category, index) => (
                    <CategoryItem key={category._id} category={category} index={index} />
                  ))
                ) : (
                  <div className="p-2 text-sm text-slate-500">No categories available</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Social Media Section */}
          <div className="flex-shrink-0">
            <SocialMediaSection />
          </div>

          {/* User Section - Fixed at bottom */}
          <div className="border-t border-gray-100 p-6 space-y-2 flex-shrink-0 bg-white">
            <motion.button 
              className="flex items-center space-x-3 w-full p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200" 
              onClick={() => { 
                onProfileHandler(); 
                onClose(); 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-base font-medium">
                {user ? (user.role === 'admin' ? 'Admin Dashboard' : 'My Account') : 'Sign In'}
              </span>
            </motion.button>

            {user && (
              <motion.button
                onClick={() => { 
                  onLogout(); 
                  onClose(); 
                }}
                className="flex items-center space-x-3 w-full p-3 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-base font-medium">Sign Out</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
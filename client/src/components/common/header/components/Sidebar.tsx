import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  LogOut, 
  Grip, 
  ChevronRight,
  Camera,
  Laptop,
  Monitor,
  Printer,
  Mouse,
  Cable,
  HardDrive,
  Speaker,
  Keyboard,
  Package,
  Tv
} from 'lucide-react';
import { navigationItems } from '../constants';
import { User as UserType } from '../types';
import LocationSection from './LocationSection';
import SocialMediaSection from './SocialMediaSection';

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onProfileHandler: () => void;
  onLogout: () => void;
}

// Product categories with their routes and icons
const productCategories = [
  {
    label: 'Camera Security',
    route: 'category/camera-security',
    icon: Camera
  },
  {
    label: 'Laptop',
    route: 'category/laptop',
    icon: Laptop
  },
  {
    label: 'PC',
    route: 'category/pc',
    icon: Monitor
  },
  {
    label: 'Printer',
    route: 'category/printer',
    icon: Printer
  },
  {
    label: 'Mouse',
    route: 'category/mouse',
    icon: Mouse
  },
  {
    label: 'Cable',
    route: 'category/cabel',
    icon: Cable
  },
  {
    label: 'Hard Disk',
    route: 'category/hard-disk',
    icon: HardDrive
  },
  {
    label: 'Speaker',
    route: 'category/speaker',
    icon: Speaker
  },
  {
    label: 'Keyboard',
    route: 'category/keyboard',
    icon: Keyboard
  },
  {
    label: 'Accessories',
    route: 'category/accessories',
    icon: Package
  },
  {
    label: 'IPTV Receiver',
    route: 'category/iptv-receiver',
    icon: Tv
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onClose,
  user,
  onProfileHandler,
  onLogout
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Sliding Menu Panel */}
          <motion.div 
            className="absolute top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col min-h-full">
              {/* Header */}
              <motion.div 
                className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-8 h-8"
                    whileHover={{ scale: 1.1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <img 
                      src="/logo.svg" 
                      alt="2M Technology Logo" 
                      className="w-full h-full rounded-lg object-cover transition-all duration-500 ease-out hover:brightness-110"
                    />
                  </motion.div>
                  <motion.span 
                    className="text-lg font-bold text-purple-600 tracking-tight"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    2M Technology
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
              </motion.div>

              {/* Navigation Content */}
              <div className="flex-1 px-6 py-4 space-y-2">
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
                        <item.icon className="w-5 h-5 text-purple-600" />
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
                      <Grip className="w-5 h-5 text-purple-600" />
                      <span className="text-base font-medium">Product Categories</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isCategoriesOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  </motion.button>

                  {/* Categories List */}
                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-2 space-y-1">
                          {productCategories.map((category, index) => (
                            <motion.div
                              key={category.route}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ duration: 0.2, delay: 0.05 * index }}
                            >
                              <Link
                                to={category.route}
                                onClick={onClose}
                                className="flex items-center space-x-3 p-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
                              >
                                <category.icon className="w-4 h-4 text-purple-500 group-hover:text-purple-600" />
                                <span className="font-medium">{category.label}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Location Section */}
              <LocationSection />

              {/* Social Media Section */}
              <SocialMediaSection />

              {/* User Section */}
              <motion.div 
                className="border-t border-gray-100 p-6 space-y-2 mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.7 }}
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-base font-medium">Sign Out</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
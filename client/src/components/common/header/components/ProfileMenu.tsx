import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, LogOut, Package } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileMenuProps {
  user: UserType | null;
  isProfileMenuOpen: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement>;
  profileButtonRef: React.RefObject<HTMLDivElement>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  isProfileMenuOpen,
  profileMenuRef,
  profileButtonRef,
  handleMouseEnter,
  handleMouseLeave,
  onLogout
}) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center">
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={profileButtonRef}
      >
        <button
          className="flex items-center space-x-2 md:space-x-3 px-4 md:px-5 lg:px-6 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
          onClick={!user ? () => navigate('/auth') : undefined}
        >
          <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" />
          <span>
            {user ? 'Account' : 'Sign In'}
          </span>
          {user && (
            <motion.div
              animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" />
            </motion.div>
          )}
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isProfileMenuOpen && user && (
            <motion.div
              ref={profileMenuRef}
              className="absolute right-0 top-full mt-2 w-48 md:w-52 lg:w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-1 right-6 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              
              <motion.button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                <span>Profile</span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/my-orders')}
                className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                <span>My Orders</span>
              </motion.button>
              
              <div className="mx-2 my-1 h-px bg-gray-200"></div>
              
              <motion.button
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                <span>Sign Out</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileMenu;
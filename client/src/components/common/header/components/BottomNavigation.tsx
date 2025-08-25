import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { bottomNavigationItems } from '../constants';
import { User as UserType } from '../types';

interface BottomNavigationProps {
  user: UserType | null;
  onProfileHandler: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ user, onProfileHandler }) => {
  return (
    <>
      {/* Enhanced Professional Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30  backdrop-blur-md border-t border-gray-200/60 shadow-lg">
        <div className="grid grid-cols-4 px-2">
          {bottomNavigationItems.map((item) => (
            <motion.div key={item.to} whileTap={{ scale: 0.3 }}>
              <Link 
                to={item.to} 
                className="flex flex-col items-center justify-center py-2 px-1 min-h-[56px] text-slate-500 hover:text-purple-600 active:bg-purple-50 transition-all duration-200 rounded-lg group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[11px] font-medium mt-1 leading-tight">{item.label}</span>
              </Link>
            </motion.div>
          ))}

          <motion.button 
            onClick={onProfileHandler}
            className="flex flex-col items-center justify-center py-2 px-1 min-h-[56px] text-slate-500 hover:text-purple-600 active:bg-purple-50 transition-all duration-200 rounded-lg group"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <span className="text-[11px] font-medium mt-1 leading-tight">
              {user ? 'Account' : 'Sign In'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Single spacer for fixed header - Matches actual header height */}
<div className="h-16 md:h-20 lg:h-24"></div>

{/* Spacer for mobile bottom navigation - NO gap */}
<div className="md:hidden h-14 -mb-2"></div>

      {/* Mobile bottom navigation spacer - REMOVED to eliminate gap */}
    </>
  );
};

export default BottomNavigation;
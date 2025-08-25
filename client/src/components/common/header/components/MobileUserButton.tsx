import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface MobileUserButtonProps {
  onClick: () => void;
}

const MobileUserButton: React.FC<MobileUserButtonProps> = ({ onClick }) => {
  return (
    <div className="md:hidden">
      <motion.button 
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <User className="w-4 h-4 text-purple-600" />
      </motion.button>
    </div>
  );
};

export default MobileUserButton;
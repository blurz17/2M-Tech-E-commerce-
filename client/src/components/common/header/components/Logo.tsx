import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
  onLogoClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onLogoClick }) => {
  return (
    <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
      <Link to="/" onClick={onLogoClick} className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 group">
        <motion.div 
          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          whileHover={{ scale: 1.1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img 
            src="/logo.svg" 
            alt="2M Technology Logo" 
            className="w-full h-full rounded-lg object-cover transition-all duration-500 ease-out group-hover:brightness-110"
          />
        </motion.div>
        
        <div className="hidden sm:block">
          <motion.span 
            className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 hover:text-purple-400 tracking-tight cursor-pointer"
            whileHover={{ scale: 1.1, letterSpacing: "0.05em" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            2M Technology
          </motion.span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;


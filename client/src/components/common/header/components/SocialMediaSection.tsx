import React from 'react';
import { motion } from 'framer-motion';
import { socialLinks } from '../constants';

const SocialMediaSection: React.FC = () => {
  return (
    <motion.div 
      className="px-6 py-4 border-t border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <h4 className="text-sm font-semibold text-slate-900 mb-3">Connect With Us</h4>
      
      <div className="grid grid-cols-2 gap-2">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${social.bgColor} border border-gray-200`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <social.icon className={`w-4 h-4 ${social.color}`} />
            <span className="text-xs font-medium text-slate-700">{social.name}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SocialMediaSection;
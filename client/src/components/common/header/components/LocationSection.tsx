import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { COMPANY_ADDRESS, GOOGLE_MAPS_URL } from '../constants';

const LocationSection: React.FC = () => {
  const [showMap, setShowMap] = useState(false);

  const handleMapClick = () => {
    window.open(GOOGLE_MAPS_URL, '_blank');
  };

  return (
    <motion.div 
      className="px-6 py-4 border-t border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
        <MapPin className="w-4 h-4 text-purple-600 mr-2" />
        Our Location
      </h4>
      
      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
        {COMPANY_ADDRESS}
      </p>

      <div className="space-y-3">
        <motion.button 
          onClick={() => setShowMap(!showMap)}
          className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MapPin className="text-sm" />
          <span>{showMap ? 'Hide Map' : 'View Map'}</span>
        </motion.button>
        
        {showMap && (
          <motion.div 
            className="rounded-lg overflow-hidden border border-purple-200 shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-full h-[150px] cursor-pointer relative"
              onClick={handleMapClick}
            >
              <iframe
                src={GOOGLE_MAPS_URL}
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
              <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LocationSection;

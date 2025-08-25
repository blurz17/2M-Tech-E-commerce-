import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[1000px]">
      <div className="text-center">
        {/* Bigger spinner */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-900 mx-auto mb-8"></div>
        
        <p className="text-blue-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;

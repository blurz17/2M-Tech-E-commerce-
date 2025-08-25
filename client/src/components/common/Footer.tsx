import { useState } from 'react';
import { FaFacebook, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { IoIosMail, IoMdPin } from "react-icons/io";

const Footer = () => {
  const [showMap, setShowMap] = useState(false);

  const handleMapClick = () => {
    // On desktop, open in new window
    if (window.innerWidth > 768) {
      window.open('https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA', '_blank');
    }
  };

  return (
    <>
      
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border-t border-purple-500/30 text-gray-100 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

            {/* Company Info Section */}
            <div className='text-center space-y-4'>
              <div className="flex items-center justify-center space-x-3 group">
                <img 
                  src="/logo.svg" 
                  alt="2M Technology Logo" 
                  className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-sm text-gray-300">
                Atef Abd El-Latif, Mansoura Qism 2, El Mansoura, Dakahlia Governorate 7650164
              </p>

              {/* Modern Map Location */}
              <div className="space-y-3">
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
                >
                  <IoMdPin className="text-lg" />
                  <span>{showMap ? 'Hide Location' : 'View Location'}</span>
                </button>
                
                {showMap && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-purple-500/30 shadow-lg">
                    <div 
                      className="w-full h-[200px] cursor-pointer relative"
                      onClick={handleMapClick}
                    >
                      <iframe
                        src="https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA"
                        width="280"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      ></iframe>
                      {/* Overlay for desktop click detection */}
                      <div className="absolute inset-0 bg-transparent md:block hidden" />
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4 justify-center">
                <a href="https://www.facebook.com/share/19NUCkDMUg/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-3 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-all duration-300 hover:scale-110 border border-blue-500/20">
                  <FaFacebook className="text-xl text-blue-400" />
                </a>
                <a href="https://wa.me/201063166996?text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-3 bg-green-800/30 rounded-full hover:bg-green-700/50 transition-all duration-300 hover:scale-110 border border-green-500/20">
                  <FaWhatsapp className="text-xl text-green-400" />
                </a>
                <a href="https://m.me/102218348579766?source=qr_link_share&text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology" target="_blank" rel="noopener noreferrer" aria-label="Messenger" className="p-3 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-all duration-300 hover:scale-110 border border-blue-500/20">
                  <FaFacebookMessenger className="text-xl text-blue-400" />
                </a>
                <a href="mailto:2mtechnology17@gmail.com" aria-label="Email" className="p-3 bg-purple-800/30 rounded-full hover:bg-purple-700/50 transition-all duration-300 hover:scale-110 border border-purple-500/20">
                  <IoIosMail className="text-xl text-purple-400" />
                </a>
              </div>
            </div>

            {/* Get Help Links */}
            <div className='text-center space-y-4'>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Get Help</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">About Us</a></li>
              </ul>
            </div>

            {/* Demo Notice */}
            <div className='text-center space-y-4'>
              <h3 className="text-xl font-bold mb-4 text-orange-300">Demo Notice</h3>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                <p className="text-sm text-orange-200">
                  This is a demonstration website. All features and content are for preview purposes only.
                </p>
              </div>
            </div>

            {/* Placeholder for fourth column */}
            <div className='text-center space-y-4'>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Contact</h3>
              <p className="text-sm text-gray-300">
                For actual inquiries, please contact us through our official channels.
              </p>
            </div>

          </div>

         
        </div>
      </footer>
    </>
  );
};

export default Footer;
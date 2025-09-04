import { useConstants } from '../../hooks/useConstants';
import { useSocialLinks, useCompanyAddress } from './header/constants';

const Footer = () => {
  const { constants, isLoading } = useConstants();
  const socialLinks = useSocialLinks();
  const companyAddress = useCompanyAddress();

  // Show loading state for critical components
  if (isLoading) {
    return (
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border-t border-purple-500/30 text-gray-100 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border-t border-purple-500/30 text-gray-100 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

            {/* Company Info Section */}
            <div className='text-center space-y-4'>
              <div className="flex items-center justify-center space-x-3 group">
                <img 
                  src={constants.logo} 
                  alt={`${constants.companyName} Logo`} 
                  className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-sm text-gray-300">
                {companyAddress}
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-4 justify-center">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.name} 
                    className={`p-3 rounded-full transition-all duration-300 hover:scale-110 border ${social.bgColor}`}
                  >
                    <social.icon className={`text-xl ${social.color}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Get Help Links - Updated with all dynamic pages */}
            <div className='text-center space-y-4'>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Get Help</h3>
              <ul className="space-y-2">
                <li>
                  <a href="pages/about-us" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="pages/faq" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="pages/privacy-policy" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="pages/terms-conditions" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="pages/refund-policy" className="text-sm text-gray-300 hover:text-purple-300 transition-colors duration-300 hover:underline">
                    Refund Policy
                  </a>
                </li>
                 
               
              </ul>
            </div>

          

            {/* Contact Info */}
            <div className='text-center space-y-4'>
              <h3 className="text-xl font-bold mb-4 text-purple-300">Contact</h3>
              <div className="space-y-2">
                {constants.email && (
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Email:</span>{' '}
                    <a 
                      href={`mailto:${constants.email}`}
                      className="hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      {constants.email}
                    </a>
                  </p>
                )}
                {constants.phone && (
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Phone:</span>{' '}
                    <a 
                      href={`tel:${constants.phone}`}
                      className="hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      {constants.phone}
                    </a>
                  </p>
                )}
                {constants.website && (
                  <p className="text-sm text-gray-300">
                    <a 
                      href={constants.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-purple-300 transition-colors duration-300 hover:underline"
                    >
                      Visit Website
                    </a>
                  </p>

                  
                )}
                {(!constants.email && !constants.phone && !constants.website) && (
                  <p className="text-sm text-gray-300">
                    For actual inquiries, please contact us through our official channels.
                  </p>
                )}


              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
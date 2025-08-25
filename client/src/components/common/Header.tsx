import { signOut } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Menu, 
  Package, 
  ShoppingBag, 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  ChevronDown,
  LogOut,
  X,
  Info,
  MapPin,
  Facebook,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../firebaseConfig';
import { useLogoutUserMutation } from '../../redux/api/user.api';
import { userNotExists } from '../../redux/reducers/user.reducer';
import { RootState } from '../../redux/store';
import { notify } from '../../utils/util';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutUserMutation();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isSidebarOpen]);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar
  const closeSidebar = () => setIsSidebarOpen(false);

  // Handle map click
  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA', '_blank');
  };

  // Handle user logout
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      await logout().unwrap();
      dispatch(userNotExists());
      notify('Logout successful', 'success');
      navigate('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      notify(errorMessage, 'error');
    }
  };

  // Show profile menu on mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProfileMenuOpen(true);
  };

  // Hide profile menu on mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 200);
  };

  // Close profile menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Navigate to the appropriate profile page based on user role
  const profileHandler = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
        
      }
    } else {
      navigate('/auth');
    }
  };

  // Social media links data
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/19NUCkDMUg/',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/201063166996?text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'Messenger',
      url: 'https://m.me/102218348579766?source=qr_link_share&text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology',
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Email',
      url: 'mailto:2mtechnology17@gmail.com',
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'hover:bg-purple-50'
    }
  ];

  return (
    <>
      {/* Top Header - Enhanced with larger size for PC */}
      <header        
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${         
          isScrolled            
            ? 'bg-white/98 backdrop-blur-md border-b border-gray-200/80 shadow-sm'            
            : 'bg-white border-b border-gray-100'       
        }`}     
      >       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">         
          <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">           
            {/* Menu Button - Enhanced with hover effects and larger size for PC */}
            <div className="flex items-center">
              <motion.button 
                onClick={toggleSidebar} 
                className="p-2 md:p-3 lg:p-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Menu className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-600" />
              </motion.button>
            </div>

            {/* Logo - Center with enhanced transitions and larger size for PC */}           
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">             
              <Link to="/" onClick={closeSidebar} className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 group">
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

            {/* Right Side - Enhanced with smooth transitions and larger size for PC */}
            <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
              {/* Search Icon - Enhanced with larger size for PC */}
              <Link 
                to="/search" 
                className="flex items-center space-x-2 md:space-x-3 px-4 md:px-5 lg:px-6 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" />
                <span className="hidden sm:inline">Search</span>
              </Link>

              {/* Desktop User Menu - Enhanced with larger size for PC */}
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
                      {user ? (user.role === 'admin' ? 'Admin' : 'Account') : 'Sign In'}
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

                  {/* Dropdown Menu - Enhanced with larger size for PC */}
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
                        
                        {user.role === 'admin' ? (
                          <>
                            <motion.button
                              onClick={() => navigate('/admin')}
                              className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <User className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                              <span>Admin Dashboard</span>
                            </motion.button>
                            <div className="mx-2 my-1 h-px bg-gray-200"></div>
                            <motion.button
                              onClick={logoutHandler}
                              className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                              <span>Sign Out</span>
                            </motion.button>
                          </>
                        ) : (
                          <>
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
                              onClick={logoutHandler}
                              className="flex items-center space-x-3 w-full px-4 py-2.5 md:py-3 text-left text-sm md:text-base text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                              <span>Sign Out</span>
                            </motion.button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile User Button - Enhanced */}
              <div className="md:hidden">
                <motion.button 
                  onClick={profileHandler}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-4 h-4 text-purple-600" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay - Enhanced with Auth Page Transitions */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Sliding Menu Panel - Using Auth Page Transition Style */}
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
                    onClick={closeSidebar}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-purple-600" />
                  </motion.button>
                </motion.div>

                {/* Navigation Items - Enhanced with staggered animations like Auth Page */}
                <motion.div 
                  className="flex-1 px-6 py-4 space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {[
                    { to: "/", icon: Home, label: "Home" },
                    { to: "/search", icon: Search, label: "Search" },
                    { to: "/products", icon: ShoppingBag, label: "Products" },
                    { to: "/about", icon: Info, label: "About Us" },
                    { to: "/my-orders", icon: Package, label: "My Orders" },
                    { to: "/cart", icon: ShoppingCart, label: "Cart" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 * index }}
                    >
                      <Link 
                        to={item.to} 
                        onClick={closeSidebar} 
                        className="flex items-center space-x-3 p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                      >
                        <item.icon className="w-5 h-5 text-purple-600" />
                        <span className="text-base font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Location Section */}
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
                    Atef Abd El-Latif, Mansoura Qism 2, El Mansoura, Dakahlia Governorate 7650164
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
                            src="https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA"
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

                {/* Social Media Section */}
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

                {/* User Section - Enhanced with Auth Page Style Transitions */}
                <motion.div 
                  className="border-t border-gray-100 p-6 space-y-2 mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <motion.button 
                    className="flex items-center space-x-3 w-full p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200" 
                    onClick={() => { 
                      profileHandler(); 
                      closeSidebar(); 
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
                        logoutHandler(); 
                        closeSidebar(); 
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

      {/* Enhanced Professional Bottom Navigation Bar */}
    

      {/* Enhanced Professional Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-lg">
        <div className="grid grid-cols-4 px-2">
          {[
            { to: "/", icon: Home, label: "Home" },
            { to: "/products", icon: ShoppingBag, label: "Shop" },
            { to: "/cart", icon: ShoppingCart, label: "Cart" }
          ].map((item) => (
            <motion.div key={item.to} whileTap={{ scale: 0.95 }}>
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
            onClick={profileHandler}
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

    </>
  );
};

export default Header;
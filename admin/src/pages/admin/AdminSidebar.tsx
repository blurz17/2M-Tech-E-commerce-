import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { 
  FaBox, 
  FaSignOutAlt, 
  FaTimes, 
  FaUsers, 
  FaChevronDown, 
  FaChevronRight, 
  FaTags,
  FaThLarge,
  FaListAlt,
  FaTicketAlt,
  FaSitemap,
  FaLayerGroup
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { useLogoutUserMutation } from '../../redux/api/user.api';
import { userNotExists } from '../../redux/reducers/user.reducer';
import { notify } from '../../utils/util';
import { FaDollarSign } from 'react-icons/fa';
interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [logout] = useLogoutUserMutation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Check if any product route is active
  const isProductRouteActive = location.pathname === '/admin/products' || location.pathname === '/admin/featured';

  // Auto-expand products menu if on product routes
  React.useEffect(() => {
    if (isProductRouteActive) {
      setIsProductsOpen(true);
    }
  }, [isProductRouteActive]);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      await logout().unwrap();
      toggleSidebar();
      dispatch(userNotExists());
      notify('Logout successful', 'success');
      navigate('/auth');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      notify(errorMessage, 'error');
    }
  };

  const toggleProductsMenu = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Fixed full height */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block z-40 flex flex-col`}
        style={{ height: '100vh' }}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center p-4 border-b md:hidden flex-shrink-0">
          <h1 className="text-xl font-bold text-blue-900">2M Technology</h1>
          <button 
            onClick={toggleSidebar} 
            className="text-2xl text-gray-600 hover:text-gray-800 transition-colors p-1"
          >
            <FaTimes />
          </button>
        </div>

        {/* Logo and Home Link - Desktop */}
        <div className="flex-shrink-0 hidden md:block border-b border-gray-100">
          <Link to="/" onClick={toggleSidebar}>
            <div className="flex justify-start cursor-pointer p-4 py-6">
              <h1 className="text-xl font-bold text-blue-900">2M Technology</h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Scrollable Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-purple-600 font-semibold rounded-lg bg-purple-50 border border-purple-200' 
                  : 'flex items-center p-3 text-blue-800 er:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaThLarge className="mr-4 text-xl" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Dashboard</span>
            </NavLink>

            {/* Products Parent Menu */}
            <div>
              <button
                onClick={toggleProductsMenu}
                className={`flex items-center justify-between w-full p-3 text-left rounded-lg transition-all duration-200 ${
                  isProductRouteActive 
                    ? 'text-purple-600 font-semibold bg-purple-50 border border-purple-200' 
                    : 'text-red-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center">
                  <FaBox className="mr-4 text-xl" style={{ minWidth: '20px' }} />
                  <span className="text-base font-medium">Products</span>
                </div>
                {isProductsOpen ? 
                  <FaChevronDown className="text-lg transition-transform duration-300 ease-in-out text-red-900" /> : 
                  <FaChevronRight className="text-lg transition-transform duration-300 ease-in-out text-red-400" />
                }
              </button>
              
              {/* Submenu */}
              <div 
                className={`ml-8 mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  isProductsOpen 
                    ? 'max-h-40 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    isActive 
                      ? 'flex items-center p-2 pl-3 text-purple-600 font-medium rounded-md bg-purple-25 border-l-2 border-purple-400' 
                      : 'flex items-center p-2 pl-3 text-purple-900 hover:text-purple-600 hover:bg-purple-25 rounded-md transition-all duration-200'
                  }
                  onClick={toggleSidebar}
                >
                  <FaBox className="mr-3 text-lg" />
                  <span className="text-sm font-medium">All Products</span>
                </NavLink>
                
                <NavLink
                  to="/admin/featured"
                  className={({ isActive }) =>
                    isActive 
                      ? 'flex items-center p-2 pl-3 text-purple-600 font-medium rounded-md bg-purple-25 border-l-2 border-purple-400' 
                      : 'flex items-center p-2 pl-3 text-gray-600 hover:text-purple-600 hover:bg-purple-25 rounded-md transition-all duration-200'
                  }
                  onClick={toggleSidebar}
                >
                  <FaBox className="mr-3 text-lg text-cyan-500" />
                  <span className="text-sm font-medium">Featured Products</span>
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/admin/brands"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-blue-600 font-semibold rounded-lg bg-blue-50 border border-blue-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaTags className="mr-4 text-xl text-pink-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Brands</span>
            </NavLink>
            <NavLink
                to="/admin/currencies"
                className={({ isActive }) =>
                  isActive 
                    ? 'flex items-center p-3 text-green-600 font-semibold rounded-lg bg-green-50 border border-green-200' 
                    : 'flex items-center p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200'
                }
                onClick={toggleSidebar}
              >
                <FaDollarSign className="mr-4 text-xl text-green-500" style={{ minWidth: '20px' }} />
                <span className="text-base font-medium">Currencies</span>
              </NavLink>
                          

            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-green-600 font-semibold rounded-lg bg-green-50 border border-green-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaUsers className="mr-4 text-xl text-green-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Customers</span>
            </NavLink>

            <NavLink
              to="/admin/coupons"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-red-600 font-semibold rounded-lg bg-red-50 border border-red-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaTicketAlt className="mr-4 text-xl text-red-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Coupons</span>
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-teal-600 font-semibold rounded-lg bg-teal-50 border border-teal-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaSitemap className="mr-4 text-xl text-teal-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Categories</span>
            </NavLink>
            
            <NavLink
              to="/admin/subcategories"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-cyan-600 font-semibold rounded-lg bg-cyan-50 border border-cyan-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaLayerGroup className="mr-4 text-xl text-cyan-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">SubCategories</span>
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive 
                  ? 'flex items-center p-3 text-indigo-600 font-semibold rounded-lg bg-indigo-50 border border-indigo-200' 
                  : 'flex items-center p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200'
              }
              onClick={toggleSidebar}
            >
              <FaListAlt className="mr-4 text-xl text-indigo-500" style={{ minWidth: '20px' }} />
              <span className="text-base font-medium">Orders</span>
            </NavLink>
          </div>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white">
          <button 
            type='button' 
            onClick={logoutHandler} 
            className="flex items-center p-3 w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FaSignOutAlt className="mr-4 text-xl text-gray-500 hover:text-red-500 transition-colors" style={{ minWidth: '20px' }} />
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
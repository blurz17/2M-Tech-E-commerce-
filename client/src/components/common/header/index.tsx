import React from 'react';
import { signOut } from 'firebase/auth';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../../../firebaseConfig';
import { useLogoutUserMutation } from '../../../redux/api/user.api';
import { userNotExists } from '../../../redux/reducers/user.reducer';
import { RootState } from '../../../redux/store';
import { notify } from '../../../utils/util';

// Import custom hooks
import { useHeaderScroll } from './hooks/useHeaderScroll';
import { useSidebar } from './hooks/useSidebar';
import { useProfileMenu } from './hooks/useProfileMenu';

// Import components
import Logo from './components/Logo';
import SearchButton from './components/SearchButton';
import ProfileMenu from './components/ProfileMenu';
import MobileUserButton from './components/MobileUserButton';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';

const Header: React.FC = () => {
  const isScrolled = useHeaderScroll();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const {
    isProfileMenuOpen,
    profileMenuRef,
    profileButtonRef,
    handleMouseEnter,
    handleMouseLeave
  } = useProfileMenu();

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutUserMutation();

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

  return (
    <>
      {/* Top Header */}
      <header        
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${         
          isScrolled            
            ? 'bg-white/98 backdrop-blur-md border-b border-gray-200/80 shadow-sm'            
            : 'bg-white border-b border-gray-100'       
        }`}     
      >       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">         
          <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">           
            {/* Menu Button */}
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

            {/* Logo */}
            <Logo onLogoClick={closeSidebar} />

            {/* Right Side */}
            <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
              {/* Search Button */}
              <SearchButton />

              {/* Desktop Profile Menu */}
              <ProfileMenu
                user={user}
                isProfileMenuOpen={isProfileMenuOpen}
                profileMenuRef={profileMenuRef}
                profileButtonRef={profileButtonRef}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                onLogout={logoutHandler}
              />

              {/* Mobile User Button */}
              <MobileUserButton onClick={profileHandler} />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClose={closeSidebar}
        user={user}
        onProfileHandler={profileHandler}
        onLogout={logoutHandler}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        user={user}
        onProfileHandler={profileHandler}
      />
    </>
  );
};

export default Header;
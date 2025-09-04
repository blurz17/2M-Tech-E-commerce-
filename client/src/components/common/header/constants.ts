import {
    FaHome,
    FaSearch,
    FaStore,
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaFacebook,
    FaWhatsapp,
    FaFacebookMessenger,
    FaEnvelope
} from 'react-icons/fa';
import { NavigationItem, SocialLink } from './types';
import { useConstants } from '../../../hooks/useConstants';

export const navigationItems: NavigationItem[] = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/search", icon: FaSearch, label: "Search" },
  { to: "/products", icon: FaStore, label: "Products" },
  { to: "/about", icon: FaUsers, label: "About Us" },
  { to: "/my-orders", icon: FaBox, label: "My Orders" },
  { to: "/cart", icon: FaShoppingCart, label: "Cart" }
];

export const bottomNavigationItems: NavigationItem[] = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/products", icon: FaStore, label: "Shop" },
  { to: "/cart", icon: FaShoppingCart, label: "Cart" }
];

// Hook to get dynamic social links from constants
export const useSocialLinks = (): SocialLink[] => {
  const { constants } = useConstants();
  
  return [
    {
      name: 'Facebook',
      url: constants.facebook ,
      icon: FaFacebook,
      color: 'text-blue-400',
      bgColor: 'bg-blue-800/30 hover:bg-blue-700/50 border-blue-500/20'
    },
    {
      name: 'WhatsApp',
      url: constants.whatsapp ,
      icon: FaWhatsapp,
      color: 'text-green-400',
      bgColor: 'bg-green-800/30 hover:bg-green-700/50 border-green-500/20'
    },
    {
      name: 'Messenger',
      url: constants.facebook ? `https://m.me/${constants.facebook.split('/').pop()}?text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%20${constants.companyName}` : 'https://m.me/102218348579766?source=qr_link_share&text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology',
      icon: FaFacebookMessenger,
      color: 'text-blue-400',
      bgColor: 'bg-blue-800/30 hover:bg-blue-700/50 border-blue-500/20'
    },
    {
      name: 'Email',
      url: `mailto:${constants.email}`,
      icon: FaEnvelope,
      color: 'text-purple-400',
      bgColor: 'bg-purple-800/30 hover:bg-purple-700/50 border-purple-500/20'
    }
  ].filter(link => link.url !== 'mailto:'); // Filter out empty email links
};

// Hook to get company address from constants
export const useCompanyAddress = () => {
  const { constants } = useConstants();
  return constants.address;
};


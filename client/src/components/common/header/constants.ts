import {
    House,
    Search,
    ShoppingBag,
    Info,
    Package,
    ShoppingCart
} from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { IoIosMail } from "react-icons/io";
import { NavigationItem, SocialLink } from './types';

export const navigationItems: NavigationItem[] = [
  { to: "/", icon: House, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/products", icon: ShoppingBag, label: "Products" },
  { to: "/about", icon: Info, label: "About Us" },
  { to: "/my-orders", icon: Package, label: "My Orders" },
  { to: "/cart", icon: ShoppingCart, label: "Cart" }
];

export const bottomNavigationItems: NavigationItem[] = [
  { to: "/", icon: House, label: "Home" },
  { to: "/products", icon: ShoppingBag, label: "Shop" },
  { to: "/cart", icon: ShoppingCart, label: "Cart" }
];

export const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/19NUCkDMUg/',
    icon: FaFacebook,
    color: 'text-blue-400',
    bgColor: 'bg-blue-800/30 hover:bg-blue-700/50 border-blue-500/20'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/201063166996?text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology',
    icon: FaWhatsapp,
    color: 'text-green-400',
    bgColor: 'bg-green-800/30 hover:bg-green-700/50 border-green-500/20'
  },
  {
    name: 'Messenger',
    url: 'https://m.me/102218348579766?source=qr_link_share&text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology',
    icon: FaFacebookMessenger,
    color: 'text-blue-400',
    bgColor: 'bg-blue-800/30 hover:bg-blue-700/50 border-blue-500/20'
  },
  {
    name: 'Email',
    url: 'mailto:2mtechnology17@gmail.com',
    icon: IoIosMail,
    color: 'text-purple-400',
    bgColor: 'bg-purple-800/30 hover:bg-purple-700/50 border-purple-500/20'
  }
];

export const COMPANY_ADDRESS = "Atef Abd El-Latif, Mansoura Qism 2, El Mansoura, Dakahlia Governorate 7650164";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA";
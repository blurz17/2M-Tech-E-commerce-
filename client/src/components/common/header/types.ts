export interface User {
  role: 'admin' | 'user';
  // Add other user properties as needed
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export interface NavigationItem {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface HeaderProps {
  // Add any props if needed in the future
}
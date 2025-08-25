import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Settings, 
  Calendar,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Clock,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RootState } from '../redux/store';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  // Mock orders data - replace with actual API call
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        { name: 'Laptop Stand', quantity: 1, price: 149.99 },
        { name: 'Wireless Mouse', quantity: 2, price: 75.00 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      status: 'shipped',
      total: 89.99,
      items: [
        { name: 'USB-C Cable', quantity: 3, price: 29.99 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'processing',
      total: 199.99,
      items: [
        { name: 'Bluetooth Headphones', quantity: 1, price: 199.99 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
  };

  const handleSaveProfile = () => {
    // Implement API call to update profile
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <motion.button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 text-white">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <motion.img
              src={user.photoURL}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-purple-100 mb-2">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {user.provider}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-8">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPersonalInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                      <motion.button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </motion.button>
                    </div>
                  </div>

                  {showPersonalInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {isEditing ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Add phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                              type="text"
                              value={editForm.address}
                              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Add address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <motion.button
                              onClick={handleSaveProfile}
                              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <User className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <Mail className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Role</p>
                              <p className="font-medium capitalize">{user.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Date of Birth</p>
                              <p className="font-medium">{new Date(user.dob).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <User className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Gender</p>
                              <p className="font-medium capitalize">{user.gender}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Sign In Method</p>
                              <p className="font-medium capitalize">{user.provider}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">My Orders</h3>
                  <p className="text-gray-500">{mockOrders.length} orders</p>
                </div>

                {mockOrders.length > 0 ? (
                  <div className="space-y-4">
                    {mockOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 mb-3 md:mb-0">
                              <div className={`p-2 rounded-lg border ${getStatusColor(order.status)}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                                <p className="text-sm text-gray-500">
                                  Placed on {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Items:</h5>
                            <div className="space-y-2">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span className="text-gray-700">{item.name}</span>
                                    <span className="text-gray-500">× {item.quantity}</span>
                                  </div>
                                  <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <motion.button
                              className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Details
                            </motion.button>
                            {order.status === 'delivered' && (
                              <motion.button
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Reorder
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <motion.button
                      onClick={() => navigate('/products')}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Shopping
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Two-factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <motion.button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enable
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">Delete Account</p>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <motion.button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
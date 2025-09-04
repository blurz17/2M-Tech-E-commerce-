import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Calendar,
  Edit3,
  Save,
  X,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
  Upload
} from 'lucide-react';
import { RootState } from '../redux/store';
import { useMyOrdersQuery } from '../redux/api/order.api';
import { useUpdateProfileMutation } from '../redux/api/user.api';
import { userExists } from '../redux/reducers/user.reducer';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    gender: user?.gender || 'male'
  });

  // Fetch real orders from API
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useMyOrdersQuery('');
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('gender', editForm.gender);
      formData.append('dob', editForm.dob);
      
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const response = await updateProfile(formData).unwrap();
      
      if (response.success) {
        // Update Redux state with new user data
        dispatch(userExists(response.user));
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl('');
        // Show success message or toast
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message or toast
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      gender: user?.gender || 'male'
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': 
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': 
      case 'pending': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
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
            <div className="relative">
              <motion.img
                src={previewUrl || user.photoURL}
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              {isEditing && (
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </motion.button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-lg">Hello </span> 
                {isEditing ? editForm.name : user.name}
              </h1>
              <p className="text-purple-100 mb-2">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-8">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'orders', label: 'My Orders', icon: Package },
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
                    <motion.button
                      onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {isEditing ? (
                      <>
                        {/* Edit Form */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => handleEditFormChange('name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                          <input
                            type="date"
                            value={editForm.dob}
                            onChange={(e) => handleEditFormChange('dob', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Gender</label>
                          <select
                            value={editForm.gender}
                            onChange={(e) => handleEditFormChange('gender', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Profile Photo</label>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                              <motion.button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Upload className="w-4 h-4" />
                                <span>{selectedFile ? selectedFile.name : 'Choose new photo'}</span>
                              </motion.button>
                            </div>
                            {(previewUrl || selectedFile) && (
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                              />
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center space-x-4">
                          <motion.button
                            onClick={handleSaveProfile}
                            disabled={isUpdating}
                            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                          </motion.button>
                          <motion.button
                            onClick={handleCancelEdit}
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Display Mode */}
                        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                          <User className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{user.name}</p>
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
                          <User className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
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
                  {ordersData?.orders && (
                    <p className="text-gray-500">{ordersData.orders.length} orders</p>
                  )}
                </div>

                {ordersLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-12"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-600">Loading orders...</span>
                  </motion.div>
                ) : ordersError ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
                    <p className="text-gray-500 mb-6">There was an error loading your orders. Please try again.</p>
                    <motion.button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Retry
                    </motion.button>
                  </motion.div>
                ) : ordersData?.orders && ordersData.orders.length > 0 ? (
                  <div className="space-y-4">
                    {ordersData.orders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <motion.div
                          key={order._id}
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
                                <h4 className="font-semibold text-gray-900">Order #{order._id}</h4>
                                <p className="text-sm text-gray-500">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
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

                          {/* Order Items */}
                          {order.orderItems && order.orderItems.length > 0 && (
                            <div className="border-t border-gray-100 pt-4">
                              <h5 className="text-sm font-medium text-gray-900 mb-3">Items:</h5>
                              <div className="space-y-2">
                                {order.orderItems.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                      <span className="text-gray-700">{item.name}</span>
                                      <span className="text-gray-500">× {item.quantity}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <motion.button
                              onClick={() => navigate(`/order/${order._id}`)}
                              className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Details
                            </motion.button>
                            {order.status.toLowerCase() === 'delivered' && (
                              <motion.button
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/products')}
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
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
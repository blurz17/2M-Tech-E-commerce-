import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
// Import your animation files - adjust paths as needed
import ecommerceAnimation from '../assets/ecommerce-animation.json'; // Replace with your actual animation file

const AuthPage: React.FC = () => {
  // Changed default to true to show Sign Up first
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Lottie Animation */}
        <div className="hidden md:flex flex-col md:w-1/2 items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="w-full max-w-md px-8">
            <Lottie 
              animationData={ecommerceAnimation} 
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: 'auto' }}
            />
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                Welcome to 2M Technology
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Discover amazing products and enjoy a seamless shopping experience with us.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              2M Technology
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-sm lg:text-base"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your one-stop shop for all your needs
            </motion.p>
          </div>

          {/* Auth Form */}
          <motion.div
            key={isSignUp ? 'signup' : 'login'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isSignUp ? <Signup /> : <Login />}
          </motion.div>
          
          {/* Toggle Buttons - Professional Design */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              {isSignUp ? (
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Already have an account?
                  </p>
                  <motion.button
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => setIsSignUp(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In to Your Account
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm font-medium">
                    Don't have an account?
                  </p>
                  <motion.button
                    className="w-full bg-white border-2 border-green-600 text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => setIsSignUp(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create New Account
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

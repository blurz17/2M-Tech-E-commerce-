import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ADD THIS
import { auth } from '../../firebaseConfig';
import { useLoginUserMutation } from '../../redux/api/user.api';
import { userExists } from '../../redux/reducers/user.reducer';
import { AppDispatch, RootState } from '../../redux/store';
import { notify } from '../../utils/util';
import { motion } from 'framer-motion';
import {
    GoogleAuthProvider,
    UserCredential,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';

const LOGIN_SUCCESS = 'Login successful';
const LOGIN_FAILED = 'Login failed';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginUser] = useLoginUserMutation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); // ADD THIS
    
    // ADD THIS - Get current user from Redux for debugging
    const currentUser = useSelector((state: RootState) => state.user.user);
    
    console.log('Login Component - Current Redux User:', currentUser); // DEBUG

    // Enhanced response handler with manual navigation
    const handleResponse = async (userCredential: UserCredential, successMessage: string, failureMessage: string) => {
        try {
            console.log('=== STARTING LOGIN PROCESS ===');
            console.log('Getting ID token...');
            const idToken = await userCredential.user.getIdToken(true);
            
            console.log('Sending login request to server...');
            console.log('Server URL:', import.meta.env.VITE_SERVER_URL);
            
            const response = await loginUser({ idToken }).unwrap();
            
            console.log('=== SERVER RESPONSE ===', response);

            if (response.user) {
                console.log('=== DISPATCHING USER TO REDUX ===');
                console.log('User data:', response.user);
                
                dispatch(userExists(response.user));
                notify(successMessage, 'success');
                
                // FORCE NAVIGATION - Add manual redirect
                console.log('=== CHECKING USER ROLE FOR REDIRECT ===');
                if (response.user.role === 'admin') {
                    console.log('User is admin, redirecting to admin dashboard...');
                    setTimeout(() => {
                        navigate('/admin/dashboard', { replace: true });
                    }, 100); // Small delay to ensure Redux state updates
                } else {
                    console.log('User is not admin, staying on auth page');
                    notify('Access denied. Admin privileges required.', 'error');
                }
            } else {
                console.error('No user in response:', response);
                notify(failureMessage, 'error');
            }
        } catch (error: any) {
            console.error('=== LOGIN ERROR ===', {
                error,
                message: error?.message,
                data: error?.data,
                status: error?.status
            });
            
            let errorMessage = 'An unknown error occurred';
            
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            if (error?.status === 401) {
                errorMessage = 'Authentication failed. Please try again.';
            } else if (error?.status === 403) {
                errorMessage = 'Access denied. Please contact support.';
            } else if (error?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            notify(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        console.log('=== STARTING GOOGLE LOGIN ===');
        
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            console.log('Opening Google popup...');
            const userCredential = await signInWithPopup(auth, provider);
            
            console.log('Google popup auth successful, user:', userCredential.user.email);
            
            await handleResponse(userCredential, LOGIN_SUCCESS, LOGIN_FAILED);
        } catch (error: unknown) {
            console.error('Google login error:', error);
            setIsLoading(false);
            
            let errorMessage = 'Google sign-in failed';
            
            if (error instanceof Error) {
                const firebaseError = error as any;
                switch (firebaseError.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Sign-in was cancelled';
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = 'Popup was blocked. Please allow popups and try again.';
                        break;
                    case 'auth/cancelled-popup-request':
                        errorMessage = 'Another sign-in popup is already open';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your connection.';
                        break;
                    default:
                        errorMessage = error.message || 'Google sign-in failed';
                }
            }
            
            notify(errorMessage, 'error');
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            notify('Email and password are required', 'error');
            return;
        }
        
        setIsLoading(true);
        console.log('=== STARTING EMAIL/PASSWORD LOGIN ===');
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase email/password auth successful');
            await handleResponse(userCredential, LOGIN_SUCCESS, LOGIN_FAILED);
        } catch (error: unknown) {
            console.error('Firebase email/password auth error:', error);
            setIsLoading(false);
            
            if (error instanceof Error) {
                notify(error.message, 'error');
            } else {
                notify('Email/password login failed', 'error');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-6">
                <h4 className="text-xl font-bold text-center mb-8">Login</h4>
                
                {/* DEBUG INFO - SHOW CURRENT STATE */}
                {import.meta.env.DEV && (
                    <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-xs">
                        <div className="font-bold mb-2">🐛 DEBUG INFO:</div>
                        <div>Server: {import.meta.env.VITE_SERVER_URL}</div>
                        <div>Environment: {import.meta.env.MODE}</div>
                        <div>Current User: {currentUser ? JSON.stringify(currentUser, null, 2) : 'None'}</div>
                        <div>User Role: {currentUser?.role || 'N/A'}</div>
                        <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
                    </div>
                )}
                
                {/* MANUAL ADMIN REDIRECT BUTTON - FOR TESTING */}
                {import.meta.env.DEV && currentUser && (
                    <div className="mb-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm"
                        >
                            🚀 FORCE REDIRECT TO ADMIN (TEST)
                        </button>
                    </div>
                )}
                
                <div className="mb-6">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
                        <button
                            className={`flex items-center justify-center text-gray-700 font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 shadow-md bg-white hover:bg-gray-100 gap-2 w-full border border-gray-300 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <FcGoogle className='text-2xl' />
                            {isLoading ? 'Signing in...' : 'Continue with Google'}
                        </button>
                    </motion.div>
                </div>

                <div className="mb-6 flex items-center justify-center">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <motion.div whileHover={{ y: -2 }} className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-shadow"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter your email"
                    />
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition-shadow"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="Enter your password"
                    />
                </motion.div>

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2 cursor-pointer"
                        disabled={isLoading}
                    />
                    <label htmlFor="showPassword" className="text-sm text-gray-600">Show Password</label>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login with Email'}
                    </button>
                </motion.div>

                <div className="mt-4 text-center">
                    <motion.a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 1.05 }}
                    >
                        Forgot Password?
                    </motion.a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
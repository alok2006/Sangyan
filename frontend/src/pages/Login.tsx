import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiSparkles, HiArrowLeft } from 'react-icons/hi';
import { Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import React from 'react';

// NOTE: We rely on the AuthContext's axios instance for most authenticated calls.
// Since login is unauthenticated, we'll use a local axios call or assume a direct path.
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Base API URL for reference

const Login = () => {
    // --- State Hooks ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // --- Context & Router Hooks ---
    const navigate = useNavigate();
    // Get refreshUserData from context to update app state upon successful login
    const { refreshUserData } = useAuth(); 

    const handleEmailLogin = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please fill in both email and password.');
            return;
        }

        setLoading(true);
        try {
            // --- STEP 1: Authenticate and get JWT Token ---
            // Use standard axios call to the token endpoint
            const response = await axios.post(`${API_BASE_URL}/token/`, {
                email: email, // Your User model uses 'email' as the USERNAME_FIELD
                password: password,
            });

            const { access } = response.data; // Assuming simplejwt returns 'access'

            if (access) {
                // --- STEP 2: Store Token and Update Context ---
                localStorage.setItem('authToken', access); 
                
                // Fetch detailed user data and update the global state via context
                await refreshUserData(); 

                toast.success('Welcome back! 🎉');
                navigate('/');
            } else {
                // This shouldn't happen with standard simplejwt, but catches generic success/no-token issues
                throw new Error("Login failed to retrieve authentication token.");
            }
        } catch (error) {
            console.error('Login error:', error);
            const axiosError = error as AxiosError;
            const errorData = axiosError.response?.data as any;
            
            // Handle specific DRF/JWT errors
            if (axiosError.response?.status === 401) {
                // Default message for Invalid Credentials
                toast.error(errorData?.detail || 'Invalid email or password.');
            } else if (axiosError.response?.status === 400) {
                 // May catch validation errors (e.g., missing fields)
                toast.error(errorData?.detail || 'Login failed due to missing information.');
            } else {
                toast.error('Failed to connect to the server. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        
        // --- Placeholder for Django Social Auth Flow ---
        toast('Google login now requires Django social authentication setup. Redirecting...');
        
        try {
            // This would trigger an OAuth flow, ideally handled by the Django backend
            // For example: window.location.href = `${API_BASE_URL}/auth/o/google-oauth2/`;
            
            setTimeout(() => {
                // In a real app, successful redirect with token would trigger refreshUserData
                // toast.success('Google login flow started! Check your Django setup.');
            }, 1000);
            
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Failed to initiate login with Google.');
        } finally {
            // Loading is often kept until the final context update after redirect
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 animate-blob"></div>
                <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-md animate-slide-in-right">
                {/* Logo Header */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <Link to="/" className="inline-flex items-center space-x-3 group pt-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                                <Lightbulb className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                            Sangyan
                        </span>
                        <HiSparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-white">Welcome Back!</h2>
                    <p className="mt-2 text-gray-400">Sign in to continue your journey</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 p-8 animate-fade-in-up animation-delay-200">
                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="w-6 h-6" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800/50 text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <HiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <HiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-sm text-gray-500 hover:text-gray-400 transition-colors inline-flex items-center mt-2"
                        >
                            <HiArrowLeft className="w-4 h-4 mr-1" /> Back to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
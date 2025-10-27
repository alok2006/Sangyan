import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiSparkles, HiArrowLeft } from 'react-icons/hi';
import { Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import React from 'react';


const Login = () => {
    // --- State Hooks ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // --- Context & Router Hooks ---
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleEmailLogin = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please fill in both email and password.');
            return;
        }

        setLoading(true);
        try {
            // Use the centralized login function from AuthContext
            const success = await login(email, password); 

            if (success) {
                toast.success('Welcome back! 🎉');
                navigate('/');
            } else {
                // The login function in AuthContext returns false on failure.
                // Since AuthContext doesn't toast, we provide a generic error here.
                // (The AuthContext console logs the specific API error.)
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            // This catch block handles unexpected errors (e.g., code crash, not API errors)
            console.error('Unexpected Login Error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        toast('Google login now requires Django social authentication setup. Redirecting...');
        
        try {
            // --- Placeholder for Django Social Auth Flow ---
            // The actual implementation would redirect the user and complete the login via the backend.
            
            setTimeout(() => {
                // toast.success('Google login flow initiated.');
            }, 1000);
            
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Failed to initiate login with Google.');
        } finally {
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
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { 
     HiLockClosed, HiEye, HiUser, HiSparkles} from 'react-icons/hi2'; // Using Hi2 for new icons
import { Lightbulb, Building2, BookOpen, MailIcon, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { HiEyeOff } from 'react-icons/hi';

// Assuming the API base URL is defined consistently
// const API_BASE_URL = 'http://localhost:8000/api/'; // Use /api/v1/

const Signup = () => {
    // --- State Hooks ---
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        institute: '', // New required field
        course: '',    // New required field
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- Context & Router Hooks ---
    const navigate = useNavigate();
    const { refreshUserData } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.institute || !formData.course) {
            toast.error('Please fill in all required fields (Username, Name, Email, Password, Institute, Course)');
            return false;
        }

        if (formData.name.length < 2) {
            toast.error('Name must be at least 2 characters');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleEmailSignup = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const nameParts = formData.name.trim().split(/\s+/);
            const firstName = nameParts[0];
            // Use the rest of the name as last name, or '.' if only one word (required by Django)
            const lastName = nameParts.slice(1).join(' ') || '.'; 
            
            // --- STEP 1: Register User via Django REST Endpoint ---
            const payload = {
                // Django REQUIRED_FIELDS: 'username', 'first_name', 'last_name'
                email: formData.email,
                username: formData.username,
                first_name: firstName,
                last_name: lastName, 
                password: formData.password,
                
                // Custom fields
                institute: formData.institute,
                course: formData.course,
                displayName: formData.name, // Mapping 'name' to the custom 'displayName' field
            };
            
            // POST to UserViewSet registration endpoint (e.g., /api/v1/users/)
            await axios.post(`/api/users/`, payload);

            // --- STEP 2: Log the User In Immediately (Get the token) ---
            // Assuming your Django simplejwt setup uses the standard /token/ endpoint
            const loginResponse = await axios.post(`/api/token/`, {
                email: formData.email, 
                password: formData.password,
            });

            const { access } = loginResponse.data; 

            if (access) {
                // --- STEP 3: Store Token and Update Context ---
                localStorage.setItem('authToken', access);
                await refreshUserData(); 

                toast.success('Account created successfully! 🎉 Welcome to Sangyan!');
                navigate('/');
            } else {
                throw new Error("Registration successful, but failed to retrieve login token.");
            }
        } catch (error) {
            console.error('Signup error:', error);
            const axiosError = error as AxiosError;
            const errorData = axiosError.response?.data as any;
            
            // Handle specific DRF validation errors
            if (axiosError.response?.status === 400 && errorData) {
                let errorMessage = 'Failed to create account. Please correct the following errors:';
                
                // Concatenate specific DRF error messages for a clearer toast
                if (errorData.email) errorMessage += `\n- Email: ${errorData.email.join(', ')}`;
                if (errorData.username) errorMessage += `\n- Username: ${errorData.username.join(', ')}`;
                if (errorData.password) errorMessage += `\n- Password: ${errorData.password.join(', ')}`;
                if (errorData.first_name) errorMessage += `\n- First name: ${errorData.first_name.join(', ')}`;
                if (errorData.last_name) errorMessage += `\n- Last name: ${errorData.last_name.join(', ')}`;
                
                // Custom fields errors
                if (errorData.institute) errorMessage += `\n- Institute: ${errorData.institute.join(', ')}`;
                if (errorData.course) errorMessage += `\n- Course: ${errorData.course.join(', ')}`;
                if (errorData.non_field_errors) errorMessage += `\n- General: ${errorData.non_field_errors.join(', ')}`;
                
                toast.error(errorMessage);
            } else {
                // Network or unexpected error
                if (axiosError.request && !axiosError.response) {
                    toast.error('Network error: failed to reach the server. Check your connection.');
                } else {
                    //@ts-ignore
                    toast.error(axiosError.response?.data?.detail || 'Failed to create account. Please check network or try again.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        toast('Google signup now requires Django social authentication setup. Redirecting...');
        // Placeholder implementation for social login
        try {
            // window.location.href = `${API_BASE_URL}/auth/o/google-oauth2/`;
            setTimeout(() => {
                toast.success('Google signup flow started! Check your Django setup.');
            }, 1000);
        } catch (error) {
            console.error('Google signup error:', error);
            toast.error('Failed to initiate signup with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background Elements (Unchanged) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 animate-blob"></div>
                <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-md animate-slide-in-left">
                {/* Logo Header (Unchanged) */}
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
                    <h2 className="mt-6 text-2xl font-bold text-white">Create Your Account</h2>
                    <p className="mt-2 text-gray-400">Join the IISER Berhampur community</p>
                </div>

                {/* Signup Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 p-8 animate-fade-in-up animation-delay-200">
                    
                    {/* Google Signup Button (Unchanged) */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="w-6 h-6" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider (Unchanged) */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800/50 text-gray-400">Or sign up with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form (Refactored to include Institute/Course) */}
                    <form onSubmit={handleEmailSignup} className="space-y-5">
                        
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username Input (required by Django User model) */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Username *
                            </label>
                            <div className="relative">
                                <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={(formData as any).username}
                                    onChange={handleChange}
                                    placeholder="choose a username"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email address *
                            </label>
                            <div className="relative">
                                <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Institute Input (New Field) */}
                        <div>
                            <label htmlFor="institute" className="block text-sm font-medium text-gray-300 mb-2">
                                Institute/University *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="institute"
                                    type="text"
                                    name="institute"
                                    value={formData.institute}
                                    onChange={handleChange}
                                    placeholder="e.g., IISER Berhampur"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Course Input (New Field) */}
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-2">
                                Course/Program *
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="course"
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    placeholder="e.g., BS-MS Dual Degree"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <HiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <HiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <HiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions (Unchanged) */}
                        <div className="text-sm text-gray-400">
                            By signing up, you agree to our{' '}
                            <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
                                Privacy Policy
                            </Link>
                        </div>

                        {/* Submit Button (Unchanged) */}
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
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    {/* Login Link (Unchanged) */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Lightbulb, Menu, X, Sparkles, LogOut, Settings,
    ChevronDown, UserCircle, Bell, Gem, LogIn, ExternalLink, Sun, Moon
} from 'lucide-react'; // Added ExternalLink for better profile button icon
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userData, signOut } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- State and Handlers ---

    // Close profile dropdown if mobile menu is opened
    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsProfileDropdownOpen(false);
        }
    }, [isMobileMenuOpen]);

    // Handle outside clicks to close the desktop dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const publicLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Team', path: '/team' },
    ];

    const authenticatedLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'Events', path: '/events' },
        { name: 'About', path: '/about' },
    ];

    const navLinks = user ? authenticatedLinks : publicLinks;
    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsProfileDropdownOpen(false);
            setIsMobileMenuOpen(false);
            navigate('/');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Member';
    const userPhotoURL = user?.photoURL;
    const parasStones = userData?.parasStones ?? 0;
    const rupeeValue = (parasStones / 100).toFixed(2);


    return (
        <>
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-cyan-500/30' // Sharper shadow and border
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20"> {/* Increased height for visual weight */}
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative p-0.5 bg-cyan-600/10 rounded-full border border-cyan-500/30">
                                <Lightbulb className="w-7 h-7 text-cyan-400 transition-transform group-hover:rotate-12" />
                            </div>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
                                Sangyan
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2.5 text-base font-semibold transition-all duration-300 rounded-xl ${
                                        isActive(link.path) 
                                            ? 'text-white bg-blue-500/20 shadow-inner shadow-blue-500/10' 
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                                    }`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <motion.div
                                            className="absolute bottom-0 left-1/2 w-4 h-1 bg-cyan-400 rounded-full -translate-x-1/2"
                                            layoutId="underline"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Paras Stones Display (Better visual) */}
                            {user && userData && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-full cursor-pointer transition-all hover:bg-amber-500/20"
                                    onClick={() => handleNavigation('/paras-wallet')}
                                >
                                    <Gem className="w-4 h-4 text-amber-400 animate-bounce-slow" />
                                    <span className="text-sm font-bold text-amber-100">{parasStones.toLocaleString()}</span>
                                </motion.div>
                            )}
                             {/* Notifications Button */}
                            {user && (
                                <button
                                    onClick={() => handleNavigation('/notifications')}
                                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-full transition-all"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                            )}

                            {user ? (
                                /* Authenticated Profile Dropdown */
                                <div className="relative z-50" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-full border-2 ${
                                            isProfileDropdownOpen 
                                                ? 'bg-slate-800 border-cyan-400/50 text-white' 
                                                : 'bg-slate-800/50 border-transparent hover:border-slate-700 text-slate-300 hover:text-white'
                                        }`}
                                    >
                                        {/* 🎯 FIX: Use photoURL for profile image */}
                                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                                            {userPhotoURL ? (
                                                <img src={userPhotoURL} alt={userDisplayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircle className="w-5 h-5 text-cyan-400" />
                                            )}
                                        </div>
                                        {/* 🎯 FIX: Display Name */}
                                        <span className='hidden lg:inline'>{userDisplayName.split(' ')[0]}</span> 
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu Content (Desktop) */}
                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-3 w-64 bg-slate-900 border border-cyan-500/20 rounded-xl shadow-2xl shadow-blue-500/10 overflow-hidden"
                                            >
                                                {/* User Info & Stones Summary */}
                                                <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                                                    <p className="text-sm font-semibold text-white truncate">{userDisplayName}</p>
                                                    <p className="text-xs text-cyan-400 mt-0.5">{user.email}</p>
                                                </div>
                                                {userData && (
                                                    <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-slate-800">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2"> <Gem className="w-4 h-4 text-amber-400" /> <span className="text-xs text-amber-300 font-semibold">Paras Stones</span> </div>
                                                            <span className="text-base font-bold text-amber-100">{parasStones.toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-xs text-amber-300/60 mt-1">Value: **₹{rupeeValue}**</p>
                                                    </div>
                                                )}
                                                {/* Menu Items */}
                                                <div className="py-2">
                                                    <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"> <UserCircle className="w-4 h-4 text-cyan-400" /> <span>Profile</span> </button>
                                                    <button onClick={() => handleNavigation('/paras-wallet')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"> <Gem className="w-4 h-4 text-amber-400" /> <span>Paras Wallet</span> </button>
                                                    <button onClick={() => handleNavigation('/settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"> <Settings className="w-4 h-4" /> <span>Settings</span> </button>
                                                </div>
                                                <div className="py-1 border-t border-slate-800">
                                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"> <LogOut className="w-4 h-4" /> <span>Sign Out</span> </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                /* UN-AUTHENTICATED: Sign In & Sign Up Buttons (Desktop) */
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full transition-all duration-200 flex items-center gap-2"
                                    >
                                        <LogIn className='w-4 h-4' /> Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md shadow-blue-500/30"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-slate-900/98 border-t border-cyan-500/20 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-1">
                                
                                {/* User Info Header Mobile */}
                                {user && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/70 rounded-lg mb-3 border border-slate-700">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                                            {userPhotoURL ? (
                                                <img src={userPhotoURL} alt={userDisplayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircle className="w-6 h-6 text-cyan-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{userDisplayName}</p>
                                            <p className="text-xs text-cyan-400">{user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Nav Links */}
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => handleNavigation(link.path)}
                                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                                            isActive(link.path) ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {user ? (
                                    /* Mobile Authenticated Menu */
                                    <div className="pt-3 mt-3 border-t border-slate-800 space-y-1">
                                        <div
                                            onClick={() => handleNavigation('/paras-wallet')}
                                            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer bg-gradient-to-r from-amber-500/5 to-yellow-500/5"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Gem className="w-5 h-5 text-amber-400" /> <span>Paras Wallet</span>
                                            </span>
                                            <span className="text-sm font-bold text-amber-100">{parasStones.toLocaleString()}</span>
                                        </div>
                                        
                                        <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                            <UserCircle className="w-5 h-5" /> <span>Profile</span>
                                        </button>
                                        <button onClick={() => handleNavigation('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                            <Settings className="w-5 h-5" /> <span>Settings</span>
                                        </button>
                                        
                                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                                            <LogOut className="w-5 h-5" /> <span>Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* Mobile Unauthenticated Buttons */
                                    <div className="pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                                        >
                                            <LogIn className="w-5 h-5" /> <span>Sign In</span>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full px-4 py-3 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Navbar;
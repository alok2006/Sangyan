import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Lightbulb, Menu, X, Search, Sparkles, LogOut, User as UserIcon, Settings,
    ChevronDown, UserCircle, Bell, Gem, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userData, signOut } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Effects & Handlers ---
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { name: 'Blogs', path: '/blog' },
        { name: 'Events', path: '/events' },
        { name: 'Resources', path: '/resources' },
        { name: 'About', path: '/about' },
        { name: 'Team', path: '/team' },
        { name: 'Membership', path: '/membership' },
    ];

    const navLinks = user ? authenticatedLinks : publicLinks;
    const isActive = (path: string) => location.pathname === path;

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsProfileDropdownOpen(false);
            setIsMobileMenuOpen(false); // Close mobile menu on sign out
            navigate('/');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsProfileDropdownOpen(false);
    };

    const handleSettingsClick = () => {
        navigate('/settings');
        setIsProfileDropdownOpen(false);
    };

    const parasStones = userData?.parasStones ?? 0;
    const rupeeValue = (parasStones / 100).toFixed(2);

    return (
        <>
            {/* Search Modal (Simplified for brevity) */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-blue-500/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Search className="w-5 h-5 text-blue-400" />
                            <input
                                type="text"
                                placeholder="Search Sangyan..."
                                className="flex-1 bg-transparent text-white text-sm placeholder-slate-400 outline-none"
                                autoFocus
                            />
                            <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-blue-500/20'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <Lightbulb className="w-7 h-7 text-blue-400 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                                <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Sangyan
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                        isActive(link.path) ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {isActive(link.path) && (<div className="absolute inset-0 bg-blue-500/10 rounded-lg" />)}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Paras Stones Display */}
                            {user && userData && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-full cursor-pointer hover:border-amber-400/50 transition-all"
                                    onClick={() => navigate('/paras-wallet')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                                        <Gem className="w-5 h-5 text-amber-400" />
                                    </motion.div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-amber-300 font-medium">Paras Stones</span>
                                        <span className="text-sm font-bold text-amber-100">{parasStones.toLocaleString()}</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {user ? (
                                /* Authenticated Profile Dropdown */
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                                            <UserIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu Content (Desktop) */}
                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-blue-500/20 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                {/* User Info & Stones Summary */}
                                                <div className="px-4 py-3 border-b border-slate-800">
                                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">Sangyan Member</p>
                                                </div>
                                                {userData && (
                                                    <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-slate-800">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2"> <Gem className="w-4 h-4 text-amber-400" /> <span className="text-xs text-amber-300 font-medium">Paras Stones</span> </div>
                                                            <span className="text-sm font-bold text-amber-100">{parasStones.toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-xs text-amber-300/60 mt-1">≈ ₹{rupeeValue}</p>
                                                    </div>
                                                )}
                                                {/* Menu Items */}
                                                <div className="py-1">
                                                    <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"> <UserCircle className="w-4 h-4" /> <span>Profile</span> </button>
                                                    <button onClick={() => { navigate('/paras-wallet'); setIsProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"> <Gem className="w-4 h-4 text-amber-400" /> <span>Paras Wallet</span> </button>
                                                    <button onClick={handleSettingsClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"> <Settings className="w-4 h-4" /> <span>Settings</span> </button>
                                                    <button onClick={() => { navigate('/notifications'); setIsProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"> <Bell className="w-4 h-4" /> <span>Notifications</span> </button>
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
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                                    >
                                        Sign Up
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
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-blue-500/20 shadow-xl">
                        <div className="px-4 py-4 space-y-1">
                            {/* Paras Stones Display Mobile */}
                            {user && userData && (
                                <div
                                    onClick={() => { navigate('/paras-wallet'); setIsMobileMenuOpen(false); }}
                                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-lg mb-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <Gem className="w-5 h-5 text-amber-400" />
                                        <div>
                                            <p className="text-xs text-amber-300 font-medium">Paras Stones</p>
                                            <p className="text-sm font-bold text-amber-100">{parasStones.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-amber-300/60">≈ ₹{rupeeValue}</span>
                                </div>
                            )}

                            {/* Mobile Nav Links */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                        isActive(link.path) ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {user ? (
                                /* Mobile Authenticated Menu (Full menu with Sign Out) */
                                <div className="pt-3 mt-3 border-t border-slate-800 space-y-1">
                                    <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                        <UserCircle className="w-5 h-5" /> <span>Profile</span>
                                    </button>
                                    <button onClick={() => { navigate('/paras-wallet'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                        <Gem className="w-5 h-5 text-amber-400" /> <span>Paras Wallet</span>
                                    </button>
                                    <button onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                        <Settings className="w-5 h-5" /> <span>Settings</span>
                                    </button>
                                    <button onClick={() => { navigate('/notifications'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
                                        <Bell className="w-5 h-5" /> <span>Notifications</span>
                                    </button>
                                    
                                    {/* --- FIX: MOBILE SIGN OUT BUTTON --- */}
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
                                        <LogOut className="w-5 h-5" /> <span>Sign Out</span>
                                    </button>
                                    {/* ---------------------------------- */}
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
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
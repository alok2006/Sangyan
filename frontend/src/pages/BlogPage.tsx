import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- Import useLocation
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, Heart, Sparkles, ChevronRight, Filter, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Blog } from '../types';


// Blog Categories (Unchanged)
const BLOG_CATEGORIES = [
    { value: 'ALL', label: 'All Topics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Interdisciplinary', label: 'Interdisciplinary' },
];

// --- Configuration ---
const API_BASE_PATH = '/api/blogs'; 

const BlogPage: React.FC = () => {
    // 1. Get location object from React Router
    const location = useLocation();

    // 2. Initialize state without hardcoding 'ALL'
    // The initial value will now be set in the first useEffect.
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('ALL'); // Initialize with default

    // --- Data Fetching Logic (Unchanged) ---
    const fetchBlogs = useCallback(async (category: string) => {
        setLoading(true);
        setError(null);

        // Construct query parameters
        const categoryFilter = category !== 'ALL' ? `?category=${category}` : '';
        const endpoint = `${API_BASE_PATH}${categoryFilter}`; 

        try {
            const response = await axios.get<Blog[]>(endpoint);
            setBlogs(response.data);
        } catch (err) {
            const axiosErr = err as AxiosError;
            console.error('Failed to fetch blogs:', axiosErr);
            setError('Could not load blog posts. Check your server connection.');
            toast.error('Failed to load blogs.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Effect to read URL query on mount and set initial state
    useEffect(() => {
        // Use URLSearchParams to easily parse the query string (location.search)
        const params = new URLSearchParams(location.search);
        const urlCategory = params.get('category');
        
        // Find a valid category value
        const validCategories = BLOG_CATEGORIES.map(cat => cat.value);
        const initialCategory = 
            urlCategory && validCategories.includes(urlCategory) 
                ? urlCategory 
                : 'ALL'; // Fallback to 'ALL' if parameter is missing or invalid

        // Set the state, which will trigger the data fetch in the next useEffect
        setActiveCategory(initialCategory);

        // OPTIONAL: Update URL when category button is clicked (for deep linking)
        // This is not strictly necessary for the prompt, but improves user experience.
        // It's often better to put this logic inside the button handler itself
    }, [location.search]); // Re-run if the URL query changes

    // 4. Effect to fetch data whenever the activeCategory state changes
    useEffect(() => {
        // This effect runs once on mount (after initialCategory is set)
        // and every time the user clicks a filter button.
        fetchBlogs(activeCategory);
    }, [activeCategory, fetchBlogs]);


    // --- Animation Variants (Unchanged) ---
    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: "spring", stiffness: 120, damping: 14 } 
        },
    };

    // --- Components (Unchanged) ---
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-900/70 p-6 rounded-3xl shadow-lg h-[350px] border border-cyan-500/10 relative overflow-hidden">
                    
                    {/* NEW: Colorful Animated Progress Bar */}
                    <motion.div
                        className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <div className="animate-pulse">
                        <div className="h-44 bg-slate-800 rounded-xl mb-4"></div>
                        <div className="h-5 bg-slate-800 w-3/4 mb-3"></div>
                        <div className="h-3 bg-slate-800 w-full mb-2"></div>
                        <div className="h-3 bg-slate-800 w-2/3 mb-4"></div>
                        <div className="h-3 bg-slate-800 w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
        const date = new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        return (
            <motion.div
                variants={cardVariants} // <-- Re-enabled variants for animation on load
                whileHover={{ 
                    y: -8, 
                    boxShadow: "0 15px 25px rgba(59, 130, 246, 0.3)",
                    transition: { duration: 0.2 }
                }}
                className="bg-slate-900/70 p-6 rounded-3xl shadow-2xl border border-cyan-500/10 flex flex-col h-full transition-all duration-300"
            >
                <Link to={`/blog/${blog.slug}`} className="block relative">
                    <img
                        src={blog.coverImage || 'https://via.placeholder.com/600x400?text=Sangyan+Blog'}
                        alt={blog.title}
                        loading="lazy" 
                        className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-700/50 transition-transform duration-300 hover:scale-[1.02] transform origin-bottom"
                    />
                    {blog.is_premuim && (
                         <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-600/90 text-slate-900 text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3" /> PREMIUM
                        </div>
                    )}
                </Link>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 text-blue-400 font-semibold">
                        <BookOpen className="w-3 h-3" />
                        {blog.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {date}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views.toLocaleString()}
                    </span>
                </div>

                <Link to={`/blog/${blog.slug}`} className="block flex-grow">
                    <h2 className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors mb-3 line-clamp-2">
                        {blog.title}
                    </h2>
                    <p className="text-slate-400 text-base mb-4 line-clamp-3">
                        {blog.excerpt}
                    </p>
                </Link>
                
                <div className="mt-auto flex justify-between items-center border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1 text-red-400">
                            <Heart className="w-4 h-4" /> {blog.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-green-400">
                            <TrendingUp className="w-4 h-4" /> {blog.readTime} min read
                        </span>
                    </div>
                    
                    <Link to={`/blog/${blog.slug}`} className="flex items-center text-base font-semibold text-blue-400 hover:text-cyan-400 transition-colors group">
                        Read Article
                        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </motion.div>
        );
    };

    // --- Main Render (Unchanged) ---

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Title and Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
                            Sangyan Knowledge Hub
                        </h1>
                        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                            Explore deep dives, cutting-edge research, and technical articles from our vibrant community of scholars.
                        </p>
                    </motion.div>

                    {/* Filter/Category Bar (Responsive and Scrollable) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-slate-800/80"
                    >
                        <div className="flex space-x-4 justify-start md:justify-center">
                            <span className="text-slate-500 flex items-center gap-2 pr-4 text-lg font-medium whitespace-nowrap">
                                <Filter className="w-5 h-5 text-blue-400" /> Filter:
                            </span>
                            {BLOG_CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={`flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                                        activeCategory === cat.value
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/70 border border-slate-700'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>


                    {/* Blog List Area */}
                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <div className="text-center p-12 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-400 text-lg">
                            {error}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center p-12 bg-slate-800/50 border border-slate-700 rounded-2xl">
                            <h3 className="text-2xl text-white mb-2">No Posts Found</h3>
                            <p className="text-slate-400 text-lg">Try broadening your filter or check back later!</p>
                        </div>
                    ) : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {blogs.map(blog => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogPage;
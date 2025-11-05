import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Eye, Heart, Share2, Bookmark, ArrowLeft, User, MessageCircle, Tag, UserCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


import ReactMarkdown from 'react-markdown';

// NOTE: Blog interface imported from your global types file. Assuming it matches Django serializer structure.
// import { Blog } from '../types'; 

// --- Configuration & Endpoints ---
// CORRECTED: Use the API_BASE_URL to hit the router base, then append the resource and slug.
const BLOG_API_ENDPOINT = '/api/blogs'; // Resource endpoint
const SANGYAN_CONFIG = { basePath: '' }; 

// Assuming Blog interface from context or types file:
interface Author { displayName: string; institute: string; photoURL:string,bio:string }
interface Blog {
    title: string; slug: string; author: Author; category: string; tags: string[];
    excerpt: string; content: string; coverImage: string; publishedAt: string;
    readTime: number; views?: number; likes?: number; is_premuim?: boolean;
}
interface RelatedBlogMeta { id: number; title: string; slug: string; excerpt: string; coverImage: string; publishedAt: string; readTime: number; }


// --- Component ---

const BlogDetail: React.FC = () => {
    // 1. Get the dynamic parameter (slug) from the URL
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    
    // State management
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlogMeta[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Local interaction states
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    // --- Data Fetching Logic ---
    const fetchBlogPost = useCallback(async (currentSlug: string) => {
        setLoading(true);
        try {
            // 2. Construct the API call using the base and the slug
            // Correct path: http://localhost:8000/api/v1/blogs/{slug}/
            const blogEndpoint = `${BLOG_API_ENDPOINT}/${currentSlug}/`;
            
            const response = await axios.get<Blog>(blogEndpoint);
            const blogData = response.data;
            console.log(response);
            setBlog(blogData);
            // MOCK RELATED BLOGS: (Keep this until you implement the real related API endpoint)
            setRelatedBlogs([
                { id: 2, title: 'Introduction to Quantum Computing', slug: 'intro-qc', excerpt: 'A beginner-friendly intro.', coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', publishedAt: new Date().toISOString(), readTime: 8 },
                { id: 3, title: 'The Future of Quantum Cryptography', slug: 'future-qc', excerpt: 'Exploring quantum communication.', coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400', publishedAt: new Date().toISOString(), readTime: 10 }
            ]);

        } catch (error) {
            console.error('Error fetching blog post:', error);
            toast.error('Blog post not found or network error.');
            // navigate('/blogs'); // Optional: redirect on error
        } finally {
            setLoading(false);
        }
    }, []); // Removed navigate from dependencies as it's static/stable

    useEffect(() => {
      console.log(slug);
        if (slug) {
            fetchBlogPost(slug);
        }
    }, [slug, fetchBlogPost]);

    // --- Interaction Effects & Handlers ---
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / documentHeight) * 100;
            setReadProgress(Math.min(progress, 100));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        }).format(new Date(date));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: blog?.title, text: blog?.excerpt, url: window.location.href })
                .catch(error => console.error('Error sharing:', error));
        } else {
            toast.success('Share options unavailable. URL copied!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        toast.success(isLiked ? 'Like removed.' : 'Liked!');
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? 'Bookmark removed.' : 'Bookmarked!');
    };

    // --- Markdown Renderer Component (Simplified for inline use) ---
    const renderMarkdownContent = (content: string) => {
        return <ReactMarkdown>{content}</ReactMarkdown>
    };
    
    // --- Main Component Render ---
    if (loading || !blog) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Loading Blog Post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-[#1a1a1a] z-50">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            <Navbar />

            {/* Back Button */}
            <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to={`${SANGYAN_CONFIG.basePath}/blogs`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <article className="pb-16">
                <header className="relative">
                    {/* Cover Image and Overlay */}
                    <div className="relative h-96 w-full overflow-hidden">
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                    </div>

                    {/* Title Overlay */}
                    <div className="relative px-4 sm:px-6 lg:px-8 -mt-32 z-10">
                        <div className="max-w-4xl mx-auto">
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                                    {blog.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-cyan-400" />
                                    <span className="text-white font-medium">{blog.author.displayName}</span>
                                    <span className="text-gray-600">•</span>
                                    <span>{blog.author.institute}</span>
                                </div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-400" />{formatDate(blog.publishedAt)}</div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" />{blog.readTime} min read</div>
                                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" />{blog.views?.toLocaleString()} views</div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isLiked ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-[#1a1a1a] text-gray-400 hover:text-pink-400 border border-white/10 hover:border-pink-500/30'}`}>
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                    {(blog.likes ?? 0) + (isLiked ? 1 : 0)}
                                </button>
                                <button onClick={handleBookmark} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isBookmarked ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-[#1a1a1a] text-gray-400 hover:text-yellow-400 border border-white/10 hover:border-yellow-500/30'}`}>
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                    {isBookmarked ? 'Saved' : 'Save'}
                                </button>
                                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 font-medium text-sm transition-all">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 font-medium text-sm transition-all">
                                    <MessageCircle className="w-4 h-4" /> Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Blog Content */}
                <div className="px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-8">
                                <div className="prose prose-invert prose-cyan max-w-none">
                                    <div className="text-gray-300 leading-relaxed">
                                        {renderMarkdownContent(blog.content)}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag className="w-4 h-4 text-cyan-400" />
                                        {blog.tags.map(tag => (
                                            <Link
                                                key={tag}
                                                to={`${SANGYAN_CONFIG.basePath}/blogs?tag=${tag}`}
                                                className="px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-xs"
                                            >
                                                {tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Author Card */}
                                <div className="mt-8 p-6 bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 rounded-xl">
                                    <div className="flex items-start gap-4">
                                        <div >
                                            <img className = "w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold"
                                            src={blog.author.photoURL}/>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">{blog.author.displayName}</h3>
                                            <p className="text-sm text-gray-400 mb-2">{blog.author.institute}</p>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {/* Placeholder for Author Bio */}
                                                {blog.author.bio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                <div className="sticky top-24 space-y-6">
                                    {/* Table of Contents (MOCK) */}
                                    {/* <div className="bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                                        <h3 className="text-base font-bold text-white mb-4">Table of Contents</h3>
                                        <nav className="space-y-2 text-sm">
                                            <a href="#introduction" className="block text-gray-400 hover:text-cyan-400 transition-colors">Introduction</a>
                                            <a href="#what-is" className="block text-gray-400 hover:text-cyan-400 transition-colors">What is Quantum Entanglement?</a>
                                            <a href="#applications" className="block text-gray-400 hover:text-cyan-400 transition-colors">Applications in Quantum Computing</a>
                                            <a href="#research" className="block text-gray-400 hover:text-cyan-400 transition-colors">Current Research</a>
                                            <a href="#conclusion" className="block text-gray-400 hover:text-cyan-400 transition-colors">Conclusion</a>
                                        </nav>
                                    </div> */}

                                    {/* Share Card */}
                                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
                                        <h3 className="text-base font-bold text-white mb-3">Share this article</h3>
                                        <div className="flex gap-2">
                                            <button onClick={handleShare} className="flex-1 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-all text-xs">Twitter</button>
                                            <button onClick={handleShare} className="flex-1 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-all text-xs">LinkedIn</button>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                {/* Related Blogs */}
                <div className="px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {relatedBlogs.map(relatedBlog => (
                                <Link
                                    key={relatedBlog.id}
                                    to={`${SANGYAN_CONFIG.basePath}/blogs/${relatedBlog.slug}`}
                                    className="group bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                >
                                    <img src={relatedBlog.coverImage} alt={relatedBlog.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
                                    <div className="p-4">
                                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">{relatedBlog.title}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{relatedBlog.excerpt}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500"><Clock className="w-3 h-3" />{relatedBlog.readTime} min read</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogDetail;
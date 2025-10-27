import React, { useState, useMemo } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Eye, 
  Grid3x3, 
  List,
  X,
  Sparkles,
  Award,
  Flame,
  Calendar,
  Zap,
  Atom,
  Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import { SANGYAN_CONFIG } from '../config/sangyan.config';
import { Blog } from '../types';

// Mock data - replace with actual API call
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Quantum Entanglement: Bridging the Gap Between Theory and Application',
    slug: 'quantum-entanglement-theory-application',
    author: { name: 'Dr. Priya Sharma', institute: 'IISER Pune', avatar: '' },
    category: 'Physics',
    tags: ['quantum-mechanics', 'entanglement', 'quantum-computing'],
    excerpt: 'Exploring the fascinating world of quantum entanglement and its potential applications in quantum computing, cryptography, and communication.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    publishedAt: new Date('2024-10-01'),
    readTime: 12,
    views: 1250,
    likes: 89,
    featured: true
  },
  {
    id: '2',
    title: 'CRISPR-Cas9: The Future of Genetic Engineering',
    slug: 'crispr-cas9-genetic-engineering',
    author: { name: 'Rajesh Kumar', institute: 'IISc Bangalore', avatar: '' },
    category: 'Biology',
    tags: ['genetics', 'crispr', 'biotechnology'],
    excerpt: 'A comprehensive look at CRISPR-Cas9 technology, its mechanisms, applications, and ethical considerations in modern genetic engineering.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800',
    publishedAt: new Date('2024-09-28'),
    readTime: 15,
    views: 2100,
    likes: 156,
    featured: false
  },
  {
    id: '3',
    title: 'Machine Learning in Climate Science: Predicting Our Future',
    slug: 'machine-learning-climate-science',
    author: { name: 'Ananya Desai', institute: 'IISER Kolkata', avatar: '' },
    category: 'Interdisciplinary',
    tags: ['machine-learning', 'climate-change', 'data-science'],
    excerpt: 'How artificial intelligence and machine learning algorithms are revolutionizing climate modeling and helping us understand global warming patterns.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    publishedAt: new Date('2024-09-25'),
    readTime: 10,
    views: 1800,
    likes: 142,
    featured: true
  },
  {
    id: '4',
    title: 'Topology in Modern Mathematics: Beyond Euclidean Geometry',
    slug: 'topology-modern-mathematics',
    author: { name: 'Prof. Vikram Singh', institute: 'IIT Delhi', avatar: '' },
    category: 'Mathematics',
    tags: ['topology', 'geometry', 'pure-mathematics'],
    excerpt: 'An introduction to topological spaces, continuity, and how topology is reshaping our understanding of mathematical structures.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    publishedAt: new Date('2024-09-20'),
    readTime: 18,
    views: 950,
    likes: 78,
    featured: false
  },
  {
    id: '5',
    title: 'Green Chemistry: Sustainable Solutions for a Better Tomorrow',
    slug: 'green-chemistry-sustainable-solutions',
    author: { name: 'Meera Patel', institute: 'IISER Berhampur', avatar: '' },
    category: 'Chemistry',
    tags: ['green-chemistry', 'sustainability', 'environment'],
    excerpt: 'Exploring innovative approaches in green chemistry that minimize environmental impact while maximizing efficiency in chemical processes.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    publishedAt: new Date('2024-09-15'),
    readTime: 8,
    views: 1400,
    likes: 112,
    featured: false
  },
  {
    id: '6',
    title: 'Plate Tectonics and Earthquake Prediction: Current Research',
    slug: 'plate-tectonics-earthquake-prediction',
    author: { name: 'Dr. Arun Menon', institute: 'NISER Bhubaneswar', avatar: '' },
    category: 'Earth Sciences',
    tags: ['geology', 'earthquakes', 'seismology'],
    excerpt: 'Understanding the movement of Earth\'s tectonic plates and the latest developments in earthquake prediction technologies.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    publishedAt: new Date('2024-09-10'),
    readTime: 14,
    views: 1100,
    likes: 94,
    featured: false
  }
];

const categories = [
  { name: 'All', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
  { name: 'Physics', icon: Atom, color: 'from-orange-500 to-red-500' },
  { name: 'Chemistry', icon: Zap, color: 'from-green-500 to-emerald-500' },
  { name: 'Biology', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { name: 'Mathematics', icon: TrendingUp, color: 'from-purple-500 to-indigo-500' },
  { name: 'Earth Sciences', icon: Calendar, color: 'from-teal-500 to-cyan-500' },
  { name: 'Computer Science', icon: Grid3x3, color: 'from-blue-500 to-violet-500' },
  { name: 'Interdisciplinary', icon: Award, color: 'from-amber-500 to-yellow-500' }
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const BlogList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockBlogs.forEach(blog => blog.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = mockBlogs.filter(blog => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => blog.tags?.includes(tag));
      
      return matchesCategory && matchesSearch && matchesTags;
    });

    // Sort blogs
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, selectedTags]);

  const featuredBlogs = mockBlogs.filter(blog => blog.featured);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Get category stats
  const categoryStats = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.name === 'All' 
        ? mockBlogs.length 
        : mockBlogs.filter(b => b.category === cat.name).length
    }));
  }, []);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + selectedTags.length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Research & Insights</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Explore Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Dive into cutting-edge research, insights, and stories from the scientific community
              </p>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Box */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search blogs by title, author, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl text-white hover:bg-slate-900 hover:border-blue-500/40 transition-all flex items-center gap-2 justify-center"
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 space-y-6">
                      {/* Categories/Subjects Filter */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          Filter by Subject
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {categoryStats.map((category) => {
                            const Icon = category.icon;
                            return (
                              <button
                                key={category.name}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                  selectedCategory === category.name
                                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="flex-1 text-left">{category.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  selectedCategory === category.name
                                    ? 'bg-white/20'
                                    : 'bg-slate-700'
                                }`}>
                                  {category.count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tags Filter */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-blue-400" />
                          Filter by Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                selectedTags.includes(tag)
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      {activeFiltersCount > 0 && (
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-sm text-slate-400">
                            {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                          </span>
                          <button
                            onClick={() => {
                              setSelectedTags([]);
                              setSelectedCategory('All');
                            }}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats and Sort Bar */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                Showing <span className="text-white font-semibold">{filteredBlogs.length}</span> {filteredBlogs.length === 1 ? 'blog' : 'blogs'}
                {selectedCategory !== 'All' && (
                  <span> in <span className="text-blue-400">{selectedCategory}</span></span>
                )}
                {selectedTags.length > 0 && (
                  <span> with {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'}</span>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Sort by:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'recent', label: 'Latest', icon: Clock },
                    { value: 'popular', label: 'Popular', icon: Eye },
                    { value: 'trending', label: 'Trending', icon: TrendingUp }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          sortBy === option.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Blogs (only show if no filters) */}
        {selectedCategory === 'All' && !searchQuery && selectedTags.length === 0 && featuredBlogs.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Featured Posts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredBlogs.slice(0, 2).map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard blog={blog} featured />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid/List */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {filteredBlogs.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredBlogs.map((blog) => (
                  <motion.div key={blog.id} variants={fadeInUp}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No blogs found</h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTags([]);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </div>
      <Footer />
    </>
  );
};

export default BlogList;

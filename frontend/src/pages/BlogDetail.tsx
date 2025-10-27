import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, Share2, Bookmark, ArrowLeft, User, ChevronRight, Tag, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Blog } from '../types';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

// Sample blog content
const sampleFullBlog: Blog = {
  id: '1',
  title: 'Quantum Entanglement: Bridging the Gap Between Theory and Application',
  slug: 'quantum-entanglement-theory-application',
  author: {
    name: 'Dr. Priya Sharma',
    institute: 'IISER Pune',
    avatar: '',
    bio: 'Quantum physicist specializing in quantum computing and information theory.'
  },
  category: 'Physics',
  tags: ['quantum-mechanics', 'entanglement', 'quantum-computing'],
  excerpt: 'Exploring the fascinating world of quantum entanglement and its potential applications in quantum computing, cryptography, and communication.',
  content: `
# Introduction

Quantum entanglement, famously described by Einstein as "spooky action at a distance," remains one of the most fascinating and counterintuitive phenomena in physics. This article explores the fundamental principles of quantum entanglement and its revolutionary applications in modern technology.

## What is Quantum Entanglement?

Quantum entanglement occurs when two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently. Instead, the particles exist in a single quantum state together, regardless of the distance separating them.

### The EPR Paradox

In 1935, Einstein, Podolsky, and Rosen (EPR) presented a thought experiment challenging the completeness of quantum mechanics. They argued that if quantum mechanics were complete, it would imply "spooky action at a distance," which seemed to violate the principle of locality.

## Applications in Quantum Computing

### Quantum Cryptography

Quantum entanglement enables perfectly secure communication through quantum key distribution (QKD). Any attempt to intercept the quantum key disturbs the entangled state, immediately alerting both parties to the presence of an eavesdropper.

### Quantum Teleportation

Using entangled particles, quantum information can be transmitted from one location to another without physically transferring the particle itself. This process, known as quantum teleportation, is crucial for quantum communication networks.

## Current Research and Future Prospects

Researchers worldwide are working on:

- Scaling up quantum computers with more qubits
- Improving quantum error correction techniques
- Developing quantum networks spanning multiple cities
- Creating more stable quantum memories

## Conclusion

Quantum entanglement bridges the gap between theoretical physics and practical applications. As we continue to understand and harness this phenomenon, we move closer to a future where quantum technologies revolutionize computing, communication, and cryptography.
  `,
  coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
  publishedAt: '2025-10-01',
  readTime: 12,
  views: 1250,
  likes: 89
};

const relatedBlogs: Blog[] = [
  {
    id: '2',
    title: 'Introduction to Quantum Computing',
    slug: 'intro-quantum-computing',
    author: { name: 'Prof. Rajesh Iyer', institute: 'IIT Bombay' },
    category: 'Physics',
    tags: ['quantum-computing'],
    excerpt: 'A beginner-friendly introduction to the principles of quantum computing.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    publishedAt: '2025-09-25',
    readTime: 8
  },
  {
    id: '3',
    title: 'The Future of Quantum Cryptography',
    slug: 'future-quantum-cryptography',
    author: { name: 'Dr. Ananya Desai', institute: 'IISc Bangalore' },
    category: 'Physics',
    tags: ['cryptography'],
    excerpt: 'Exploring how quantum mechanics is revolutionizing secure communication.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400',
    publishedAt: '2025-09-20',
    readTime: 10
  }
];

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(sampleFullBlog);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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
          {/* Cover Image */}
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
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
                  <span className="text-white font-medium">{blog.author.name}</span>
                  <span className="text-gray-600">•</span>
                  <span>{blog.author.institute}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  {formatDate(blog.publishedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {blog.readTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  {blog.views?.toLocaleString()} views
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isLiked
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-pink-400 border border-white/10 hover:border-pink-500/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {(blog.likes ?? 0) + (isLiked ? 1 : 0)}
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isBookmarked
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-yellow-400 border border-white/10 hover:border-yellow-500/30'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 font-medium text-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 font-medium text-sm transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Comment
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
                  <div
                    className="text-gray-300 leading-relaxed"
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.75rem'
                    }}
                  >
                    {blog.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('# ')) {
                        return (
                          <h1 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                            {paragraph.substring(2)}
                          </h1>
                        );
                      } else if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3">
                            {paragraph.substring(3)}
                          </h2>
                        );
                      } else if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">
                            {paragraph.substring(4)}
                          </h3>
                        );
                      } else if (paragraph.startsWith('- ')) {
                        return (
                          <li key={index} className="text-gray-300 ml-4 mb-2">
                            {paragraph.substring(2)}
                          </li>
                        );
                      } else {
                        return (
                          <p key={index} className="text-gray-300 mb-4 text-sm leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      }
                    })}
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {blog.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {blog.author.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {blog.author.institute}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {blog.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  {/* Table of Contents */}
                  <div className="bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <h3 className="text-base font-bold text-white mb-4">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2 text-sm">
                      <a href="#introduction" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                        Introduction
                      </a>
                      <a href="#what-is" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                        What is Quantum Entanglement?
                      </a>
                      <a href="#applications" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                        Applications in Quantum Computing
                      </a>
                      <a href="#research" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                        Current Research
                      </a>
                      <a href="#conclusion" className="block text-gray-400 hover:text-cyan-400 transition-colors">
                        Conclusion
                      </a>
                    </nav>
                  </div>

                  {/* Share Card */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
                    <h3 className="text-base font-bold text-white mb-3">
                      Share this article
                    </h3>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-all text-xs">
                        Twitter
                      </button>
                      <button className="flex-1 px-3 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-all text-xs">
                        LinkedIn
                      </button>
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
                  <img
                    src={relatedBlog.coverImage}
                    alt={relatedBlog.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {relatedBlog.readTime} min read
                    </div>
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

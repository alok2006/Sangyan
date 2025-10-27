import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Blog } from '../types';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, featured = false }) => {
  const categoryColors: Record<string, string> = {
    'Physics': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Chemistry': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Biology': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Mathematics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Earth Sciences': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Computer Science': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Data Science': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Interdisciplinary': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  };

  if (featured) {
    return (
      <Link 
        to={`${SANGYAN_CONFIG.basePath}/blogs/${blog.id}`}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover-lift animate-fade-in-up"
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-64 md:h-full overflow-hidden">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            
            {/* Featured Badge */}
            <div className="absolute top-4 left-4 animate-bounce-in">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg animate-glow-pulse">
                <Sparkles className="w-4 h-4" />
                FEATURED
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center space-y-6">
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 animate-slide-in-right animation-delay-200">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[blog.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} transform hover:scale-110 transition-transform duration-300`}>
                {blog.category}
              </span>
              {blog.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-110"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-500 animate-slide-in-right animation-delay-300">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-300 line-clamp-3 group-hover:text-slate-200 transition-colors duration-300 animate-slide-in-right animation-delay-400">
              {blog.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 animate-slide-in-right animation-delay-500">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                {blog.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{blog.author.name}</p>
                <p className="text-sm text-slate-400">{blog.author.institute}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 animate-slide-in-right animation-delay-600">
              <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
                <Calendar className="w-4 h-4" />
                {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
              {blog.views && (
                <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
                  <Eye className="w-4 h-4" />
                  {blog.views}
                </span>
              )}
              {blog.likes && (
                <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
                  <Heart className="w-4 h-4" />
                  {blog.likes}
                </span>
              )}
            </div>

            {/* Read More */}
            <div className="animate-slide-in-right animation-delay-700">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 magnetic-button group/btn">
                Read Full Article
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`${SANGYAN_CONFIG.basePath}/blogs/${blog.id}`}
      className="group relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm hover-lift animate-fade-in-up"
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 animate-bounce-in">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${categoryColors[blog.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} transform group-hover:scale-110 transition-transform duration-300`}>
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-500">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
          {blog.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            {blog.author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{blog.author.name}</p>
            <p className="text-xs text-slate-400 truncate">{blog.author.institute}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800 group-hover:border-cyan-500/30 transition-colors duration-300">
          <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
            <Clock className="w-3 h-3" />
            {blog.readTime} min
          </span>
          {blog.views && (
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
              <Eye className="w-3 h-3" />
              {blog.views}
            </span>
          )}
          {blog.likes && (
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300">
              <Heart className="w-3 h-3" />
              {blog.likes}
            </span>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/50 rounded-xl transition-all duration-500 pointer-events-none" />
      </div>
    </Link>
  );
};

export default BlogCard;

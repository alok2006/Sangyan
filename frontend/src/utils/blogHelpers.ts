import { Blog } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const extractExcerpt = (content: string, maxLength: number = 200): string => {
  const plainText = content.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

export const getRelatedBlogs = (currentBlog: Blog, allBlogs: Blog[], limit: number = 3): Blog[] => {
  return allBlogs
    .filter(blog => blog.id !== currentBlog.id)
    .filter(blog => 
      blog.category === currentBlog.category ||
      blog.tags.some(tag => currentBlog.tags.includes(tag))
    )
    .slice(0, limit);
};

export const getCategoryBlogs = (category: string, allBlogs: Blog[]): Blog[] => {
  return allBlogs.filter(blog => blog.category === category);
};

export const searchBlogs = (query: string, allBlogs: Blog[]): Blog[] => {
  const lowerQuery = query.toLowerCase();
  return allBlogs.filter(blog =>
    blog.title.toLowerCase().includes(lowerQuery) ||
    blog.excerpt.toLowerCase().includes(lowerQuery) ||
    blog.author.name.toLowerCase().includes(lowerQuery) ||
    blog.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const sortBlogsByDate = (blogs: Blog[], order: 'asc' | 'desc' = 'desc'): Blog[] => {
  return [...blogs].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const sortBlogsByPopularity = (blogs: Blog[]): Blog[] => {
  return [...blogs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
};

export const getTrendingBlogs = (blogs: Blog[], limit: number = 5): Blog[] => {
  return [...blogs]
    .sort((a, b) => {
      const scoreA = (a.likes ?? 0) * 2 + (a.views ?? 0);
      const scoreB = (b.likes ?? 0) * 2 + (b.views ?? 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

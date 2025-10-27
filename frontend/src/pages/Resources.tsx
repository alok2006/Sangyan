import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ExternalLink, BookOpen, Video, FileText, Code, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'notes' | 'video' | 'paper' | 'code';
  category: string;
  author: {
    name: string;
    institute: string;
  };
  link: string;
  downloads?: number;
  uploadedAt: Date;
  tags: string[];
  thumbnail?: string;
}

const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Quantum Mechanics - Lecture Notes',
    description: 'Comprehensive lecture notes covering the fundamentals of quantum mechanics, including wave functions, operators, and the Schrödinger equation.',
    type: 'notes',
    category: 'Physics',
    author: { name: 'Prof. Rajesh Iyer', institute: 'IIT Bombay' },
    link: '#',
    downloads: 1250,
    uploadedAt: new Date('2025-09-15'),
    tags: ['quantum-mechanics', 'physics', 'undergraduate'],
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals - Video Series',
    description: 'A complete video lecture series covering supervised learning, neural networks, and deep learning with Python implementations.',
    type: 'video',
    category: 'Data Science',
    author: { name: 'Dr. Ananya Desai', institute: 'IISc Bangalore' },
    link: '#',
    downloads: 2100,
    uploadedAt: new Date('2025-09-10'),
    tags: ['machine-learning', 'python', 'ai'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
  },
  {
    id: '3',
    title: 'Organic Chemistry Reaction Mechanisms',
    description: 'Detailed notes on organic reaction mechanisms with step-by-step explanations and practice problems.',
    type: 'notes',
    category: 'Chemistry',
    author: { name: 'Dr. Priya Menon', institute: 'IISER Pune' },
    link: '#',
    downloads: 890,
    uploadedAt: new Date('2025-09-05'),
    tags: ['chemistry', 'organic', 'reactions'],
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'
  },
  {
    id: '4',
    title: 'Python for Scientific Computing - GitHub Repository',
    description: 'Complete codebase with examples for numerical methods, data visualization, and scientific simulations using NumPy, SciPy, and Matplotlib.',
    type: 'code',
    category: 'Programming',
    author: { name: 'Arjun Kumar', institute: 'IISER Kolkata' },
    link: '#',
    downloads: 1560,
    uploadedAt: new Date('2025-09-01'),
    tags: ['python', 'scientific-computing', 'numpy'],
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'
  },
  {
    id: '5',
    title: 'Climate Change Research Paper Collection',
    description: 'Curated collection of peer-reviewed papers on climate modeling, carbon cycles, and environmental impact studies.',
    type: 'paper',
    category: 'Earth Sciences',
    author: { name: 'Prof. Vikram Singh', institute: 'IIT Delhi' },
    link: '#',
    downloads: 720,
    uploadedAt: new Date('2025-08-28'),
    tags: ['climate-change', 'research', 'environment'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'
  },
  {
    id: '6',
    title: 'Molecular Biology Techniques - Lab Manual',
    description: 'Practical laboratory manual covering DNA extraction, PCR, gel electrophoresis, and protein purification techniques.',
    type: 'notes',
    category: 'Biology',
    author: { name: 'Dr. Meera Patel', institute: 'NISER Bhubaneswar' },
    link: '#',
    downloads: 1340,
    uploadedAt: new Date('2025-08-25'),
    tags: ['biology', 'molecular', 'lab-techniques'],
    thumbnail: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400'
  }
];

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [filteredResources, setFilteredResources] = useState<Resource[]>(sampleResources);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const resourceTypes = ['All', 'notes', 'video', 'paper', 'code'];

  useEffect(() => {
    let result = [...resources];

    if (selectedCategory !== 'All') {
      result = result.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType !== 'All') {
      result = result.filter(resource => resource.type === selectedType);
    }

    if (searchQuery) {
      result = result.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    result.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    setFilteredResources(result);
  }, [selectedCategory, selectedType, searchQuery, resources]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notes':
        return FileText;
      case 'video':
        return Video;
      case 'paper':
        return BookOpen;
      case 'code':
        return Code;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'notes':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'video':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'paper':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'code':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/3 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-400 text-xs font-medium mb-4">
            <BookOpen className="w-3 h-3" />
            Learning Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Resources
          </h1>
          <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Access curated educational materials, research papers, lecture notes, and video tutorials contributed by our community.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-16 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-sm transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['All', ...SANGYAN_CONFIG.categories].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                        : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {resourceTypes.map(type => {
                  const Icon = type !== 'All' ? getTypeIcon(type) : Filter;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white border border-white/10'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div
                    key={resource.id}
                    className="group relative bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Thumbnail */}
                    {resource.thumbnail && (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />

                        {/* Type Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-1 ${getTypeColor(resource.type)}`}>
                          <TypeIcon className="w-3 h-3" />
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </div>

                        {/* Downloads Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloads}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      {/* Category */}
                      <div className="text-xs text-cyan-400 font-medium mb-2">
                        {resource.category}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-400 mb-3 line-clamp-3 leading-relaxed">
                        {resource.description}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span className="text-gray-400">{resource.author.name}</span>
                        <span>•</span>
                        <span>{resource.author.institute}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <a
                        href={resource.link}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-sm hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-400/40 group/btn"
                      >
                        <Download className="w-3 h-3" />
                        Access Resource
                        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                <BookOpen className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
              <p className="text-sm text-gray-400 mb-4">No resources found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                }}
                className="text-green-400 hover:text-green-300 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Contribute Your Resources
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
              Have educational resources to contribute? Help the community by sharing your notes, videos, or research materials.
            </p>
            <div className="text-xs text-gray-500 mb-4">
              We accept: Lecture notes, video tutorials, research papers, slides, code repositories, and more.
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-sm hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-400/40 hover:scale-105">
              Submit Resource
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Resources;

import React, { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Search, Filter, Video, User, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { Event } from '../types';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Introduction to Quantum Computing',
    slug: 'intro-quantum-computing',
    type: 'workshop',
    date: new Date('2025-11-15'),
    time: '2:00 PM - 5:00 PM',
    venue: 'Online',
    speaker: {
      name: 'Dr. Rajesh Iyer',
      institute: 'IIT Bombay',
      avatar: ''
    },
    description: 'Hands-on workshop covering the fundamentals of quantum computing, including quantum gates, algorithms, and real-world applications.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    registrationLink: '#',
    tags: ['Physics', 'Computing'],
    maxParticipants: 100,
    currentParticipants: 67
  },
  {
    id: '2',
    title: 'Machine Learning in Healthcare',
    slug: 'ml-healthcare',
    type: 'talk',
    date: new Date('2025-11-20'),
    time: '4:00 PM - 5:30 PM',
    venue: 'IISER Pune',
    speaker: {
      name: 'Prof. Ananya Desai',
      institute: 'IISc Bangalore',
      avatar: ''
    },
    description: 'Exploring how AI and machine learning are revolutionizing disease diagnosis, drug discovery, and personalized medicine.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    registrationLink: '#',
    tags: ['AI/ML', 'Biology'],
    maxParticipants: 150,
    currentParticipants: 142
  },
  {
    id: '3',
    title: 'Climate Change: Data Science Perspectives',
    slug: 'climate-data-science',
    type: 'panel',
    date: new Date('2025-11-25'),
    time: '3:00 PM - 6:00 PM',
    venue: 'Hybrid',
    speaker: {
      name: 'Multiple Speakers',
      institute: 'Various Institutes',
      avatar: ''
    },
    description: 'Panel discussion featuring experts discussing how data science and computational models help us understand and combat climate change.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    registrationLink: '#',
    tags: ['Interdisciplinary', 'Earth Sciences'],
    maxParticipants: 200,
    currentParticipants: 178
  },
  {
    id: '4',
    title: 'CRISPR Gene Editing Workshop',
    slug: 'crispr-workshop',
    type: 'workshop',
    date: new Date('2025-12-01'),
    time: '10:00 AM - 4:00 PM',
    venue: 'IISER Kolkata',
    speaker: {
      name: 'Dr. Priya Menon',
      institute: 'NISER Bhubaneswar',
      avatar: ''
    },
    description: 'Comprehensive hands-on workshop on CRISPR-Cas9 gene editing techniques, ethics, and applications in modern biotechnology.',
    image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800',
    registrationLink: '#',
    tags: ['Biology', 'Biotechnology'],
    maxParticipants: 50,
    currentParticipants: 48
  },
  {
    id: '5',
    title: 'Sustainable Chemistry Innovations',
    slug: 'sustainable-chemistry',
    type: 'talk',
    date: new Date('2025-12-05'),
    time: '5:00 PM - 6:30 PM',
    venue: 'Online',
    speaker: {
      name: 'Prof. Arun Kumar',
      institute: 'IIT Delhi',
      avatar: ''
    },
    description: 'Discover cutting-edge research in green chemistry and sustainable materials that are shaping the future of chemical industries.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    registrationLink: '#',
    tags: ['Chemistry', 'Sustainability'],
    maxParticipants: 120,
    currentParticipants: 85
  }
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Events: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(sampleEvents);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const eventTypes = ['All', 'talk', 'workshop', 'panel'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(err => console.log('Autoplay prevented:', err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let result = [...events];

    if (selectedType !== 'All') {
      result = result.filter(event => event.type === selectedType);
    }

    if (searchQuery) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredEvents(result);
  }, [selectedType, searchQuery, events]);

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(parsedDate);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'talk':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'workshop':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'panel':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Fixed Video Background Container */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/bg_video_2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-10">
        {/* Hero Header with Video Background */}
        <section className="relative h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-4 h-4" />
                Upcoming Events & Workshops
              </motion.div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Workshops</span>
            </motion.h1>

            <motion.p 
              className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join our expert talks, hands-on workshops, and community discussions. Learn, share, and grow with fellow curious minds.
            </motion.p>
          </div>
        </section>

        {/* Content that scrolls over the video - with solid background */}
        <div className="relative bg-transparent">
          {/* Search and Filters - Sticky */}
          <section className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <motion.div 
                  className="flex-1 relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search events, topics, speakers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm transition-all"
                  />
                </motion.div>

                {/* Type Filters */}
                <motion.div 
                  className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {eventTypes.map((type, index) => (
                    <motion.button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Events Grid */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {filteredEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="group relative bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                        {/* Event Type Badge */}
                        <motion.div 
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getTypeColor(event.type)}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </motion.div>

                        {/* Capacity Badge */}
                        {event.maxParticipants && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.currentParticipants}/{event.maxParticipants}
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-5">
                        {/* Date and Time */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {event.time}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Speaker */}
                        {event.speaker && (
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                            <User className="w-3 h-3 text-cyan-400" />
                            <span>{event.speaker.name}</span>
                            <span className="text-gray-600">•</span>
                            <span>{event.speaker.institute}</span>
                          </div>
                        )}

                        {/* Venue */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {event.venue}
                          {event.venue.toLowerCase().includes('online') && (
                            <Video className="w-3 h-3 text-cyan-400" />
                          )}
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Register Button */}
                        <motion.a
                          href={event.registrationLink}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 group/btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Register Now
                          <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                  <p className="text-sm text-gray-400 mb-4">No events found matching your criteria.</p>
                  <motion.button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('All');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Clear filters
                  </motion.button>
                </motion.div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Want to Host an Event?
                </h2>
                <p className="text-sm text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Have an idea for a talk, workshop, or community session? We'd love to hear from you!
                </p>
                <motion.button 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-semibold text-sm hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Propose an Event
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </section>

          <Newsletter />
        </div>
      </div>

      <Footer />

      {/* Custom Animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Events;

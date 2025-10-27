import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, BookOpen, Users, Lightbulb, TrendingUp, Star, Sparkles, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import EventCard from '../components/EventCard';
import Newsletter from '../components/Newsletter';
import { SANGYAN_CONFIG } from '../config/sangyan.config';
import { Blog, Event } from '../types';

const featuredBlogs: Blog[] = [
  {
    id: '1',
    title: 'Quantum Entanglement: Bridging Theory and Application',
    slug: 'quantum-entanglement-theory-application',
    author: { name: 'Dr. Priya Sharma', institute: 'IISER Pune' },
    category: 'Physics',
    tags: ['quantum-mechanics', 'entanglement'],
    excerpt: 'Exploring quantum entanglement and its revolutionary applications in computing and cryptography.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    publishedAt: new Date('2024-03-15'),
    readTime: 8
  },
  {
    id: '2',
    title: 'CRISPR and the Future of Gene Editing',
    slug: 'crispr-future-gene-editing',
    author: { name: 'Dr. Arjun Patel', institute: 'IISc Bangalore' },
    category: 'Biology',
    tags: ['genetics', 'biotechnology'],
    excerpt: 'Understanding CRISPR technology and its potential to revolutionize medicine and agriculture.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42',
    publishedAt: new Date('2024-03-10'),
    readTime: 10
  },
  {
    id: '3',
    title: 'Machine Learning in Climate Prediction',
    slug: 'ml-climate-prediction',
    author: { name: 'Dr. Sarah Kumar', institute: 'IISER Kolkata' },
    category: 'Data Science',
    tags: ['machine-learning', 'climate'],
    excerpt: 'How AI and machine learning models are improving our ability to predict climate patterns.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    publishedAt: new Date('2024-03-05'),
    readTime: 12
  }
];

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop: Introduction to Quantum Computing',
    slug: 'quantum-computing-workshop',
    type: 'workshop',
    date: new Date('2024-04-20'),
    time: '2:00 PM - 5:00 PM',
    venue: 'Online',
    speaker: { name: 'Prof. Rajesh Iyer', institute: 'IIT Bombay' },
    description: 'Hands-on workshop covering the basics of quantum computing and quantum algorithms.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    registrationLink: '#'
  },
  {
    id: '2',
    title: 'Talk: Sustainable Energy Solutions',
    slug: 'sustainable-energy-talk',
    type: 'talk',
    date: new Date('2024-04-25'),
    time: '4:00 PM - 5:30 PM',
    venue: 'IISER Pune',
    speaker: { name: 'Dr. Meera Verma', institute: 'IIT Delhi' },
    description: 'Exploring innovative approaches to renewable energy and sustainability challenges.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
    registrationLink: '#'
  }
];

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

// Animated Section Component
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SangyanHome: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax effects for hero section
  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(err => console.log('Autoplay prevented:', err));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    playVideo();

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Research Blogs', value: '150+', color: 'from-blue-500 to-cyan-400' },
    { icon: Users, label: 'Community Members', value: '2,000+', color: 'from-cyan-500 to-teal-400' },
    { icon: Calendar, label: 'Events Hosted', value: '50+', color: 'from-teal-400 to-emerald-400' },
    { icon: Star, label: 'Partner Institutes', value: '20+', color: 'from-blue-400 to-indigo-400' }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Research Blogs',
      description: 'In-depth articles exploring cutting-edge research across all scientific disciplines.',
      link: '/blog'
    },
    {
      icon: Calendar,
      title: 'Expert Talks & Workshops',
      description: 'Learn from leading researchers through engaging talks and hands-on workshops.',
      link: '/events'
    },
    {
      icon: Lightbulb,
      title: 'Learning Resources',
      description: 'Access curated materials, notes, and resources for continuous learning.',
      link: '/resources'
    },
    {
      icon: Users,
      title: 'Collaborative Community',
      description: 'Connect with curious minds from top institutes across India.',
      link: '/about'
    }
  ];

  return (
    <>
      <Navbar />
      
      <div className="relative min-h-screen">
        {/* Hero Section with Bright Video Background */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Bright Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover brightness-110"
              loop
              muted
              playsInline
              autoPlay
            >
              <source src="/bg_video_4.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Lighter Gradient Overlay - Only for Right Side Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            
            {/* Magical Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    background: i % 3 === 0 ? '#60A5FA' : i % 3 === 1 ? '#22D3EE' : '#A78BFA',
                    boxShadow: '0 0 20px currentColor'
                  }}
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    y: [null, Math.random() * -200 - 100],
                    x: [null, Math.random() * 100 - 50],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0.5]
                  }}
                  transition={{
                    duration: Math.random() * 4 + 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hero Content - Split Layout */}
          <motion.div
            ref={heroRef}
            style={{ y: yHero, opacity: opacityHero }}
            className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-20"
          >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Empty for Video Visibility */}
              <div className="hidden lg:block" />

              {/* Right Side - Text Content with Magical Effects */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Magical Glow Background */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl animate-pulse" />
                
                <div className="relative bg-slate-950/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                  {/* Welcome Badge with Shimmer */}
                  <motion.div 
                    variants={fadeInDown}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/40 rounded-full backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse relative z-10" />
                    <span className="text-xs font-semibold text-cyan-100 tracking-wide relative z-10">Welcome to Sangyan Community</span>
                  </motion.div>

                  {/* Main Heading with Glow */}
                  <motion.h1 
                    variants={fadeInRight}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                  >
                    <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                      Welcome to{' '}
                    </span>
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(34,211,238,0.8)] animate-gradient">
                        Sangyan
                      </span>
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-2xl opacity-30"
                        animate={{
                          opacity: [0.3, 0.5, 0.3],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </span>
                  </motion.h1>

                  {/* Subheadings with Elegant Spacing */}
                  <motion.div variants={fadeInRight} className="space-y-3 mb-8">
                    <p className="text-base sm:text-lg text-white font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      A comprehensive platform for learning, sharing, and growing together
                    </p>
                    <p className="text-sm text-cyan-100/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      Discover a world of knowledge, connection, and growth
                    </p>
                  </motion.div>

                  {/* CTA Buttons with Magical Hover */}
                  <motion.div 
                    variants={fadeInRight}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      to="/blog"
                      className="group relative px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Explore Blogs
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 blur-lg opacity-0 group-hover:opacity-60 transition-opacity" />
                    </Link>
                    
                    <Link
                      to="/events"
                      className="group px-7 py-3.5 bg-white/10 backdrop-blur-md border-2 border-cyan-400/50 text-white text-sm font-bold rounded-xl hover:bg-white/20 hover:border-cyan-300 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <Calendar className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Join Events</span>
                    </Link>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Scroll Indicator */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-12 flex flex-col items-center gap-2"
                >
                  <span className="text-xs text-cyan-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Scroll to explore more
                  </span>
                  <TrendingUp className="w-5 h-5 text-cyan-300 animate-bounce drop-shadow-[0_2px_12px_rgba(34,211,238,0.8)]" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Content Sections with Solid Backgrounds */}
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
          {/* Stats Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/80 backdrop-blur-sm">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={scaleIn}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-all duration-300"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity`} />
                        
                        <div className="relative z-10">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-xs text-slate-400">{stat.label}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    What We Offer
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                    Discover a world of knowledge, connection, and growth
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        variants={scaleIn}
                        whileHover={{ y: -8 }}
                        className="relative group bg-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                        
                        <div className="relative z-10">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            {feature.description}
                          </p>
                          <Link
                            to={feature.link}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 group-hover:text-cyan-400 transition-colors"
                          >
                            Learn more
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </section>

          {/* Featured Blogs Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      Latest Insights
                    </h2>
                    <p className="text-sm text-slate-400">
                      From our community of researchers
                    </p>
                  </div>
                  <Link
                    to="/blog"
                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-xl hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                  >
                    View all blogs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                  >
                    View all blogs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </section>

          {/* Upcoming Events Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
            <AnimatedSection>
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      Upcoming Events
                    </h2>
                    <p className="text-sm text-slate-400">
                      Join our talks, workshops, and community sessions
                    </p>
                  </div>
                  <Link
                    to="/events"
                    className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-xl hover:bg-slate-800 hover:border-blue-500/40 transition-all"
                  >
                    View all events
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                  >
                    View all events
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </section>

          {/* Newsletter Section */}
          <Newsletter />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SangyanHome;

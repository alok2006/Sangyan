import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  MessageCircle, 
  Calendar, 
  Sparkles,
  Check,
  ArrowRight,
  User,
  GraduationCap,
  Building,
  Github,
  Linkedin,
  Globe,
  Send,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  institute: string;
  course: string;
  yearOfStudy: string;
  interests: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  motivation: string;
  skills: string[];
  preferredRole: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Membership: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    institute: '',
    course: '',
    yearOfStudy: '',
    interests: [],
    github: '',
    linkedin: '',
    portfolio: '',
    motivation: '',
    skills: [],
    preferredRole: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const interestOptions = [
    'Physics', 'Chemistry', 'Biology', 'Mathematics', 
    'Computer Science', 'Data Science', 'AI/ML', 'Earth Sciences',
    'Interdisciplinary', 'Research', 'Teaching', 'Writing'
  ];

  const skillOptions = [
    'Research', 'Writing', 'Design', 'Web Development',
    'Data Analysis', 'Public Speaking', 'Event Management',
    'Social Media', 'Video Editing', 'Teaching'
  ];

  const roleOptions = [
    'Content Creator',
    'Event Organizer',
    'Community Manager',
    'Technical Lead',
    'Social Media Manager',
    'Designer',
    'Just want to participate'
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: 'Exclusive Content',
      description: 'Access to research papers, study materials, and expert insights'
    },
    {
      icon: Calendar,
      title: 'Priority Events',
      description: 'Early registration and exclusive invites to workshops and talks'
    },
    {
      icon: Users,
      title: 'Networking',
      description: 'Connect with students and researchers from top institutes'
    },
    {
      icon: Award,
      title: 'Certification',
      description: 'Get recognized for your contributions and achievements'
    },
    {
      icon: MessageCircle,
      title: 'Mentorship',
      description: 'One-on-one guidance from experienced researchers and professionals'
    },
    {
      icon: Sparkles,
      title: 'Opportunities',
      description: 'Internships, projects, and research collaboration opportunities'
    }
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: 'interests' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      console.log('Form submitted:', formData);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitStatus('idle');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          institute: '',
          course: '',
          yearOfStudy: '',
          interests: [],
          github: '',
          linkedin: '',
          portfolio: '',
          motivation: '',
          skills: [],
          preferredRole: ''
        });
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Fixed Video Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover scale-105 brightness-150"
        >
          <source src="/bg_video_3.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

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

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-4 h-4" />
                Join Our Community
              </motion.div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400">Member</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join a community of passionate learners, researchers, and innovators from leading institutes across India
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                onClick={() => document.getElementById('membership-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Member <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Benefits</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                What you get as a Sangyan community member
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group relative bg-slate-900/60 backdrop-blur-sm rounded-xl p-8 border border-slate-800 hover:border-cyan-500/30 overflow-hidden cursor-pointer"
                    whileHover={{ y: -10 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <div className="relative z-10">
                      <motion.div 
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-5"
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-7 h-7 text-cyan-400" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section id="membership-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Form</span>
              </h2>
              <p className="text-slate-400">
                Fill in your details to join our community
              </p>
            </motion.div>

            {submitStatus === 'success' ? (
              <motion.div 
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Application Submitted!</h3>
                <p className="text-slate-300 mb-6">
                  Thank you for your interest! We'll review your application and get back to you within 3-5 business days.
                </p>
                <motion.button
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Another Application
                </motion.button>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Institute *
                      </label>
                      <input
                        type="text"
                        name="institute"
                        value={formData.institute}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="IISER Pune"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                    Academic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Course/Program *
                      </label>
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="BS-MS, B.Tech, M.Sc, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Year of Study *
                      </label>
                      <select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Areas of Interest * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestOptions.map((interest) => (
                        <label
                          key={interest}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest)}
                            onChange={() => handleCheckboxChange('interests', interest)}
                            className="hidden"
                          />
                          {formData.interests.includes(interest) && (
                            <Check className="w-4 h-4 text-cyan-400" />
                          )}
                          <span className="text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Social Links (Optional)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Portfolio/Website
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Role */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    Skills & Interests
                  </h3>

                  {/* Skills */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Your Skills (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skillOptions.map((skill) => (
                        <label
                          key={skill}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                            formData.skills.includes(skill)
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill)}
                            onChange={() => handleCheckboxChange('skills', skill)}
                            className="hidden"
                          />
                          {formData.skills.includes(skill) && (
                            <Check className="w-4 h-4 text-cyan-400" />
                          )}
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Role */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      How would you like to contribute? *
                    </label>
                    <select
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    >
                      <option value="">Select Role</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Motivation */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    Tell Us About Yourself
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Why do you want to join Sangyan? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                      placeholder="Share your motivation, goals, and how you plan to contribute to the community..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Membership;

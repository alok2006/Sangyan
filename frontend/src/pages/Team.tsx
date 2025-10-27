import React, { useState } from 'react';
import { Mail, Linkedin, Github, Instagram, Search, UserPlus, Users as UsersIcon, Sparkles, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  institute: string;
  avatar?: string;
  bio: string;
  expertise: string[];
  social: {
    email?: string;
    linkedin?: string;
    github?: string;
  };
  featured?: boolean;
}

const teamMembers: TeamMember[] = [
  // Featured Developer - Sounish S.
  {
    id: '1',
    name: 'Sounish S.',
    role: 'Lead Developer & Visionary',
    institute: 'IISER Berhampur',
    bio: 'Founded the revolutionary idea of "Shodh" - transforming scientific research accessibility. Full-stack developer passionate about building platforms that empower student communities.',
    expertise: ['Web Development', 'React/TypeScript', 'Firebase', 'UI/UX Design', 'Innovation'],
    social: {
      email: 'sounish@sangyan.org',
      github: '#',
      linkedin: 'https://www.linkedin.com/in/sounish-singha-869544258/'
    },
    featured: true
  },
  // Founder and Executive Head
  {
    id: '2',
    name: 'Shrirang K.',
    role: 'Founder & Executive Head',
    institute: 'IISER Berhampur',
    bio: 'Visionary founder leading Sangyan\'s mission to create a collaborative scientific community. Passionate about fostering innovation and knowledge sharing.',
    expertise: ['Leadership', 'Strategic Planning', 'Community Building', 'Science Communication'],
    social: {
      email: 'shrirang@sangyan.org',
      linkedin: '#'
    }
  },
  // Founding Members and Coordinators
  {
    id: '3',
    name: 'Om',
    role: 'Founding Member & Coordinator',
    institute: 'IISER Berhampur',
    bio: 'Core founding member dedicated to organizing events and coordinating activities that bring together scientific minds.',
    expertise: ['Event Coordination', 'Team Management', 'Research'],
    social: {
      email: 'om@sangyan.org',
      linkedin: '#'
    }
  },
  {
    id: '4',
    name: 'Shreekant',
    role: 'Founding Member & Coordinator',
    institute: 'IISER Berhampur',
    bio: 'Passionate coordinator working to expand Sangyan\'s reach and impact across the student community.',
    expertise: ['Community Outreach', 'Content Creation', 'Collaboration'],
    social: {
      email: 'shreekant@sangyan.org',
      linkedin: '#'
    }
  },
  {
    id: '5',
    name: 'Saurabh',
    role: 'Founding Member & Coordinator',
    institute: 'IISER Berhampur',
    bio: 'Committed to building strong connections between students and fostering a culture of scientific curiosity.',
    expertise: ['Networking', 'Event Planning', 'Student Engagement'],
    social: {
      email: 'saurabh@sangyan.org',
      linkedin: '#'
    }
  },
  {
    id: '6',
    name: 'Parth',
    role: 'Founding Member & Coordinator',
    institute: 'IISER Berhampur',
    bio: 'Enthusiastic coordinator focused on creating meaningful learning experiences and collaborative opportunities.',
    expertise: ['Workshop Organization', 'Mentorship', 'Academic Support'],
    social: {
      email: 'parth@sangyan.org',
      linkedin: '#'
    }
  },
  {
    id: '7',
    name: 'Kartik',
    role: 'Founding Member & Coordinator',
    institute: 'IISER Berhampur',
    bio: 'Dedicated to empowering students through knowledge sharing and organizing impactful scientific initiatives.',
    expertise: ['Resource Management', 'Team Coordination', 'Innovation'],
    social: {
      email: 'kartik@sangyan.org',
      linkedin: '#'
    }
  }
];

const openPositions = [
  { title: 'Content Writer', department: 'Content', type: 'Volunteer' },
  { title: 'Graphic Designer', department: 'Design', type: 'Volunteer' },
  { title: 'Social Media Manager', department: 'Marketing', type: 'Volunteer' },
  { title: 'Event Organizer', department: 'Events', type: 'Volunteer' }
];

const Team: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredMembers(teamMembers);
      return;
    }

    const filtered = teamMembers.filter(member => 
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.role.toLowerCase().includes(query.toLowerCase()) ||
      member.institute.toLowerCase().includes(query.toLowerCase()) ||
      member.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredMembers(filtered);
  };

  // Get avatar initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  // Separate featured member from others
  const featuredMember = filteredMembers.find(m => m.featured);
  const otherMembers = filteredMembers.filter(m => !m.featured);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <UsersIcon className="w-6 h-6 text-blue-400" />
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h1>
              <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Meet the passionate innovators driving Sangyan forward — students dedicated to making learning accessible, joyful, and collaborative.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search team members by name, role, or expertise..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Member - Sounish S. */}
        {featuredMember && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Spotlight Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">
                {/* Featured Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-5 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">LEAD DEVELOPER</span>
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl border-4 border-white/10">
                      <span className="text-4xl font-bold text-white">{getInitials(featuredMember.name)}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                      {featuredMember.name}
                    </h2>
                    <p className="text-base text-cyan-400 font-semibold mb-2">{featuredMember.role}</p>
                    <p className="text-sm text-slate-400 mb-3 flex items-center justify-center md:justify-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {featuredMember.institute}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{featuredMember.bio}</p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {featuredMember.expertise.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-medium backdrop-blur-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2 justify-center md:justify-start">
                      {featuredMember.social.email && (
                        <a 
                          href={`mailto:${featuredMember.social.email}`}
                          className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {featuredMember.social.github && (
                        <a 
                          href={featuredMember.social.github}
                          className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {featuredMember.social.linkedin && (
                        <a 
                          href={featuredMember.social.linkedin}
                          className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Team Grid - Other Members */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {otherMembers.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {otherMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  {/* Avatar */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold text-white">{getInitials(member.name)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
                    </div>
                  </div>

                  {/* Institute */}
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-blue-400 rounded-full" />
                    {member.institute}
                  </p>

                  {/* Bio */}
                  <p className="text-slate-300 text-xs leading-relaxed mb-3">
                    {member.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {member.expertise.slice(0, 3).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    {member.social.email && (
                      <a 
                        href={`mailto:${member.social.email}`}
                        className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a 
                        href={member.social.github}
                        className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a 
                        href={member.social.linkedin}
                        className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm">No team members found matching your search.</p>
            </div>
          )}
        </div>

        {/* Join Us Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <UserPlus className="w-6 h-6 text-blue-400" />
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Join Our Team
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-6">
              Interested in volunteering? Help us organize events, create content, manage community, or build our technical infrastructure. We're always looking for passionate contributors!
            </p>

            {/* Open Positions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {openPositions.map((position, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-3 hover:border-blue-500/40 transition-all"
                >
                  <h3 className="font-semibold text-sm text-white mb-1">{position.title}</h3>
                  <p className="text-xs text-slate-400">
                    {position.department} • {position.type}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={`mailto:${SANGYAN_CONFIG.contact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 font-semibold"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </motion.div>
        </div>

        <Newsletter />
      </div>
      <Footer />
    </>
  );
};

export default Team;

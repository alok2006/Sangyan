import React from 'react';
import { Target, Users, Lightbulb, Heart, Award, Globe, Mail, Instagram, ExternalLink, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

const About: React.FC = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Curiosity-Driven',
      description: 'We believe curiosity is the foundation of learning. We encourage questions, exploration, and the joy of discovery.'
    },
    {
      icon: Users,
      title: 'Community-First',
      description: 'Built by volunteers, for learners. Every initiative is driven by passionate individuals committed to shared growth.'
    },
    {
      icon: Globe,
      title: 'Open & Inclusive',
      description: 'Knowledge should be accessible to everyone. We create spaces where all voices are heard and valued.'
    },
    {
      icon: Heart,
      title: 'Collaborative',
      description: 'Learning happens best together. We foster collaboration across disciplines, institutes, and backgrounds.'
    }
  ];

  const milestones = [
    { year: '2023', title: 'Founded', description: 'Sangyan was born from a vision to connect curious minds across India' },
    { year: '2024', title: 'Community Growth', description: 'Reached 2,000+ members from 20+ institutes nationwide' },
    { year: '2024', title: '50+ Events', description: 'Organized talks, workshops, and discussions with leading researchers' },
    { year: '2025', title: 'Platform Launch', description: 'Launched our digital platform for seamless knowledge sharing' }
  ];

  const stats = [
    { number: '2,000+', label: 'Community Members' },
    { number: '150+', label: 'Research Articles' },
    { number: '50+', label: 'Events Hosted' },
    { number: '20+', label: 'Partner Institutes' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Sangyan
          </h1>
          <p className="text-base text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Sangyan is a student-driven platform fostering curiosity, collaboration, and continuous learning. We connect passionate learners and researchers from top institutes across India, creating spaces for knowledge sharing, meaningful discussions, and collective growth.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  To make quality education and research accessible to everyone by building collaborative learning communities, sharing knowledge freely, and fostering scientific curiosity across disciplines and institutes.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A world where learning is joyful, collaborative, and accessible to all—where students and researchers connect across boundaries to explore ideas, solve problems, and create positive impact together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Our Core Values</h2>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Impact by Numbers</h2>
            <p className="text-base text-gray-400">
              Growing together, one step at a time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 text-center group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Our Journey</h2>
            <p className="text-base text-gray-400">
              Key milestones in our story
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="relative flex gap-6 group"
              >
                {/* Timeline Line */}
                {index !== milestones.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                )}

                {/* Year Badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                    {milestone.year.slice(-2)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 group-hover:border-cyan-500/30 rounded-xl p-5 transition-all duration-300">
                    <div className="text-xs text-cyan-400 font-medium mb-1">
                      {milestone.year}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Join Our Community
              </h2>
              <p className="text-sm text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
                Be part of a growing community of curious minds. Connect, learn, and grow with students and researchers from across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:scale-105">
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white rounded-full font-semibold text-sm transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                  Follow Us
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Instagram, Linkedin, Mail, Heart, ExternalLink, Github, Twitter } from 'lucide-react';
import { SANGYAN_CONFIG } from '../config/sangyan.config';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Research Blogs', path: `/blogs` },
      { name: 'Events & Workshops', path: `/events` },
      { name: 'Learning Resources', path: `/resources` },
      { name: 'Our Team', path: `/team` }
    ],
    community: [
      { name: 'About Us', path: `/about` },
      { name: 'Join the Community', path: `/membership` },
      { name: 'Contribute Content', path: `/about#contribute` },
      { name: 'Partner Institutes', path: `/about#partners` }
    ],
    categories: SANGYAN_CONFIG.categories.slice(0, 5).map(cat => ({
      name: cat,
      path: `/blogs?category=${cat}`
    }))
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="relative bg-[#0f0f0f] border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to={`/`} className="inline-flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sangyan
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
              A student-driven platform fostering curiosity, collaboration, and continuous learning across India's top institutes.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg text-gray-400 hover:text-cyan-400 transition-all group"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {currentYear} Sangyan. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
              <span>by the Sangyan Community</span>
            </div>

            <div className="flex gap-4 text-xs">
              <Link to="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

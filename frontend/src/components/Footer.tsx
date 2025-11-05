import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Instagram, Linkedin, Mail, Heart, ExternalLink, Github, Twitter, Layers } from 'lucide-react'; // Added Layers icon for categories
import { SANGYAN_CONFIG } from '../config/sangyan.config';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Define links structure outside the component for cleaner code if possible, but fine here for context.
  const footerLinks = {
    explore: [
      { name: 'Research Blogs', path: `/blogs` },
      { name: 'Events & Workshops', path: `/events` },
      // { name: 'Learning Resources', path: `/resources` }, // Retained commented link
      { name: 'Our Team', path: `/team` }
    ],
    community: [
      { name: 'About Us', path: `/about` },
      { name: 'Join the Community', path: `/membership` },
      { name: 'Contribute Content', path: `/about#contribute` },
      { name: 'Partner Institutes', path: `/about#partners` }
    ],
    // Categories are now included and mapped
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
  
  // --- Enhanced Sub-Component for Link Columns ---
  const FooterLinkColumn = ({ title, links, IconComponent }) => (
    <div>
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <IconComponent className="w-4 h-4 text-cyan-400" />
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors relative before:content-[''] before:absolute before:w-0 before:h-[1px] before:bottom-0 before:left-0 before:bg-cyan-400 before:transition-all before:duration-300 hover:before:w-full"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-[#0d0d0d] border-t border-cyan-500/10 backdrop-blur-sm">
      
      {/* Subtle Star/Dot Background Pattern - Enhanced for depth */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-8 mb-16">
          
          {/* Brand and Description Section (Takes 2/5 columns on large screens) */}
          <div className="col-span-2 lg:col-span-2">
            <Link to={`/`} className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative p-2 bg-cyan-600/10 border border-cyan-500/30 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/10 transition-shadow">
                <Lightbulb className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-widest">
                SANGYAN
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-xs">
              A student-driven platform fostering curiosity, collaboration, and continuous learning across India's top institutes.
            </p>
            
            {/* Social Links - Enhanced Hover and Ring */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-3 bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-full text-gray-400 hover:text-cyan-400 transition-all duration-300 ring-1 ring-transparent hover:ring-cyan-500/30"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Links (1/5 columns) */}
          <div className="col-span-1">
            <FooterLinkColumn title="Explore" links={footerLinks.explore} IconComponent={ExternalLink} />
          </div>

          {/* Community Links (1/5 columns) */}
          <div className="col-span-1">
            <FooterLinkColumn title="Community" links={footerLinks.community} IconComponent={Heart} />
          </div>

          {/* Categories (New 1/5 column) */}
          <div className="col-span-2 md:col-span-1">
            <FooterLinkColumn title="Categories" links={footerLinks.categories} IconComponent={Layers} />
          </div>
          
        </div>

        {/* --- Bottom Bar with Divider and Flex Layout --- */}
        <div className="pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright and Creator */}
            <div className="order-2 md:order-1 flex items-center gap-4 text-xs text-gray-500">
                <p className="text-center md:text-left">
                  © {currentYear} **SANGYAN**. All rights reserved.
                </p>
                <div className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-4">
                  <span>Built with</span>
                  <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                  <span>by the Community</span>
                </div>
            </div>

            {/* Legal Links */}
            <div className="order-1 md:order-2 flex gap-6 text-sm">
              <Link to="#" className="text-gray-500 hover:text-cyan-400 transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-500 hover:text-cyan-400 transition-colors font-medium">
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
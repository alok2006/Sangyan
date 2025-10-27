import React from 'react';
import { Linkedin, Github, Twitter, Mail } from 'lucide-react';
import { TeamMember as TeamMemberType } from '../types';

interface TeamMemberProps {
  member: TeamMemberType;
}

const TeamMember: React.FC<TeamMemberProps> = ({ member }) => {
  return (
    <div className="group relative bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/10 hover:border-pink-500/30 rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10">
      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

      <div className="relative z-10">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        {/* Name & Role */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-cyan-400 font-medium mb-1">
            {member.role}
          </p>
          <p className="text-xs text-gray-500">
            {member.institute}
          </p>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="text-sm text-gray-400 text-center mb-4 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Social Links */}
        {member.social && (
          <div className="flex justify-center gap-2">
            {member.social.linkedin && (
              <a
                href={member.social.linkedin}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-gray-400 hover:text-pink-400 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.social.github && (
              <a
                href={member.social.github}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-gray-400 hover:text-pink-400 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.social.twitter && (
              <a
                href={member.social.twitter}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-gray-400 hover:text-pink-400 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {member.social.email && (
              <a
                href={`mailto:${member.social.email}`}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 rounded-lg text-gray-400 hover:text-pink-400 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;

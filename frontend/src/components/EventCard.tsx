import React from 'react';
import { Calendar, Clock, MapPin, Users, Video, ExternalLink, Zap } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const typeColors: Record<string, string> = {
    talk: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    workshop: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    project: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    discussion: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    seminar: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    panel: 'bg-blue-400/20 text-blue-300 border-blue-400/30'
  };

  const spotsLeft = event.maxParticipants && event.currentParticipants
    ? event.maxParticipants - event.currentParticipants
    : null;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover-lift animate-fade-in-up">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Thumbnail */}
      {event.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          {/* Spots Alert */}
          {spotsLeft && spotsLeft <= 10 && spotsLeft > 0 && (
            <div className="absolute top-3 right-3 animate-bounce-in animate-glow-pulse">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Only {spotsLeft} spots left!
              </div>
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3 animate-slide-in-left">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${typeColors[event.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} transform group-hover:scale-110 transition-transform duration-300`}>
              {event.type.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-5 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-white text-xl line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-500 animate-slide-in-right animation-delay-100">
          {event.title}
        </h3>

        {/* Speaker */}
        {event.speaker && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 group-hover:border-cyan-500/30 transition-all duration-300 animate-slide-in-right animation-delay-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              {event.speaker.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{event.speaker.name}</p>
              <p className="text-sm text-slate-400 truncate">{event.speaker.institute}</p>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-3 group-hover:text-slate-200 transition-colors duration-300 animate-slide-in-right animation-delay-300">
          {event.description}
        </p>

        {/* Date, Time, Venue */}
        <div className="space-y-2 text-sm animate-slide-in-right animation-delay-400">
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
            <Calendar className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
            <span>
              {new Date(event.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
            <Clock className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
            {event.venue.toLowerCase().includes('online') ? (
              <Video className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <MapPin className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
            )}
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Participants */}
        {event.maxParticipants && event.currentParticipants !== undefined && (
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 group-hover:border-cyan-500/30 transition-all duration-300 animate-slide-in-right animation-delay-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Participants
              </span>
              <span className="text-sm font-bold text-white">
                {event.currentParticipants} / {event.maxParticipants}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transform origin-left transition-all duration-1000 ease-out group-hover:animate-pulse"
                style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        {event.registrationLink && (
          <div className="animate-slide-in-right animation-delay-600">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 magnetic-button group/btn"
            >
              Register Now
              <ExternalLink className="w-4 h-4 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
            </a>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/30 rounded-xl transition-all duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default EventCard;

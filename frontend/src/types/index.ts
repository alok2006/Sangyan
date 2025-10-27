export interface Author {
  name: string;
  institute: string;
  avatar?: string;
  bio?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  author: Author;
  category: string | 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Earth Sciences' | 'Computer Science' | 'Interdisciplinary' | 'Data Science';
  tags: string[];
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string | Date;
  readTime: number; // in minutes
  views?: number;
  likes?: number;
  featured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  type: string |'talk' | 'workshop' | 'project' | 'discussion' | 'seminar';
  slug?: string;
  date: string | Date;
  time: string;
  venue: string;
  image: string;
  mode?: 'online' | 'offline' | 'hybrid';
  tags?: string[];
  speaker?: {
    name: string;
    designation?: string;
    institute: string;
    avatar?: string;
  };
  description: string;
  registrationLink?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  isPast?: boolean;
  thumbnail?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'video' | 'article' | 'slides' | 'notes' | 'paper';
  description: string;
  link: string;
  date: string;
  author: string;
  thumbnail?: string;
  downloads?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institute: string;
  bio?: string;
  avatar?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
}

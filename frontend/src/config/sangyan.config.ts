export const SANGYAN_CONFIG = {
  name: 'The Sangyan Community',
  tagline: 'Making knowledge open, joyful, and useful',
  description: 'A volunteer-driven platform that cultivates curiosity and shared learning — connecting thinkers, learners, and doers through talks, workshops, and creative outreach.',
  
  contact: {
    email: 'sangyan@iiserbpr.ac.in',
    instagram: 'https://www.instagram.com/sangyan.in/',
    linkedin: 'https://in.linkedin.com/company/sangyan-community'
  },
  
  // For easy separation: change to true when making it standalone
  isStandalone: false,
  
  // Base path - change to '/' when standalone
  basePath: '/sangyan',
  
  // API endpoints - easy to switch to separate backend
  api: {
    blogs: '/api/sangyan/blogs',
    events: '/api/sangyan/events',
    resources: '/api/sangyan/resources',
    team: '/api/sangyan/team',
    newsletter: '/api/sangyan/newsletter'
  },
  
  categories: [
    'Physics',
    'Chemistry', 
    'Biology',
    'Mathematics',
    'Earth Sciences',
    'Computer Science',
    'Interdisciplinary'
  ] as const
};

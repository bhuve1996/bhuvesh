// Site Configuration
export const SITE_CONFIG = {
  name: 'Bhuvesh Singla',
  title: 'Full-Stack Developer & Portfolio',
  description:
    'Experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies.',
  url: 'https://bhuvesh.com',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/bhuvesh-singla',
    linkedin: 'https://linkedin.com/in/bhuvesh-singla',
    twitter: 'https://twitter.com/bhuvesh_singla',
    email: 'mailto:bhuve1996@gmail.com',
  },
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { label: 'About', href: '/about', type: 'route' },
  // { label: 'Projects', href: '/projects', type: 'route' }, // Commented out
  { label: 'Resume Builder', href: '/resume/builder', type: 'route' },
  { label: 'Templates', href: '/resume/templates', type: 'route' },
  { label: 'ATS Checker', href: '/resume/ats-checker', type: 'route' },
  // { label: 'Blog', href: '/blog', type: 'route' }, // Commented out
  { label: 'Contact', href: '/contact', type: 'route' },
] as const;

// Animation Delays
export const ANIMATION_DELAYS = {
  fast: 100,
  medium: 200,
  slow: 300,
  slower: 500,
} as const;

// Common CSS Classes
export const COMMON_CLASSES = {
  // Layout
  container: 'max-w-7xl mx-auto px-6',
  section: 'py-20 px-6',
  sectionTitle: 'text-4xl md:text-5xl font-bold mb-6 gradient-text',
  sectionSubtitle: 'text-xl text-neutral-300 max-w-3xl mx-auto',

  // Cards
  card: 'bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300',
  cardHover: 'hover:border-primary-500/50 hover:bg-neutral-800/50',

  // Buttons
  buttonPrimary:
    'bg-primary-500 hover:bg-primary-600 text-primary-950 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary-500/25',
  buttonSecondary:
    'bg-secondary-500 hover:bg-secondary-600 text-secondary-950 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-secondary-500/25',
  buttonOutline:
    'border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-primary-950 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95',

  // Animations
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',

  // Glass Effects
  glass: 'bg-white/5 backdrop-blur-md border border-white/10',
  glassDark: 'bg-black/20 backdrop-blur-md border border-white/5',

  // Gradients
  gradientText:
    'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent',
} as const;

// Tech Stack
export const TECH_STACK = {
  frontend: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Sass',
    'Figma',
  ],
  backend: [
    'Node.js',
    'Python',
    'Express.js',
    'Django',
    'FastAPI',
    'REST APIs',
    'GraphQL',
    'Microservices',
  ],
  database: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'Supabase'],
  cloud: [
    'AWS',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Terraform',
    'Jenkins',
  ],
  tools: [
    'Git',
    'GitHub',
    'VS Code',
    'Webpack',
    'Vite',
    'Jest',
    'Cypress',
    'Postman',
  ],
} as const;

// Social Links
export const SOCIAL_LINKS = [
  { name: 'GitHub', url: SITE_CONFIG.links.github, icon: 'github' },
  { name: 'LinkedIn', url: SITE_CONFIG.links.linkedin, icon: 'linkedin' },
  { name: 'Twitter', url: SITE_CONFIG.links.twitter, icon: 'twitter' },
  { name: 'Email', url: SITE_CONFIG.links.email, icon: 'email' },
] as const;

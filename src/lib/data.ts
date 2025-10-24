import {
  BlogPost,
  Certification,
  Education,
  Experience,
  ProcessStep,
  Project,
  Service,
  Skills,
  Testimonial,
} from './data-types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with React, Node.js, and MongoDB',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Portfolio Website',
    description:
      'Modern portfolio website with animations and responsive design',
    tech: ['Next.js', 'Tailwind', 'Framer Motion'],
    status: 'Completed',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js 15',
    excerpt:
      'Learn how to leverage the latest features in Next.js 15 to build performant and scalable web applications.',
    content:
      "Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced security. In this comprehensive guide, we'll explore how to build modern web applications using the latest version of Next.js...",
    author: 'Bhuvesh Singla',
    category: 'Web Development',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Next.js', 'React', 'JavaScript', 'Web Development'],
  },
  {
    id: '2',
    title: 'Mastering TypeScript for Large-Scale Applications',
    excerpt:
      'Discover best practices for using TypeScript in enterprise-level applications and how it improves code quality.',
    content:
      'TypeScript has become the standard for large-scale JavaScript applications. This article covers advanced TypeScript patterns, type safety strategies, and how to maintain clean, scalable code...',
    author: 'Bhuvesh Singla',
    category: 'Programming',
    date: '2024-01-10',
    readTime: '12 min read',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
  },
  {
    id: '3',
    title: 'The Future of Web Development: AI and Machine Learning Integration',
    excerpt:
      'Exploring how AI and ML are revolutionizing web development and what developers need to know.',
    content:
      'Artificial Intelligence is transforming how we build and interact with web applications. From automated code generation to intelligent user interfaces, AI is reshaping the development landscape...',
    author: 'Bhuvesh Singla',
    category: 'AI & ML',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['AI', 'Machine Learning', 'Web Development', 'Future Tech'],
  },
  {
    id: '4',
    title: 'Optimizing React Performance: A Complete Guide',
    excerpt:
      'Learn advanced techniques to optimize React applications for better performance and user experience.',
    content:
      'Performance optimization is crucial for React applications. This guide covers memoization, code splitting, lazy loading, and other advanced techniques to make your React apps lightning fast...',
    author: 'Bhuvesh Singla',
    category: 'Web Development',
    date: '2024-01-01',
    readTime: '15 min read',
    tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
  },
  {
    id: '5',
    title: 'Building Accessible Web Applications',
    excerpt:
      'A comprehensive guide to creating web applications that are accessible to all users, including those with disabilities.',
    content:
      'Web accessibility is not just a legal requirement but a moral imperative. Learn how to build applications that work for everyone, including users with visual, auditory, motor, and cognitive disabilities...',
    author: 'Bhuvesh Singla',
    category: 'Accessibility',
    date: '2023-12-28',
    readTime: '9 min read',
    tags: ['Accessibility', 'Web Development', 'UX', 'Inclusive Design'],
  },
  {
    id: '6',
    title: 'My Journey from Designer to Full-Stack Developer',
    excerpt:
      'Personal insights and lessons learned while transitioning from design to development.',
    content:
      "Transitioning from design to development was one of the most challenging yet rewarding decisions of my career. Here's what I learned along the way and how it shaped my approach to building digital products...",
    author: 'Bhuvesh Singla',
    category: 'Career',
    date: '2023-12-20',
    readTime: '6 min read',
    tags: ['Career', 'Personal', 'Design', 'Development'],
  },
];

export const experience: Experience[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    company: 'Tech Innovations Inc.',
    position: 'Senior Full-Stack Developer',
    startDate: '2022-01-01',
    location: 'San Francisco, CA',
    period: '2022 - Present',
    type: 'Full-time',
    description:
      'Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.',
    achievements: [
      'Increased application performance by 40% through optimization',
      'Led a team of 5 developers on major product launches',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
      'Mentored 3 junior developers to senior level',
    ],
    technologies: [
      'React',
      'Node.js',
      'TypeScript',
      'AWS',
      'Docker',
      'Kubernetes',
    ],
  },
  {
    id: '2',
    title: 'Full-Stack Developer',
    company: 'Digital Solutions Ltd.',
    position: 'Full-Stack Developer',
    startDate: '2020-01-01',
    location: 'New York, NY',
    period: '2020 - 2022',
    type: 'Full-time',
    description:
      'Developed and maintained multiple web applications for clients across various industries. Collaborated with design teams to create user-friendly interfaces.',
    achievements: [
      'Built 15+ client applications with 99.9% uptime',
      'Reduced bug reports by 50% through improved testing',
      'Implemented responsive designs for mobile-first approach',
      'Collaborated with 10+ cross-functional teams',
    ],
    technologies: [
      'React',
      'Vue.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'Redis',
    ],
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Creative Agency Pro',
    position: 'Frontend Developer',
    startDate: '2019-01-01',
    location: 'Los Angeles, CA',
    period: '2019 - 2020',
    type: 'Full-time',
    description:
      'Specialized in creating interactive and responsive user interfaces. Worked closely with designers to bring creative visions to life.',
    achievements: [
      'Created 20+ responsive websites with modern animations',
      'Improved page load speeds by 35%',
      'Implemented accessibility standards (WCAG 2.1)',
      'Collaborated with 5+ design teams',
    ],
    technologies: [
      'JavaScript',
      'React',
      'Sass',
      'Webpack',
      'Figma',
      'Adobe Creative Suite',
    ],
  },
  {
    id: '4',
    title: 'Junior Web Developer',
    company: 'StartupHub',
    position: 'Junior Web Developer',
    startDate: '2018-01-01',
    location: 'Austin, TX',
    period: '2018 - 2019',
    type: 'Full-time',
    description:
      'Started my professional journey building web applications and learning modern development practices in a fast-paced startup environment.',
    achievements: [
      'Built first production application from scratch',
      'Learned agile development methodologies',
      'Contributed to open-source projects',
      'Completed 50+ code reviews',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap', 'Git'],
  },
];

export const education: Education[] = [
  {
    id: '1',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of California, Berkeley',
    field: 'Computer Science',
    school: 'University of California, Berkeley',
    startDate: '2014-09-01',
    location: 'Berkeley, CA',
    period: '2014 - 2018',
    gpa: '3.8/4.0',
    relevant_courses: [
      'Data Structures and Algorithms',
      'Software Engineering',
      'Database Systems',
      'Web Development',
      'Machine Learning',
    ],
  },
  {
    id: '2',
    degree: 'Full-Stack Web Development Bootcamp',
    institution: 'General Assembly',
    field: 'Web Development',
    school: 'General Assembly',
    startDate: '2018-01-01',
    location: 'San Francisco, CA',
    period: '2018',
    gpa: 'Graduated with Honors',
    relevant_courses: [
      'React and Redux',
      'Node.js and Express',
      'MongoDB and SQL',
      'RESTful APIs',
      'Agile Development',
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023',
    credential_id: 'AWS-CSA-123456',
  },
  {
    id: '2',
    name: 'Google Cloud Professional Developer',
    issuer: 'Google Cloud',
    date: '2022',
    credential_id: 'GCP-PD-789012',
  },
  {
    id: '3',
    name: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    date: '2022',
    credential_id: 'CKA-345678',
  },
  {
    id: '4',
    name: 'React Developer Certification',
    issuer: 'Meta',
    date: '2021',
    credential_id: 'META-REACT-901234',
  },
];

export const skills: Skills = {
  technical: [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'Docker',
    'Kubernetes',
  ],
  soft: [
    'Problem Solving',
    'Team Leadership',
    'Communication',
    'Project Management',
    'Mentoring',
  ],
  languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)'],
  Frontend: [
    'React',
    'Next.js',
    'Vue.js',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Sass',
    'Figma',
  ],
  Backend: [
    'Node.js',
    'Python',
    'Express.js',
    'Django',
    'FastAPI',
    'REST APIs',
    'GraphQL',
    'Microservices',
  ],
  Database: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Firebase', 'Supabase'],
  DevOps: [
    'AWS',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Terraform',
    'Jenkins',
  ],
  Tools: [
    'Git',
    'GitHub',
    'VS Code',
    'Webpack',
    'Vite',
    'Jest',
    'Cypress',
    'Postman',
  ],
};

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    icon: '🌐',
    description:
      'Custom web applications built with modern technologies and best practices.',
    features: [
      'Responsive Design',
      'Performance Optimization',
      'SEO Optimization',
      'Cross-browser Compatibility',
      'Mobile-first Approach',
      'Accessibility Compliance',
    ],
    technologies: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    icon: '📱',
    description:
      'Native and cross-platform mobile applications for iOS and Android.',
    features: [
      'Cross-platform Development',
      'Native Performance',
      'App Store Optimization',
      'Push Notifications',
      'Offline Functionality',
      'User Authentication',
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
  },
  {
    id: 'backend-development',
    title: 'Backend Development',
    icon: '⚙️',
    description:
      'Scalable server-side applications and APIs for your business needs.',
    features: [
      'RESTful APIs',
      'GraphQL APIs',
      'Database Design',
      'Authentication & Authorization',
      'Cloud Integration',
      'Microservices Architecture',
    ],
    technologies: [
      'Node.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'AWS',
      'Docker',
    ],
  },
  {
    id: 'e-commerce',
    title: 'E-commerce Solutions',
    icon: '🛒',
    description:
      'Complete e-commerce platforms with payment integration and inventory management.',
    features: [
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Processing',
      'Customer Management',
      'Analytics Dashboard',
      'Multi-vendor Support',
    ],
    technologies: [
      'Shopify',
      'WooCommerce',
      'Stripe',
      'PayPal',
      'React',
      'Node.js',
    ],
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    icon: '💡',
    description:
      'Expert guidance on technology decisions, architecture, and development strategies.',
    features: [
      'Technology Assessment',
      'Architecture Planning',
      'Code Review',
      'Performance Audit',
      'Security Assessment',
      'Team Training',
    ],
    technologies: ['Various', 'Best Practices', 'Industry Standards'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    icon: '🔧',
    description:
      'Ongoing maintenance, updates, and support for your existing applications.',
    features: [
      'Bug Fixes',
      'Security Updates',
      'Performance Monitoring',
      'Feature Enhancements',
      '24/7 Support',
      'Backup & Recovery',
    ],
    technologies: ['Various', 'Monitoring Tools', 'CI/CD'],
  },
];

export const process: ProcessStep[] = [
  {
    id: '1',
    step: 1,
    title: 'Discovery & Planning',
    description:
      'We start by understanding your requirements, goals, and target audience.',
    icon: '🔍',
    order: 1,
  },
  {
    id: '2',
    step: 2,
    title: 'Design & Prototyping',
    description:
      'Creating wireframes, mockups, and interactive prototypes for your approval.',
    icon: '🎨',
    order: 2,
  },
  {
    id: '3',
    step: 3,
    title: 'Development',
    description:
      'Building your application using modern technologies and best practices.',
    icon: '💻',
    order: 3,
  },
  {
    id: '4',
    step: 4,
    title: 'Testing & Quality Assurance',
    description:
      'Thorough testing to ensure your application works perfectly across all devices.',
    icon: '🧪',
    order: 4,
  },
  {
    id: '5',
    step: 5,
    title: 'Deployment & Launch',
    description:
      'Deploying your application and ensuring everything runs smoothly.',
    icon: '🚀',
    order: 5,
  },
  {
    id: '6',
    step: 6,
    title: 'Support & Maintenance',
    description:
      'Ongoing support and maintenance to keep your application running smoothly.',
    icon: '🔧',
    order: 6,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content:
      'Bhuvesh delivered an exceptional web application that exceeded our expectations. His attention to detail and technical expertise made all the difference.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Founder',
    company: 'Digital Agency',
    content:
      'Working with Bhuvesh was a game-changer for our business. He understood our vision and brought it to life with cutting-edge technology.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'Retail Corp',
    content:
      'The website Bhuvesh built for us has significantly improved our online presence and customer engagement. Highly recommended!',
    rating: 5,
  },
];

export const skillsList = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind',
  'Node.js',
  'MongoDB',
  'Python',
  'Git',
  'Docker',
];

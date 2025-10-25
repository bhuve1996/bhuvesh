import { ResumeData } from '@/types/resume';

// Comprehensive sample data for template previews
export const sampleResumeData: ResumeData = {
  personal: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    portfolio: 'alexjohnson.dev',
    jobTitle: 'Senior Software Engineer',
  },
  summary:
    'Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring junior developers. Proven track record of delivering high-quality software solutions that drive business growth.',
  experience: [
    {
      id: 'exp-1',
      position: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description:
        'Lead development of microservices architecture serving 1M+ users. Mentor junior developers and drive technical decisions.',
      achievements: [
        'Reduced system latency by 40% through performance optimization',
        'Led migration to cloud-native architecture, saving $200K annually',
        'Mentored 3 junior developers, improving team productivity by 25%',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
      ],
    },
    {
      id: 'exp-2',
      position: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description:
        'Developed and maintained web applications using modern JavaScript frameworks and cloud technologies.',
      achievements: [
        'Built responsive web application serving 50K+ daily active users',
        'Implemented automated testing suite with 90% code coverage',
        'Collaborated with cross-functional teams to deliver features on time',
        'Optimized database queries improving page load times by 35%',
      ],
    },
    {
      id: 'exp-3',
      position: 'Junior Developer',
      company: 'WebSolutions Ltd.',
      location: 'New York, NY',
      startDate: '2019',
      endDate: '2020',
      current: false,
      description:
        'Developed frontend components and integrated with backend APIs.',
      achievements: [
        'Created reusable React components used across 5+ projects',
        'Participated in agile development process and daily standups',
        'Fixed critical bugs improving application stability',
        'Contributed to code reviews and documentation',
      ],
    },
  ],
  skills: {
    technical: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'REST APIs',
    ],
    business: [
      'Project Management',
      'Team Leadership',
      'Agile/Scrum',
      'Technical Writing',
      'Client Communication',
      'Problem Solving',
    ],
    soft: [
      'Leadership',
      'Mentoring',
      'Collaboration',
      'Adaptability',
      'Critical Thinking',
      'Communication',
    ],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional',
    ],
  },
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      current: false,
      gpa: '3.8',
    },
    {
      id: 'edu-2',
      degree: 'Certificate',
      field: 'Cloud Architecture',
      institution: 'AWS Training Center',
      location: 'Online',
      startDate: '2021',
      endDate: '2021',
      current: false,
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-commerce Platform',
      description:
        'Full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.',
      startDate: '2023',
      endDate: '2023',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'AWS'],
    },
    {
      id: 'proj-2',
      name: 'Task Management App',
      description:
        'Collaborative task management application with real-time updates and team collaboration features.',
      startDate: '2022',
      endDate: '2022',
      technologies: ['Vue.js', 'Express.js', 'Socket.io', 'MongoDB', 'Docker'],
    },
    {
      id: 'proj-3',
      name: 'Data Visualization Dashboard',
      description:
        'Interactive dashboard for visualizing business metrics and KPIs with real-time data updates.',
      startDate: '2021',
      endDate: '2021',
      technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL', 'Chart.js'],
    },
  ],
  achievements: [
    'AWS Certified Solutions Architect - Professional',
    'Led team of 5 developers in successful product launch',
    'Published 3 technical articles on software architecture',
    'Speaker at TechConf 2023 on microservices best practices',
    'Open source contributor with 500+ GitHub stars',
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      name: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
    },
  ],
};

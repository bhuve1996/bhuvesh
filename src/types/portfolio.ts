// Portfolio and Data Structure Types
// Consolidated from src/lib/data-types.ts to eliminate duplication

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// Project types (Portfolio-specific, different from ATS Project)
export interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  tech: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  image?: string;
  link?: string;
  github?: string;
}

// Blog types
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  slug?: string;
}

// Experience types
export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Education types (Portfolio-specific, different from ATS Education)
export interface PortfolioEducation {
  id: number;
  degree: string;
  school: string;
  location: string;
  period: string;
  gpa: string;
  relevant_courses: string[];
}

// Certification types (Portfolio-specific, different from ATS Certification)
export interface PortfolioCertification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credential_id: string;
  link: string;
}

// Skills types
export interface Skills {
  [category: string]: string[];
}

// Service types
export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  technologies: string[];
  pricing: string;
  timeline: string;
  popular: boolean;
}

// Process types
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

// Testimonial types
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  project: string;
}

// Contact form types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

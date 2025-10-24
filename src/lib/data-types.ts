// Data types for the application

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  image?: string;
  status?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
  title?: string;
  location?: string;
  period?: string;
  type?: string;
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  school?: string;
  location?: string;
  period?: string;
  relevant_courses?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credential_id?: string;
  url?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  category: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  excerpt?: string;
  category?: string;
  readTime?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
  Frontend?: string[];
  Backend?: string[];
  Database?: string[];
  DevOps?: string[];
  Tools?: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  technologies?: string[];
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  step?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  position?: string;
  image?: string;
}

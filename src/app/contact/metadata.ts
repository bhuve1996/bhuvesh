import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Bhuvesh Singla | Full-Stack Developer - Get In Touch',
  description:
    'Get in touch with Bhuvesh Singla for web development projects, consulting, or collaboration opportunities. Available for React, Next.js, and full-stack development services.',
  keywords: [
    'Contact Bhuvesh Singla',
    'Hire Full-Stack Developer',
    'Web Development Services',
    'React Developer Contact',
    'Next.js Developer Hire',
    'Software Engineer Contact',
    'Web Development Consultation',
    'Developer Services',
    'Tech Consulting',
    'Project Collaboration',
    'Freelance Developer',
    'Development Services',
  ],
  openGraph: {
    title: 'Contact Bhuvesh Singla | Full-Stack Developer',
    description:
      'Get in touch for web development projects, consulting, or collaboration opportunities.',
    url: 'https://bhuvesh.com/contact',
    type: 'website',
    images: [
      {
        url: '/og-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Bhuvesh Singla - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Bhuvesh Singla | Full-Stack Developer',
    description:
      'Get in touch for web development projects and collaboration opportunities.',
    images: ['/og-contact.png'],
  },
  alternates: {
    canonical: '/contact',
  },
};

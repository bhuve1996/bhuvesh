import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Development Services | Bhuvesh Singla - Full-Stack Developer',
  description:
    'Professional web development services including React applications, Next.js websites, mobile apps, e-commerce solutions, and technical consulting. Get custom web solutions built with modern technologies.',
  keywords: [
    'Web Development Services',
    'React Development Services',
    'Next.js Development',
    'Full-Stack Development',
    'Mobile App Development',
    'E-commerce Solutions',
    'Custom Web Applications',
    'Technical Consulting',
    'Software Development',
    'Frontend Development',
    'Backend Development',
    'API Development',
    'Web Application Development',
    'Development Services',
    'Hire Developer',
  ],
  openGraph: {
    title: 'Web Development Services | Bhuvesh Singla',
    description:
      'Professional web development services including React, Next.js, mobile apps, and e-commerce solutions.',
    url: 'https://bhuvesh.com/services',
    type: 'website',
    images: [
      {
        url: '/og-services.png',
        width: 1200,
        height: 630,
        alt: 'Web Development Services - Bhuvesh Singla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Services | Bhuvesh Singla',
    description:
      'Professional web development services and technical consulting.',
    images: ['/og-services.png'],
  },
  alternates: {
    canonical: '/services',
  },
};

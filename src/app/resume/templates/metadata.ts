import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Templates | Professional CV Templates - Bhuvesh Singla',
  description:
    'Choose from professional resume templates designed for developers, engineers, and tech professionals. ATS-friendly templates with modern designs for your next job application.',
  keywords: [
    'Resume Templates',
    'CV Templates',
    'Professional Resume Templates',
    'ATS Resume Templates',
    'Developer Resume Templates',
    'Engineer Resume Templates',
    'Tech Resume Templates',
    'Modern Resume Templates',
    'Professional CV Templates',
    'Resume Design Templates',
    'Free Resume Templates',
    'Resume Template Gallery',
    'CV Template Collection',
    'Resume Layout Templates',
    'Professional Templates',
  ],
  openGraph: {
    title: 'Resume Templates | Professional CV Templates',
    description:
      'Choose from professional resume templates designed for developers and tech professionals.',
    url: 'https://bhuvesh.com/resume/templates',
    type: 'website',
    images: [
      {
        url: '/og-resume-templates.png',
        width: 1200,
        height: 630,
        alt: 'Professional Resume Templates - CV Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Templates | Professional CV Templates',
    description:
      'Choose from professional resume templates designed for developers and tech professionals.',
    images: ['/og-resume-templates.png'],
  },
  alternates: {
    canonical: '/resume/templates',
  },
};

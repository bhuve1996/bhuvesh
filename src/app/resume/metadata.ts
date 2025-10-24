import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume | Bhuvesh Singla - Full-Stack Developer CV & Experience',
  description:
    "View Bhuvesh Singla's professional resume with 7+ years of Full-Stack Development experience. Download CV, explore skills in React, Next.js, TypeScript, and modern web technologies.",
  keywords: [
    'Bhuvesh Singla Resume',
    'Full-Stack Developer CV',
    'Software Engineer Resume',
    'React Developer Resume',
    'Next.js Developer CV',
    'TypeScript Developer',
    'Web Developer Resume',
    'Frontend Developer CV',
    'Backend Developer Resume',
    'Developer Experience',
    'Professional Resume',
    'Tech Resume',
    'Software Development CV',
    'Programming Experience',
    'Developer Skills',
  ],
  openGraph: {
    title: 'Resume | Bhuvesh Singla - Full-Stack Developer',
    description:
      'View my professional resume with 7+ years of Full-Stack Development experience.',
    url: 'https://bhuvesh.com/resume',
    type: 'profile',
    images: [
      {
        url: '/og-resume.png',
        width: 1200,
        height: 630,
        alt: 'Bhuvesh Singla - Full-Stack Developer Resume',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume | Bhuvesh Singla - Full-Stack Developer',
    description:
      'View my professional resume with 7+ years of Full-Stack Development experience.',
    images: ['/og-resume.png'],
  },
  alternates: {
    canonical: '/resume',
  },
};

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Bhuvesh Singla | Full-Stack Developer & Software Engineer',
  description:
    'Learn about Bhuvesh Singla, an experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies. Discover my journey, skills, and passion for creating exceptional digital experiences.',
  keywords: [
    'About Bhuvesh Singla',
    'Full-Stack Developer Profile',
    'Software Engineer Background',
    'React Developer Experience',
    'Next.js Developer',
    'TypeScript Expert',
    'Web Development Journey',
    'Developer Portfolio',
    'Tech Professional',
    'Software Engineering Career',
  ],
  openGraph: {
    title: 'About Bhuvesh Singla | Full-Stack Developer',
    description:
      'Learn about my journey as a Full-Stack Developer, my expertise in modern web technologies, and my passion for creating exceptional digital experiences.',
    url: 'https://bhuvesh.com/about',
    type: 'profile',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Bhuvesh Singla - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Bhuvesh Singla | Full-Stack Developer',
    description:
      'Learn about my journey as a Full-Stack Developer and my expertise in modern web technologies.',
    images: ['/og-about.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

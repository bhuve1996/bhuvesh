import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Bhuvesh Singla - Full-Stack Developer Portfolio',
  description:
    'Explore my portfolio of web development projects including React applications, Next.js websites, mobile apps, and full-stack solutions. See real-world examples of my work in modern web technologies.',
  keywords: [
    'Web Development Projects',
    'React Portfolio',
    'Next.js Projects',
    'Full-Stack Applications',
    'Mobile App Development',
    'E-commerce Solutions',
    'Web Applications',
    'JavaScript Projects',
    'TypeScript Projects',
    'Node.js Applications',
    'Frontend Development',
    'Backend Development',
    'Portfolio Showcase',
    'Developer Projects',
  ],
  openGraph: {
    title: 'Projects | Bhuvesh Singla - Full-Stack Developer',
    description:
      'Explore my portfolio of web development projects including React applications, Next.js websites, and full-stack solutions.',
    url: 'https://bhuvesh.com/projects',
    type: 'website',
    images: [
      {
        url: '/og-projects.png',
        width: 1200,
        height: 630,
        alt: 'Bhuvesh Singla - Web Development Projects Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Bhuvesh Singla - Full-Stack Developer',
    description:
      'Explore my portfolio of web development projects and full-stack solutions.',
    images: ['/og-projects.png'],
  },
  alternates: {
    canonical: '/projects',
  },
};

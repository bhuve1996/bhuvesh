import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Bhuvesh Singla - Web Development Insights & Tutorials',
  description:
    'Read my blog about web development, React, Next.js, TypeScript, and modern web technologies. Get insights, tutorials, and best practices from an experienced Full-Stack Developer.',
  keywords: [
    'Web Development Blog',
    'React Tutorials',
    'Next.js Blog',
    'TypeScript Articles',
    'JavaScript Tutorials',
    'Web Development Tips',
    'Frontend Development',
    'Backend Development',
    'Programming Blog',
    'Tech Blog',
    'Developer Blog',
    'Software Engineering',
    'Web Technologies',
    'Development Insights',
    'Coding Tutorials',
  ],
  openGraph: {
    title: 'Blog | Bhuvesh Singla - Web Development Insights',
    description:
      'Read my blog about web development, React, Next.js, and modern web technologies.',
    url: 'https://bhuvesh.com/blog',
    type: 'website',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Bhuvesh Singla - Web Development Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Bhuvesh Singla - Web Development Insights',
    description:
      'Read my blog about web development, React, Next.js, and modern web technologies.',
    images: ['/og-blog.png'],
  },
  alternates: {
    canonical: '/blog',
  },
};

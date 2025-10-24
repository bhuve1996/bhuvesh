import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Builder | Create Professional Resumes Online - Bhuvesh Singla',
  description:
    'Build professional resumes online with our free resume builder. Create ATS-friendly resumes with modern templates. Perfect for developers, engineers, and tech professionals.',
  keywords: [
    'Resume Builder',
    'Online Resume Creator',
    'Professional Resume Builder',
    'ATS Resume Builder',
    'Free Resume Builder',
    'Resume Templates',
    'CV Builder',
    'Resume Generator',
    'Professional CV',
    'Resume Creator',
    'Online CV Builder',
    'Resume Maker',
    'CV Creator',
    'Resume Builder Online',
    'Professional Resume',
  ],
  openGraph: {
    title: 'Resume Builder | Create Professional Resumes Online',
    description:
      'Build professional resumes online with our free resume builder. Create ATS-friendly resumes with modern templates.',
    url: 'https://bhuvesh.com/resume/builder',
    type: 'website',
    images: [
      {
        url: '/og-resume-builder.png',
        width: 1200,
        height: 630,
        alt: 'Resume Builder - Create Professional Resumes Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Builder | Create Professional Resumes Online',
    description:
      'Build professional resumes online with our free resume builder.',
    images: ['/og-resume-builder.png'],
  },
  alternates: {
    canonical: '/resume/builder',
  },
};

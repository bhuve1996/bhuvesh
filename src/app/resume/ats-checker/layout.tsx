import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATS Resume Checker',
  description:
    'Free ATS (Applicant Tracking System) resume checker. Upload your resume and get instant analysis with AI-powered job detection, keyword matching, and actionable recommendations.',
  keywords: [
    'ATS checker',
    'resume parser',
    'resume analyzer',
    'ATS score',
    'job application',
    'resume optimization',
    'career tools',
    'resume keywords',
    'applicant tracking system',
    'AI resume analysis',
  ],
  openGraph: {
    title: 'Free ATS Resume Checker with AI Analysis',
    description:
      'Upload your resume and get instant ATS compatibility analysis with keyword matching, job detection, and improvement suggestions',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker',
    description:
      'Get instant ATS analysis for your resume with AI-powered insights',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/resume/ats-checker',
  },
};

export default function ATSCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

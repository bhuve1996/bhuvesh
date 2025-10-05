import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATS Analysis Results',
  description:
    'Detailed resume analysis results including ATS score, contact information, education, work experience, skills, and recommendations',
  keywords: [
    'ATS results',
    'resume analysis',
    'resume score',
    'resume parser',
    'career analysis',
    'job application',
  ],
  openGraph: {
    title: 'ATS Resume Analysis Results',
    description:
      'View your detailed resume analysis with ATS compatibility score',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Analysis Results',
    description:
      'View your detailed resume analysis with ATS compatibility score',
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

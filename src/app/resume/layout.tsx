import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Tools',
  description:
    'Professional resume tools and services including ATS checker, resume builder, and career resources.',
  keywords: [
    'resume tools',
    'career services',
    'resume builder',
    'ATS checker',
    'professional resume',
  ],
  openGraph: {
    title: 'Resume Tools & Services',
    description: 'Professional resume tools to help you land your dream job',
    type: 'website',
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

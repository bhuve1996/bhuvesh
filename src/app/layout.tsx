import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { LayoutWrapper } from './LayoutWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bhuvesh.com'
  ),
  title: {
    default: 'Bhuvesh | Portfolio',
    template: 'Bhuvesh | %s',
  },
  description:
    'Senior Frontend Developer with 7+ years of experience in React, Next.js, and modern web technologies',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/logo.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'Bhuvesh Singla - Portfolio',
    description:
      'Senior Frontend Developer with 7+ years of experience in React, Next.js, and modern web technologies',
    url: 'https://bhuvesh.com',
    siteName: 'Bhuvesh Singla Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bhuvesh Singla Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhuvesh Singla - Portfolio',
    description:
      'Senior Frontend Developer with 7+ years of experience in React, Next.js, and modern web technologies',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

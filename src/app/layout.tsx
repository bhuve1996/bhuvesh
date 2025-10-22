import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';
import { LayoutWrapper } from './LayoutWrapper';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bhuvesh.com'
  ),
  title: {
    default: 'Bhuvesh Singla | Full-Stack Developer & Portfolio',
    template: '%s | Bhuvesh Singla',
  },
  description:
    'Experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies. Creating exceptional digital experiences and scalable applications.',
  keywords: [
    'Full-Stack Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'Web Development',
    'Frontend Developer',
    'Backend Developer',
    'JavaScript Developer',
    'Portfolio',
    'Software Engineer',
    'Web Applications',
    'Mobile Development',
    'UI/UX Development',
    'E-commerce Development',
    'API Development',
    'Cloud Solutions',
    'DevOps',
    'AWS',
    'Node.js',
    'Vue.js',
    'Tailwind CSS',
    'Modern Web Technologies',
  ],
  authors: [{ name: 'Bhuvesh Singla', url: 'https://bhuvesh.com' }],
  creator: 'Bhuvesh Singla',
  publisher: 'Bhuvesh Singla',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bhuvesh.com',
    siteName: 'Bhuvesh Singla - Full-Stack Developer',
    title: 'Bhuvesh Singla | Full-Stack Developer & Portfolio',
    description:
      'Experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies. Creating exceptional digital experiences and scalable applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bhuvesh Singla - Full-Stack Developer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bhuvesh_singla',
    creator: '@bhuvesh_singla',
    title: 'Bhuvesh Singla | Full-Stack Developer & Portfolio',
    description:
      'Experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* Additional meta tags for better sharing */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#06b6d4' />
        <meta name='msapplication-TileColor' content='#06b6d4' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content='Bhuvesh Portfolio' />

        {/* Open Graph meta tags */}
        <meta property='og:type' content='website' />
        <meta
          property='og:site_name'
          content='Bhuvesh Singla - Full-Stack Developer'
        />
        <meta property='og:locale' content='en_US' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta
          property='og:image:alt'
          content='Bhuvesh Singla - Full-Stack Developer Portfolio'
        />

        {/* Twitter Card meta tags */}
        <meta name='twitter:site' content='@bhuvesh_singla' />
        <meta name='twitter:creator' content='@bhuvesh_singla' />
        <meta name='twitter:domain' content='bhuvesh.com' />

        {/* Additional SEO meta tags */}
        <meta
          name='robots'
          content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        />
        <meta name='googlebot' content='index, follow' />
        <meta name='bingbot' content='index, follow' />

        {/* Canonical URL */}
        <link rel='canonical' href='https://bhuvesh.com' />

        {/* Preconnect to external domains for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* Favicon and app icons */}
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <link rel='manifest' href='/manifest.json' />

        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('bhuvesh-theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = storedTheme || 'light'; // Default to light theme
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

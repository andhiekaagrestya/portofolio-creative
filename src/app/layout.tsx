import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andhiekaagrestya.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
  description:
    'Andhieka Agrestya is a Software Engineer from Indonesia, specializing in fullstack development with Next.js, Go, and PostgreSQL. Explore an experimental portfolio built with collage animation, scrollytelling, and interactive physics.',
  keywords: [
    'andhieka agrestya',
    'andhieka',
    'software engineer',
    'creative developer',
    'fullstack developer',
    'frontend developer',
    'react developer',
    'nextjs developer',
    'indonesia',
    'portfolio',
  ],
  authors: [{ name: 'Andhieka Agrestya', url: SITE_URL }],
  creator: 'Andhieka Agrestya',
  publisher: 'Andhieka Agrestya',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
    description:
      'Software Engineer from Indonesia. Experimental portfolio with collage animation, scrollytelling, and interactive physics.',
    siteName: 'Andhieka Agrestya',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Andhieka Agrestya — Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andhieka Agrestya — Software Engineer & Creative Developer',
    description:
      'Software Engineer from Indonesia. Experimental portfolio with collage animation, scrollytelling, and interactive physics.',
    creator: '@andhiekaagrestya',
    images: ['/opengraph-image'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Andhieka Agrestya',
  jobTitle: 'Software Engineer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/andhiekaagrestya',
    'https://linkedin.com/in/andhiekaagrestya',
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Raw <script> (not next/script) — JSON-LD must be synchronous in <head> for search engine structured data parsing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden hide-native-cursor">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

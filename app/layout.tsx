import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://boggler.vercel.app'),
  title: 'Boggler - Word Grid Game',
  description:
    'A time-limited word-finding game where players connect adjacent letters on a grid to form words. Play in English or Finnish with customizable grid sizes and timers.',
  keywords: ['word game', 'boggle', 'puzzle', 'word search', 'brain game', 'Finnish', 'English'],
  authors: [{ name: 'Boggler Team' }],
  creator: 'Boggler Team',
  publisher: 'Boggler',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fi_FI'],
    url: '/',
    siteName: 'Boggler',
    title: 'Boggler - Word Grid Game',
    description:
      'Find as many words as you can by connecting adjacent letters! Play in English or Finnish with shareable game boards.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Boggler - Word Grid Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boggler - Word Grid Game',
    description:
      'Find as many words as you can by connecting adjacent letters! Play in English or Finnish with shareable game boards.',
    images: ['/og-image.png'],
    creator: '@boggler',
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Boggler',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

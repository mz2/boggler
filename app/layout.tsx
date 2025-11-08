import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boggler - Word Grid Game',
  description:
    'A time-limited word-finding game where players connect adjacent letters on a grid to form words',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

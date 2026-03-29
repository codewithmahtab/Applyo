import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/queryProvider';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Applyo — Find Your Dream Job',
    template: '%s | Applyo',
  },
  description:
    'Applyo connects top talent with leading companies. Browse 5 lakh+ jobs, apply with one click, and land your dream career today.',
  keywords: [
    'jobs',
    'job search',
    'career',
    'employment',
    'hiring',
    'job portal',
    'India jobs',
    'remote jobs',
  ],
  authors: [{ name: 'Applyo' }],
  creator: 'Applyo',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Applyo',
    title: 'Applyo — Find Your Dream Job',
    description:
      'Applyo connects top talent with leading companies. Browse 5 lakh+ jobs, apply with one click.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applyo — Find Your Dream Job',
    description: 'Browse 5 lakh+ jobs and land your dream career.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            {children}
            {modal}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

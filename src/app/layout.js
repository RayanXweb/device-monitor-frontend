import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import Providers from '@/components/providers/Providers';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Device Monitor Pro',
    template: '%s | Device Monitor Pro',
  },
  description: 'Professional device monitoring and management platform',
  keywords: ['device monitoring', 'surveillance', 'remote control', 'security'],
  authors: [{ name: 'Device Monitor Team' }],
  creator: 'Device Monitor',
  publisher: 'Device Monitor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
  }

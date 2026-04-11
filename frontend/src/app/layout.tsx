import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Readex_Pro } from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScrollWrapper from '@/components/SmoothScrollWrapper';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://abocartonastore.com'),
  title: {
    default: 'أبوكرتونة - أفضل متجر للهاردوير والألعاب في مصر',
    template: '%s | أبوكرتونة'
  },
  description: 'اكتشف أحدث أجهزة الكمبيوتر والهاردوير الاحترافي والألعاب الحصرية في مصر. توصيل سريع لجميع المحافظات وضمان أصالة المنتجات.',
  keywords: ['هاردوير مصر', 'كمبيوتر جيمينج', 'أجهزة كمبيوتر', 'ألعاب فيديو', 'أفلام', 'Hardware Egypt', 'Gaming PCs', 'PC Hardware', 'Video Games Egypt', 'Abocartona'],
  authors: [{ name: 'Abocartona Store' }],
  creator: 'Abocartona Store',
  publisher: 'Abocartona Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://abocartonastore.com',
    title: 'أبوكرتونة - أفضل متجر للهاردوير والألعاب في مصر',
    description: 'اكتشف أحدث أجهزة الكمبيوتر والهاردوير الاحترافي والألعاب الحصرية في مصر. توصيل سريع لجميع المحافظات.',
    siteName: 'أبوكرتونة',
    images: [
      {
        url: '/assets/images/app_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'أبوكرتونة - متجر الهاردوير والألعاب',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أبوكرتونة - أفضل متجر للهاردوير والألعاب في مصر',
    description: 'اكتشف أحدث أجهزة الكمبيوتر والهاردوير الاحترافي والألعاب الحصرية في مصر',
    images: ['/assets/images/twitter-image.jpg'],
    creator: '@abocartonastore',
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
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [{ url: '/assets/images/app_logo.png', type: 'image/png' }],
    shortcut: '/assets/images/favicon.ico',
    apple: '/assets/images/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${readexPro.variable} font-readex bg-base text-text-primary antialiased`}>
        <ThemeProvider>
          <SmoothScrollWrapper>
            <Providers>{children}</Providers>
          </SmoothScrollWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

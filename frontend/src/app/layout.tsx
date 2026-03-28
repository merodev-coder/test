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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'أبو كارتونة — أقوى عتاد هاردوير في مصر',
  description:
    'تسوق أحدث الكمبيوترات والإكسسوارات، واملأ هارد درايف بالألعاب والأفلام مجاناً. شحن لجميع محافظات مصر.',
  icons: {
    icon: [{ url: '/assets/images/app_logo.png', type: 'image/png' }],
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

import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import Providers from './providers';
import SmoothScrollWrapper from '@/components/SmoothScrollWrapper';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'أبو كارتونة — هاردوير وداتا جيمينج بأفضل الأسعار',
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
      <body>
        <Providers>
          <SmoothScrollWrapper>{children}</SmoothScrollWrapper>
        </Providers>

        <script
          type="module"
          async
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fabocartona8335back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.17"
        />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}

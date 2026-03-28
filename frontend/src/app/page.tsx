import React from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FlashSales from '@/components/FlashSales';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'أبو كارتونة',
  description:
    'تسوق أحدث الكمبيوترات والإكسسوارات، واملأ هارد درايف بالألعاب والأفلام مجاناً. شحن لجميع محافظات مصر.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base">
      <FloatingNavbar />

      <HeroSection />

      <CategoryGrid />

      <FlashSales />

      <FeaturedProducts />

      <Footer />
    </main>
  );
}

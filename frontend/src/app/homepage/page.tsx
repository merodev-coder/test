'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import WhatsAppButton from './components/WhatsAppButton';
import SectionSeparator from '@/components/ui/SectionSeparator';
import { gsap, ScrollTrigger } from '@/lib/gsapinit';
import { useStore, type Product } from '@/store/useStore';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/AppIcon';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

export default function HomePage() {
  const { addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const salesRef = useRef<HTMLDivElement>(null);
  const laptopsRef = useRef<HTMLDivElement>(null);
  const accessoriesRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        type: product.type as any,
        subtype: product.subtype,
        price: product.price,
        oldPrice: product.oldPrice,
        description: product.description,
        images: product.images,
        stockCount: product.stockCount,
        storageCapacity: product.storageCapacity,
        gbSize: product.gbSize,
        isSale: product.isSale,
        tags: product.tags,
        isBrandActive: product.isBrandActive,
        brands: product.brands,
        createdAt: '',
        updatedAt: '',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('الماركة')) {
        alert('يرجى اختيار الماركة قبل إضافة المنتج للسلة');
      } else {
        alert('حدث خطأ أثناء إضافة المنتج للسلة');
      }
    }
  };

  const sales = products.filter((p) => !!p.isSale);
  const laptops = products.filter((p) => p.type === 'laptops');
  const accessories = products.filter((p) => p.type === 'accessories');
  const storage = products.filter((p) => p.type === 'storage');

  const storageInfo = { total: 1000, used: 0, hasDrive: false };

  // GSAP ScrollTrigger animations for grids
  useEffect(() => {
    if (loading) return;

    const refs = [salesRef, laptopsRef, accessoriesRef, storageRef];
    const contexts: (() => void)[] = [];

    refs.forEach((ref) => {
      if (!ref.current) return;
      // We animate the direct child wrapper elements
      const cards = ref.current.children;
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loading, products.length]);

  // Reusable section header
  const SectionHeader = ({
    label,
    title,
    accent,
    href,
  }: {
    label: string;
    title: string;
    accent: string;
    href?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-8"
    >
      <div>
        <p className="section-label mb-2 relative">
          <span className="relative z-10">{label}</span>
          <span className="absolute inset-0 bg-brand-500/20 bg-brand-400/20 -z-10 scale-x-110 rounded-full blur-sm" />
        </p>
        <h2 className="text-h1 md:text-display text-text-primary text-text-primary font-heading relative">
          {title}{' '}
          <span className="text-gradient-primary relative">
            {accent}
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500 via-brand-400 to-transparent rounded-full opacity-50" />
          </span>
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1.5 text-body-sm font-semibold text-brand-500 hover:text-brand-600 text-brand-400 dark:hover:text-brand-300 transition-all duration-200 hover:gap-2"
        >
          <span>عرض الكل</span>
          <Icon
            name="ArrowLeftIcon"
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      )}
    </motion.div>
  );

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="card rounded-2xl p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-tertiary bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon name="InboxIcon" size={24} className="text-text-muted text-text-muted" />
      </div>
      <p className="text-body font-medium text-text-muted text-text-muted">{message}</p>
    </div>
  );

  // Product grid renderer
  const ProductGrid = ({
    items,
    gridRef,
    cols = 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  }: {
    items: Product[];
    gridRef: React.RefObject<HTMLDivElement | null>;
    cols?: string;
  }) => (
    <div ref={gridRef} className={`grid ${cols} gap-4 md:gap-6`}>
      {items.map((p) => (
        <div key={p.id}>
          <ProductCard product={p} onAddToCart={handleAddToCart} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface bg-surface" dir="rtl">
      <Header />
      <main className="pt-14">
        <HeroSection storage={storageInfo} />

        {loading ? (
          <div className="section-container section-padding">
            <ProductGridSkeleton count={8} />
          </div>
        ) : (
          <>
            {/* Sales Section */}
            {sales.length > 0 && (
              <>
                <section className="section-padding section-container">
                  <SectionHeader label="العروض" title="منتجات" accent="عليها خصم" />
                  <ProductGrid items={sales} gridRef={salesRef} />
                </section>
                <SectionSeparator />
              </>
            )}

            {/* Laptops Section */}
            <>
              <section className="section-padding section-container section-alt">
                <SectionHeader
                  label="اللابتوبات"
                  title="أحدث"
                  accent="اللابتوبات"
                  href="/products?cat=laptops"
                />
                {laptops.length === 0 ? (
                  <EmptyState message="لا توجد لابتوبات حالياً" />
                ) : (
                  <ProductGrid items={laptops.slice(0, 8)} gridRef={laptopsRef} />
                )}
              </section>
              <SectionSeparator />
            </>

            {/* Accessories Section */}
            <>
              <section className="section-padding section-container">
                <SectionHeader
                  label="الإكسسوارات"
                  title="إكسسوارات"
                  accent="إضافية"
                  href="/products?cat=accessories"
                />
                {accessories.length === 0 ? (
                  <EmptyState message="لا توجد إكسسوارات حالياً" />
                ) : (
                  <ProductGrid items={accessories.slice(0, 8)} gridRef={accessoriesRef} />
                )}
              </section>
              <SectionSeparator />
            </>

            {/* Storage Section */}
            {storage.length > 0 && (
              <section className="section-padding section-container section-alt">
                <SectionHeader
                  label="التخزين"
                  title="هارد"
                  accent="درايف"
                  href="/products?cat=storage"
                />
                <ProductGrid items={storage.slice(0, 4)} gridRef={storageRef} />
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

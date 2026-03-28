'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const featuredProducts = [
  {
    id: 1,
    name: 'كمبيوتر جيمينج Ultra X Pro',
    specs: 'Intel Core i9 | RTX 4080 | 32GB RAM | 1TB SSD',
    price: 28500,
    oldPrice: 32000,
    badge: '🔥 الأفضل مبيعاً',
    rating: 4.9,
    reviews: 124,
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: 'لاب توب جيمينج ROG Strix G16',
    specs: 'AMD Ryzen 9 | RTX 4070 | 16GB RAM | 512GB SSD',
    price: 19900,
    oldPrice: 22500,
    badge: '✨ جديد',
    rating: 4.8,
    reviews: 87,
    inStock: true,
    featured: false,
  },
  {
    id: 3,
    name: 'كمبيوتر Creator Station Pro',
    specs: 'Intel Core i7 | RTX 4060 | 16GB RAM | 512GB SSD',
    price: 16500,
    oldPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 56,
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: 'كمبيوتر Budget Gaming X',
    specs: 'AMD Ryzen 5 | GTX 1660 | 8GB RAM | 256GB SSD',
    price: 8900,
    oldPrice: 9500,
    badge: '💰 الأوفر',
    rating: 4.6,
    reviews: 203,
    inStock: false,
    featured: false,
  },
];

export default function FeaturedHardwareSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 120);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding max-w-7xl mx-auto px-4 md:px-6 bg-midnight"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-10 reveal">
        <div>
          <p className="section-label mb-2 text-brand">هاردوير مختار</p>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary font-arabic">
            الكمبيوترات <span className="text-brand">الأكثر مبيعاً</span>
          </h2>
        </div>
        <Link
          href="/products?cat=hardware"
          className="btn-gaming px-5 py-2.5 text-sm font-black flex items-center gap-2"
        >
          <span>عرض الكل</span>
          <Icon name="ArrowLeftIcon" size={14} />
        </Link>
      </div>
      {/* Asymmetric Grid (7/5 inspired by Template 1) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Featured Card */}
        <div className="md:col-span-7 reveal">
          <Link href="/products" className="card-product group block">
            <div className="relative pt-6 px-5 border-b border-glass-border pb-4">
              {featuredProducts?.[0]?.badge && (
                <div className="inline-block mb-2">
                  <span className="badge-hot">{featuredProducts?.[0]?.badge}</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black text-text-primary mb-2">
                {featuredProducts?.[0]?.name}
              </h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                {featuredProducts?.[0]?.specs}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-brand">
                      {featuredProducts?.[0]?.price?.toLocaleString('ar-EG')} جنيه
                    </span>
                    {(featuredProducts?.[0]?.oldPrice ?? 0) > 0 && (
                      <span className="text-text-dark-muted line-through text-sm">
                        {featuredProducts?.[0]?.oldPrice?.toLocaleString('ar-EG')} جنيه
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="stars">{'★'?.repeat(5)}</div>
                    <span className="text-xs text-text-muted">
                      ({featuredProducts?.[0]?.reviews})
                    </span>
                  </div>
                </div>
                <button className="btn-gaming px-6 py-3 text-sm font-bold flex items-center gap-2 relative z-10">
                  <span className="relative z-10">أضف للسلة</span>
                  <Icon name="ShoppingCartIcon" size={16} className="text-midnight relative z-10" />
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Small Cards Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {featuredProducts?.slice(1, 4)?.map((product, idx) => (
            <Link
              key={product?.id}
              href="/products"
              className={`card-product group flex gap-4 p-4 reveal bg-glass rounded-2xl shadow-glass`}
              style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-black text-text-primary leading-tight line-clamp-2">
                    {product?.name}
                  </h3>
                  {product?.badge && (
                    <span className="badge-new flex-shrink-0 text-[9px]">{product?.badge}</span>
                  )}
                </div>
                <p className="text-xs text-text-muted mb-2 line-clamp-1">{product?.specs}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-brand">
                    {product?.price?.toLocaleString('ar-EG')} جنيه
                  </span>
                  {!product?.inStock ? (
                    <span className="text-xs text-danger font-bold">نفد المخزون</span>
                  ) : (
                    <button className="text-xs btn-gaming px-3 py-1.5 font-bold relative z-10">
                      <span className="relative z-10">أضف</span>
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

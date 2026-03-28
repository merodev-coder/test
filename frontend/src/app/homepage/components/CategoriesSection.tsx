'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const categories = [
  {
    id: 'hardware',
    label: 'الهاردوير',
    sub: 'كمبيوترات • لاب توب',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800',
    href: '/products?cat=hardware',
    icon: 'ComputerDesktopIcon',
    featured: true,
    badge: 'الأكثر مبيعاً',
  },
  {
    id: 'accessories',
    label: 'الإكسسوارات',
    sub: 'كيبورد • ماوس • سماعات',
    image: 'https://images.unsplash.com/photo-1672588596999-8f6c273ff95b',
    href: '/products?cat=accessories',
    icon: 'CpuChipIcon',
    badge: null,
  },
  {
    id: 'storage',
    label: 'وحدات التخزين',
    sub: 'HDD • SSD • فلاش',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800',
    href: '/products?cat=storage',
    icon: 'CircleStackIcon',
    badge: '🔥 الأكثر طلباً',
  },
  {
    id: 'data',
    label: 'مكتبة الداتا',
    sub: 'ألعاب • أفلام • برامج',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800',
    href: '/products?cat=games',
    icon: 'FolderIcon',
    badge: '✨ مجاناً مع الهارد',
    featured: true,
  },
];

export default function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding max-w-7xl mx-auto px-4 md:px-6 bg-surface">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 reveal">
        <div>
          <p className="section-label mb-2 text-brand-500">تسوق حسب الفئة</p>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary font-arabic">
            اختار اللي يناسبك
          </h2>
        </div>
        <Link
          href="/products"
          className="btn-ghost px-5 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          <span>كل المنتجات</span>
          <Icon name="ArrowLeftIcon" size={14} />
        </Link>
      </div>
      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Large Featured Card */}
        <Link
          href={categories?.[0]?.href}
          className="col-span-2 row-span-2 category-card reveal group h-80 md:h-auto"
        >
          <div className="absolute inset-0">
            <AppImage
              src={categories?.[0]?.image}
              alt={categories?.[0]?.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="category-card-overlay" />
          <div className="absolute inset-0 bg-gradient-to-tl from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 p-6">
            {categories?.[0]?.badge && (
              <span className="badge-new inline-block mb-2">{categories?.[0]?.badge}</span>
            )}
            <h3 className="text-2xl font-black text-white mb-1">{categories?.[0]?.label}</h3>
            <p className="text-sm text-text-muted">{categories?.[0]?.sub}</p>
            <div className="flex items-center gap-2 mt-3 text-brand-500 text-sm font-bold">
              <span>تسوق الآن</span>
              <Icon
                name="ArrowLeftIcon"
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>

        {/* Regular Cards */}
        {categories?.slice(1)?.map((cat, idx) => (
          <Link
            key={cat?.id}
            href={cat?.href}
            className={`category-card reveal group h-36 md:h-40 ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            style={{ transitionDelay: `${(idx + 1) * 80}ms` }}
          >
            <div className="absolute inset-0">
              <AppImage
                src={cat?.image}
                alt={cat?.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="category-card-overlay" />
            <div className="absolute inset-0 bg-gradient-to-tl from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 p-4">
              {cat?.badge && (
                <span className="badge-new inline-block mb-1 text-[9px]">{cat?.badge}</span>
              )}
              <h3 className="text-base font-black text-white">{cat?.label}</h3>
              <p className="text-xs text-text-muted hidden md:block">{cat?.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const trendingItems = [
  {
    id: 1,
    title: 'GTA VI',
    type: 'لعبة',
    genre: 'أكشن • مغامرات',
    size: '120 GB',
    rating: 4.9,
    badge: '🔥 الأكثر طلباً',
    platform: 'PC',
  },
  {
    id: 2,
    title: 'Red Dead Redemption 2',
    type: 'لعبة',
    genre: 'مغامرات • RPG',
    size: '150 GB',
    rating: 4.8,
    badge: null,
    platform: 'PC',
  },
  {
    id: 3,
    title: 'Cyberpunk 2077',
    type: 'لعبة',
    genre: 'RPG • مستقبلي',
    size: '70 GB',
    rating: 4.7,
    badge: '✨ جديد',
    platform: 'PC',
  },
  {
    id: 4,
    title: 'Dune: Part Two',
    type: 'فيلم',
    genre: 'خيال علمي • ملحمي',
    size: '25 GB',
    rating: 4.8,
    badge: '4K HDR',
    platform: 'Movie',
  },
  {
    id: 5,
    title: 'Elden Ring',
    type: 'لعبة',
    genre: 'RPG • Dark Fantasy',
    size: '50 GB',
    rating: 4.9,
    badge: null,
    platform: 'PC',
  },
  {
    id: 6,
    title: 'Oppenheimer',
    type: 'فيلم',
    genre: 'دراما • تاريخي',
    size: '30 GB',
    rating: 4.9,
    badge: '4K',
    platform: 'Movie',
  },
  {
    id: 7,
    title: 'Spider-Man 2',
    type: 'لعبة',
    genre: 'أكشن • مغامرات',
    size: '55 GB',
    rating: 4.8,
    badge: '🆕 جديد',
    platform: 'PC',
  },
  {
    id: 8,
    title: 'Adobe Creative Suite',
    type: 'برنامج',
    genre: 'تصميم • إبداع',
    size: '12 GB',
    rating: 4.7,
    badge: null,
    platform: 'Software',
  },
];

const filters = ['الكل', 'ألعاب', 'أفلام', 'مسلسلات', 'برامج'];

export default function TrendingDataSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const filteredItems =
    activeFilter === 'الكل'
      ? trendingItems
      : trendingItems.filter((item) =>
          activeFilter === 'ألعاب'
            ? item.type === 'لعبة'
            : activeFilter === 'أفلام'
              ? item.type === 'فيلم'
              : activeFilter === 'برامج'
                ? item.type === 'برنامج'
                : true
        );

  return (
    <section ref={sectionRef} className="section-padding bg-surface dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 reveal">
          <div>
            <p className="section-label mb-2">مكتبة الداتا</p>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary text-text-primary font-arabic">
              الأكثر طلباً <span className="text-gradient-primary">هذا الأسبوع</span>
            </h2>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === f ? 'bg-brand-500 text-bg-deep' : 'btn-ghost'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 mb-4 justify-start reveal">
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${canScrollRight ? 'btn-ghost hover:border-brand-500/40' : 'opacity-30 cursor-not-allowed btn-ghost'}`}
            aria-label="التالي"
          >
            <Icon name="ChevronRightIcon" size={16} />
          </button>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${canScrollLeft ? 'btn-ghost hover:border-brand-500/40' : 'opacity-30 cursor-not-allowed btn-ghost'}`}
            aria-label="السابق"
          >
            <Icon name="ChevronLeftIcon" size={16} />
          </button>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="carousel-track" onScroll={handleScroll} dir="rtl">
          {filteredItems.map((item) => (
            <div key={item.id} className="carousel-item w-48 md:w-56">
              <div className="product-card group cursor-pointer">
                {/* Cover Art */}
                <div className="relative pt-6 px-3 border-b border-white/5 pb-4">
                  {item.badge && (
                    <div className="inline-block mb-2">
                      <span className="badge-new text-[9px]">{item.badge}</span>
                    </div>
                  )}
                  {/* Size Badge */}
                  <div className="absolute top-6 left-3">
                    <span className="badge-size">{item.size}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-text-muted">{item.genre}</span>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary text-text-primary leading-tight mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icon name="StarIcon" size={12} className="text-yellow-400" variant="solid" />
                      <span className="text-xs text-text-muted">{item.rating}</span>
                    </div>
                    <button className="text-xs text-brand-500 font-bold hover:text-primary-bright transition-colors flex items-center gap-1">
                      <Icon name="PlusCircleIcon" size={14} />
                      <span>أضف</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8 reveal">
          <Link
            href="/products?cat=games"
            className="btn-secondary px-8 py-3 text-sm font-bold inline-flex items-center gap-2"
          >
            <span>عرض كل مكتبة الداتا</span>
            <Icon name="ArrowLeftIcon" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

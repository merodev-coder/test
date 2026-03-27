'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const heroSlides = [
  {
    id: 1,
    tag: 'عرض حصري',
    title: 'اشتري هارد',
    titleAccent: 'واملأه مجاناً',
    subtitle: 'اشتري أي هارد درايف واملأه بالألعاب والأفلام والبرامج مجاناً حتى آخر بايت',
    cta: 'اكتشف العرض',
    ctaSecondary: 'مكتبة الداتا',
    image: 'https://images.unsplash.com/photo-1726433479087-04a8d3d8ea56',
  },
  {
    id: 2,
    tag: 'جديد 2026',
    title: 'لابتوبات',
    titleAccent: 'بمواصفات خرافية',
    subtitle: 'أحدث اللابتوبات المجمعة بمواصفات خرافية وأسعار لا تقاوم',
    cta: 'تسوق اللابتوبات',
    image: '/assets/images/laptop.png',
  },
];

interface StorageState {
  total: number;
  used: number;
  hasDrive: boolean;
}

// ─── Hook: detect viewport ────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setBp('mobile');
      else if (w < 1024) setBp('tablet');
      else setBp('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return bp;
}

// ─── Slide dots ───────────────────────────────────────────────────────────────
const SlideDots = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(idx)}
        aria-label={`الشريحة ${idx + 1}`}
        style={{
          width: idx === current ? 28 : 6,
          height: 6,
          borderRadius: 9999,
          background: idx === current ? 'var(--color-brand-500)' : 'rgba(255,255,255,0.2)',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          transition: 'width 400ms cubic-bezier(0.32,0,0.17,1), background 300ms ease',
          boxShadow: idx === current ? '0 0 10px var(--color-brand-500)' : 'none',
        }}
      />
    ))}
  </div>
);

// ─── Progress ring ────────────────────────────────────────────────────────────
const ProgressRing = ({ percent }: { percent: number }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="var(--color-brand-500)"
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        strokeDashoffset={circ / 4}
        style={{ filter: 'drop-shadow(0 0 6px var(--color-brand-500))' }}
      />
      <text
        x="28"
        y="32"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="var(--color-brand-500)"
      >
        {percent}%
      </text>
    </svg>
  );
};

// ─── Floating card ────────────────────────────────────────────────────────────
const FloatingCard = ({ storage, compact }: { storage: StorageState; compact?: boolean }) => {
  const percent = storage.hasDrive ? Math.round((storage.used / storage.total) * 100) : 0;

  const pad = compact ? 20 : 28;
  const radius = compact ? 20 : 28;

  return (
    <div
      style={{
        background: 'var(--color-surface-dark-secondary)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--color-brand-500)',
        borderRadius: radius,
        padding: pad,
        boxShadow:
          '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-brand-500) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {storage.hasDrive ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: compact ? 14 : 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 600,
                  marginBottom: 4,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)',
                }}
              >
                سعة الهارد درايف
              </p>
              <p
                style={{
                  fontSize: compact ? 24 : 30,
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {storage.total}{' '}
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>
                  GB
                </span>
              </p>
            </div>
            <ProgressRing percent={percent} />
          </div>

          <div style={{ marginBottom: compact ? 14 : 20 }}>
            <div
              style={{
                height: 6,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${percent}%`,
                  borderRadius: 999,
                  background:
                    percent > 85
                      ? 'linear-gradient(90deg, #f97316, #ef4444)'
                      : 'linear-gradient(90deg, var(--color-brand-500), var(--color-brand-400))',
                  boxShadow: '0 0 8px var(--color-brand-500)',
                  transition: 'width 800ms cubic-bezier(0.32,0,0.17,1)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--color-brand-500)', fontWeight: 700 }}>
                {storage.used} GB مستخدم
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                {storage.total - storage.used} GB متبقي
              </span>
            </div>
          </div>

          <Link
            href="/products?cat=games"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: compact ? '11px 0' : '13px 0',
              borderRadius: 9999,
              background: 'var(--color-brand-500)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              boxShadow: '0 4px 20px var(--color-brand-500)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 28px var(--color-brand-500)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 4px 20px var(--color-brand-500)';
            }}
          >
            <span>أضف داتا مجاناً</span>
            <Icon name="PlusCircleIcon" size={15} />
          </Link>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: compact ? 14 : 20 }}>
            <div
              style={{
                width: compact ? 48 : 60,
                height: compact ? 48 : 60,
                borderRadius: 18,
                background: 'var(--color-brand-500)',
                border: '1px solid var(--color-brand-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Icon name="CircleStackIcon" size={compact ? 22 : 28} className="text-brand-500" />
            </div>
            <h3
              style={{
                fontSize: compact ? 15 : 17,
                fontWeight: 900,
                color: '#fff',
                marginBottom: 4,
              }}
            >
              نظام Fill Your Drive
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              اشتري هارد → اختار داتا مجاناً
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: compact ? 8 : 10,
              marginBottom: compact ? 14 : 20,
            }}
          >
            {[
              { label: '1TB HDD', free: '1000 GB داتا مجاناً', price: '850 جنيه' },
              { label: '2TB HDD', free: '2000 GB داتا مجاناً', price: '1,200 جنيه' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: compact ? '9px 12px' : '11px 14px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'background 200ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'rgba(0,212,160,0.06)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')
                }
              >
                <div>
                  <p
                    style={{
                      fontSize: compact ? 13 : 14,
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--color-brand-500)', fontWeight: 600 }}>
                    {item.free}
                  </p>
                </div>
                <span style={{ fontSize: compact ? 13 : 14, fontWeight: 900, color: '#fff' }}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/products?cat=hdd"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: compact ? '11px 0' : '13px 0',
              borderRadius: 9999,
              background: 'var(--color-brand-500)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
              boxShadow: '0 4px 20px var(--color-brand-500)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 28px var(--color-brand-500)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 4px 20px var(--color-brand-500)';
            }}
          >
            <span>اختار هارد درايف</span>
            <Icon name="ArrowLeftIcon" size={15} />
          </Link>
        </>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroSection({ storage }: { storage: StorageState }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bp = useBreakpoint();

  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const isDesktop = bp === 'desktop';

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setDirection(idx > current ? 1 : -1);
      setPrev(current);
      setCurrent(idx);
    },
    [current]
  );

  const advance = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(advance, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  const slide = heroSlides[current];

  return (
    <section
      className="bg-surface bg-surface transition-colors duration-500"
      style={{
        position: 'relative',
        minHeight: isMobile ? '100svh' : '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Background images — crossfade ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background: 'linear-gradient(-45deg, #059669, #6366f1, #f59e0b, #059669)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 15s ease infinite',
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 texture-noise opacity-5 dark:opacity-10" />

        {heroSlides.map((s, idx) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === current ? 1 : 0,
              transform: idx === current ? 'scale(1)' : 'scale(1.04)',
              transition:
                'opacity 900ms cubic-bezier(0.4,0,0.2,1), transform 1200ms cubic-bezier(0.4,0,0.2,1)',
              willChange: 'opacity, transform',
            }}
          >
            <AppImage
              src={s.image}
              alt={s.title}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Enhanced overlay with glassmorphism effect */}
        <div
          className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-500 ${
            isMobile
              ? 'bg-gradient-to-b from-white/90 via-white/80 to-white/95 from-surface/90 dark:via-surface-dark/80 dark:to-surface-dark/95'
              : isTablet
                ? 'bg-gradient-to-r from-white/95 via-white/85 to-white/40 from-surface/95 dark:via-surface-dark/85 dark:to-surface-dark/40'
                : 'bg-gradient-to-r from-white/95 via-white/87 to-white/35 from-surface/95 dark:via-surface-dark/87 dark:to-surface-dark/35'
          }`}
        />

        {/* Animated light streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(5,150,105,0.4) 0%, transparent 70%)',
              top: '-200px',
              right: '-200px',
              animation: 'float 20s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-8"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
              bottom: '-150px',
              left: '-150px',
              animation: 'float 25s ease-in-out infinite reverse',
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/30 to-transparent from-surface/60 dark:via-surface-dark/30 transition-colors duration-500" />
      </div>

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1280,
          margin: '0 auto',
          padding: isMobile ? '80px 16px 48px' : isTablet ? '96px 32px 64px' : '96px 40px 64px',
        }}
      >
        {/* ─── DESKTOP / TABLET: side-by-side grid ─── */}
        {!isMobile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr 1fr' : '7fr 5fr',
              gap: isTablet ? 24 : 32,
              alignItems: 'center',
            }}
          >
            {/* Left: text */}
            <div>
              {/* Tag pill */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tag-${current}`}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 16px',
                      borderRadius: 9999,
                      background: 'rgba(55, 215, 172, 0.1)',
                      border: '1px solid rgba(55, 215, 172, 0.25)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--color-brand-500)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--color-brand-500)',
                        boxShadow: '0 0 8px var(--color-brand-500)',
                        animation: 'pulse-dot 2s ease-in-out infinite',
                        flexShrink: 0,
                      }}
                    />
                    {slide.tag}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${current}`}
                  initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                  style={{ marginBottom: 16 }}
                >
                  <h1
                    style={{
                      fontSize: isTablet ? 'clamp(36px, 5vw, 52px)' : 'clamp(44px, 6vw, 76px)',
                      fontWeight: 900,
                      lineHeight: 1.05,
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    <span
                      className="text-text-primary text-text-primary"
                      style={{ display: 'block' }}
                    >
                      {slide.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        background:
                          'linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-400) 50%, var(--color-brand-600) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {slide.titleAccent}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${current}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  style={{
                    fontSize: isTablet ? 16 : 18,
                    color: 'inherit',
                    lineHeight: 1.7,
                    maxWidth: 480,
                    marginBottom: 32,
                  }}
                  className="text-text-secondary text-text-secondary"
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}
              >
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: isTablet ? '12px 22px' : '14px 28px',
                    borderRadius: 9999,
                    background: 'var(--color-brand-500)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: isTablet ? 14 : 15,
                    textDecoration: 'none',
                    boxShadow: '0 4px 24px var(--color-brand-500)',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 10px 36px var(--color-brand-500)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 4px 24px var(--color-brand-500)';
                  }}
                >
                  <span>{slide.cta}</span>
                  <Icon name="ArrowLeftIcon" size={16} />
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: isTablet ? 16 : 24 }}
              >
                {[
                  { icon: 'TruckIcon', text: 'شحن لكل مصر' },
                  { icon: 'ShieldCheckIcon', text: 'ضمان أصالة' },
                  { icon: 'BoltIcon', text: 'تسليم سريع' },
                ].map((badge) => (
                  <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div className="w-[30px] h-[30px] rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <Icon
                        name={badge.icon as any}
                        size={14}
                        className="text-brand-500 text-brand-400"
                      />
                    </div>
                    <span
                      style={{ fontSize: 13, fontWeight: 500 }}
                      className="text-text-primary text-text-secondary"
                    >
                      {badge.text}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Slide dots + counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 36 }}
              >
                <SlideDots total={heroSlides.length} current={current} onSelect={goTo} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  className="text-text-secondary text-text-muted"
                >
                  {String(current + 1).padStart(2, '0')} /{' '}
                  {String(heroSlides.length).padStart(2, '0')}
                </span>
              </motion.div>
            </div>
          </div>
        )}

        {/* ─── MOBILE: stacked layout ─── */}
        {isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Text block */}
            <div style={{ marginBottom: 32 }}>
              {/* Tag pill */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tag-m-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'inline-flex', marginBottom: 16 }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '5px 14px',
                      borderRadius: 9999,
                      background: 'rgba(55, 215, 172, 0.1)',
                      border: '1px solid rgba(55, 215, 172, 0.25)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--color-brand-500)',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: 'var(--color-brand-500)',
                        boxShadow: '0 0 8px var(--color-brand-500)',
                        animation: 'pulse-dot 2s ease-in-out infinite',
                        flexShrink: 0,
                      }}
                    />
                    {slide.tag}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-m-${current}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, delay: 0.04 }}
                  style={{ marginBottom: 12 }}
                >
                  <h1
                    style={{
                      fontSize: 'clamp(36px, 10vw, 52px)',
                      fontWeight: 900,
                      lineHeight: 1.05,
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    <span
                      className="text-text-primary text-text-primary"
                      style={{ display: 'block' }}
                    >
                      {slide.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        background:
                          'linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-400) 50%, var(--color-brand-600) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {slide.titleAccent}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-m-${current}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    marginBottom: 24,
                  }}
                  className="text-text-secondary text-text-secondary"
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>

              {/* CTAs — full-width stacked on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}
              >
                <Link
                  href="/products"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '14px 20px',
                    borderRadius: 9999,
                    background: 'var(--color-brand-500)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    textDecoration: 'none',
                    boxShadow: '0 4px 24px var(--color-brand-500)',
                  }}
                >
                  <span>{slide.cta}</span>
                  <Icon name="ArrowLeftIcon" size={16} />
                </Link>
              </motion.div>

              {/* Trust badges — horizontal scroll on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 4,
                  scrollbarWidth: 'none',
                }}
              >
                {[
                  { icon: 'TruckIcon', text: 'شحن لكل مصر' },
                  { icon: 'ShieldCheckIcon', text: 'ضمان أصالة' },
                  { icon: 'BoltIcon', text: 'تسليم سريع' },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0,
                      padding: '7px 12px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <Icon name={badge.icon as any} size={13} className="text-brand-500" />
                    <span
                      style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                      className="text-text-secondary text-text-muted"
                    >
                      {badge.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Floating card — full width on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <FloatingCard storage={storage} compact />
            </motion.div>

            {/* Slide dots + counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}
            >
              <SlideDots total={heroSlides.length} current={current} onSelect={goTo} />
              <span
                style={{ fontSize: 12, fontWeight: 500 }}
                className="text-text-secondary text-text-muted"
              >
                {String(current + 1).padStart(2, '0')} /{' '}
                {String(heroSlides.length).padStart(2, '0')}
              </span>
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-white from-surface to-transparent z-[5] pointer-events-none transition-colors duration-500" />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        /* Hide scrollbar for trust badge row */
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

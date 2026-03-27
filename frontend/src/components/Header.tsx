'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { label: 'منتجات', href: '/products' },
  { label: 'عروض', href: '/sales' },
];

// ─── Nav Link ────────────────────────────────────────────────────────────────
const NavLink = ({
  href,
  label,
  onClick = () => {},
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative px-4 py-2 text-body-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200 block rounded-full group overflow-hidden"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-surface-tertiary dark:bg-white/5"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="relative z-10">{label}</span>
        <motion.span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-500 to-transparent"
          initial={false}
          animate={{ width: hovered ? '60%' : '0%', opacity: hovered ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        />
      </Link>
    </li>
  );
};

const NavItems = ({ onClick = () => {} }: { onClick?: () => void }) => (
  <ul className="flex flex-col md:flex-row gap-1 items-center">
    {navItems.map((item, idx) => (
      <NavLink key={idx} href={item.href} label={item.label} onClick={onClick} />
    ))}
  </ul>
);

// ─── Cart Button ─────────────────────────────────────────────────────────────
const CartButton = ({ cartCount }: { cartCount: number }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 360, damping: 22 });
  const springY = useSpring(y, { stiffness: 360, damping: 22 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      id="global-cart-icon"
      href="/checkout"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className="relative text-text-secondary dark:text-text-dark-secondary hover:text-brand-500 dark:hover:text-brand-400 transition-colors p-2.5 rounded-full hover:bg-surface-tertiary dark:hover:bg-white/5 flex items-center justify-center"
    >
      <Icon name="ShoppingCartIcon" size={20} />
      <AnimatePresence mode="popLayout">
        {cartCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0, y: 4 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -3 }}
            transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            className="absolute -top-0.5 -right-0.5 bg-brand-500 dark:bg-brand-400 text-white dark:text-brand-950 text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-glow-sm"
          >
            {cartCount > 99 ? '99+' : cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// ─── Hamburger ────────────────────────────────────────────────────────────────
const HamburgerButton = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
    className="text-text-secondary dark:text-text-dark-secondary hover:text-brand-500 dark:hover:text-brand-400 p-2 md:hidden transition-colors rounded-full hover:bg-surface-tertiary dark:hover:bg-white/5"
  >
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <motion.line
        x1="3"
        y1="7"
        x2="19"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={open ? { x1: 4, y1: 4, x2: 18, y2: 18 } : { x1: 3, y1: 7, x2: 19, y2: 7 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />
      <motion.line
        x1="3"
        y1="15"
        x2="19"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={open ? { x1: 4, y1: 18, x2: 18, y2: 4 } : { x1: 3, y1: 15, x2: 19, y2: 15 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />
      <motion.line
        x1="3"
        y1="11"
        x2="19"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ originX: '50%', originY: '50%' }}
      />
    </svg>
  </button>
);

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
      className="text-text-muted dark:text-text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 transition-colors p-2.5 rounded-full hover:bg-surface-tertiary dark:hover:bg-white/5 flex items-center justify-center"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {theme === 'dark' ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </motion.div>
    </button>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartItems } = useStore();
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/*
        ┌─────────────────────────────────────────────────────────────────┐
        │  KEY FIX: A single wrapper div handles ALL the layout morphing  │
        │  (width, margin, padding) using CSS transitions so every        │
        │  property moves in perfect lockstep — no spring drift.          │
        │                                                                 │
        │  The inner <header> only handles background/border/shadow via   │
        │  CSS transition-colors, which is cheap and instantaneous.       │
        └─────────────────────────────────────────────────────────────────┘
      */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ perspective: '800px' }}
      >
        {/* Top gradient fade — only visible before scroll */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none transition-opacity duration-500 bg-gradient-to-b from-white/95 to-transparent dark:from-surface-dark/95 dark:to-transparent"
          style={{
            opacity: scrolled ? 0 : 1,
          }}
        />

        {/*
          The morphing shell — CSS transition drives width, margin,
          padding, and border-radius all at once from a single
          class toggle. This is the only reliable way to keep
          them perfectly in sync without spring drift.
        */}
        <div
          className="pointer-events-auto w-full"
          style={{
            maxWidth: scrolled ? '780px' : '100%',
            width: scrolled ? '88%' : '100%',
            marginTop: scrolled ? '14px' : '0px',
            padding: scrolled ? '0 4px' : '0',
            // All morph values share one cubic-bezier — they move as one.
            transition:
              'max-width 420ms cubic-bezier(0.32, 0, 0.17, 1), width 420ms cubic-bezier(0.32, 0, 0.17, 1), margin-top 420ms cubic-bezier(0.32, 0, 0.17, 1), padding 420ms cubic-bezier(0.32, 0, 0.17, 1)',
          }}
        >
          <header
            style={{
              borderRadius: scrolled ? '9999px' : '0px',
              // border-radius transitions slightly faster so the pill
              // shape resolves just before the width settles — looks intentional.
              transition:
                'border-radius 360ms cubic-bezier(0.32, 0, 0.17, 1), background-color 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
            }}
            className={`
              relative flex items-center justify-between overflow-visible
              ${
                scrolled
                  ? 'bg-white/85 dark:bg-surface-dark/85 backdrop-blur-2xl border border-border dark:border-border-dark shadow-elevated dark:shadow-elevated-dark'
                  : 'bg-transparent border-b border-border-light dark:border-border-dark'
              }
            `}
          >
            {/* Top shimmer line — only on floating state */}
            <div
              className="absolute inset-x-0 top-0 h-px pointer-events-none transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
                opacity: scrolled ? 1 : 0,
                borderRadius: '9999px',
              }}
            />

            <div className="flex items-center justify-between w-full h-[60px] px-4">
              {/* Logo with breathing animation */}
              <Link href="/homepage" className="flex items-center gap-2.5 group">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.85, 1],
                  }}
                  transition={{
                    duration: 3,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="p-1.5 rounded-full bg-surface-tertiary dark:bg-white/[0.06] group-hover:bg-border dark:group-hover:bg-white/[0.1] transition-colors duration-200 ring-1 ring-border dark:ring-white/10"
                >
                  <AppLogo size={28} />
                </motion.div>
                <motion.span
                  className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary tracking-tight hidden sm:block"
                  whileHover={{ x: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  أبو كارتونة
                </motion.span>
              </Link>

              {/* Right side */}
              <div className="flex items-center gap-1 md:gap-6">
                <nav className="hidden md:block">
                  <NavItems />
                </nav>

                <div className="hidden md:block w-px h-5 bg-border dark:bg-border-dark rounded-full" />

                <div className="flex items-center gap-0.5">
                  <ThemeToggle />
                  <CartButton cartCount={cartCount} />
                  <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
                </div>
              </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute top-full left-0 right-0 mt-3 mx-2 bg-white/95 dark:bg-surface-dark-secondary/95 backdrop-blur-2xl border border-border dark:border-border-dark rounded-2xl overflow-hidden md:hidden shadow-elevated dark:shadow-elevated-dark"
                >
                  <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-border dark:via-border-dark-hover to-transparent" />

                  <nav className="p-5 flex flex-col gap-3">
                    {navItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: idx * 0.05,
                          type: 'spring',
                          stiffness: 380,
                          damping: 28,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between w-full px-4 py-3 text-text-secondary dark:text-text-dark-secondary hover:text-brand-500 dark:hover:text-brand-400 font-medium text-body rounded-xl hover:bg-surface-tertiary dark:hover:bg-white/[0.06] transition-all duration-150 group"
                        >
                          <span>{item.label}</span>
                          <Icon
                            name="ChevronLeftIcon"
                            size={16}
                            className="text-text-muted group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors"
                          />
                        </Link>
                      </motion.div>
                    ))}

                    <div className="h-px bg-border dark:bg-border-dark mx-2 my-1" />

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: navItems.length * 0.05 + 0.03,
                        type: 'spring',
                        stiffness: 380,
                        damping: 28,
                      }}
                    >
                      <Link
                        href="/checkout"
                        onClick={() => setMobileOpen(false)}
                        className="btn-primary w-full py-3.5 text-body-sm"
                      >
                        <Icon name="ShoppingCartIcon" size={17} />
                        <span>إتمام الشراء</span>
                        {cartCount > 0 && (
                          <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
        </div>
      </div>
    </>
  );
}

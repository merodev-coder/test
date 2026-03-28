'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden" dir="rtl">
      {/* 🔥 Dynamic Background - Mobile optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-[#37D7AC]/10 blur-[100px] sm:blur-[150px] lg:blur-[180px] top-[20px] sm:top-[50px] right-[-100px] sm:right-[-200px]" />
        <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-[#37D7AC]/5 blur-[80px] sm:blur-[120px] lg:blur-[150px] bottom-[-100px] sm:bottom-[-200px] left-[-100px] sm:left-[-200px]" />
      </div>

      {/* ✨ Floating Lines - Simplified for mobile performance */}
      <div className="absolute inset-0 opacity-[0.03] sm:opacity-[0.05] pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(to_right,#37D7AC_1px,transparent_1px),linear-gradient(to_bottom,#37D7AC_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px] lg:bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex flex-col justify-center min-h-screen">
        {/* TOP BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#37D7AC]"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          تجربة جديدة بالكامل في عالم
        </motion.div>

        {/* MAIN GRID - Mobile: stack vertically, Desktop: side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT - Text first on mobile */}
          <div className="order-2 lg:order-1">
            {/* HEADLINE - Fluid typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-4 sm:mb-6"
            >
              القوة اللي <br />
              <span className="text-[#37D7AC]">كنت مستنيها</span>
              <br />
              وصلت خلاص
            </motion.h1>

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 max-w-xl leading-relaxed"
            >
              مش مجرد جهاز… ده أداء يخليك تكسب، سرعة تخليك تسبق، وتجربة تخليك مستحيل ترجع لقديمك.
            </motion.p>

            {/* CTA Buttons - Touch friendly */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group px-6 sm:px-8 py-3.5 sm:py-4 bg-[#37D7AC] text-black font-bold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_40px_rgba(55,215,172,0.4)] touch-target">
                  استكشف الأجهزة
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition" />
                </button>
              </Link>

              <Link href="/build" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/10 bg-white/5 rounded-xl sm:rounded-2xl hover:bg-white/10 transition touch-target">
                  ابني جهازك
                </button>
              </Link>
            </motion.div>

            {/* MINI FEATURES */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 sm:gap-6 lg:gap-10 mt-8 sm:mt-12 lg:mt-16 text-white/40 text-xs sm:text-sm"
            >
              <span>أداء خارق</span>
              <span>تبريد احترافي</span>
              <span>جاهز للتطوير</span>
            </motion.div>
          </div>

          {/* RIGHT VISUAL - Image second on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center order-1 lg:order-2"
          >
            {/* Glow Circle - Responsive sizing */}
            <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-[#37D7AC]/20 blur-[60px] sm:blur-[100px] lg:blur-[120px] rounded-full" />

            {/* IMAGE - Responsive sizing with aspect ratio maintained */}
            <img
              src="/assets/images/hero-pc-case.png"
              alt="Gaming PC"
              className="relative z-10 w-[75%] sm:w-[80%] lg:w-[90%] max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] sm:drop-shadow-[0_50px_60px_rgba(0,0,0,0.8)]"
            />

            {/* FLOATING CARD 1 - Responsive positioning */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-4 sm:top-10 left-0 sm:left-[-10px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 sm:px-5 sm:py-4"
            >
              <p className="text-[10px] sm:text-xs text-white/50">أداء</p>
              <p className="text-[#37D7AC] font-bold text-sm sm:text-lg">+220 FPS</p>
            </motion.div>

            {/* FLOATING CARD 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-4 sm:bottom-10 right-0 sm:right-[-10px] bg-[#37D7AC]/10 border border-[#37D7AC]/30 rounded-xl px-3 py-2 sm:px-5 sm:py-4"
            >
              <p className="text-[10px] sm:text-xs text-white/50">جاهز لـ</p>
              <p className="text-white font-bold text-sm sm:text-base">RTX Series</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

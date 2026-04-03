'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ProductCard';
import { useStore, type Product } from '@/store/useStore';
import { getApiUrl } from '@/lib/apiConfig';

const BRAND_GREEN = '#37D7AC';

interface HeroSectionProps {
  storage: {
    total: number;
    used: number;
    hasDrive: boolean;
  };
}

export default function HeroSection({ storage }: HeroSectionProps) {
  const { addToCart } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const apiUrl = getApiUrl('products');
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          // Get a mix of different product types for hero section
          const products = data.products || [];
          const featured = products
            .filter((p: Product) => p.isSale || p.type === 'laptops' || p.type === 'accessories')
            .slice(0, 3);
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, createdAt: '', updatedAt: '' } as any);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-base via-base to-base/95" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-96 h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, ${BRAND_GREEN}20 0%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full"
        style={{
          background: `radial-gradient(circle, ${BRAND_GREEN}15 0%, transparent 60%)`,
          filter: 'blur(50px)'
        }}
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex"
          >
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: `${BRAND_GREEN}15`,
                color: BRAND_GREEN,
                border: `1px solid ${BRAND_GREEN}30`,
                backdropFilter: 'blur(10px)'
              }}
            >
              🎮 أبوكرتونة - عالم الألعاب والإكسسوارات
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
          >
            <span className="block">أحدث</span>
            <span 
              className="block bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${BRAND_GREEN}, ${BRAND_GREEN}80, ${BRAND_GREEN}40)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              الأجهزة
            </span>
            <span className="block">والإكسسوارات</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            كنبيوترات وإكسسوارات احترافية • املأ هاردك بالألعاب والأفلام مجاناً • شحن لجميع محافظات مصر
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/products"
              className="group relative px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${BRAND_GREEN}, ${BRAND_GREEN}80)`,
                boxShadow: `0 4px 20px ${BRAND_GREEN}30`
              }}
            >
              <span className="relative z-10 text-white">تسوق الآن</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_GREEN}CC, ${BRAND_GREEN}99)`
                }}
              />
            </Link>

            <Link
              href="/products?cat=data"
              className="group px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-300 border-white/20 text-white hover:border-white/40 hover:bg-white/10"
            >
              الألعاب المجانية
            </Link>
          </motion.div>

          {/* Featured Products Mini Grid */}
          {featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-white mb-8">منتجات مميزة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="aspect-square bg-gradient-to-br from-brand/20 to-brand/5 rounded-xl mb-4 flex items-center justify-center">
                      <Icon name="ComputerDesktopIcon" size={48} style={{ color: BRAND_GREEN }} />
                    </div>
                    <h4 className="text-white font-semibold mb-2">{product.name}</h4>
                    <p className="text-white/70 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: BRAND_GREEN }}
                      >
                        {product.price} جنيه
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                        style={{
                          background: `${BRAND_GREEN}20`,
                          color: BRAND_GREEN,
                          border: `1px solid ${BRAND_GREEN}40`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${BRAND_GREEN}30`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${BRAND_GREEN}20`;
                        }}
                      >
                        أضف للسلة
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Storage Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm max-w-md mx-auto"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: `${BRAND_GREEN}20` }}
              >
                <Icon name="HardDriveIcon" size={24} style={{ color: BRAND_GREEN }} />
              </div>
              <div className="text-right">
                <h4 className="text-white font-semibold">مساحة التخزين</h4>
                <p className="text-white/70 text-sm">
                  {storage.hasDrive 
                    ? `مستخدم ${storage.used}GB من ${storage.total}GB` 
                    : 'احصل على هارد مجاني مع كل جهاز'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-sm">اسحب للأسفل</span>
          <Icon name="ChevronDownIcon" size={20} className="text-white/30" />
        </div>
      </motion.div>
    </section>
  );
}

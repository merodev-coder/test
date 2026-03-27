'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductFilters from './components/ProductFilters';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/AppIcon';
import WhatsAppButton from '../homepage/components/WhatsAppButton';
import { useSearchParams } from 'next/navigation';
import { useStore, type Product } from '@/store/useStore';
import { ThemedSelect } from '@/components/ui/ThemedSelect';

export const dynamic = 'force-dynamic';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'الأكثر شعبية' },
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل' },
  { value: 'price-desc', label: 'السعر: من الأعلى' },
];

const tabOptions = [
  { id: 'all', label: 'الكل' },
  { id: 'storage', label: 'التخزين' },
  { id: 'laptops', label: 'اللابتوبات' },
  { id: 'accessories', label: 'الإكسسوارات' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const {
    driveItems,
    filters,
    products,
    productsLoading,
    setSearchQuery,
    setCategory,
    toggleTag,
    clearTags,
    addToCart,
    addToDrive,
    fetchProducts,
    fetchTags,
    tags,
  } = useStore();

  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [storage] = useState({ total: 1000, used: 0, hasDrive: false });

  useEffect(() => {
    fetchProducts();
    fetchTags();
  }, [fetchProducts, fetchTags]);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (!cat) return;
    if (cat === 'laptops') {
      setCategory('laptops');
      setActiveTab('laptops');
    } else if (cat === 'accessories') {
      setCategory('accessories');
      setActiveTab('accessories');
    } else if (cat === 'storage' || cat === 'hdd' || cat === 'ssd' || cat === 'flash') {
      setCategory('storage');
      setActiveTab('storage');
    } else {
      setCategory('all');
      setActiveTab('all');
    }
    if (['hdd', 'ssd', 'flash'].includes(cat)) {
      clearTags();
      toggleTag(cat);
    }
  }, [searchParams, setCategory, toggleTag, clearTags]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      if (tabId === 'all') setCategory('all');
      else setCategory(tabId as any);
    },
    [setCategory]
  );

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      try {
        addToCart(product);
        const brandText = product.selectedBrand ? ` (${product.selectedBrand})` : '';
        showNotification(`✓ تمت إضافة "${product.name}${brandText}" للسلة`);
      } catch (error) {
        if (error instanceof Error && error.message.includes('الماركة')) {
          showNotification('⚠️ يرجى اختيار الماركة قبل إضافة المنتج للسلة');
        } else {
          showNotification('⚠️ حدث خطأ أثناء إضافة المنتج للسلة');
        }
      }
    },
    [addToCart, showNotification]
  );

  const handleAddToDrive = useCallback(
    (product: Product) => {
      const sizeNum = product.storageCapacity || 0;
      const currentUsed = driveItems.reduce(
        (acc, p) => acc + (p.storageCapacity || 0),
        storage.used
      );
      if (currentUsed + sizeNum > storage.total) {
        showNotification('⚠️ مساحة الهارد مش كفاية لهذا الملف');
        return;
      }
      addToDrive(product);
      showNotification(`✓ تمت إضافة "${product.name}" للدرايف مجاناً`);
    },
    [addToDrive, driveItems, storage, showNotification]
  );

  const filteredProducts = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    const activeCategory = filters.category;
    const activeTags = filters.tags;
    const [minPrice, maxPrice] = filters.priceRange;

    console.log('Filtering products:', {
      totalProducts: products.length,
      activeCategory,
      activeTags,
      searchQuery: q,
      priceRange: [minPrice, maxPrice],
      products: products.map((p) => ({ id: p.id, name: p.name, type: p.type })),
    });

    let filtered = products.filter((p) => {
      // Hide data products from general listing
      if (p.type === 'data') return false;

      // Category filtering - this is the key fix
      if (activeCategory && activeCategory !== 'all' && p.type !== activeCategory) {
        console.log(`Filtering out ${p.name} - type: ${p.type}, needed: ${activeCategory}`);
        return false;
      }

      if (q) {
        const hay = `${p.name} ${p.subtype} ${p.description || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeTags.length > 0) {
        const tagSlugs = p.tags.map((t) => t.slug);
        if (!activeTags.some((t) => tagSlugs.includes(t))) return false;
      }
      // Price range filtering
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    console.log(
      'Filtered products:',
      filtered.map((p) => ({ id: p.id, name: p.name, type: p.type }))
    );

    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
      default:
        // Keep original order or sort by a combination of factors
        filtered = [...filtered].sort((a, b) => {
          // Sort by isSale first, then by price (descending), then by name
          if (a.isSale && !b.isSale) return -1;
          if (!a.isSale && b.isSale) return 1;
          if (a.price !== b.price) return b.price - a.price;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    return filtered;
  }, [products, sortBy, filters.searchQuery, filters.category, filters.tags, filters.priceRange]);

  return (
    <div className="min-h-screen bg-surface bg-surface" dir="rtl">
      <Header />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 rounded-2xl text-body-sm font-semibold text-text-primary text-text-primary shadow-elevated"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 pb-32">
        {/* Page Header */}
        <div className="bg-surface-secondary bg-surface-secondary/40 border-b border-border-light border-border">
          <div className="section-container py-8">
            <div ref={headerRef}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="section-label mb-2">المتجر</p>
                <h1 className="text-h1 md:text-display font-heading text-text-primary text-text-primary mb-6">
                  كل المنتجات
                </h1>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative max-w-lg"
              >
                <Icon
                  name="MagnifyingGlassIcon"
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="ابحث عن منتج، لعبة، فيلم..."
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pr-11 pl-4 py-3 text-body-sm w-full"
                />
              </motion.div>
            </div>

            {/* Category Tabs - Removed */}

            {/* Tag Filters */}
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1"
              >
                {tags.slice(0, 8).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.slug)}
                    className={`px-4 py-2 rounded-xl text-body-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      filters.tags.includes(tag.slug)
                        ? 'bg-brand-500 text-white shadow-btn'
                        : 'bg-surface-tertiary bg-white/5 text-text-secondary text-text-secondary hover:bg-surface-secondary hover:bg-white/10'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="section-container mt-8">
          <div className="flex gap-6">
            <ProductFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="md:hidden btn-ghost px-4 py-2.5 text-body-sm font-semibold flex items-center gap-2"
                  >
                    <Icon name="FunnelIcon" size={16} />
                    <span>فلاتر</span>
                  </button>
                  <span className="text-body-sm text-text-muted text-text-muted">
                    <span className="text-text-primary text-text-primary font-bold">
                      {filteredProducts.length}
                    </span>{' '}
                    منتج
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-caption text-text-muted hidden md:block">ترتيب:</span>
                  <ThemedSelect
                    value={sortBy}
                    onChange={(value) => setSortBy(value as SortOption)}
                    options={sortOptions}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Loading State — Skeleton */}
              {productsLoading ? (
                <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card rounded-2xl overflow-hidden">
                      <div className="shimmer w-full aspect-[4/3]" />
                      <div className="p-4 space-y-3">
                        <div className="shimmer h-3 w-20 rounded-md" />
                        <div className="shimmer h-5 w-full rounded-md" />
                        <div className="shimmer h-5 w-3/4 rounded-md" />
                        <div className="flex justify-between pt-2">
                          <div className="shimmer h-6 w-24 rounded-md" />
                          <div className="shimmer h-4 w-12 rounded-md" />
                        </div>
                        <div className="shimmer h-11 w-full rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-tertiary bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Icon name="MagnifyingGlassIcon" size={28} className="text-text-muted" />
                  </div>
                  <p className="text-h3 font-bold text-text-secondary text-text-secondary">
                    مفيش نتائج للبحث ده
                  </p>
                  <p className="text-body-sm text-text-muted text-text-muted mt-2">
                    جرب كلمة تانية أو غير الفلاتر
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleTabChange('all');
                      clearTags();
                    }}
                    className="btn-secondary mt-6 text-body-sm"
                  >
                    مسح الفلاتر
                  </button>
                </motion.div>
              ) : (
                /* Product Grid */
                <motion.div
                  key={`${activeTab}-${filters.category}-${filters.searchQuery}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div key={product.id} variants={itemVariants} layout>
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onAddToDrive={handleAddToDrive}
                          hasDrive={storage.hasDrive}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface bg-surface flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-500 rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

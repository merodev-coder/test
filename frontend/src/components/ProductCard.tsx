'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import type { Product } from '@/store/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import { isFreeWithHardware } from '@/lib/freeContentUtils';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToDrive?: (product: Product) => void;
  hasDrive?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToDrive,
  hasDrive,
}: ProductCardProps) {
  const router = useRouter();
  const isData = product.type === 'data';
  const isFreeContent = isFreeWithHardware(product.type, product.subtype);
  const inStock = product.stockCount > 0;
  const flyingCloneRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flyingCloneRef.current) {
        flyingCloneRef.current.remove();
        flyingCloneRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Brand selection state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [brandError, setBrandError] = useState(false);

  // Check if product requires brand selection
  const needsBrandSelection =
    product.isBrandActive && product.brands && product.brands.length > 0 && !isData;

  const triggerFlyingAnimation = useCallback(() => {
    const cartIcon = document.getElementById('global-cart-icon');
    if (!cartIcon || !imageRef.current) return;

    const srcRect = imageRef.current.getBoundingClientRect();
    const destRect = cartIcon.getBoundingClientRect();

    const clone = document.createElement('div');
    const imgSrc = product.images?.[0] || product.image || '/placeholder.png';
    clone.innerHTML = `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />`;

    Object.assign(clone.style, {
      position: 'fixed',
      top: `${srcRect.top}px`,
      left: `${srcRect.left}px`,
      width: `${srcRect.width}px`,
      height: `${srcRect.height}px`,
      borderRadius: '12px',
      zIndex: '9999',
      pointerEvents: 'none',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: '0 10px 25px rgba(5,150,105,0.3)',
    });

    // Cleanup any existing clone
    if (flyingCloneRef.current) {
      flyingCloneRef.current.remove();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Assign to ref for tracking and cleanup
    flyingCloneRef.current = clone;
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.top = `${destRect.top + destRect.height / 2 - 16}px`;
      clone.style.left = `${destRect.left + destRect.width / 2 - 16}px`;
      clone.style.width = '32px';
      clone.style.height = '32px';
      clone.style.opacity = '0.3';
      clone.style.transform = 'scale(0.3) rotate(10deg)';

      timeoutRef.current = setTimeout(() => {
        if (flyingCloneRef.current === clone) {
          flyingCloneRef.current = null;
        }
        clone.remove();
        cartIcon.classList.add('scale-125');
        timeoutRef.current = setTimeout(() => {
          cartIcon.classList.remove('scale-125');
          timeoutRef.current = null;
        }, 300);
      }, 600);
    });
  }, [product.images, product.image]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    // If brand selection is required but not selected, navigate to product page
    if (needsBrandSelection && !selectedBrand) {
      router.push(`/product/${product.slug || product.id || product._id}`);
      return;
    }

    if (onAddToCart && inStock) {
      try {
        // Add product with selected brand
        const productWithBrand = selectedBrand
          ? { ...product, selectedBrand, brand: selectedBrand }
          : product;
        onAddToCart(productWithBrand);
        triggerFlyingAnimation();
      } catch (error) {
        if (error instanceof Error && error.message.includes('الماركة')) {
          router.push(`/product/${product.slug || product.id || product._id}`);
        }
      }
    }
  };

  const handleDriveAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToDrive) {
      onAddToDrive(product);
    }
  };

  const hasOldPrice =
    product.oldPrice !== undefined && product.oldPrice !== null && product.oldPrice > 0;

  const typeLabel =
    product.type === 'laptops'
      ? 'لابتوب'
      : product.type === 'accessories'
        ? 'إكسسوار'
        : product.type === 'storage'
          ? 'تخزين'
          : 'داتا';

  // Convert brands to dropdown options
  const brandOptions =
    product.brands?.map((brand) => ({
      value: brand,
      label: brand,
      icon: 'TagIcon',
    })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: -5,
        scale: 1.02,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="flex flex-col h-full bg-white bg-surface-secondary rounded-2xl overflow-hidden relative group shadow-card dark:shadow-card-dark border border-border-light border-border hover:shadow-glow-lg dark:hover:shadow-glow-lg hover:border-brand-500/50 dark:hover:border-brand-400/50 transition-all duration-300 preserve-3d"
    >
      {/* Image Area */}
      <div ref={imageRef} className="relative bg-surface-secondary bg-surface-tertiary">
        <Link
          href={`/product/${product.slug || product.id || product._id}`}
          className="block relative w-full aspect-[4/3] overflow-hidden"
        >
          <AppImage
            src={product.images?.[0] || product.image || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Subtle gradient overlay on image bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </Link>

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isSale && hasOldPrice && (
            <span className="badge-error text-[10px] px-2 py-0.5">
              <Icon name="FireIcon" size={10} />
              خصم
            </span>
          )}
          {isData && (product.gbSize ?? 0) > 0 && (
            <span className="badge-new text-[10px] px-2 py-0.5">{product.gbSize} GB</span>
          )}
        </div>

        {/* Quick-action on hover — add to cart floating button */}
        {onAddToCart && inStock && !isData && (
          <motion.button
            onClick={handleAdd}
            initial={{ opacity: 0, scale: 0.8, z: -50 }}
            whileHover={{ scale: 1.15, z: 20 }}
            className="absolute bottom-3 left-3 z-10 w-10 h-10 rounded-full bg-brand-500 bg-brand-400 text-white dark:text-brand-950 shadow-glow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="أضف للسلة"
            style={{
              boxShadow: '0 0 20px rgba(5, 150, 105, 0.6), 0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Icon name="ShoppingCartIcon" size={16} />
          </motion.button>
        )}

        {/* Brand selector popup */}
        <AnimatePresence>
          {showBrandSelector && needsBrandSelection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center p-4"
              onClick={() => setShowBrandSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white bg-surface-secondary rounded-2xl p-4 w-full max-w-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-body font-bold text-text-primary text-text-primary">
                    اختر الماركة
                  </h3>
                  <button
                    onClick={() => setShowBrandSelector(false)}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-tertiary hover:bg-white/5 transition-colors"
                  >
                    <Icon name="XMarkIcon" size={14} className="text-text-muted" />
                  </button>
                </div>

                <CustomDropdown
                  options={brandOptions}
                  value={selectedBrand}
                  onChange={(value) => {
                    setSelectedBrand(value);
                    setBrandError(false);
                  }}
                  label=""
                  placeholder="اختر الماركة..."
                  error={brandError}
                  errorMessage={brandError ? 'يرجى اختيار الماركة قبل الإضافة للسلة' : undefined}
                  required
                  size="sm"
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowBrandSelector(false)}
                    className="flex-1 py-2 rounded-lg text-body-sm font-medium text-text-muted hover:bg-surface-tertiary hover:bg-white/5 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      if (selectedBrand && onAddToCart && inStock) {
                        const productWithBrand = {
                          ...product,
                          selectedBrand,
                          brand: selectedBrand,
                        };
                        onAddToCart(productWithBrand);
                        triggerFlyingAnimation();
                        setShowBrandSelector(false);
                      }
                    }}
                    disabled={!selectedBrand}
                    className="flex-1 py-2 rounded-lg text-body-sm font-medium bg-brand-500 text-white disabled:bg-surface-tertiary disabled:text-text-muted transition-colors"
                  >
                    أضف للسلة
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-white/50 dark:to-surface-dark-secondary/50">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="badge-primary text-[10px] px-2 py-0.5">{typeLabel}</span>
          {!inStock && <span className="badge-error text-[10px] px-2 py-0.5">نفد</span>}
        </div>

        {/* Product Name */}
        <Link
          href={`/product/${product.slug || product.id || product._id}`}
          className="block mb-auto"
        >
          <h3 className="font-heading text-body font-bold text-text-primary text-text-primary leading-snug line-clamp-2 group-hover:text-brand-500 group-hover:text-brand-400 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Brand indicator */}
        {selectedBrand && needsBrandSelection && (
          <div className="flex items-center gap-1.5 mt-2">
            <Icon name="CheckBadgeIcon" size={12} className="text-brand-500" />
            <span className="text-caption text-brand-500 text-brand-400 font-medium">
              {selectedBrand}
            </span>
          </div>
        )}

        {/* Price + CTA area */}
        <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-border-light border-border">
          {/* Price */}
          <div className="flex items-end justify-between">
            {isFreeContent ? (
              <span className="badge-success text-[10px] px-2 py-0.5">
                <Icon name="GiftIcon" size={10} />
                هدية مع الهاردات
              </span>
            ) : isData && hasDrive ? (
              <span className="text-h3 font-bold text-brand-500 text-brand-400 font-heading">
                مجاناً
              </span>
            ) : (
              <div className="flex flex-col">
                <span className="text-h3 font-bold text-text-primary text-text-primary leading-none font-heading">
                  {product.price.toLocaleString('ar-EG')}
                  <span className="text-caption text-text-muted text-text-muted font-normal me-1">
                    جنيه
                  </span>
                </span>
                {hasOldPrice && (
                  <span className="text-text-muted line-through text-caption mt-1 decoration-error/50">
                    {product.oldPrice?.toLocaleString('ar-EG')} جنيه
                  </span>
                )}
              </div>
            )}
            {inStock && !isFreeContent && (
              <span className="badge-success text-[10px] px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                متوفر
              </span>
            )}
          </div>

          {/* CTA Button */}
          {(onAddToCart || onAddToDrive) && (
            <div className="w-full">
              {isFreeContent ? (
                <Link
                  href="/products?cat=storage"
                  className="w-full py-2.5 rounded-full font-semibold text-body-sm bg-brand-500 bg-brand-400 text-white dark:text-brand-950 hover:bg-brand-600 dark:hover:bg-brand-300 shadow-btn hover:shadow-btn-hover transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingBagIcon" size={15} />
                  تسوق وحدات التخزين
                </Link>
              ) : isData && hasDrive ? (
                <button
                  onClick={handleDriveAdd}
                  className="w-full py-2.5 rounded-full font-semibold text-body-sm bg-brand-500 bg-brand-400 text-white dark:text-brand-950 hover:bg-brand-600 dark:hover:bg-brand-300 shadow-btn hover:shadow-btn-hover transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  <Icon name="PlusCircleIcon" size={15} />
                  أضف للدرايف
                </button>
              ) : (
                <div className="space-y-2">
                  {/* Brand selection hint */}
                  {needsBrandSelection && !selectedBrand && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                      <Icon
                        name="InformationCircleIcon"
                        size={14}
                        className="text-amber-600 dark:text-amber-400 flex-shrink-0"
                      />
                      <span className="text-xs text-amber-700 dark:text-amber-300">
                        يجب اختيار الماركة أولاً
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleAdd}
                    disabled={!inStock}
                    className={`w-full py-2.5 rounded-full font-semibold text-body-sm transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 ${
                      inStock
                        ? 'bg-brand-500 bg-brand-400 text-white dark:text-brand-950 hover:bg-brand-600 dark:hover:bg-brand-300 shadow-btn hover:shadow-btn-hover'
                        : 'bg-surface-tertiary bg-white/5 text-text-muted text-text-muted cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Icon name="ShoppingCartIcon" size={15} />
                    {!inStock
                      ? 'نفد المخزون'
                      : needsBrandSelection && !selectedBrand
                        ? 'اختر الماركة أولاً'
                        : 'أضف للسلة'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import WhatsAppButton from '@/app/homepage/components/WhatsAppButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '#AC-XXXXX';
  const total = searchParams.get('total') || '0';
  const deposit = searchParams.get('deposit') || '0';
  const drive = searchParams.get('drive') || '0';

  return (
    <div className="max-w-md w-full text-center">
      {/* Success Animation */}
      <div className="w-24 h-24 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
        <Icon name="CheckCircleIcon" size={48} className="text-brand-500" variant="solid" />
      </div>
      <h2 className="text-3xl font-black text-text-primary mb-3">تم تأكيد أوردرك! 🎉</h2>
      <p className="text-text-muted mb-8 leading-relaxed">
        أوردرك اتأكد وبيتجهز دلوقتي. هنتواصل معاك على الموبايل في أقرب وقت لتحديد موعد التوصيل.
      </p>

      {/* Order Details */}
      <div className="glass-card rounded-3xl p-6 text-right mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">رقم الأوردر</span>
          <span className="text-sm font-black text-text-primary" dir="ltr">
            {orderId}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">إجمالي الأوردر</span>
          <span className="text-sm font-black text-text-primary">
            {Number(total).toLocaleString('ar-EG')} جنيه
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">العربون المدفوع</span>
          <span className="text-sm font-black text-brand-500">{deposit} جنيه ✓</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">ملفات الداتا</span>
          <span className="text-sm font-black text-brand-500">{drive} ملف مجاناً 🎁</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href="https://wa.me/201067957449"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full py-4 text-base font-black flex items-center justify-center gap-2 relative z-10"
        >
          <span className="relative z-10">تابع أوردرك على واتساب</span>
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 mt-14">
        <Suspense fallback={<div className="text-text-primary">جاري التحميل...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

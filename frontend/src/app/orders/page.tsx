'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import WhatsAppButton from '../homepage/components/WhatsAppButton';
import { useStore } from '@/store/useStore';

export default function OrdersPage() {
  const { orders } = useStore();
  const pending = orders.filter((o) => o.status === 'pending');

  return (
    <div className="min-h-screen bg-surface flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <div className="bg-surface-secondary/40 border-b border-border mb-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
            <p className="section-label mb-2">الأوردرات</p>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary">طلباتك الحالية</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {pending.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center mx-auto mb-4">
                <Icon name="CubeIcon" size={28} className="text-text-muted" />
              </div>
              <p className="text-lg font-black text-text-primary mb-1">لا يوجد أوردرات Pending</p>
              <p className="text-sm text-text-muted">اعمل أوردر من صفحة الشيك آوت وسيظهر هنا</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((o) => (
                <div key={o.id} className="glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-text-muted">رقم الأوردر</p>
                      <p className="text-sm font-black text-text-primary" dir="ltr">
                        #{o.id}
                      </p>
                    </div>
                    <span className="badge-new">Pending</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-surface-secondary border border-white/5">
                      <p className="text-xs text-text-muted mb-1">الهاردوير المختار</p>
                      <p className="text-sm font-black text-text-primary line-clamp-2">
                        {o.items
                          .map((i) => `${i.name}${i.selectedBrand ? ` (${i.selectedBrand})` : ''}`)
                          .join(' • ') || '—'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-secondary border border-white/5">
                      <p className="text-xs text-text-muted mb-1">إجمالي الداتا</p>
                      <p className="text-sm font-black text-brand-500">{o.totalGb} GB</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-secondary border border-white/5">
                      <p className="text-xs text-text-muted mb-1">إثبات الدفع</p>
                      <p className="text-sm font-black text-text-primary">
                        {o.paymentScreenshot || 'تم الرفع'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { getAdminApiUrl } from '@/lib/apiConfig';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function BostaShipButton({
  orderId,
  status,
  trackingNumber,
}: {
  orderId: string;
  status: string;
  trackingNumber?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isShipped = status === 'shipped' || status === 'completed';

  const handleShip = async () => {
    try {
      setLoading(true);
      const res = await fetch(getAdminApiUrl('orders/ship'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to ship with Bosta');

      alert(`تم بنجاح! رقم التتبع: ${data.trackingNumber}`);
      router.refresh(); // Automatically hydrates the state natively
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (trackingNumber) {
    return (
      <div className="glass-card rounded-2xl p-6 mt-6">
        <h3 className="text-body-lg font-bold text-text-primary text-text-primary mb-4 font-heading flex items-center gap-2">
          <Icon name="TruckIcon" size={20} className="text-blue-400" />
          تمت الجدولة مع بوسطة
        </h3>
        <a
          href={`https://tracking.bosta.co/tracking/${trackingNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 py-3 rounded-xl font-bold transition-all hover:bg-blue-500/20"
        >
          تتبع الطلب ({trackingNumber})
          <Icon name="ArrowTopRightOnSquareIcon" size={16} />
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 mt-6">
      <h3 className="text-body-lg font-bold text-text-primary text-text-primary mb-4 font-heading flex items-center gap-2">
        <Icon name="TruckIcon" size={20} className="text-brand-500 text-brand-400" />
        خيارات الشحن
      </h3>
      <button
        onClick={handleShip}
        disabled={isShipped || loading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
          isShipped
            ? 'bg-surface-tertiary bg-white/5 text-text-muted cursor-not-allowed border border-border border-border'
            : 'bg-brand-500 text-white hover:bg-brand-600 bg-brand-400 dark:text-brand-950 dark:hover:bg-brand-300 shadow-btn hover:shadow-btn-hover'
        }`}
      >
        {loading ? (
          <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
        ) : (
          <Icon name="TruckIcon" size={18} />
        )}
        {loading ? 'جاري التنفيذ...' : 'شحن الطلب مع بوسطة'}
      </button>
    </div>
  );
}

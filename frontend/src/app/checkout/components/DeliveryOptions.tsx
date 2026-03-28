'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface DeliveryOptionsProps {
  onDeliveryChange: (method: string, governorate: string, cost: number, cityCode?: string) => void;
}

const governorates = [
  { name: 'القاهرة', cost: 50, cityCode: 'EG-01' },
  { name: 'الجيزة', cost: 50, cityCode: 'EG-14' },
  { name: 'الإسكندرية', cost: 80, cityCode: 'EG-02' },
  { name: 'الدقهلية', cost: 90, cityCode: 'EG-06' },
  { name: 'الشرقية', cost: 85, cityCode: 'EG-07' },
  { name: 'القليوبية', cost: 60, cityCode: 'EG-08' },
  { name: 'الغربية', cost: 90, cityCode: 'EG-10' },
  { name: 'المنوفية', cost: 85, cityCode: 'EG-11' },
  { name: 'البحيرة', cost: 90, cityCode: 'EG-12' },
  { name: 'الفيوم', cost: 85, cityCode: 'EG-16' },
  { name: 'بني سويف', cost: 95, cityCode: 'EG-15' },
  { name: 'المنيا', cost: 100, cityCode: 'EG-17' },
  { name: 'أسيوط', cost: 110, cityCode: 'EG-18' },
  { name: 'سوهاج', cost: 115, cityCode: 'EG-19' },
  { name: 'قنا', cost: 120, cityCode: 'EG-20' },
  { name: 'الأقصر', cost: 125, cityCode: 'EG-22' },
  { name: 'أسوان', cost: 130, cityCode: 'EG-21' },
  { name: 'البحر الأحمر', cost: 120, cityCode: 'EG-23' },
  { name: 'الوادي الجديد', cost: 130, cityCode: 'EG-24' },
  { name: 'مطروح', cost: 120, cityCode: 'EG-25' },
  { name: 'شمال سيناء', cost: 110, cityCode: 'EG-26' },
  { name: 'جنوب سيناء', cost: 115, cityCode: 'EG-27' },
  { name: 'بورسعيد', cost: 90, cityCode: 'EG-03' },
  { name: 'الإسماعيلية', cost: 85, cityCode: 'EG-13' },
  { name: 'السويس', cost: 85, cityCode: 'EG-04' },
  { name: 'دمياط', cost: 90, cityCode: 'EG-05' },
  { name: 'كفر الشيخ', cost: 90, cityCode: 'EG-09' },
];

export default function DeliveryOptions({ onDeliveryChange }: DeliveryOptionsProps) {
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedGov, setSelectedGov] = useState('');

  const selectedGovData = governorates.find((g) => g.name === selectedGov);
  const shippingCost = method === 'pickup' ? 0 : selectedGovData?.cost || 0;

  const handleMethodChange = (m: 'delivery' | 'pickup') => {
    setMethod(m);
    onDeliveryChange(m, selectedGov, m === 'pickup' ? 0 : shippingCost, selectedGovData?.cityCode);
  };

  const handleGovChange = (gov: string) => {
    setSelectedGov(gov);
    const govData = governorates.find((g) => g.name === gov);
    onDeliveryChange(method, gov, govData?.cost || 0, govData?.cityCode);
  };

  return (
    <div className="space-y-4">
      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-3">
        {/* Home Delivery */}
        <button
          onClick={() => handleMethodChange('delivery')}
          className={`p-4 rounded-2xl border transition-all text-right ${
            method === 'delivery'
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-border bg-surface-secondary hover:border-border-light'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              method === 'delivery' ? 'bg-brand-500/20' : 'bg-surface-tertiary'
            }`}
          >
            <Icon
              name="TruckIcon"
              size={20}
              className={method === 'delivery' ? 'text-brand-500' : 'text-text-muted'}
            />
          </div>
          <p
            className={`text-sm font-black ${method === 'delivery' ? 'text-text-primary' : 'text-text-muted'}`}
          >
            توصيل للبيت
          </p>
          <p
            className={`text-xs mt-1 ${method === 'delivery' ? 'text-brand-500' : 'text-text-secondary'}`}
          >
            {selectedGov && method === 'delivery' ? `${shippingCost} جنيه` : 'حسب المحافظة'}
          </p>
        </button>

        {/* Store Pickup */}
        <button
          onClick={() => handleMethodChange('pickup')}
          className={`p-4 rounded-2xl border transition-all text-right ${
            method === 'pickup'
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-border bg-surface-secondary hover:border-border-light'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              method === 'pickup' ? 'bg-brand-500/20' : 'bg-surface-tertiary'
            }`}
          >
            <Icon
              name="BuildingStorefrontIcon"
              size={20}
              className={method === 'pickup' ? 'text-brand-500' : 'text-text-muted'}
            />
          </div>
          <p
            className={`text-sm font-black ${method === 'pickup' ? 'text-text-primary' : 'text-text-muted'}`}
          >
            استلام من المحل
          </p>
          <p
            className={`text-xs mt-1 font-bold ${method === 'pickup' ? 'text-brand-500' : 'text-text-secondary'}`}
          >
            مجاناً
          </p>
        </button>
      </div>

      {/* Delivery Details */}
      {method === 'delivery' && (
        <div className="space-y-4 p-4 rounded-2xl bg-surface-secondary border border-border">
          <h4 className="text-sm font-black text-text-primary">تفاصيل التوصيل</h4>

          {/* Governorate */}
          <div className="w-full">
            <CustomDropdown
              options={governorates.map((gov) => ({
                value: gov.name,
                label: `${gov.name} — ${gov.cost} جنيه`,
              }))}
              value={selectedGov}
              onChange={handleGovChange}
              placeholder="اختار المحافظة"
              className="w-full"
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-bold text-text-muted mb-2 block">الاسم بالكامل</label>
              <input
                type="text"
                placeholder="محمد أحمد علي"
                className="input-field px-4 py-3 text-sm w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted mb-2 block">رقم الموبايل</label>
              <input
                type="tel"
                placeholder="201067957449"
                dir="ltr"
                className="input-field px-4 py-3 text-sm text-right w-full"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted mb-2 block">
                العنوان بالتفصيل
              </label>
              <textarea
                placeholder="الشارع، رقم المبنى، الدور، الشقة..."
                rows={3}
                className="input-field px-4 py-3 text-sm resize-none w-full"
              />
            </div>
          </div>

          {/* Cost Summary */}
          {selectedGov && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
              <span className="text-sm text-text-muted">تكلفة الشحن لـ {selectedGov}</span>
              <span className="text-sm font-black text-brand-500">{shippingCost} جنيه</span>
            </div>
          )}
        </div>
      )}

      {/* Store Pickup Details */}
      {method === 'pickup' && (
        <div className="p-4 rounded-2xl bg-surface-secondary border border-border space-y-4">
          <h4 className="text-sm font-black text-text-primary">موقع المحل</h4>

          <div className="flex items-start gap-3">
            <Icon name="MapPinIcon" size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-text-primary font-bold">أبو كارتونة Gaming Store</p>
              <p className="text-xs text-text-muted mt-1">شارع الهرم، الجيزة — بجوار مول المحطة</p>
              <p className="text-xs text-text-muted mt-1">السبت – الخميس: 11 ص – 11 م</p>
            </div>
          </div>

          {/* Embedded Map Placeholder */}
          <div className="relative h-40 rounded-xl overflow-hidden bg-surface-tertiary border border-border flex items-center justify-center">
            <div className="text-center">
              <Icon name="MapIcon" size={32} className="text-brand-500 mx-auto mb-2" />
              <p className="text-xs text-text-muted">افتح الخريطة</p>
            </div>
            <a
              href="https://maps.google.com/?q=أبو+كارتونة+الجيزة"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-end p-3"
            >
              <span className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 relative z-10">
                <span className="relative z-10">افتح في Google Maps</span>
                <Icon
                  name="ArrowTopRightOnSquareIcon"
                  size={12}
                  className="text-bg-deep relative z-10"
                />
              </span>
            </a>
          </div>

          <div>
            <label className="text-xs font-bold text-text-muted mb-2 block">
              رقم الموبايل للتواصل
            </label>
            <input
              type="tel"
              placeholder="201067957449"
              dir="ltr"
              className="input-field px-4 py-3 text-sm text-right w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

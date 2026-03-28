'use client';

import React, { useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    num: '01',
    icon: 'ShoppingBagIcon',
    title: 'اختار هارد درايف',
    desc: 'تصفح مجموعتنا من الهارد ديسك والـ SSD بأحجام مختلفة من 500GB لـ 4TB وأضف واحد لسلة التسوق',
    color: '#059669',
    detail: 'HDD / SSD / Flash Drive',
  },
  {
    num: '02',
    icon: 'FolderArrowDownIcon',
    title: 'اختار داتا مجاناً',
    desc: 'بعد إضافة الهارد، ادخل مكتبة الداتا وأضف ألعاب وأفلام وبرامج مجاناً حتى تمتلئ سعة الهارد بالكامل',
    color: '#059669',
    detail: 'ألعاب • أفلام • برامج • مسلسلات',
  },
  {
    num: '03',
    icon: 'TruckIcon',
    title: 'استلم أوردرك',
    desc: 'بعد تأكيد الأوردر ودفع عربون الشحن، هنوصلك أوردرك على بيتك أو تيجي تستلمه من المحل',
    color: '#059669',
    detail: 'شحن لكل محافظات مصر',
  },
];

const HowItWorksSection = memo(function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-surface dark:bg-black relative overflow-hidden"
    >
      {/* Background Glow - reduced blur intensity */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="section-label mb-3">كيف يشتغل النظام</p>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary text-text-primary font-arabic mb-4">
            نظام <span className="text-gradient-primary">Fill Your Drive</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            بفكرة بسيطة وذكية، اشتري هارد وخد داتا بحجمه مجاناً
          </p>
        </div>

        {/* Steps - Elevated center card pattern from Template 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`step-card reveal p-8 ${idx === 1 ? 'md:-translate-y-6' : ''}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Number Watermark */}
              <span className="step-number">{step.num}</span>

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                <Icon name={step.icon as any} size={26} className="text-brand-500" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-lg">
                    خطوة {step.num}
                  </span>
                  <span className="text-xs text-text-muted">{step.detail}</span>
                </div>
                <h3 className="text-xl font-black text-text-primary text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector Arrow (not on last) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center z-20">
                  <Icon name="ChevronLeftIcon" size={20} className="text-brand-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <Link
            href="/products?cat=hdd"
            className="btn-primary px-10 py-4 text-base font-bold inline-flex items-center gap-3 relative z-10"
          >
            <span className="relative z-10">ابدأ الآن</span>
            <Icon name="ArrowLeftIcon" size={18} className="text-bg-deep relative z-10" />
          </Link>
        </div>
      </div>
    </section>
  );
});

export default HowItWorksSection;

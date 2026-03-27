import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const footerLinks = {
  products: {
    title: 'المنتجات',
    links: [
      { label: 'لابتوبات', href: '/products?cat=laptops' },
      { label: 'إكسسوارات', href: '/products?cat=accessories' },
      { label: 'هارد درايف', href: '/products?cat=storage' },
      { label: 'مكتبة الداتا', href: '/products?cat=data' },
    ],
  },
  support: {
    title: 'الدعم',
    links: [{ label: 'تتبع الطلب', href: '/orders' }],
  },
};

const socialLinks = [
  { icon: 'GlobeAltIcon', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'CameraIcon', href: 'https://instagram.com', label: 'Instagram' },
  { icon: 'MusicalNoteIcon', href: 'https://tiktok.com', label: 'TikTok' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border border-border bg-surface dark:bg-black mt-auto relative">
      <div className="section-container py-16 md:py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={36} />
              <div className="flex flex-col leading-none">
                <span className="font-heading font-extrabold text-lg text-text-primary text-text-primary">
                  أبو كارتونة
                </span>
                <span className="text-caption text-brand-500 font-semibold">
                  متجر الهاردوير والداتا
                </span>
              </div>
            </div>
            <p className="text-body-sm text-text-secondary text-text-secondary leading-relaxed mb-6 max-w-sm">
              متجرك الأول للهاردوير والألعاب. اشتري هارد درايف واملأه بالداتا مجاناً. شحن لكل
              محافظات مصر.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn-icon w-10 h-10 bg-surface-tertiary bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-400/10 text-text-muted hover:text-brand-500 hover:text-brand-400"
                >
                  <Icon name={s.icon as any} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="section-label mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-text-secondary text-text-secondary hover:text-brand-500 hover:text-brand-400 transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="section-label mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-body-sm text-text-secondary text-text-secondary">
                <Icon
                  name="PhoneIcon"
                  size={15}
                  className="text-caption text-brand-500 font-semibold flex-shrink-0"
                />
                <span dir="ltr">201067957449</span>
              </li>
              <li className="flex items-center gap-2.5 text-body-sm text-text-secondary text-text-secondary">
                <Icon
                  name="EnvelopeIcon"
                  size={15}
                  className="text-caption text-brand-500 font-semibold flex-shrink-0"
                />
                <span>info@abocartona.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-body-sm text-text-secondary text-text-secondary">
                <Icon
                  name="MapPinIcon"
                  size={15}
                  className="text-caption text-brand-500 font-semibold flex-shrink-0 mt-0.5"
                />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border border-border" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <p className="text-caption text-text-muted text-text-muted">
            © {new Date().getFullYear()} أبو كارتونة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

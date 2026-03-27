import React from 'react';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import BostaShipButton from './components/BostaShipButton';

export default async function AdminOrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  await connectDB();
  const { id } = await params;

  // Natively fetch specific order directly bypassing API wrapper
  const doc = (await Order.findOne({
    $or: [{ orderID: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  }).lean()) as any;

  if (!doc) {
    return (
      <div className="min-h-screen bg-surface bg-surface flex flex-col items-center justify-center">
        <h1 className="text-xl font-black text-text-primary text-text-primary mb-2">
          الطلب غير موجود
        </h1>
        <Link href="/admin" className="text-brand-500 text-brand-400 font-bold">
          العودة للوحة التحكم
        </Link>
      </div>
    );
  }

  // Sanitize the lean doc
  const order = { ...doc, _id: doc._id.toString() };
  const proofImage = order.uploadedPhotoUrl || order.paymentScreenshot;

  return (
    <div className="min-h-screen bg-surface bg-surface flex flex-col" dir="rtl">
      <header className="bg-surface-secondary bg-surface-secondary/50 border-b border-border border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-surface-tertiary hover:bg-white/5 rounded-full transition-colors"
            >
              <Icon
                name="ArrowRightIcon"
                size={20}
                className="text-text-primary text-text-primary"
              />
            </Link>
            <h1 className="text-xl font-black text-text-primary text-text-primary font-heading">
              تفاصيل الطلب
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-text-primary text-text-primary font-heading mb-1">
                    الطلب {order.orderID || `#${order._id.slice(-6)}`}
                  </h2>
                  <p className="text-body-sm text-text-muted text-text-muted">
                    {new Date(order.createdAt).toLocaleString('ar-EG', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                      order.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : order.status === 'completed'
                            ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {order.status === 'pending'
                      ? 'معلق'
                      : order.status === 'shipped'
                        ? 'قيد الشحن'
                        : order.status === 'completed'
                          ? 'مكتمل'
                          : 'ملغي'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-surface-secondary bg-surface-secondary p-4 rounded-xl border border-border border-border">
                  <p className="text-caption text-text-muted text-text-muted mb-1">اسم العميل</p>
                  <p className="text-body-sm font-bold text-text-primary text-text-primary">
                    {order.customerName || 'بدون اسم'}
                  </p>
                </div>
                <div className="bg-surface-secondary bg-surface-secondary p-4 rounded-xl border border-border border-border">
                  <p className="text-caption text-text-muted text-text-muted mb-1">رقم الموبايل</p>
                  <p
                    className="text-body-sm font-bold text-text-primary text-text-primary"
                    dir="ltr"
                  >
                    {order.phone || '—'}
                  </p>
                </div>
                <div className="bg-surface-secondary bg-surface-secondary p-4 rounded-xl border border-border border-border sm:col-span-2 md:col-span-1">
                  <p className="text-caption text-text-muted text-text-muted mb-1">العنوان</p>
                  <p className="text-body-sm text-text-primary text-text-primary line-clamp-3">
                    {order.address || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-body-lg font-bold text-text-primary text-text-primary mb-4 font-heading">
                المنتجات المطلوبة
              </h3>
              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-surface-secondary bg-surface-secondary p-3 rounded-xl border border-border border-border"
                  >
                    <div className="w-12 h-12 bg-surface-tertiary bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="CubeIcon" size={20} className="text-text-muted text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-sm font-bold text-text-primary text-text-primary line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-caption text-text-muted text-text-muted mt-0.5">
                        الكمية: {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-body-sm font-bold text-brand-500 text-brand-400">
                        {(item.price || 0).toLocaleString('ar-EG')} جنيه
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-80 w-full space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-body-lg font-bold text-text-primary text-text-primary mb-4 font-heading">
                إجمالي الحساب
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted text-text-muted">إجمالي المنتجات</span>
                  <span className="text-text-primary text-text-primary font-bold">
                    {order.totalPrice?.toLocaleString('ar-EG')} جنيه
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-body-lg font-bold text-text-primary text-text-primary">
                    الإجمالي
                  </span>
                  <span className="text-h3 font-bold text-brand-500 text-brand-400 font-heading">
                    {order.totalPrice?.toLocaleString('ar-EG')} جنيه
                  </span>
                </div>
              </div>
            </div>

            <BostaShipButton
              orderId={order.orderID || order._id.toString()}
              status={order.status}
              trackingNumber={order.trackingNumber}
            />

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-body-lg font-bold text-text-primary text-text-primary mb-4 font-heading flex items-center gap-2">
                <Icon name="PhotoIcon" size={20} className="text-text-muted text-text-muted" />
                إيصال الدفع
              </h3>
              {proofImage ? (
                <a
                  href={proofImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 bg-white/5 group border border-gray-200 dark:border-white/10 hover:border-brand-500/50 transition-colors"
                >
                  <AppImage
                    src={proofImage}
                    alt="إيصال الدفع"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-body-sm bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-lg flex items-center gap-2">
                      <Icon name="ArrowsPointingOutIcon" size={16} /> عرض الصورة
                    </span>
                  </div>
                </a>
              ) : (
                <div className="w-full aspect-video rounded-xl bg-surface-tertiary bg-white/5 border border-border border-border flex flex-col items-center justify-center text-text-muted text-text-muted">
                  <Icon name="NoSymbolIcon" size={24} className="mb-2 opacity-50" />
                  <p className="text-xs">لا يوجد إيصال مرفق</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

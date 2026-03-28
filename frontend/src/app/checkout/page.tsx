'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartReview from './components/CartReview';
import DeliveryOptions from './components/DeliveryOptions';
import PaymentDeposit from './components/PaymentDeposit';
import OrderSummary from './components/OrderSummary';
import Icon from '@/components/ui/AppIcon';
import WhatsAppButton from '../homepage/components/WhatsAppButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore, Product as StoreProduct } from '@/store/useStore';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: 'laptops' | 'accessories' | 'storage' | 'data';
  size?: string;
  selectedBrand?: string;
}

const STEPS = [
  { id: 1, label: 'مراجعة السلة', icon: 'ShoppingCartIcon' },
  { id: 2, label: 'بيانات العميل والتوصيل', icon: 'TruckIcon' },
  { id: 3, label: 'الدفع والعربون', icon: 'CreditCardIcon' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems: storedCart,
    driveItems: storedDrive,
    products,
    addToCart,
    removeFromCart,
    removeFromDrive,
    placeOrder,
    clearCart,
    clearDrive,
    fetchProducts,
  } = useStore();
  const [activeStep, setActiveStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [driveItems, setDriveItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [cityCode, setCityCode] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const hasStorageProduct = storedCart.some((item) => item.type === 'storage');

  const storageTotal = storedCart
    .filter((p) => p.type === 'storage')
    .reduce((acc, p) => acc + (typeof p.storageCapacity === 'number' ? p.storageCapacity : 0), 0);

  const usedDataGB = storedCart
    .filter((p) => p.type === 'data')
    .reduce((acc, p) => acc + (typeof p.gbSize === 'number' ? p.gbSize : 0), 0);

  const storageUsed = usedDataGB;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const depositAmount = Math.max(50, Math.round(shippingCost > 0 ? shippingCost : 50));

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    removeFromCart(id);
  };

  const handleRemoveDrive = (id: string) => {
    setDriveItems((prev) => prev.filter((item) => item.id !== id));
    removeFromDrive(id);
  };

  const handleDeliveryChange = (
    _method: string,
    _gov: string,
    cost: number,
    _cityCode?: string
  ) => {
    setShippingCost(cost);
    setCityCode(_cityCode);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const orderID = `AC-${Math.floor(Math.random() * 90000) + 10000}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID,
          customerName,
          phone,
          address: customerAddress,
          cityCode,
          items: cartItems,
          driveItems,
          totalPrice: subtotal + shippingCost,
          capacityGB: storageTotal,
          uploadedPhotoUrl: receiptFile,
        }),
      });

      if (!res.ok) throw new Error('فشل إرسال الطلب');

      clearCart();
      clearDrive();
      router.push(
        `/checkout/success?orderId=${orderID}&total=${subtotal + shippingCost}&deposit=${depositAmount}&drive=${driveItems.length}`
      );
    } catch (error) {
      alert('حدث خطأ أثناء تأكيد الطلب. برجاء المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  const canConfirm =
    receiptFile !== null && cartItems.length > 0 && !!customerName && !!phone && !!customerAddress;

  const toCartItems = (items: StoreProduct[]): CartItem[] =>
    items.map((p) => {
      const isData = p.type === 'data';
      const effectivePrice = hasStorageProduct && isData ? 0 : p.price;
      return {
        id: p.id,
        name: p.name,
        image: p.images?.[0] || '',
        price: effectivePrice,
        quantity: (p as any).quantity || 1,
        type: p.type,
        size: isData
          ? typeof p.gbSize === 'number' && p.gbSize > 0
            ? `${p.gbSize} GB`
            : undefined
          : typeof p.storageCapacity === 'number'
            ? `${p.storageCapacity} GB`
            : undefined,
        selectedBrand: (p as any).selectedBrand,
      };
    });

  useEffect(() => {
    // Fetch products to ensure data products are available for selection
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCartItems(toCartItems(storedCart));
    setDriveItems(toCartItems(storedDrive));
  }, [storedCart, storedDrive, hasStorageProduct]);

  return (
    <div className="min-h-screen bg-surface flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1 pt-20 pb-12">
        {/* Page Header */}
        <div className="bg-surface-secondary/40 border-b border-border mb-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
            <h1 className="text-h1 md:text-display font-heading text-text-primary mb-6">
              إتمام الشراء
            </h1>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-1">
              {STEPS.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => step.id < activeStep && setActiveStep(step.id)}
                    className={`checkout-step flex-shrink-0 ${activeStep === step.id ? 'active' : activeStep > step.id ? 'completed' : ''} ${step.id < activeStep ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`step-dot ${activeStep === step.id ? 'active' : activeStep > step.id ? 'completed' : 'pending'}`}
                    >
                      {activeStep > step.id ? <Icon name="CheckIcon" size={14} /> : step.id}
                    </div>
                    <span
                      className={`text-body-sm font-semibold hidden md:block ${activeStep === step.id ? 'text-text-primary text-text-primary' : activeStep > step.id ? 'text-brand-500' : 'text-text-muted text-text-muted'}`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px transition-colors ${activeStep > step.id ? 'bg-brand-500/40' : 'bg-border dark:bg-border-dark'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Cart Review */}
              {activeStep === 1 && (
                <div className="card rounded-3xl p-6">
                  <h2 className="text-h3 text-text-primary text-text-primary mb-6 flex items-center gap-2">
                    <Icon name="ShoppingCartIcon" size={20} className="text-brand-500" />
                    مراجعة السلة
                  </h2>
                  <CartReview
                    items={cartItems}
                    driveItems={driveItems}
                    onUpdateQty={handleUpdateQty}
                    onRemove={(id) => {
                      handleRemoveCart(id);
                      handleRemoveDrive(id);
                    }}
                    storageTotal={storageTotal}
                    storageUsed={storageUsed}
                  />

                  {hasStorageProduct && storageTotal > 0 && (
                    <>
                      {/* Storage Tracker */}
                      <div className="mt-6 p-4 rounded-2xl bg-surface-secondary bg-surface-tertiary/60 border border-brand-200 dark:border-brand-500/25">
                        <h3 className="text-body-sm font-bold text-text-primary text-text-primary mb-3 flex items-center gap-2">
                          <Icon name="CircleStackIcon" size={18} className="text-brand-500" />
                          تتبع مساحة الهارد
                        </h3>
                        <div className="flex items-center justify-between mb-2 text-caption">
                          <span className="text-text-muted text-text-muted">
                            السعة:{' '}
                            <span className="font-bold text-text-primary text-text-primary">
                              {storageTotal} GB
                            </span>
                          </span>
                          <span className="text-text-muted text-text-muted">
                            المستخدم:{' '}
                            <span className="font-bold text-brand-500">{usedDataGB} GB</span>
                          </span>
                        </div>
                        <div className="storage-bar-track h-2 rounded-full overflow-hidden">
                          <div
                            className="storage-bar-fill h-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((usedDataGB / Math.max(storageTotal, 1)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Free Data Selection */}
                      <div className="mt-6">
                        <h3 className="text-body-sm font-bold text-text-primary text-text-primary mb-2">
                          اختر الداتا المجانية لهاردك
                        </h3>
                        <p className="text-caption text-text-muted text-text-muted mb-4">
                          كل الداتا هتتحسب مجاناً (0 جنيه) طول ما الهارد موجود في السلة.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {(products || [])
                            .filter((p) => p.type === 'data')
                            .map((p) => {
                              const alreadyInCart = storedCart.some((c) => c.id === p.id);
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => !alreadyInCart && addToCart(p)}
                                  disabled={alreadyInCart}
                                  className={`product-card p-3 text-right ${
                                    alreadyInCart ? 'opacity-60 cursor-default' : ''
                                  }`}
                                >
                                  {/* Product Image */}
                                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-surface-tertiary">
                                    {p.images?.[0] ? (
                                      <img
                                        src={p.images[0]}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Icon
                                          name="PhotoIcon"
                                          size={24}
                                          className="text-text-muted"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <span className="text-caption text-text-muted text-text-muted line-clamp-1">
                                      {p.subtype}
                                    </span>
                                    <span className="badge-new text-[9px] flex-shrink-0">
                                      مجاني
                                    </span>
                                  </div>
                                  <p className="text-caption font-bold text-text-primary text-text-primary mb-2 line-clamp-2">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="badge-size">
                                      {typeof p.gbSize === 'number' && p.gbSize > 0
                                        ? `${p.gbSize} GB`
                                        : '—'}
                                    </span>
                                    {/* Remove price display for data products */}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}

                  {(cartItems.length > 0 || driveItems.length > 0) && (
                    <button
                      onClick={() => setActiveStep(2)}
                      className="btn-primary w-full py-4 text-body font-semibold mt-6 flex items-center justify-center gap-2"
                    >
                      <span>التالي: بيانات العميل والتوصيل</span>
                      <Icon name="ArrowLeftIcon" size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Customer Info & Delivery */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  {/* Customer Info Card */}
                  <div className="card rounded-3xl p-6">
                    <h2 className="text-h3 text-text-primary text-text-primary mb-6 flex items-center gap-2">
                      <Icon name="UserIcon" size={20} className="text-brand-500" />
                      بيانات العميل
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-body-sm text-text-secondary text-text-secondary mb-1.5">
                          الاسم بالكامل
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="input-field w-full"
                          placeholder="الاسم الثلاثي"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm text-text-secondary text-text-secondary mb-1.5">
                          رقم الموبايل
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-field text-right w-full"
                          placeholder="01xxxxxxxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm text-text-secondary text-text-secondary mb-1.5">
                          العنوان بالتفصيل
                        </label>
                        <textarea
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="input-field min-h-[100px] resize-none w-full"
                          placeholder="المحافظة، المنطقة، اسم الشارع، رقم العمارة، رقم الشقة"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Card */}
                  <div className="card rounded-3xl p-6">
                    <h2 className="text-h3 text-text-primary text-text-primary mb-6 flex items-center gap-2">
                      <Icon name="TruckIcon" size={20} className="text-brand-500" />
                      خيارات التوصيل
                    </h2>
                    <DeliveryOptions onDeliveryChange={handleDeliveryChange} />

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setActiveStep(1)}
                        className="btn-ghost flex-1 py-4 text-body-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Icon name="ArrowRightIcon" size={16} />
                        السابق
                      </button>
                      <button
                        onClick={() => {
                          if (customerName && phone && customerAddress) setActiveStep(3);
                          else alert('برجاء إكمال بيانات العميل أولاً');
                        }}
                        className="btn-primary flex-1 py-4 text-body font-semibold flex items-center justify-center gap-2"
                      >
                        <span>التالي: الدفع</span>
                        <Icon name="ArrowLeftIcon" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <div className="card rounded-3xl p-6">
                  <h2 className="text-h3 text-text-primary text-text-primary mb-6 flex items-center gap-2">
                    <Icon name="CreditCardIcon" size={20} className="text-brand-500" />
                    دفع العربون
                  </h2>
                  <PaymentDeposit
                    depositAmount={depositAmount}
                    onReceiptUpload={setReceiptFile as any}
                    receiptFile={receiptFile}
                  />

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="btn-ghost flex-1 py-4 text-body-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Icon name="ArrowRightIcon" size={16} />
                      السابق
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cartItems}
                driveItems={driveItems}
                shippingCost={shippingCost}
                depositAmount={depositAmount}
                onConfirm={handleConfirm}
                canConfirm={canConfirm && activeStep === 3}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

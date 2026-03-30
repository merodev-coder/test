'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import { useStore, Product as StoreProduct, StorageDataMapping } from '@/store/useStore';
import { createStorageSummary, getDataItemEffectivePrices, calculateCartTotals, parseCapacityGB } from '@/lib/storageUtils';
import { getApiUrl } from '@/lib/apiConfig';
import PerStorageTracker, { StorageDevice, DataItem, StorageAssignment } from './components/PerStorageTracker';
import TermsOfServiceModal from '@/components/TermsOfServiceModal';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: 'laptops' | 'accessories' | 'storage' | 'data' | 'games';
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
    getStorageSummary,
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
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
  const [requiredDeposit, setRequiredDeposit] = useState(0);
  const [storageAssignments, setStorageAssignments] = useState<StorageAssignment[]>([]);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  const hasStorageProduct = storedCart.some((item) => item.type === 'storage');

  const storageTotal = [...storedCart, ...storedDrive]
    .filter((p) => p.type === 'storage')
    .reduce((acc, p) => acc + parseCapacityGB(p.storageCapacity, p.name) * ((p as any).quantity || 1), 0);

  const usedDataGB = storedCart
    .filter((p) => p.type === 'data')
    .reduce((acc, p) => acc + (typeof p.gbSize === 'number' ? p.gbSize : 0) * ((p as any).quantity || 1), 0);

  const cartTotals = calculateCartTotals(storedCart);
  const storageUsed = cartTotals.freeDataGB;
  const dataDiscount = cartTotals.freeDataGB * 0.5;
  const storageSummary = getStorageSummary();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const depositAmount = deliveryMethod === 'pickup' ? 0 : (requiredDeposit > 0 ? Math.round(requiredDeposit) : Math.max(50, Math.round(shippingCost > 0 ? shippingCost : 50)));

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
    _cityCode?: string,
    shippingMethodName?: string,
    _depositType?: string,
    deposit?: number
  ) => {
    setDeliveryMethod(_method as 'delivery' | 'pickup');
    setShippingCost(cost);
    setCityCode(_cityCode);
    if (shippingMethodName !== undefined) setSelectedShippingMethod(shippingMethodName);
    if (deposit !== undefined) setRequiredDeposit(deposit);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const orderID = `AC-${Math.floor(Math.random() * 90000) + 10000}`;
    const storageDataMapping = generateStorageDataMapping();

    try {
      const res = await fetch(getApiUrl('orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID,
          customerName,
          phone,
          address: customerAddress,
          customerEmail,
          cityCode,
          selectedShippingMethod,
          shippingCost,
          requiredDeposit: depositAmount,
          items: cartItems,
          driveItems,
          totalPrice: subtotal + shippingCost,
          capacityGB: storageTotal,
          uploadedPhotoUrl: receiptFile,
          storageDataMapping,
        }),
      });

      if (!res.ok) throw new Error('فشل إرسال الطلب');

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('abuKartona_userOrders') || '[]');
      const newOrder = {
        orderId: orderID,
        items: cartItems,
        driveItems,
        totalPrice: subtotal + shippingCost,
        totalGb: storageTotal,
        date: new Date().toISOString(),
        status: 'Pending',
        customerName,
        phone,
        address: customerAddress,
        storageDataMapping,
      };
      existingOrders.push(newOrder);
      localStorage.setItem('abuKartona_userOrders', JSON.stringify(existingOrders));

      clearCart();
      clearDrive();
      setStorageAssignments([]);
      router.push(
        `/checkout/success?orderId=${orderID}&total=${subtotal + shippingCost}&deposit=${depositAmount}&drive=${driveItems.length}`
      );
    } catch (error) {
      alert('حدث خطأ أثناء تأكيد الطلب. برجاء المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  const canConfirm =
    (deliveryMethod === 'pickup' || receiptFile !== null) && cartItems.length > 0 && !!customerName && !!phone && !!customerAddress && !!customerEmail;

  const dataEffectivePrices = getDataItemEffectivePrices(storedCart);

  // Get storage devices from cart
  const storageDevices: StorageDevice[] = useMemo(() => {
    return storedCart
      .filter((p) => p.type === 'storage')
      .map((p, index) => ({
        id: `${p.id}-${index}-${p.storageCapacity || 0}`,
        name: p.name,
        subtype: p.subtype || 'Storage',
        capacityGB: parseCapacityGB(p.storageCapacity, p.name),
        quantity: (p as any).quantity || 1,
      }));
  }, [storedCart]);

  // Get data items from cart
  const dataItems: DataItem[] = useMemo(() => {
    return storedCart
      .filter((p) => p.type === 'data')
      .map((p) => ({
        id: p.id,
        name: p.name,
        sizeGB: p.gbSize || 0,
        quantity: (p as any).quantity || 1,
        image: p.images?.[0],
      }));
  }, [storedCart]);

  // Handle assignment changes
  const handleAssignmentChange = (storageId: string, dataId: string, assigned: boolean) => {
    if (assigned) {
      setStorageAssignments((prev) => [...prev, { storageId, dataId }]);
    } else {
      setStorageAssignments((prev) => 
        prev.filter((a) => !(a.storageId === storageId && a.dataId === dataId))
      );
    }
  };

  // Generate storage data mapping for order
  const generateStorageDataMapping = (): StorageDataMapping[] => {
    return storageDevices.map((device) => {
      const assignedData = storageAssignments
        .filter((a) => a.storageId === device.id)
        .map((a) => {
          const dataItem = dataItems.find((d) => d.id === a.dataId);
          return dataItem ? {
            dataItemId: dataItem.id,
            dataName: dataItem.name,
            sizeGB: dataItem.sizeGB * dataItem.quantity,
          } : null;
        })
        .filter(Boolean) as { dataItemId: string; dataName: string; sizeGB: number }[];

      return {
        storageItemId: device.id,
        storageName: device.name,
        storageCapacity: device.capacityGB * device.quantity,
        assignedData,
      };
    }).filter((mapping) => mapping.assignedData.length > 0);
  };

  const toCartItems = (items: StoreProduct[]): CartItem[] =>
    items.map((p) => {
      const isData = p.type === 'data';
      const effectivePrice = isData
        ? (dataEffectivePrices.get(p.id) ?? p.price)
        : p.price;
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

            {/* Step Indicator - Responsive scrollable on mobile */}
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                      {/* Per-Storage Trackers */}
                      <div className="mt-6">
                        <h3 className="text-body-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                          <Icon name="CircleStackIcon" size={18} className="text-brand-500" />
                          تتبع مساحة التخزين لكل جهاز
                        </h3>
                        <p className="text-caption text-text-muted mb-4">
                          اختر البيانات التي تريد تخزينها على كل جهاز تخزين. يمكنك توزيع البيانات بين الأجهزة المختلفة.
                        </p>
                        
                        <PerStorageTracker
                          storageDevices={storageDevices}
                          dataItems={dataItems}
                          assignments={storageAssignments}
                          onAssignmentChange={handleAssignmentChange}
                        />
                      </div>

                      {/* Free Data Selection */}
                      <div className="mt-6">
                        <h3 className="text-body-sm font-bold text-text-primary mb-2">
                          اختر الداتا المجانية لهاردك
                        </h3>
                        <p className="text-caption text-text-muted mb-4">
                          أضف منتجات DATA لسلتك، ثم اختر الجهاز المناسب لكل بيانات أعلاه.
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
                                    <span className="text-caption text-text-muted line-clamp-1">
                                      {p.subtype}
                                    </span>
                                    <span className="badge-new text-[9px] flex-shrink-0">
                                      مجاني
                                    </span>
                                  </div>
                                  <p className="text-caption font-bold text-text-primary mb-2 line-clamp-2">
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
                      <div>
                        <label className="block text-body-sm text-text-secondary text-text-secondary mb-1.5">
                          البريد الإلكتروني (لاستلام الإيصال)
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="input-field w-full"
                          placeholder="example@email.com"
                          dir="ltr"
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
                    <DeliveryOptions onDeliveryChange={handleDeliveryChange} orderSubtotal={subtotal} />

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
                          if (customerName && phone && customerAddress && customerEmail) setActiveStep(3);
                          else alert('برجاء إكمال بيانات العميل أولاً (تأكد من إدخال البريد الإلكتروني)');
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
                    {deliveryMethod === 'pickup' ? 'تأكيد الطلب' : 'دفع العربون'}
                  </h2>
                  {deliveryMethod === 'pickup' ? (
                    <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 flex items-start gap-3">
                      <Icon name="BuildingStorefrontIcon" size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-brand-500 mb-1">استلام من المحل — بدون عربون</p>
                        <p className="text-xs text-text-muted leading-relaxed">
                          اخترت استلام الطلب من المحل مباشرة. لا يلزمك دفع عربون. قم بمراجعة شروط الخدمة والموافقة عليها لإتمام الطلب.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <PaymentDeposit
                      depositAmount={depositAmount}
                      onReceiptUpload={setReceiptFile as any}
                      receiptFile={receiptFile}
                    />
                  )}

                  {/* Terms Agreement */}
                  <div className="mt-6 p-4 rounded-2xl bg-surface-secondary border border-border">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="w-5 h-5 rounded border-border bg-surface-tertiary text-brand-500 focus:ring-brand-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-text-primary">
                          أوافق على{' '}
                          <button
                            type="button"
                            onClick={() => setIsTermsModalOpen(true)}
                            className="text-brand-500 font-bold hover:underline"
                          >
                            شروط الخدمة
                          </button>
                        </span>
                        <p className="text-xs text-text-muted mt-1">
                          يجب الموافقة على الشروط لإتمام الطلب
                        </p>
                      </div>
                    </label>
                  </div>

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
                dataDiscount={dataDiscount}
                onConfirm={handleConfirm}
                canConfirm={canConfirm && activeStep === 3}
                isLoading={isLoading}
                termsAgreed={termsAgreed}
                isPickup={deliveryMethod === 'pickup'}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={() => setTermsAgreed(true)}
        showAgreeButton={true}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  Plus,
  Calendar,
  Clock,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, DeliveryMethod, Address } from '../../types';
import { MapPicker } from '../../components/common/MapPicker';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartSavings,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    createOrder,
    setCurrentView,
    showToast,
    isLoggedIn,
    requireAuth,
    user
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [bankReceiptAttached, setBankReceiptAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">لا توجد منتجات في السلة للمتابعة</p>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-3 text-xs text-blue-600 font-bold"
        >
          العودة للتسوق
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      requireAuth('يرجى تسجيل الدخول أو إنشاء حساب لتأكيد طلبك وتوثيقه في قاعدة البيانات', () => {
        // Proceed after login
        doSubmitOrder();
      });
      return;
    }

    doSubmitOrder();
  };

  const doSubmitOrder = () => {
    if (!selectedAddress && deliveryMethod !== 'pickup') {
      showToast('يرجى اختيار أو إضافة عنوان التوصيل أولاً', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        deliveryMethod,
        paymentMethod,
        notes: deliveryNotes
      });

      setIsSubmitting(false);
      showToast('🎉 تم تأكيد طلبك وإرساله لمستودع البشارة بنجاح!', 'success');
      setCurrentView('order_success');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          id="back-to-cart-btn"
          onClick={() => setCurrentView('cart')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900">إتمام الطلب والدفع</h2>
          <p className="text-xs text-slate-500">اختر عنوان التوصيل وطريقة الدفع المناسبة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Checkout options (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 1. Delivery Address Selection */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">1. عنوان التوصيل وموقع GPS</h3>
              </div>

              {!isAddingNewAddress && (
                <button
                  type="button"
                  id="add-new-address-checkout-btn"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة عنوان جديد</span>
                </button>
              )}
            </div>

            {isAddingNewAddress ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-3">
                  تحديد الموقع على الخريطة وإدخال بيانات المستلم:
                </div>
                <MapPicker
                  onLocationSelected={data => {
                    const newAddr = addAddress(data);
                    setSelectedAddress(newAddr);
                    setIsAddingNewAddress(false);
                  }}
                  onCancel={() => setIsAddingNewAddress(false)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map(addr => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      id={`address-card-${addr.id}`}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-slate-900">
                          {addr.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {addr.city}، {addr.district}، {addr.street}
                      </p>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between font-medium">
                        <span>{addr.recipientName}</span>
                        <span dir="ltr">{addr.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Delivery Method */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">2. طريقة التوصيل والشحن</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'standard' as DeliveryMethod,
                  title: 'توصيل شاحنة البشارة (تعز)',
                  desc: 'خلال 1-3 ساعات لباب محلك/منزلك',
                  price: cartDeliveryFee === 0 ? 'مجاني' : '1,500 ر.ي'
                },
                {
                  id: 'express' as DeliveryMethod,
                  title: 'توصيل مستعجل VIP',
                  desc: 'توصيل فوري خلال 45 دقيقة',
                  price: '2,500 ر.ي'
                },
                {
                  id: 'pickup' as DeliveryMethod,
                  title: 'استلام من المستودع',
                  desc: 'مستودع تعز المركزي - بيرباشا',
                  price: 'مجاني'
                }
              ].map(opt => {
                const isSelected = deliveryMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    id={`delivery-opt-${opt.id}`}
                    onClick={() => setDeliveryMethod(opt.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                      <span className="text-xs font-black text-emerald-700">{opt.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">3. طريقة الدفع الآمنة</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {[
                {
                  id: 'cod' as PaymentMethod,
                  title: 'الدفع عند الاستلام (كاش للمندوب)',
                  desc: 'ادفع نقداً عند استلام الكراتين في تعز',
                  badge: 'الأكثر طلباً 💵'
                },
                {
                  id: 'kuraimi' as PaymentMethod,
                  title: 'بنك الكريمي (حاسب / إيداع)',
                  desc: 'تحويل مباشر لحساب البشارة بالكريمي',
                  badge: 'خدمة حاسب 🏦'
                },
                {
                  id: 'e_wallet' as PaymentMethod,
                  title: 'المحافظ الإلكترونية (فلوسك / جوالي / ون كاش)',
                  desc: 'دفع فوري عبر محفظتك الإلكترونية المفضلة',
                  badge: 'محافظ يمنية 📱'
                },
                {
                  id: 'bank_transfer' as PaymentMethod,
                  title: 'حوالات النجم / الامتياز / التضامن',
                  desc: 'معتمد للمحلات والمطاعم والطلبيات الكبرى',
                  badge: 'حوالات سريعة 🧾'
                }
              ].map(method => {
                const isSelected = paymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    id={`payment-opt-${method.id}`}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{method.title}</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{method.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Bank Transfer Details Simulation */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>بيانات الحساب البنكي لمؤسسة البشارة:</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                  <div><strong>البنك:</strong> مصرف الراجحي (Al Rajhi Bank)</div>
                  <div><strong>اسم الحساب:</strong> مؤسسة البشارة للبلاستيك والمنظفات</div>
                  <div><strong>رقم الآيبان:</strong> SA4580000392608010123456</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBankReceiptAttached(!bankReceiptAttached);
                      showToast(bankReceiptAttached ? 'تم إلغاء الإيصال' : 'تم إرفاق إيصال التحويل بنجاح ✅', 'info');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
                      bankReceiptAttached
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{bankReceiptAttached ? 'تم إرفاق الإيصال بنجاح' : 'إرفاق صورة الإيصال البنكي'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Notes */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              ملاحظات إضافية للتوصيل أو المستودع (اختياري)
            </label>
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={e => setDeliveryNotes(e.target.value)}
              placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة، التوصيل للبوابة الخلفية للمطعم..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none resize-none"
            />
          </div>
        </div>

        {/* Right: Detailed Summary & Final Confirmation Button (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-3">
              مراجعة الطلب والمنتجات ({cart.length} أصناف)
            </h3>

            {/* Mini item list */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 mb-4 pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.nameAr}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{item.product.nameAr}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.quantity} × {item.product.price} ريال
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    {((item.quantity || 1) * (item.product?.price || 0)).toFixed(2)} ريال
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="flex flex-col gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{(cartSubtotal || 0).toLocaleString()} ريال</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{(cartDiscount || 0).toLocaleString()} ريال</span>
                </div>
              )}
              {cartSavings > 0 && (
                <div className="flex justify-between text-blue-700 font-bold">
                  <span>وفرت بأسعار الجملة:</span>
                  <span>{(cartSavings || 0).toLocaleString()} ريال</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span className="font-bold text-slate-800">
                  {cartDeliveryFee === 0 ? 'مجاني 🚚' : `${(cartDeliveryFee || 0).toLocaleString()} ريال`}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">الإجمالي النهائي للدفع:</span>
                <span className="text-2xl font-black text-blue-900">
                  {(cartTotal || 0).toLocaleString()} ريال
                </span>
              </div>
            </div>

            {/* Place Order CTA button */}
            <button
              type="button"
              id="confirm-place-order-btn"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md active:scale-98 transition-all text-sm"
            >
              {isSubmitting ? (
                <span>جاري معالجة الطلب...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>تأكيد وإرسال الطلب الآن</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-400 mt-2.5">
              بالضغط على تأكيد الطلب، فإنك توافق على شروط وسياسات متجر البشارة
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

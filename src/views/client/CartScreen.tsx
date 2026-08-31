import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  Tag,
  Check,
  X,
  ArrowLeft,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuantitySelector } from '../../components/common/QuantitySelector';

export const CartScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartSavings,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    getTierPrice,
    isLoggedIn,
    requireAuth
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 20000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      requireAuth('يرجى تسجيل الدخول أولاً لإكمال طلبك وتأكيد عنوان التوصيل', () => {
        setCurrentView('checkout');
      });
    } else {
      setCurrentView('checkout');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const success = applyCoupon(couponCode.trim());
    if (!success) {
      setCouponError('كود الكوبون غير صالح أو انتهت صلاحيته');
    } else {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-800">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">سلة التسوق فارغة</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          لم تقم بإضافة أي كراتين أو منتجات لسلتك بعد. استكشف أفضل عروض البشارة للبلاستيك والمنظفات بأسعار الجملة.
        </p>
        <button
          type="button"
          id="cart-empty-browse-btn"
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 px-6 rounded-2xl shadow-md active:scale-98 transition-all"
        >
          <span>تصفح المنتجات والعروض</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-slate-900">سلة التسوق</h2>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
            {cartCount} عنصر
          </span>
        </div>

        <button
          type="button"
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>تفريغ السلة</span>
        </button>
      </div>

      {/* Free shipping progress bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Truck className="w-4 h-4 text-emerald-600" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-extrabold">
                🎉 مبروك! حصلت على توصيل مجاني لهذا الطلب
              </span>
            ) : (
              <span>
                أضف بـ <span className="text-blue-600 font-black">{(remainingForFreeShipping || 0).toFixed(2)} ريال</span> لتحصل على التوصيل المجاني!
              </span>
            )}
          </span>
          <span className="text-slate-400 text-[11px] font-mono">
            {cartSubtotal} / {freeShippingThreshold} ريال
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Layout: Items (7 cols) + Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart items list */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {cart.map(item => {
            const tierPrice = getTierPrice(item.product, item.quantity);
            const lineTotal = tierPrice * item.quantity;
            const originalLineTotal = item.product.price * item.quantity;
            const hasBulkDiscount = lineTotal < originalLineTotal;

            return (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Product Info with thumbnail */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.nameAr}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {item.product.brand}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 mt-1">
                      {item.product.nameAr}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      سعر الوحدة: <span className="font-bold text-slate-700">{tierPrice} ريال</span> ({item.product.unit})
                    </div>
                    {hasBulkDiscount && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                        <Sparkles className="w-3 h-3" />
                        تم تفعيل خصم الجملة للكمية!
                      </span>
                    )}
                  </div>
                </div>

                {/* Modifiers & Line Price */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      onDecrease={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      size="sm"
                    />
                    <button
                      type="button"
                      id={`remove-cart-item-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-black text-blue-900">
                      {(lineTotal || 0).toFixed(2)} ريال
                    </div>
                    {hasBulkDiscount && (
                      <div className="text-[10px] text-slate-400 line-through">
                        {(originalLineTotal || 0).toFixed(2)} ريال
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupon Form */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Coupon input */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>هل لديك كود خصم أو كوبون؟</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-800">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[10px] text-emerald-600">
                      تم خصم {appliedCoupon.discountPercentage}% ({appliedCoupon.descriptionAr})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="remove-coupon-btn"
                  onClick={removeCoupon}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                  title="إلغاء الكوبون"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  id="coupon-code-input"
                  value={couponCode}
                  onChange={e => {
                    setCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  placeholder="مثال: BASHARA10 أو WHOLESALE20"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none uppercase font-mono"
                  dir="ltr"
                />
                <button
                  type="submit"
                  id="apply-coupon-btn"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  تطبيق
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1.5">
                {couponError}
              </p>
            )}

            {/* Quick coupon hint tags */}
            {!appliedCoupon && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">كوبونات شائعة:</span>
                <button
                  type="button"
                  onClick={() => applyCoupon('BASHARA10')}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100"
                >
                  BASHARA10 (10%)
                </button>
                <button
                  type="button"
                  onClick={() => applyCoupon('WHOLESALE20')}
                  className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100"
                >
                  WHOLESALE20 (20%)
                </button>
              </div>
            )}
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-3">
              ملخص الحساب
            </h3>

            <div className="flex flex-col gap-2.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{(cartSubtotal || 0).toLocaleString()} ريال</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصومات وتخفيض الكوبون:</span>
                  <span>-{(cartDiscount || 0).toLocaleString()} ريال</span>
                </div>
              )}

              {cartSavings > 0 && (
                <div className="flex justify-between text-blue-700 font-bold">
                  <span>وفرت بأسعار الجملة والكرتون:</span>
                  <span>{(cartSavings || 0).toLocaleString()} ريال</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>رسوم التوصيل والشحن:</span>
                <span className="font-bold text-slate-800">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">مجاني 🚚</span>
                  ) : (
                    `${(cartDeliveryFee || 0).toLocaleString()} ريال`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">الإجمالي النهائي:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-blue-900">
                    {(cartTotal || 0).toLocaleString()} ريال
                  </span>
                  <div className="text-[10px] text-slate-400">ريال يمني (شامل الضريبة)</div>
                </div>
              </div>
            </div>

            {/* Checkout Action Button with Auth Guard */}
            <button
              type="button"
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md active:scale-98 transition-all text-sm"
            >
              <span>متابعة إتمام الطلب والدفع</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                دفع آمن 100%
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                تغليف كراتين محكم
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

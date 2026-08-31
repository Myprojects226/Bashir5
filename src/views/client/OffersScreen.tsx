import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Percent,
  Clock,
  Copy,
  Check,
  Tag,
  Package,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';

export const OffersScreen: React.FC = () => {
  const { products, coupons, applyCoupon, showToast, setCurrentView } = useApp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => (p.isDealOfTheDay || (p.discountPercentage && p.discountPercentage > 0)) && p.isActive);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`تم نسخ وتطبيق كود الخصم (${code}) بنجاح! 🏷️`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header & Flash Countdown */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-amber-200 text-xs font-black px-3 py-1 rounded-full mb-2">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              عروض وتخفيضات موسمية حصرية
            </div>
            <h1 className="text-xl sm:text-3xl font-black mb-1">
              مهرجان تخفيضات البشارة الكبرى
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-md">
              خصومات فورية تصل حتى 30% على كراتين المنظفات والبلاستيك والورقيات.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center shrink-0">
            <div className="text-[11px] text-amber-300 font-bold mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ينتهي العرض بعد:
            </div>
            <div className="flex items-center gap-1.5 font-mono text-base font-black text-white" dir="ltr">
              <div className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-rose-600 px-2 py-1 rounded-lg border border-rose-500">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-black text-slate-900">كوبونات وقسائم الخصم المتاحة</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coupons.map(coupon => (
            <div
              key={coupon.code}
              className="bg-white p-4 rounded-2xl border border-dashed border-blue-300 shadow-xs flex items-center justify-between gap-3 relative overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-blue-900 font-mono tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200" dir="ltr">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    %{coupon.discountPercentage} خصم
                  </span>
                </div>
                <p className="text-xs text-slate-600 truncate">{coupon.descriptionAr}</p>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  الحد الأدنى للطلب: {coupon.minOrderValue} ريال
                </div>
              </div>

              <button
                type="button"
                id={`copy-coupon-${coupon.code}`}
                onClick={() => handleCopyCoupon(coupon.code)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                  copiedCode === coupon.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === coupon.code ? 'تم التفعيل' : 'نسخ وتفعيل'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-black text-slate-900">منتجات العروض والتخفيضات</h2>
          </div>
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-xl">
            {dealProducts.length} عروض نشطة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {dealProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} layout="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};

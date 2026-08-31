import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  Clock,
  Award,
  Zap,
  Tag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Building2,
  Percent,
  Smartphone,
  Download,
  Quote,
  CheckCircle2,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { AlBisharaLogo } from '../../components/common/AlBisharaLogo';
import { Category } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    products,
    categories,
    banners,
    setSelectedCategory,
    setCurrentView,
    customerType,
    setCustomerType,
    setIsAndroidApkModalOpen,
    setIsBrandIdentityModalOpen
  } = useApp();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const bestSellers = products.filter(p => p.isBestSeller && p.isActive);
  const dealsOfTheDay = products.filter(p => p.isDealOfTheDay && p.isActive);
  const newArrivals = products.filter(p => p.isNew && p.isActive);
  const recommended = products.slice(0, 6);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('product_list');
  };

  return (
    <div className="flex flex-col gap-6 pb-24 text-slate-800">
      {/* 1. Hero Banner Slider */}
      <div className="relative w-full overflow-hidden px-3 sm:px-4 pt-3">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden shadow-lg aspect-21/9 sm:aspect-24/7 min-h-[160px] sm:min-h-[220px]">
          {banners.map((banner, index) => {
            const isActive = index === activeBannerIndex;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.titleAr}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-85`} />

                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-center max-w-xl text-white">
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-blue-100 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full w-fit mb-2">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    عروض البشارة الحصرية
                  </span>
                  <h2 className="text-base sm:text-2xl lg:text-3xl font-black leading-snug mb-1.5 drop-shadow-xs">
                    {banner.titleAr}
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-200 line-clamp-2 mb-4 drop-shadow-xs max-w-md">
                    {banner.subtitleAr}
                  </p>

                  <div>
                    <button
                      type="button"
                      id={`banner-action-btn-${banner.id}`}
                      onClick={() => {
                        if (banner.linkType === 'wholesale') {
                          setCurrentView('wholesale_portal');
                        } else if (banner.linkType === 'offer') {
                          setCurrentView('offers');
                        } else if (banner.targetId) {
                          const cat = categories.find(c => c.id === banner.targetId);
                          if (cat) handleCategoryClick(cat);
                        } else {
                          setCurrentView('offers');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 bg-white text-blue-900 hover:bg-blue-50 text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      <span>{banner.buttonTextAr}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slider dots */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveBannerIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeBannerIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Brand Slogan & Official Quotes Ticker */}
      <div className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-sky-50 via-blue-50 to-emerald-50 p-3 sm:p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-sky-200 shrink-0">
              <AlBisharaLogo size="xs" variant="icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">البشارة.. عنوان الجودة</span>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  هوية رسمية
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                "منظفات فعالة - نظافة لا مثيل لها ولمعان يدوم بكل سهولة"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="home-open-brand-guide-btn"
              onClick={() => setIsBrandIdentityModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs transition-colors shrink-0"
            >
              <Quote className="w-3.5 h-3.5 text-blue-600" />
              <span>دليل الشعار والاقتباسات</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Value Propositions bar */}
      <div className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">أسعار جملة مباشرة</div>
              <div className="text-[10px] text-slate-400">وفر حتى 30% على الكراتين</div>
            </div>
            <span className="text-[10px] font-bold sm:hidden">أسعار جملة</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-slate-700 border-x border-slate-100 px-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">توصيل سريع للباب</div>
              <div className="text-[10px] text-slate-400">مجاناً للطلبات فوق 200 ريال</div>
            </div>
            <span className="text-[10px] font-bold sm:hidden">توصيل للباب</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">منتجات أصلية 100%</div>
              <div className="text-[10px] text-slate-400">ضمان الجودة ونقاء البلاستيك</div>
            </div>
            <span className="text-[10px] font-bold sm:hidden">ضمان الجودة</span>
          </div>
        </div>
      </div>

      {/* 2.5 Android App & APK Quick Callout Banner */}
      <div className="px-3 sm:px-4">
        <div 
          id="home-android-app-callout"
          onClick={() => setIsAndroidApkModalOpen(true)}
          className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-700 via-teal-800 to-blue-900 rounded-2xl p-3.5 sm:p-4 text-white shadow-md flex items-center justify-between gap-3 cursor-pointer hover:shadow-lg transition-all border border-emerald-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm">تطبيق متجر البشارة للأندرويد (APK)</span>
                <span className="bg-emerald-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md">متاح الآن</span>
              </div>
              <p className="text-[11px] text-emerald-100 hidden sm:block mt-0.5">
                حمّل وثبّت التطبيق على هاتفك المحمول لتجربة تصفح أسرع وإشعارات فورية بحالة طلباتك
              </p>
            </div>
          </div>
          <button
            type="button"
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل وتثبيت APK</span>
          </button>
        </div>
      </div>

      {/* 3. Categories Grid & Horizontal list */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                أقسام المتجر
              </h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {categories.length} قسم
              </span>
            </div>
            <button
              type="button"
              id="view-all-categories-btn"
              onClick={() => setCurrentView('categories')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>عرض الكل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3.5">
            {categories.slice(0, 6).map(cat => (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => handleCategoryClick(cat)}
                className="group flex flex-col items-center text-center p-2.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.nameAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {cat.nameAr}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {cat.itemCount} منتج
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers (الأكثر مبيعاً) */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  الأكثر مبيعاً
                </h3>
                <p className="text-[11px] text-slate-500">المنتجات الأكثر طلباً من المطاعم والشركات والمنازل</p>
              </div>
            </div>
            <button
              type="button"
              id="view-all-bestsellers-btn"
              onClick={() => setCurrentView('offers')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>المزيد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} layout="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Today's Deals (عروض اليوم) */}
      <section className="px-3 sm:px-4 bg-gradient-to-b from-rose-50/50 via-amber-50/30 to-transparent py-4 rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    عروض وتخفيضات اليوم
                  </h3>
                  <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full animate-pulse">
                    خصم يصل لـ %30
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">كميات محدودة تنتهي بانتهاء الوقت</p>
              </div>
            </div>

            <button
              type="button"
              id="view-all-deals-btn"
              onClick={() => setCurrentView('offers')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
            >
              <span>كل العروض</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {dealsOfTheDay.map(prod => (
              <ProductCard key={prod.id} product={prod} layout="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* 6. B2B Wholesale Callout Card */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-blue-700/80 text-blue-100 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              مخصص للمطاعم، الكافيهات، الفنادق والشركات
            </span>
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              هل تدير مطعماً أو فندقاً أو مشروعاً تجارياً؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              احصل على أسعار الجملة المباشرة للكراتين، فواتير ضريبية نظامية، وتسهيلات دفع مع جدول توصيل دوري مخصص.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="wholesale-portal-cta-btn"
                onClick={() => setCurrentView('wholesale_portal')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>حساب تكلفة طلبيات الجملة B2B</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="contact-sales-btn"
                onClick={() => setCurrentView('contact_us')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                تواصل مع مسؤول المبيعات
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10">
              <div className="text-2xl font-black text-emerald-400">+500</div>
              <div className="text-xs text-slate-300">منتج وكرتون متوفر</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10">
              <div className="text-2xl font-black text-amber-400">30%</div>
              <div className="text-xs text-slate-300">توفير على الكميات</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Official Brand Identity & Quotes Showcase */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-white via-sky-50/40 to-emerald-50/30 rounded-3xl p-5 sm:p-7 border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Official Logo Box */}
            <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs shrink-0 w-full sm:w-auto text-center">
              <AlBisharaLogo size="lg" variant="full" showSlogan={true} showPhones={false} />
            </div>

            {/* Middle: Brand Quotes Grid */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                  هوية وشعارات البشارة
                </span>
                <span className="text-xs text-slate-500 font-bold">تعز - بيرباشا</span>
              </div>

              <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                "البشارة.. عنوان الجودة" - كل ما تحتاجه بجودة عالية
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="text-[10px] font-extrabold text-blue-700">✨ قسم المنظفات</div>
                  <div className="text-xs font-bold text-slate-800">
                    "منظفات فعالة - نظافة لا مثيل لها ولمعان يدوم بكل سهولة"
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                  <div className="text-[10px] font-extrabold text-emerald-700">🌸 قسم أدوات التجميل</div>
                  <div className="text-xs font-bold text-slate-800">
                    "مستحضرات التجميل - كل لمسة جمال تبدأ من هنا"
                  </div>
                </div>
              </div>

              {/* Official Store Info */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>تعز - جولة بير باشا - خط المطار - جوار مطعم حضرموت</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs font-mono" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">776776429 / 783755055 / 783744044</span>
                </div>
              </div>
            </div>

            {/* Right: Action button */}
            <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="brand-section-guide-btn"
                onClick={() => setIsBrandIdentityModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-center"
              >
                <Quote className="w-4 h-4" />
                <span>عرض الدليل والشعارات الكامل</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals (وصل حديثاً) */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  وصل حديثاً
                </h3>
                <p className="text-[11px] text-slate-500">أحدث المنتجات والموديلات المضافة لمستودع البشارة</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newArrivals.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} layout="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Recommended for you */}
      <section className="px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                منتجات مقترحة لك
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommended.slice(0, 3).map(prod => (
              <ProductCard key={prod.id} product={prod} layout="horizontal" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

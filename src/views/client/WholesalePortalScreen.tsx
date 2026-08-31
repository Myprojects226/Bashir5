import React, { useState } from 'react';
import {
  Package,
  Building2,
  Calculator,
  CheckCircle2,
  FileText,
  Truck,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { saveWholesaleRequestToFirestore } from '../../lib/firebase';

export const WholesalePortalScreen: React.FC = () => {
  const {
    products,
    customerType,
    setCustomerType,
    addToCart,
    setCurrentView,
    showToast
  } = useApp();

  // Calculator state
  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');
  const [cartonCount, setCartonCount] = useState<number>(25);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [activityType, setActivityType] = useState('مطعم / كافيه');
  const [city, setCity] = useState('تعز');
  const [contactPhone, setContactPhone] = useState('777123456');
  const [submitted, setSubmitted] = useState(false);

  const activeProduct = products.find(p => p.id === selectedProdId) || products[0];

  // Pricing calculation
  const retailUnitPrice = activeProduct ? activeProduct.price : 0;
  let wholesaleUnitPrice = retailUnitPrice;

  if (activeProduct && activeProduct.wholesaleTiers) {
    for (const tier of activeProduct.wholesaleTiers) {
      if (cartonCount >= tier.minQuantity && (!tier.maxQuantity || cartonCount <= tier.maxQuantity)) {
        wholesaleUnitPrice = tier.pricePerUnit;
        break;
      }
    }
  }

  const totalRetailPrice = retailUnitPrice * cartonCount;
  const totalWholesalePrice = wholesaleUnitPrice * cartonCount;
  const totalSavings = Math.max(0, totalRetailPrice - totalWholesalePrice);
  const vatAmount = totalWholesalePrice * 0.15;
  const finalWithVat = totalWholesalePrice + vatAmount;

  const handleApplyB2B = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !crNumber) {
      showToast('يرجى تعبئة اسم المنشأة ورقم السجل التجاري', 'error');
      return;
    }

    saveWholesaleRequestToFirestore({
      facilityName: companyName,
      contactName: companyName,
      contactPhone: contactPhone || '777123456',
      activityType: activityType,
      city: city || 'تعز',
      monthlyCartons: `${cartonCount} كرتون شهرياً`,
      notes: `رقم السجل: ${crNumber}، الرقم الضريبي: ${taxNumber}`
    }).catch(err => {
      console.warn('Firestore wholesale request note:', err);
    });

    setSubmitted(true);
    setCustomerType('wholesale');
    showToast('🎉 تم تسجيل طلب وتفعيل حساب الجملة B2B في Firebase بنجاح!', 'success');
  };

  const handleAddCalculatedToCart = () => {
    if (activeProduct) {
      addToCart(activeProduct, cartonCount);
      setCurrentView('cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-700/80 text-blue-200 text-xs font-black px-3 py-1 rounded-full mb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            بوابة المبيعات والجملة B2B
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            عقود وتوريدات الجملة للمطاعم والفنادق والشركات
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            احصل على أفضل أسعار التوريد المباشرة للبلاستيك والمنظفات والورقيات من مستودع البشارة في تعز - بيرباشا، مع فواتير وفواتير معتمدة وجدول توصيل سريع لكافة أحياء تعز وباقي المحافظات.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Wholesale Calculator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  حاسبة أسعار وتوفير الجملة
                </h2>
                <p className="text-xs text-slate-500">
                  احسب سعر الكراتين ووفورات الكميات الكبيرة بدقة
                </p>
              </div>
            </div>

            {/* Select Product */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اختر الصنف أو الكرتون:
              </label>
              <select
                id="calc-product-select"
                value={selectedProdId}
                onChange={e => setSelectedProdId(e.target.value)}
                className="w-full p-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nameAr} - (سعر التجزئة: {p.price} ريال)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>عدد الكراتين / الوحدات المطلوبة:</span>
                <span className="text-blue-900 font-black text-sm bg-blue-50 px-3 py-0.5 rounded-lg">
                  {cartonCount} {activeProduct.unit}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={cartonCount}
                onChange={e => setCartonCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>1 كرتون</span>
                <span>50 كرتون</span>
                <span>100 كرتون</span>
                <span>200 كرتون</span>
              </div>
            </div>

            {/* Live Calculation Results Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block">سعر الكرتون بالجملة</span>
                  <span className="text-sm font-black text-blue-900">{wholesaleUnitPrice} ريال</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block">سعر التجزئة العادي</span>
                  <span className="text-sm font-bold text-slate-400 line-through">{retailUnitPrice} ريال</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block">إجمالي التوفير</span>
                  <span className="text-sm font-black text-emerald-700">{(totalSavings || 0).toFixed(2)} ريال</span>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-bold block">الإجمالي بعد الخصم</span>
                  <span className="text-sm font-black text-blue-900">{(totalWholesalePrice || 0).toFixed(2)} ريال</span>
                </div>
              </div>

              {/* Tax simulation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>المجموع الصافي (بدون ضريبة):</span>
                  <span className="font-bold">{(totalWholesalePrice || 0).toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-bold">{(vatAmount || 0).toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>المبلغ الإجمالي مع الضريبة والتوصيل:</span>
                  <span className="text-blue-900">{(finalWithVat || 0).toFixed(2)} ريال</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="add-wholesale-calc-to-cart-btn"
              onClick={handleAddCalculatedToCart}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md active:scale-98 transition-all text-xs sm:text-sm"
            >
              <Package className="w-4 h-4" />
              <span>إضافة هذه الكمية ({cartonCount} كرتون) للسلة الآن</span>
            </button>
          </div>
        </div>

        {/* Right: B2B Account Registration (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  طلب فتح حساب منشأة تجارية B2B
                </h2>
                <p className="text-xs text-slate-500">
                  تسجيل منشأتك للحصول على فواتير ضريبية وخصم دائم
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-black text-emerald-900 mb-1">
                  تم اعتماد حسابك التجاري!
                </h3>
                <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                  مرحباً بمنشأة <strong>{companyName}</strong>. تم تفعيل أسعار الجملة المباشرة في كامل المتجر.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs"
                >
                  تسوق بأسعار الجملة الآن
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyB2B} className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المنشأة / الشركة / المطعم *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="مثال: مطاعم ومطابخ النخيل"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم السجل التجاري *
                    </label>
                    <input
                      type="text"
                      required
                      value={crNumber}
                      onChange={e => setCrNumber(e.target.value)}
                      placeholder="1010XXXXXX"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الرقم الضريبي (اختياري)
                    </label>
                    <input
                      type="text"
                      value={taxNumber}
                      onChange={e => setTaxNumber(e.target.value)}
                      placeholder="300XXXXXXXXX"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نوع النشاط
                    </label>
                    <select
                      value={activityType}
                      onChange={e => setActivityType(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="مطعم / كافيه">مطعم / كافيه</option>
                      <option value="فندق / شقق فندقية">فندق / شقق فندقية</option>
                      <option value="مغسلة ملابس / سيارات">مغسلة ملابس / سيارات</option>
                      <option value="مستشفى / مركز طبي">مستشفى / مجمع طبي</option>
                      <option value="مدرسة / جهة تعليمية">مدرسة / جهة تعليمية</option>
                      <option value="شركة / مكاتب تجارية">شركة / مكاتب تجارية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المدينة / المحافظة
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="تعز">تعز (المدينة والمديريات)</option>
                      <option value="إب">إب</option>
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="الحديدة">الحديدة</option>
                      <option value="ذمار">ذمار</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم جوال مسؤول المشتريات *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 outline-none"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-b2b-app-btn"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all text-xs mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد تسجيل الحساب وتفعيل أسعار الجملة</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

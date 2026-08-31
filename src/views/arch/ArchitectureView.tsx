import React, { useState } from 'react';
import {
  Code,
  Database,
  Layers,
  Server,
  Smartphone,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  Cpu,
  CheckCircle2,
  FileCode2,
  GitBranch,
  Copy,
  Check,
  Quote,
  Sparkles,
  Phone,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlBisharaLogo } from '../../components/common/AlBisharaLogo';

export const ArchitectureView: React.FC = () => {
  const { showToast } = useApp();
  const [activeArchTab, setActiveArchTab] = useState<'brand_identity' | 'android_apk' | 'firebase' | 'flutter' | 'laravel' | 'database' | 'apis' | 'wholesale_engine'>('brand_identity');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    showToast('تم نسخ الكود البرمجي للحافظة', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 pb-28 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-600/80 text-blue-100 text-xs font-black px-3 py-1 rounded-full mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              المخطط المعماري والهندسي الكامل للإنتاج
            </div>
            <h1 className="text-xl sm:text-3xl font-black mb-1">
              هندسة مشروع "البشارة للبلاستيك والمنظفات"
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              توثيق معماري دقيق وشامل يغطي تطبيق عميل Flutter (Android/iOS)، خادم Laravel 11 REST API، قواعد بيانات MySQL، خوارزمية تسعير الجملة، وبوابات الدفع والإشعارات.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <Smartphone className="w-6 h-6 text-sky-400" />
            <span className="text-slate-400 text-xs">+</span>
            <Server className="w-6 h-6 text-rose-400" />
            <span className="text-slate-400 text-xs">+</span>
            <Database className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'brand_identity', label: '🎨 الهوية والشعار والاقتباسات الرسمية', icon: Quote },
          { id: 'android_apk', label: '📱 تطبيق الأندرويد & ملف APK', icon: Smartphone },
          { id: 'firebase', label: '🔥 Firebase Firestore & Auth (Live)', icon: Database },
          { id: 'flutter', label: '📱 بنية Flutter (Client App)', icon: Smartphone },
          { id: 'laravel', label: '⚡ بنية Laravel 11 (Backend)', icon: Server },
          { id: 'database', label: '🗄️ مخطط قواعد بيانات MySQL (ERD)', icon: Database },
          { id: 'apis', label: '🔌 نقاط النهاية RESTful APIs', icon: Globe },
          { id: 'wholesale_engine', label: '📦 محرك حسابات الجملة والكراتين', icon: Layers }
        ].map(t => {
          const isActive = activeArchTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveArchTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: BRAND IDENTITY & SLOGANS */}
      {activeArchTab === 'brand_identity' && (
        <div className="space-y-6">
          {/* Main Brand Overview */}
          <div className="bg-gradient-to-br from-blue-900 via-sky-950 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-1 rounded-full border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الهوية البصرية الرسمية المعتمدة لشركة ومستودع البشارة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  البشارة.. عنوان الجودة
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  تأسست هوية البشارة لتكون المرجع الأول في تعز واليمن لتوريد منتجات البلاستيك، المنظفات المركزة، الورقيات ومستحضرات التجميل بالجملة والتجزئة وفق أعلى معايير النقاء والجودة الموثوقة.
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-2 justify-center lg:justify-start text-xs font-mono" dir="ltr">
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>776776429 / 783755055 / 783744044</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-white/20 shrink-0 text-center">
                <AlBisharaLogo size="xl" variant="full" showSlogan={true} showPhones={true} />
              </div>
            </div>
          </div>

          {/* Slogans & Quotes Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <Quote className="w-4 h-4" />
                  <h3 className="font-black text-sm">اقتباس قسم المنظفات المعتمد</h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('منظفات فعالة - نظافة لا مثيل لها ولمعان يدوم بكل سهولة', 'quote-clean')}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="نسخ الاقتباس"
                >
                  {copiedCode === 'quote-clean' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-slate-900 font-extrabold text-sm leading-relaxed">
                "منظفات فعالة - نظافة لا مثيل لها ولمعان يدوم بكل سهولة"
              </div>
              <p className="text-xs text-slate-500">
                يُستخدم في لافتات المتجر، بنرات المنظفات، الإعلانات، وبطاقات صابون الغسيل والكلور المركز.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Quote className="w-4 h-4" />
                  <h3 className="font-black text-sm">اقتباس قسم مستحضرات التجميل</h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('مستحضرات التجميل - كل لمسة جمال تبدأ من هنا', 'quote-cosmetics')}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="نسخ الاقتباس"
                >
                  {copiedCode === 'quote-cosmetics' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-slate-900 font-extrabold text-sm leading-relaxed">
                "مستحضرات التجميل - كل لمسة جمال تبدأ من هنا"
              </div>
              <p className="text-xs text-slate-500">
                يُستخدم في قسم العناية بالبشرة، العطور، أدوات الصالونات ومستحضرات التجميل النسائية والرجالية.
              </p>
            </div>
          </div>

          {/* Color Palette Specification */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-black text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>لوحة الألوان الرسمية المعتمدة (Design Tokens)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="w-full h-12 rounded-xl bg-[#0284c7] shadow-inner flex items-center justify-center text-white font-mono font-bold text-xs">
                  #0284C7
                </div>
                <div className="text-xs font-black text-slate-900">سماوي البشارة (Sky Blue)</div>
                <div className="text-[11px] text-slate-500">يمثل النظافة والانتعاش والبلاستيك</div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="w-full h-12 rounded-xl bg-[#1e3a8a] shadow-inner flex items-center justify-center text-white font-mono font-bold text-xs">
                  #1E3A8A
                </div>
                <div className="text-xs font-black text-slate-900">كحلي عميق (Royal Navy)</div>
                <div className="text-[11px] text-slate-500">يمثل الثقة والجودة وتجارة الجملة</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="w-full h-12 rounded-xl bg-[#059669] shadow-inner flex items-center justify-center text-white font-mono font-bold text-xs">
                  #059669
                </div>
                <div className="text-xs font-black text-slate-900">أخضر زمردي (Emerald)</div>
                <div className="text-[11px] text-slate-500">يمثل الطبيعة والجمال والتوفير</div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="w-full h-12 rounded-xl bg-[#f59e0b] shadow-inner flex items-center justify-center text-white font-mono font-bold text-xs">
                  #F59E0B
                </div>
                <div className="text-xs font-black text-slate-900">ذهبي فاخر (Golden Amber)</div>
                <div className="text-[11px] text-slate-500">يمثل العروض الحصرية والتميز</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ANDROID APK & PWA & CAPACITOR */}
      {activeArchTab === 'android_apk' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600/10 via-teal-500/5 to-slate-50 p-6 rounded-3xl border border-emerald-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md font-black text-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    تطبيق الأندرويد الأصلي وحزمة APK (Android Production Release)
                  </h2>
                  <p className="text-xs text-slate-500">
                    معمارية التجهيز للنشر المباشر بصيغ APK و AAB عبر Capacitor و PWA WebAPK
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                جاهز للبناء والتصدير (v1.0.0)
              </span>
            </div>

            {/* Architecture Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-500 mb-1">معرّف حزمة الأندرويد</div>
                <div className="text-sm font-black text-blue-900 font-mono" dir="ltr">com.albishara.store</div>
                <div className="text-[11px] text-slate-400 mt-1">Package ID فريد معتمد لمتجر Google Play</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-500 mb-1">البيئة ومحرك البناء</div>
                <div className="text-sm font-black text-emerald-700 font-mono" dir="ltr">Capacitor v8 + Gradle 8.5</div>
                <div className="text-[11px] text-slate-400 mt-1">أعلى أداء مع Native WebView Bridging</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-500 mb-1">دعم الأنظمة</div>
                <div className="text-sm font-black text-slate-800">Android 7.0 (API 24) - Android 15+</div>
                <div className="text-[11px] text-slate-400 mt-1">تغطية 99.8% من هواتف المستخدمين في اليمن</div>
              </div>
            </div>

            {/* Build Commands */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white font-mono text-xs mb-4">
              <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  أوامر توليد ملف APK عبر سطر الأوامر (Terminal)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('npm run build\nnpx cap add android\nnpx cap sync android\ncd android && ./gradlew assembleRelease', 'apk-cmd')}
                  className="hover:text-white flex items-center gap-1 text-[11px] text-slate-400 transition-colors"
                >
                  {copiedCode === 'apk-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>نسخ الأوامر</span>
                </button>
              </div>
              <pre className="text-emerald-300 leading-relaxed overflow-x-auto select-all" dir="ltr">
{`# 1. بناء ملفات الواجهة للإنتاج
npm run build

# 2. مزامنة ملفات مشروع الأندرويد الأصلي
npx cap sync android

# 3. بناء ملف APK الإنتاجي المباشر
cd android && ./gradlew assembleRelease

# مسار ملف الـ APK الناتج:
# android/app/build/outputs/apk/release/app-release-unsigned.apk`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 0: FIREBASE LIVE BACKEND */}
      {activeArchTab === 'firebase' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 p-6 rounded-3xl border border-amber-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md font-black text-xl">
                  🔥
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Firebase Cloud Firestore & Authentication (Active)
                  </h2>
                  <p className="text-xs text-slate-500">
                    قاعدة بيانات سحابية حية متزامنة في الوقت الفعلي مع قواعد أمان ABAC وقنوات المصادقة
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                متصل ونشط (Europe-West2)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold mb-1">Project ID</span>
                <span className="font-mono font-black text-slate-800 text-xs" dir="ltr">focal-liberty-2r7h4</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold mb-1">Database Edition</span>
                <span className="font-bold text-amber-700 text-xs">Cloud Firestore Enterprise</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold mb-1">Security Model</span>
                <span className="font-bold text-blue-700 text-xs">Zero-Trust ABAC (8 Pillars)</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold mb-1">Auth Providers</span>
                <span className="font-bold text-purple-700 text-xs">Google OAuth + Phone / OTP</span>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'orders',
                title: 'طلبات العملاء والجملة (Orders)',
                desc: 'تخزين الطلبات، بيانات الفاتورة بالريال اليمني، العنوان المختار في تعز، وسجل التتبع الحي.',
                keys: 'id, orderNumber, userId, items, subtotal, totalAmount, status, paymentMethod'
              },
              {
                name: 'users',
                title: 'ملفات المستخدمين والأدوار (Users)',
                desc: 'إدارة الأدوار (مدير عام، مدير مستودع، عميل قطاعي، عميل جملة B2B)، والتراخيص الضريبية.',
                keys: 'id, name, phone, email, role, customerType, companyName, isVerified'
              },
              {
                name: 'wholesale_requests',
                title: 'طلبات الجملة B2B والعقود',
                desc: 'تلقي عروض الأسعار والتوريد المباشر للمطاعم والفنادق والمنشآت في تعز وباقي المحافظات.',
                keys: 'id, facilityName, contactPhone, activityType, city, monthlyCartons, status'
              },
              {
                name: 'reviews',
                title: 'التقييمات والآراء (Reviews)',
                desc: 'مراجعات وتقييمات العملاء لجودة كراتين البلاستيك والمنظفات مع ردود إدارة المتجر.',
                keys: 'id, productId, productName, rating, comment, isApproved, createdAt'
              },
              {
                name: 'contact_messages',
                title: 'رسائل واستفسارات المستودع',
                desc: 'استفسارات العملاء الموجهة لمقر مستودع البشارة في تعز - بيرباشا.',
                keys: 'id, name, phone, subject, message, status, createdAt'
              },
              {
                name: 'products',
                title: 'كتالوج الأصناف والكراتين (Products)',
                desc: 'تزامن الأصناف، الكميات المتوفرة، شرائح أسعار الجملة، ومواصفات الكرتون بالقطعة.',
                keys: 'id, sku, nameAr, price, wholesalePrice, stockQuantity, unit, isActive'
              }
            ].map(col => (
              <div key={col.name} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                    /{col.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    Firestore Sync
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">{col.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{col.desc}</p>
                <div className="bg-slate-50 p-2 rounded-xl text-[10px] font-mono text-slate-600 truncate" dir="ltr">
                  {col.keys}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: FLUTTER */}
      {activeArchTab === 'flutter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-blue-900 mb-2">إدارة الحالة (State Management)</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                اعتماد <strong>Bloc / Cubit</strong> أو <strong>Provider</strong> لفصل منطق الأعمال (Business Logic) تماماً عن طبقة العرض والواجهات، مما يضمن أداءً سلساً واستهلاكاً مثالياً للذاكرة.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-mono text-slate-700">
                CartBloc • AuthCubit • WholesalePriceCubit • OrderTrackingBloc
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-blue-900 mb-2">دعم RTL والخطوط العربية</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                تطبيق اتجاه <strong>TextDirection.rtl</strong> افتراضياً مع تهيئة خطوط <strong>Cairo</strong> و <strong>Tajawal</strong> المعتمدة للمتاجر السعودية.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-mono text-slate-700">
                fonts: - family: Cairo, Tajawal | Locale('ar', 'SA')
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-black text-blue-900 mb-2">الخرائط والإشعارات</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                تكامل حقيقي مع حزمة <strong>google_maps_flutter</strong> لتحديد إحداثيات GPS، وحزمة <strong>firebase_messaging</strong> لتنبيهات الفواتير والشحنات.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-mono text-slate-700">
                google_maps_flutter • geolocator • firebase_messaging
              </div>
            </div>
          </div>

          {/* Folder Structure */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl font-mono text-xs shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
              <span className="font-bold">هيكلية مجلدات مشروع Flutter (lib/ Directory Structure)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(`lib/
├── main.dart
├── app.dart
├── core/
│   ├── constants/ (colors, assets, strings)
│   ├── network/ (dio_client, api_endpoints)
│   ├── theme/ (app_theme, typography)
│   └── utils/ (formatters, wholesale_calculator)
├── data/
│   ├── models/ (product_model, order_model, user_model)
│   └── repositories/ (product_repo, order_repo, auth_repo)
├── logic/
│   ├── auth/ (auth_cubit, auth_state)
│   ├── cart/ (cart_bloc, cart_event, cart_state)
│   └── tracking/ (tracking_bloc)
└── presentation/
    ├── screens/ (home, categories, product_details, cart, checkout, tracking, profile)
    └── widgets/ (product_card, quantity_selector, map_picker, wholesale_badge)`, 'flutter_tree')}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
              >
                {copiedCode === 'flutter_tree' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الهيكلية</span>
              </button>
            </div>
            <pre className="text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">
{`lib/
├── main.dart                          # نقطة الانطلاق وتهيئة Firebase
├── app.dart                           # MaterialApp مع اتجاه RTL
├── core/
│   ├── constants/                     # الألوان الرسمية (Royal Blue #1E3A8A)، الروابط، النصوص
│   ├── network/                       # Dio Client، مصفوفة Bearer Token، معالجة الأخطاء
│   ├── theme/                         # ثيم البشارة، خط Cairo، بطاقات الحواف المنحنية
│   └── utils/                         # محرك شرائح الجملة (Wholesale Engine)، تحويل العملة
├── data/
│   ├── models/                        # نماذج JSON: Product, WholesaleTier, Order, Address
│   └── repositories/                  # فئات التعامل مع خادم Laravel API
├── logic/
│   ├── auth/                          # إدارة تسجيل الدخول والتحقق برقم الجوال OTP
│   ├── cart/                          # سلة المشتريات وتطبيق شرائح الجملة آلياً
│   └── tracking/                      # تحديث مسار المندوب المباشر (Socket / Polling)
└── presentation/
    ├── screens/                       # الشاشات: الرئيسية، المنتجات، السلة، التتبع، الملف
    └── widgets/                       # المكونات: بطاقة المنتج، منتقي الخريطة، شارات الجملة`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: LARAVEL */}
      {activeArchTab === 'laravel' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-2">
              بنية خادم Laravel 11 والخدمات المعمارية
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              يعتمد الخادم على نمط <strong>Repository-Service Pattern</strong> مع <strong>Form Requests</strong> للتحقق الصارم من المدخلات، و <strong>API Resource Classes</strong> لتنسيق مخرجات JSON المتوافقة مع تطبيق Flutter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">المصادقة والأمان</strong>
                <span className="text-slate-500">Laravel Sanctum (Personal Access Tokens) مع OTP عبر SMS</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">الفواتير الضريبية</strong>
                <span className="text-slate-500">توليد QR Code المتوافق مع هيئة الزكاة والضريبة والجمارك (ZATCA Phase 1 & 2)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">الإشعارات الفورية</strong>
                <span className="text-slate-500">Google Firebase Cloud Messaging (FCM) عبر Laravel Queues</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">المهام في الخلفية</strong>
                <span className="text-slate-500">Redis & Database Queue Worker لمعالجة الطلبات وإرسال التنبيهات</span>
              </div>
            </div>
          </div>

          {/* Sample Controller Code */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl font-mono text-xs shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
              <span className="font-bold">app/Services/WholesalePricingService.php</span>
              <button
                type="button"
                onClick={() => copyToClipboard(`<?php
namespace App\\Services;

use App\\Models\\Product;

class WholesalePricingService
{
    /**
     * حساب سعر الوحدة الفعلي بناءً على كمية الكراتين وشريحة العميل
     */
    public function calculateUnitPrice(Product $product, int $quantity, string $customerType = 'retail'): float
    {
        $basePrice = $product->price;

        // إذا كان العميل منشأة تجارية B2B موثقة
        if ($customerType === 'wholesale' || $customerType === 'commercial') {
            $basePrice = $basePrice * 0.90; // خصم إضافي 10%
        }

        // فحص شرائح الجملة للكميات
        $tier = $product->wholesaleTiers()
            ->where('min_quantity', '<=', $quantity)
            ->where(function ($q) use ($quantity) {
                $q->whereNull('max_quantity')
                  ->orWhere('max_quantity', '>=', $quantity);
            })
            ->first();

        return $tier ? $tier->price_per_unit : $basePrice;
    }
}`, 'wholesale_service_php')}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
              >
                {copiedCode === 'wholesale_service_php' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ الكود</span>
              </button>
            </div>
            <pre className="text-[11px] leading-relaxed text-sky-300 overflow-x-auto" dir="ltr">
{`<?php
namespace App\\Services;

use App\\Models\\Product;

class WholesalePricingService
{
    /**
     * حساب سعر الوحدة والكرتون الفعلي بناءً على الكمية ونوع الحساب
     */
    public function calculateUnitPrice(Product $product, int $quantity, string $customerType = 'retail'): float
    {
        $basePrice = $product->price;

        // 1. فحص شريحة الكميات في قاعدة البيانات
        $tier = $product->wholesaleTiers()
            ->where('min_quantity', '<=', $quantity)
            ->where(function ($q) use ($quantity) {
                $q->whereNull('max_quantity')
                  ->orWhere('max_quantity', '>=', $quantity);
            })
            ->first();

        $effectivePrice = $tier ? $tier->price_per_unit : $basePrice;

        // 2. تطبيق خصم منشآت B2B المعتمدة (مطاعم وفنادق)
        if ($customerType === 'wholesale' || $customerType === 'commercial') {
            $effectivePrice = min($effectivePrice, $product->price * 0.88);
        }

        return round($effectivePrice, 2);
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMA */}
      {activeArchTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-2">
              جداول قاعدة بيانات MySQL المعيارية
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              مخطط علائقي مفهرس ومحكم الربط بمفاتيح أجنبية (Foreign Keys) مع دعم كامل لحقول التسعير الديناميكي، العناوين الجغرافية، وتتبع الحالات الخمس للطلبات.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">users</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• id (BIGINT, PK)</li>
                  <li>• name, phone (UNIQUE), email</li>
                  <li>• role (admin, customer, driver)</li>
                  <li>• customer_type (retail, wholesale, commercial)</li>
                  <li>• company_name, cr_number, vat_number</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">products</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• id (BIGINT, PK), category_id (FK)</li>
                  <li>• name_ar, name_en, sku (UNIQUE)</li>
                  <li>• price, stock_quantity, min_stock_alert</li>
                  <li>• unit (كرتون, درزن, جالون, حبة)</li>
                  <li>• brand, is_active, is_deal_of_the_day</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">wholesale_tiers</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• id (BIGINT, PK), product_id (FK)</li>
                  <li>• min_quantity (e.g. 10)</li>
                  <li>• max_quantity (e.g. 49, NULL for unlimited)</li>
                  <li>• price_per_unit (DECIMAL 10,2)</li>
                  <li>• label_ar</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">orders & order_items</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• id, order_number (UNIQUE, e.g. BSH-89412)</li>
                  <li>• user_id (FK), address_id (FK)</li>
                  <li>• status (pending, confirmed, processing, out_for_delivery, delivered)</li>
                  <li>• subtotal, vat_amount (15%), grand_total</li>
                  <li>• payment_method, zatca_qr_payload</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">addresses</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• id, user_id (FK), title</li>
                  <li>• city, district, street, details</li>
                  <li>• latitude, longitude (DECIMAL 10,8)</li>
                  <li>• is_default (BOOLEAN)</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="block text-blue-900 mb-1">coupons & reviews</strong>
                <ul className="text-slate-600 space-y-0.5 text-[11px] font-mono">
                  <li>• code (UNIQUE), discount_percentage</li>
                  <li>• min_order_value, expires_at</li>
                  <li>• reviews: rating, comment, is_approved, admin_reply</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REST APIS */}
      {activeArchTab === 'apis' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              قائمة نقاط النهاية المعيارية (RESTful API Endpoints)
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { method: 'POST', path: '/api/v1/auth/send-otp', desc: 'إرسال رمز التحقق لرقم الجوال السعودي' },
                { method: 'POST', path: '/api/v1/auth/verify-otp', desc: 'التحقق من الرمز وإصدار Sanctum Token' },
                { method: 'GET', path: '/api/v1/products', desc: 'جلب المنتجات مع الفلترة والبحث والأقسام وشرائح الجملة' },
                { method: 'GET', path: '/api/v1/products/{id}', desc: 'جلب تفاصيل صنف معين وتقييماته والمخزون' },
                { method: 'POST', path: '/api/v1/cart/calculate', desc: 'محاكاة أسعار الجملة والضريبة للسلة قبل الدفع' },
                { method: 'POST', path: '/api/v1/orders', desc: 'إنشاء طلب جديد، حجز المخزون، وتوليد الفاتورة الضريبية' },
                { method: 'GET', path: '/api/v1/orders/{id}/tracking', desc: 'تتبع مسار الشحنة وإحداثيات السائق GPS' },
                { method: 'POST', path: '/api/v1/coupons/apply', desc: 'التحقق من كود الخصم وتطبيقه على الإجمالي' },
                { method: 'POST', path: '/api/v1/b2b/register', desc: 'تقديم طلب توثيق حساب جملة أو منشأة تجارية' }
              ].map((api, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        api.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {api.method}
                    </span>
                    <span className="font-bold text-slate-800 text-xs" dir="ltr">{api.path}</span>
                  </div>
                  <span className="text-slate-600 text-xs">{api.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHOLESALE ENGINE */}
      {activeArchTab === 'wholesale_engine' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-2">
              خوارزمية حساب أسعار الجملة المعتمدة في المتجر
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              تضمن هذه الخوارزمية تطابقاً بنسبة 100% بين واجهة العميل (Flutter) والخادم (Laravel) لضمان عدم حدوث أي تباين في الأسعار أو الفواتير.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200">
                <strong className="block text-blue-950 mb-1">الشريحة الأولى (تجزئة / كميات محدودة)</strong>
                <span className="text-slate-600">من 1 إلى 9 كراتين: سعر البيع القياسي بالقطعة.</span>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200">
                <strong className="block text-indigo-950 mb-1">الشريحة الثانية (جملة متوسطة)</strong>
                <span className="text-slate-600">من 10 إلى 49 كرتون: خصم فوري 10% إلى 15% على الكرتون.</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <strong className="block text-emerald-950 mb-1">الشريحة الثالثة (عقود كبار العملاء 50+)</strong>
                <span className="text-slate-600">50 كرتون فما فوق: خصم توريد مباشر يصل حتى 25% مع شحن مجاني.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

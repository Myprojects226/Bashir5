import React from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Building2,
  PhoneCall,
  ShieldCheck,
  FileText,
  Globe,
  LogOut,
  ChevronLeft,
  Sparkles,
  Award,
  CreditCard,
  Smartphone,
  Download,
  Quote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    isLoggedIn,
    customerType,
    setCustomerType,
    setCurrentView,
    setMainMode,
    logout,
    orders,
    wishlist,
    addresses,
    openAuthModal,
    setIsAuthModalOpen,
    setIsAndroidApkModalOpen,
    setIsBrandIdentityModalOpen,
    showToast
  } = useApp();

  const handleLanguageSwitch = () => {
    showToast('المتجر يدعم العربية بشكل كامل، وقريباً النسخة الإنجليزية بالكامل 🌐', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* If Not Logged In -> Show Prominent Login Card */}
      {!isLoggedIn ? (
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6 text-center relative overflow-hidden border border-blue-800/40">
          <div className="w-16 h-16 bg-blue-600/30 border border-blue-400/40 rounded-3xl flex items-center justify-center mx-auto mb-3 text-blue-200">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black mb-1">أهلاً بك في متجر البشارة</h2>
          <p className="text-xs text-blue-200/90 max-w-md mx-auto mb-5 leading-relaxed">
            سجل دخولك أو أنشئ حساباً جديداً للوصول إلى أسعار كراتين الجملة، متابعة شحناتك، وحفظ عناوين التوصيل في تعز
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            <button
              type="button"
              id="profile-login-btn"
              onClick={() => openAuthModal('login', 'يرجى تسجيل الدخول للوصول إلى حسابك')}
              className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl shadow-md transition-all active:scale-98"
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              id="profile-register-btn"
              onClick={() => openAuthModal('register', 'إنشاء حساب عميل جديد أو تاجر كراتين')}
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-md transition-all active:scale-98"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      ) : (
        /* User Header Profile Card When Logged In */
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 border-4 border-blue-400/50 flex items-center justify-center font-black text-3xl text-white shadow-xl shrink-0">
              {user.name ? user.name[0] : 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-black text-white">{user.name}</h2>
                <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                  {user.customerType === 'retail' && 'عميل أفراد / تجزئة'}
                  {user.customerType === 'wholesale' && 'عميل جملة وكراتين 📦'}
                  {user.customerType === 'commercial' && 'منشأة تجارية B2B 🏢'}
                </span>
                {user.role === 'super_admin' && (
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                    مدير النظام 👑
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-blue-200 mb-3">
                <span className="font-mono" dir="ltr">{user.phone}</span>
                {user.email && <span>• {user.email}</span>}
              </div>

              {/* Loyalty points banner */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs border border-white/10">
                <Award className="w-4 h-4 text-amber-300" />
                <span>نقاط الولاء والمكافآت:</span>
                <strong className="text-amber-300 font-black">240 نقطة</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6 text-center">
        <div
          id="stat-orders"
          onClick={() => setCurrentView('orders')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="text-xl font-black text-blue-900">{orders.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold">طلباتي</div>
        </div>

        <div
          id="stat-favs"
          onClick={() => setCurrentView('favorites')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-400 transition-all"
        >
          <div className="text-xl font-black text-rose-600">{wishlist.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold">المفضلة</div>
        </div>

        <div
          id="stat-addresses"
          onClick={() => setCurrentView('addresses')}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="text-xl font-black text-emerald-600">{addresses.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold">العناوين</div>
        </div>
      </div>

      {/* Android APK Promo Card Banner */}
      <div 
        id="profile-android-apk-banner"
        onClick={() => setIsAndroidApkModalOpen(true)}
        className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between gap-3 border border-emerald-400/30"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-bold shadow-md shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black">تحميل وتثبيت تطبيق الأندرويد (APK)</h4>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Android</span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">تثبيت فوري على الجوال وتوليد ملف APK جاهز للتنزيل</p>
          </div>
        </div>
        <div className="bg-white text-emerald-700 font-bold text-xs px-3 py-2 rounded-xl shadow-xs shrink-0 flex items-center gap-1">
          <Download className="w-3.5 h-3.5" />
          <span>تنزيل</span>
        </div>
      </div>

      {/* Navigation Options List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden mb-6">
        {[
          {
            id: 'orders',
            label: 'سجل الطلبات وتتبع الشحنات',
            desc: 'عرض كافة الفواتير والطلبات السابقة والحالية',
            icon: Package,
            color: 'text-blue-600 bg-blue-50',
            action: () => setCurrentView('orders')
          },
          {
            id: 'addresses',
            label: 'دفتر العناوين ومواقع GPS',
            desc: 'إدارة مواقع التوصيل لمنازلك ومطاعمك',
            icon: MapPin,
            color: 'text-emerald-600 bg-emerald-50',
            action: () => setCurrentView('addresses')
          },
          {
            id: 'wholesale_portal',
            label: 'بوابة أسعار الجملة وحسابات B2B',
            desc: 'حاسبة خصومات الكراتين وعقود التوريد',
            icon: Building2,
            color: 'text-indigo-600 bg-indigo-50',
            action: () => setCurrentView('wholesale_portal')
          },
          {
            id: 'offers',
            label: 'عروض وتخفيضات اليوم',
            desc: 'أحدث كوبونات الخصم والصفقات الحصرية',
            icon: Sparkles,
            color: 'text-amber-600 bg-amber-50',
            action: () => setCurrentView('offers')
          },
          {
            id: 'brand_guide',
            label: 'دليل الهوية والشعارات الرسمية',
            desc: 'الشعار المعتمد، الاقتباسات، لوحة الألوان وأرقام التواصل',
            icon: Quote,
            color: 'text-sky-600 bg-sky-50',
            action: () => setIsBrandIdentityModalOpen(true)
          },
          {
            id: 'contact_us',
            label: 'تواصل معنا ومستودع البشارة',
            desc: 'أرقام خدمة العملاء والموقع المباشر',
            icon: PhoneCall,
            color: 'text-emerald-600 bg-emerald-50',
            action: () => setCurrentView('contact_us')
          }
        ].map(item => (
          <div
            key={item.id}
            id={`profile-nav-${item.id}`}
            onClick={item.action}
            className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.label}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>

      {/* Settings & Info section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden mb-6">
        <div
          id="lang-toggle-row"
          onClick={handleLanguageSwitch}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">لغة التطبيق (Language)</span>
              <p className="text-[10px] text-slate-400">العربية (Arabic) - افتراضي</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">🇸🇦 العربية</span>
        </div>

        <div
          id="terms-privacy-row"
          onClick={() => showToast('متجر البشارة للبلاستيك والمنظفات مسجل رسمياً بالسجل التجاري - تعز، اليمن', 'info')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">الشروط وسياسة الخصوصية</span>
              <p className="text-[10px] text-slate-400">حماية البيانات والضمان وسياسة الاسترجاع</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </div>

        {/* Discrete Admin Link for Store Owner */}
        <div
          id="admin-direct-link-row"
          onClick={() => {
            window.location.hash = '#admin';
            setMainMode('admin');
          }}
          className="p-4 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">بوابة الإدارة ولوحة التحكم (للمسؤولين)</span>
              <p className="text-[10px] text-slate-400">إدارة المنتجات، الطلبات، الأسعار والكوبونات</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md" dir="ltr">#admin 🔐</span>
        </div>
      </div>

      {/* Official Social Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        <a
          href="https://wa.me/967783755055"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xs text-xs font-bold transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          <span>واتساب المبيعات (+967 783 755 055)</span>
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61589413543387"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-xs text-xs font-bold transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>صفحة فيسبوك الرسمية</span>
        </a>
      </div>

      {/* Logout / Switch Account */}
      <button
        type="button"
        id="logout-btn"
        onClick={() => {
          logout();
          setIsAuthModalOpen(true);
        }}
        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج / تبديل الحساب</span>
      </button>
    </div>
  );
};

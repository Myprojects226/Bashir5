import React from 'react';
import { Smartphone, Monitor, Tablet, Shield, Code2, Users, BellRing, Sparkles, Building, ShoppingBag, Quote } from 'lucide-react';
import { useApp, MainMode, DeviceFrameMode } from '../../context/AppContext';
import { CustomerType } from '../../types';

export const TopModeBar: React.FC = () => {
  const {
    mainMode,
    setMainMode,
    deviceFrame,
    setDeviceFrame,
    customerType,
    setCustomerType,
    notifications,
    setCurrentView,
    setIsAndroidApkModalOpen,
    setIsBrandIdentityModalOpen,
    showToast
  } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSimulatePushNotification = () => {
    const pushMessages = [
      {
        title: '📦 تحديث طلبك #10025: المندوب في طريقه إليك!',
        body: 'شاحنة البشارة محملة بكراتين البلاستيك والمنظفات وتقترب من موقعك.',
        type: 'order_status' as const
      },
      {
        title: '🔥 عرض حصري: كرتون مناديل وجه مجاناً مع كل 5 كراتين منظفات',
        body: 'ساري حتى نهاية اليوم لعملاء الجملة والتجزئة.',
        type: 'offer' as const
      },
      {
        title: '✨ توفر مجدداً: كلور مبيض البشارة 4 لتر فائق النقاء',
        body: 'تم استلام دفعة جديدة في مستودع تعز المركزي - بيرباشا.',
        type: 'stock_alert' as const
      }
    ];

    const randomMsg = pushMessages[Math.floor(Math.random() * pushMessages.length)];
    showToast(`🔔 إشعار فوري جديد (FCM): ${randomMsg.title}`, 'info');
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-3 py-2 select-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            id="mode-btn-client"
            onClick={() => {
              setMainMode('client');
              window.location.hash = '';
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              mainMode === 'client'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تطبيق العميل (Store)</span>
          </button>

          <button
            type="button"
            id="mode-btn-admin"
            onClick={() => {
              setMainMode('admin');
              window.location.hash = '#admin';
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              mainMode === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>لوحة تحكم الإدارة (Admin)</span>
          </button>

          <button
            type="button"
            id="mode-btn-arch"
            onClick={() => {
              setMainMode('architecture');
              window.location.hash = '#architecture';
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              mainMode === 'architecture'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>كود Backend & Flutter & MySQL</span>
          </button>
        </div>

        {/* Right controls: Customer Type & Frame & Notifications */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Customer Pricing Tier Simulator */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" />
              نوع العميل:
            </span>
            <select
              id="customer-type-selector"
              value={customerType}
              onChange={e => {
                const val = e.target.value as CustomerType;
                setCustomerType(val);
                showToast(
                  val === 'retail'
                    ? 'تم التبديل إلى أسعار التجزئة (أفراد)'
                    : val === 'wholesale'
                    ? 'تم تفعيل أسعار الجملة والكراتين! 📦'
                    : 'تم تفعيل أسعار العقود التجارية B2B! 🏢',
                  'success'
                );
              }}
              className="bg-slate-900 border border-slate-600 text-white text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              <option value="retail">👤 عميل تجزئة (عادي)</option>
              <option value="wholesale">📦 عميل جملة (كراتين)</option>
              <option value="commercial">🏢 عميل تجاري B2B</option>
            </select>
          </div>

          {/* Device Frame (Only for Client Mode) */}
          {mainMode === 'client' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
              <button
                type="button"
                id="frame-mobile"
                onClick={() => setDeviceFrame('mobile')}
                title="عرض شاشة الجوال (Flutter Mobile)"
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceFrame === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="frame-tablet"
                onClick={() => setDeviceFrame('tablet')}
                title="عرض شاشة التابلت"
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceFrame === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="frame-desktop"
                onClick={() => setDeviceFrame('desktop')}
                title="عرض متجر الويب بالكامل"
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceFrame === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Brand Identity button */}
          <button
            type="button"
            id="top-bar-brand-guide-btn"
            onClick={() => setIsBrandIdentityModalOpen(true)}
            className="flex items-center gap-1 bg-sky-800 hover:bg-sky-700 text-sky-200 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs border border-sky-600/40"
            title="دليل هوية البشارة والشعار والاقتباسات الرسمية"
          >
            <Quote className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">الهوية والشعارات</span>
          </button>

          {/* Android APK download modal button */}
          <button
            type="button"
            id="top-bar-android-apk-btn"
            onClick={() => setIsAndroidApkModalOpen(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-black px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs border border-emerald-400/40"
            title="تحويل وبناء تطبيق الأندرويد APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
            <span>تطبيق الأندرويد (APK)</span>
          </button>

          {/* FCM Push Notification Trigger button */}
          <button
            type="button"
            id="fcm-simulator-btn"
            onClick={handleSimulatePushNotification}
            className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs"
            title="محاكاة إشعار FCM للمتجر"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إشعار تجريبي FCM</span>
          </button>
        </div>
      </div>
    </div>
  );
};

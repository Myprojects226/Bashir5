import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  ShoppingBag,
  Heart,
  Package,
  Layers,
  Sparkles,
  PhoneCall,
  Smartphone,
  Download,
  Quote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlBisharaLogo } from '../common/AlBisharaLogo';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedAddress,
    notifications,
    user,
    isLoggedIn,
    openAuthModal,
    setIsAuthModalOpen,
    setIsAndroidApkModalOpen,
    setIsBrandIdentityModalOpen,
    searchQuery,
    setSearchQuery,
    addRecentSearch,
    cartCount,
    wishlist,
    customerType
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      addRecentSearch(localSearch.trim());
      setCurrentView('search');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-blue-900 text-white shadow-md">
      {/* Top micro bar: Location & User & Notifications */}
      <div className="border-b border-blue-800/80 px-3 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Location Picker Trigger */}
          <button
            type="button"
            id="header-location-btn"
            onClick={() => setCurrentView('addresses')}
            className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white bg-blue-800/60 hover:bg-blue-800 px-2.5 py-1.5 rounded-xl transition-colors max-w-[220px] sm:max-w-xs truncate"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span className="text-[11px] text-blue-200">التوصيل إلى:</span>
            <span className="font-bold truncate">
              {selectedAddress ? `${selectedAddress.city} - ${selectedAddress.district}` : 'تحديد الموقع GPS'}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-300 shrink-0" />
          </button>

          {/* Right Action Icons: Notification & Profile & Android App & Brand Identity */}
          <div className="flex items-center gap-2">
            {/* Brand Guide & Slogans Button */}
            <button
              type="button"
              id="header-brand-guide-btn"
              onClick={() => setIsBrandIdentityModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-sky-200 hover:text-white bg-sky-800/60 hover:bg-sky-700 px-2.5 py-1.5 rounded-xl transition-all border border-sky-500/30 shadow-xs"
              title="دليل هوية البشارة والشعار والاقتباسات الرسمية"
            >
              <Quote className="w-3.5 h-3.5 text-sky-300" />
              <span className="font-bold text-[11px] hidden sm:inline">الهوية والشعارات</span>
            </button>

            {/* Android App Button */}
            <button
              type="button"
              id="header-android-apk-btn"
              onClick={() => setIsAndroidApkModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-emerald-700/60 hover:bg-emerald-600 px-2.5 py-1.5 rounded-xl transition-all border border-emerald-500/40 shadow-xs"
              title="تثبيت وتحميل تطبيق الأندرويد APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-extrabold text-[11px]">تطبيق APK</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              id="header-notifications-btn"
              onClick={() => setCurrentView('notifications')}
              className="relative p-1.5 text-blue-100 hover:text-white hover:bg-blue-800 rounded-xl transition-colors"
              aria-label="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-blue-900 animate-pulse" />
              )}
            </button>

            {/* User Profile / Login */}
            <button
              type="button"
              id="header-profile-btn"
              onClick={() => {
                if (isLoggedIn) {
                  setCurrentView('profile');
                } else {
                  openAuthModal('login', 'يرجى تسجيل الدخول للوصول إلى بيانات حسابك وطلباتك');
                }
              }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl transition-all ${
                isLoggedIn
                  ? 'text-blue-100 hover:text-white bg-blue-800/50 hover:bg-blue-800'
                  : 'text-white bg-emerald-600 hover:bg-emerald-500 font-bold shadow-xs'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                {isLoggedIn ? (user.name ? user.name[0] : 'U') : <UserIcon className="w-3 h-3" />}
              </div>
              <span className="font-bold">
                {isLoggedIn ? user.name.split(' ')[0] : 'دخول / حساب جديد'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo & Search & Fast Links */}
      <div className="px-3 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div
            id="brand-logo-container"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="p-1.5 bg-white rounded-2xl shadow-md border-2 border-sky-400 group-hover:scale-105 transition-transform">
              <AlBisharaLogo size="sm" variant="icon" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wide text-white">البشارة</span>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/40">
                  للبلاستيك والمنظفات
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-sky-200 mt-0.5">
                <span className="font-extrabold text-amber-300">"البشارة.. عنوان الجودة"</span>
                <span className="text-blue-300">•</span>
                <span className="text-[10px] text-blue-200">تعز بيرباشا</span>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative flex items-center"
          >
            <input
              type="text"
              id="header-search-input"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="ماذا تبحث عنه؟ (أكواب، مناديل، صابون، أكياس 50 جالون...)"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium py-2.5 pr-10 pl-24 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
            
            <button
              type="submit"
              id="header-search-submit-btn"
              className="absolute left-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
            >
              بحث
            </button>
          </form>

          {/* Quick shortcuts for desktop / tablet */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              id="header-offers-link"
              onClick={() => setCurrentView('offers')}
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-amber-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>عروض اليوم</span>
            </button>

            <button
              type="button"
              id="header-wholesale-link"
              onClick={() => setCurrentView('wholesale_portal')}
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-emerald-400/30"
            >
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>أسعار الجملة B2B</span>
            </button>

            <button
              type="button"
              id="header-apk-download-link"
              onClick={() => setIsAndroidApkModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-emerald-500/20"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تحميل تطبيق الأندرويد APK</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

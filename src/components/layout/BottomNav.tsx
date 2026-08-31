import React from 'react';
import { Home, Grid, ShoppingCart, Heart, User } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, wishlist, isLoggedIn, openAuthModal } = useApp();

  const navItems: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'categories', label: 'الأقسام', icon: Grid },
    { id: 'cart', label: 'السلة', icon: ShoppingCart },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'profile', label: 'حسابي', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          const isCart = item.id === 'cart';
          const isFav = item.id === 'favorites';

          return (
            <button
              key={item.id}
              type="button"
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                if (item.id === 'profile' && !isLoggedIn) {
                  openAuthModal('login', 'يرجى تسجيل الدخول للوصول إلى حسابك وسجل طلباتك');
                  setCurrentView('profile');
                } else {
                  setCurrentView(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-blue-700 font-black'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-blue-600 rounded-full animate-in fade-in zoom-in" />
              )}

              <div className="relative p-1">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-blue-700' : ''}`} />

                {/* Badges */}
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}

                {isFav && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

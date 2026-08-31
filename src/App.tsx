import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { AuthModal } from './components/common/AuthModal';
import { ShareModal } from './components/common/ShareModal';
import { ReviewModal } from './components/common/ReviewModal';
import { AndroidApkModal } from './components/common/AndroidApkModal';
import { BrandIdentityModal } from './components/common/BrandIdentityModal';
import { Toast } from './components/common/Toast';

// Client Views
import { SplashScreen } from './views/client/SplashScreen';
import { OnboardingScreen } from './views/client/OnboardingScreen';
import { HomeScreen } from './views/client/HomeScreen';
import { CategoriesScreen } from './views/client/CategoriesScreen';
import { ProductListScreen } from './views/client/ProductListScreen';
import { ProductDetailsScreen } from './views/client/ProductDetailsScreen';
import { SearchScreen } from './views/client/SearchScreen';
import { CartScreen } from './views/client/CartScreen';
import { CheckoutScreen } from './views/client/CheckoutScreen';
import { OrderSuccessScreen } from './views/client/OrderSuccessScreen';
import { OrderTrackingScreen } from './views/client/OrderTrackingScreen';
import { MyOrdersScreen } from './views/client/MyOrdersScreen';
import { FavoritesScreen } from './views/client/FavoritesScreen';
import { OffersScreen } from './views/client/OffersScreen';
import { WholesalePortalScreen } from './views/client/WholesalePortalScreen';
import { AddressBookScreen } from './views/client/AddressBookScreen';
import { NotificationsScreen } from './views/client/NotificationsScreen';
import { ProfileScreen } from './views/client/ProfileScreen';
import { ContactUsScreen } from './views/client/ContactUsScreen';

// Admin & Arch Views
import { AdminDashboard } from './views/admin/AdminDashboard';
import { ArchitectureView } from './views/arch/ArchitectureView';

const MainContent: React.FC = () => {
  const {
    mainMode,
    setMainMode,
    currentView,
    isAuthModalOpen,
    setIsAuthModalOpen,
    sharingProduct,
    setSharingProduct,
    reviewingProduct,
    setReviewingProduct,
    isAndroidApkModalOpen,
    setIsAndroidApkModalOpen,
    isBrandIdentityModalOpen,
    setIsBrandIdentityModalOpen
  } = useApp();

  // Listen for direct URL parameters / hash / path (e.g. ?admin=true, /admin, or #admin)
  React.useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || hash.includes('/admin') || path.includes('/admin') || search.includes('admin=true') || search.includes('view=admin')) {
        setMainMode('admin');
      } else if (hash === '#architecture' || path.includes('/architecture')) {
        setMainMode('architecture');
      } else {
        setMainMode('client');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, [setMainMode]);

  // If in Admin Mode (accessed directly via URL #admin or ?admin=true)
  if (mainMode === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-['Cairo',sans-serif]">
        <AdminDashboard />
        {/* Modals & Toast */}
        <Toast />
        <AndroidApkModal
          isOpen={isAndroidApkModalOpen}
          onClose={() => setIsAndroidApkModalOpen(false)}
        />
        <BrandIdentityModal
          isOpen={isBrandIdentityModalOpen}
          onClose={() => setIsBrandIdentityModalOpen(false)}
        />
      </div>
    );
  }

  // If in Architecture Blueprint Mode (accessed via #architecture)
  if (mainMode === 'architecture') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-['Cairo',sans-serif]">
        <div className="bg-slate-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="font-bold text-xs sm:text-sm">مخطط وبنية النظام الكاملة (Backend Architecture & APIs)</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setMainMode('client');
              window.location.hash = '';
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
          >
            العودة لمتجر العميل
          </button>
        </div>
        <ArchitectureView />
        <Toast />
        <AndroidApkModal
          isOpen={isAndroidApkModalOpen}
          onClose={() => setIsAndroidApkModalOpen(false)}
        />
        <BrandIdentityModal
          isOpen={isBrandIdentityModalOpen}
          onClose={() => setIsBrandIdentityModalOpen(false)}
        />
      </div>
    );
  }

  // Client Application Flow
  if (currentView === 'splash') {
    return <SplashScreen />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingScreen />;
  }

  const renderClientView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'products':
        return <ProductListScreen />;
      case 'product_details':
        return <ProductDetailsScreen />;
      case 'search':
        return <SearchScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order_success':
        return <OrderSuccessScreen />;
      case 'order_tracking':
        return <OrderTrackingScreen />;
      case 'orders':
        return <MyOrdersScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'wholesale_portal':
        return <WholesalePortalScreen />;
      case 'addresses':
        return <AddressBookScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'contact_us':
        return <ContactUsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const hideHeaderAndBottomNav = currentView === 'checkout' || currentView === 'order_success';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Main Header */}
      {!hideHeaderAndBottomNav && <Header />}

      {/* Main Dynamic View */}
      <main className="flex-1 w-full">
        {renderClientView()}
      </main>

      {/* Bottom Navigation */}
      {!hideHeaderAndBottomNav && <BottomNav />}

      {/* Global Modals & Notifications */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {sharingProduct && (
        <ShareModal
          product={sharingProduct}
          onClose={() => setSharingProduct(null)}
        />
      )}

      {reviewingProduct && (
        <ReviewModal
          product={reviewingProduct}
          onClose={() => setReviewingProduct(null)}
        />
      )}

      <AndroidApkModal
        isOpen={isAndroidApkModalOpen}
        onClose={() => setIsAndroidApkModalOpen(false)}
      />

      <BrandIdentityModal
        isOpen={isBrandIdentityModalOpen}
        onClose={() => setIsBrandIdentityModalOpen(false)}
      />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

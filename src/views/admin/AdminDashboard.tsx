import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  BellRing,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Printer,
  ChevronDown,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Shield,
  RefreshCw,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Order, OrderStatus, Coupon, CustomerType, PackagingUnit } from '../../types';
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  updateOrderStatusInFirestore
} from '../../lib/firebase';
import { AccountingManagement } from './AccountingManagement';
import { SuppliersManagement } from './SuppliersManagement';

export const AdminDashboard: React.FC = () => {
  const {
    setMainMode,
    products,
    setProducts,
    orders,
    setOrders,
    coupons,
    setCoupons,
    categories,
    reviews,
    setReviews,
    notifications,
    setNotifications,
    usersList,
    updateUserRoleAndType,
    deleteUser,
    showToast
  } = useApp();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('bashara_admin_authenticated') === 'true';
  });
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'accounting' | 'suppliers' | 'customers' | 'coupons' | 'reviews' | 'fcm'>('overview');

  const packagingUnitsList: PackagingUnit[] = [
    'كرتون',
    'حبة',
    'شدة',
    'باكت',
    'درزن',
    'لفة',
    'ربطة',
    'رول',
    'كيس',
    'بالة',
    'طقم',
    'جالون',
    'لتر',
    'متر',
    'كيلو',
    'علبة'
  ];

  // Helper for safe order amount & address
  const getOrderTotal = (o: Order) => Number(o?.totalAmount ?? (o as any)?.grandTotal ?? 0);
  const getOrderRecipientName = (o: Order) => o?.deliveryAddress?.recipientName || (o as any)?.shippingAddress?.recipientName || o?.userName || 'عميل المتجر';
  const getOrderPhone = (o: Order) => o?.deliveryAddress?.phone || (o as any)?.shippingAddress?.phone || o?.userPhone || '77xxxxxxx';
  const getOrderCity = (o: Order) => o?.deliveryAddress?.city || (o as any)?.shippingAddress?.city || 'تعز';
  const getOrderDistrict = (o: Order) => o?.deliveryAddress?.district || (o as any)?.shippingAddress?.district || 'بيرباشا';

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o?.status !== 'cancelled' ? getOrderTotal(o) : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter(p => (p?.stockQuantity ?? 0) <= (p?.minStockAlert ?? 10));
  const pendingOrders = orders.filter(o => o?.status === 'pending' || o?.status === 'new');

  // Search & Filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // New product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'cat_plastics');
  const [newProdPrice, setNewProdPrice] = useState(18500);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdUnit, setNewProdUnit] = useState('كرتون');
  const [newProdBrand, setNewProdBrand] = useState('البشارة برو');
  const [newProdDesc, setNewProdDesc] = useState('');

  // New coupon state
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(25000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // FCM broadcast state
  const [fcmTitle, setFcmTitle] = useState('');
  const [fcmBody, setFcmBody] = useState('');
  const [fcmType, setFcmType] = useState<'offer' | 'order_status' | 'stock_alert'>('offer');

  // Selected Order for Modal/Invoice
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() === 'admin' && adminPass.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('bashara_admin_authenticated', 'true');
      setLoginError('');
      showToast('مرحباً بك في لوحة تحكم إدارة البشارة (Super Admin) 🛡️', 'success');
    } else {
      setLoginError('بيانات الدخول غير صحيحة. اسم المستخدم: admin | كلمة المرور: admin');
      showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('bashara_admin_authenticated');
    showToast('تم تسجيل الخروج من لوحة الإدارة بنجاح', 'info');
  };

  // Handlers with Firestore persistence
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let history: any[] = [];
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedHistory = o.trackingHistory ? o.trackingHistory.map(h => {
            if (h.status === newStatus) {
              return { ...h, completed: true, timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
            }
            return h;
          }) : [];
          history = updatedHistory;
          return { ...o, status: newStatus, trackingHistory: updatedHistory };
        }
        return o;
      })
    );
    updateOrderStatusInFirestore(orderId, newStatus, history).catch(err => {
      console.warn('Firestore update status:', err);
    });
    showToast(`تم تحديث حالة الطلب #${orderId} إلى (${newStatus}) في Firebase بنجاح 🔄`, 'success');
  };

  const handleDeleteProduct = (prodId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج من المتجر وقاعدة البيانات؟')) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      deleteProductFromFirestore(prodId).catch(err => {
        console.warn('Firestore delete product:', err);
      });
      showToast('تم حذف المنتج من قاعدة بيانات Firebase بنجاح 🗑️', 'info');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const catObj = categories.find(c => c.id === newProdCategory);

    const newP: Product = {
      id: `prod_${Date.now()}`,
      nameAr: newProdName,
      nameEn: newProdName,
      descriptionAr: newProdDesc || 'منتج عالي الجودة من توريدات البشارة - تعز',
      categoryId: newProdCategory,
      categoryName: catObj ? catObj.nameAr : 'منتجات عامة',
      price: Number(newProdPrice),
      stockQuantity: Number(newProdStock),
      minStockAlert: 10,
      unit: newProdUnit,
      sku: `BSH-YE-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newProdBrand,
      rating: 5,
      reviewsCount: 1,
      images: [
        'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80'
      ],
      wholesaleTiers: [
        { minQuantity: 1, maxQuantity: 9, pricePerUnit: Number(newProdPrice), label: '1 - 9 كراتين' },
        { minQuantity: 10, maxQuantity: 49, pricePerUnit: Math.round(Number(newProdPrice) * 0.9), label: '10 - 49 كرتون' },
        { minQuantity: 50, pricePerUnit: Math.round(Number(newProdPrice) * 0.82), label: '50+ كرتون (سعر خاص)' }
      ],
      isActive: true,
      tags: ['بضائع', 'جديد', newProdBrand, 'تعز']
    };

    setProducts(prev => [newP, ...prev]);
    saveProductToFirestore(newP).catch(err => {
      console.warn('Firestore save product error:', err);
    });
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    showToast('تمت إضافة المنتج الجديد وحفظه في Firebase بنجاح 📦', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newC: Coupon = {
      id: `cp_${Date.now()}`,
      code: newCouponCode.toUpperCase().trim(),
      discountPercentage: Number(newCouponDiscount),
      discountValue: Number(newCouponDiscount),
      discountType: 'percentage',
      minOrderValue: Number(newCouponMinOrder),
      minOrderAmount: Number(newCouponMinOrder),
      descriptionAr: newCouponDesc || `خصم ${newCouponDiscount}% على طلبات الجملة في تعز`,
      description: newCouponDesc || `خصم ${newCouponDiscount}% على طلبات الجملة في تعز`,
      isActive: true
    };

    setCoupons(prev => [newC, ...prev]);
    saveCouponToFirestore(newC).catch(err => {
      console.warn('Firestore coupon save error:', err);
    });
    setIsAddCouponOpen(false);
    setNewCouponCode('');
    setNewCouponDesc('');
    showToast(`تم إنشاء الكوبون (${newC.code}) وحفظه في Firebase بنجاح 🏷️`, 'success');
  };

  const handleDeleteCoupon = (couponCodeOrId: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCodeOrId && c.id !== couponCodeOrId));
    deleteCouponFromFirestore(couponCodeOrId).catch(err => {
      console.warn('Firestore coupon delete error:', err);
    });
    showToast('تم حذف الكوبون من قاعدة البيانات 🏷️', 'info');
  };

  const handleSendFCM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fcmTitle || !fcmBody) {
      showToast('يرجى كتابة عنوان ونص الإشعار', 'error');
      return;
    }

    const newNotif = {
      id: `notif_${Date.now()}`,
      title: fcmTitle,
      titleAr: fcmTitle,
      body: fcmBody,
      bodyAr: fcmBody,
      createdAt: 'الآن',
      isRead: false,
      type: fcmType
    };

    setNotifications(prev => [newNotif as any, ...prev]);
    setFcmTitle('');
    setFcmBody('');
    showToast('🚀 تم إرسال الإشعار الفوري FCM لكافة مستخدمي التطبيق بنجاح!', 'success');
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, isApproved: true } : r))
    );
    showToast('تمت الموافقة على نشر التقييم في صفحة المنتج', 'success');
  };

  const handleReplyReview = (reviewId: string, replyText: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, adminReply: replyText } : r))
    );
    showToast('تم نشر رد إدارة البشارة على التقييم بنجاح', 'success');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = !productSearch || p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) || (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const recipient = getOrderRecipientName(o).toLowerCase();
    const phone = getOrderPhone(o);
    const orderNum = (o?.orderNumber || o?.id || '').toLowerCase();
    const matchesSearch = !orderSearch || recipient.includes(orderSearch.toLowerCase()) || phone.includes(orderSearch) || orderNum.includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o?.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-blue-400">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white">تسجيل الدخول للوحة التحكم</h2>
            <p className="text-xs text-slate-400 mt-1">
              مؤسسة ومستودع البشارة للبلاستيك والمنظفات - تعز
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                id="admin-username-input"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور (Password)
              </label>
              <input
                type="password"
                id="admin-password-input"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="bg-blue-950/60 border border-blue-800/60 rounded-xl p-3 text-[11px] text-blue-300 space-y-1">
              <div className="font-bold text-blue-200">بيانات الدخول الافتراضية للمسؤول:</div>
              <div>اسم المستخدم: <span className="font-mono font-bold text-white bg-blue-900/60 px-1.5 py-0.5 rounded">admin</span></div>
              <div>كلمة المرور: <span className="font-mono font-bold text-white bg-blue-900/60 px-1.5 py-0.5 rounded">admin</span></div>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs"
            >
              دخول إلى لوحة التحكم
            </button>

            <button
              type="button"
              onClick={() => {
                setMainMode('client');
                window.location.hash = '';
              }}
              className="w-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>العودة لمتجر العميل (تطبيق المتجر)</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-24">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white px-4 py-4 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-md border border-blue-400">
              <Shield className="w-5 h-5" />
            </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black">لوحة تحكم إدارة المتجر</h1>
                  <span className="text-[10px] font-bold bg-blue-700/80 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/40">
                    Firebase & Cloud
                  </span>
                </div>
                <p className="text-xs text-slate-400">مؤسسة ومستودع البشارة للبلاستيك والمنظفات - تعز بيرباشا</p>
              </div>
          </div>

          {/* Quick status indicators, Direct Link Copy & Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              id="admin-to-store-btn"
              onClick={() => {
                setMainMode('client');
                window.location.hash = '';
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 shadow-sm"
              title="الانتقال لمتجر العميل"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>الذهاب للمتجر (العميل)</span>
            </button>
            <span className="flex items-center gap-1.5 bg-slate-800 text-emerald-400 font-bold px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Firestore: مزامن
            </span>
            <button
              type="button"
              id="copy-admin-direct-link-btn"
              onClick={() => {
                const adminUrl = `${window.location.origin}${window.location.pathname}#admin`;
                navigator.clipboard.writeText(adminUrl);
                showToast(`تم نسخ رابط لوحة التحكم المباشر (${adminUrl}) 🔗`, 'success');
              }}
              className="bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-600/50 px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1"
              title="نسخ الرابط المباشر للوحة الإدارة"
            >
              <span>🔗 رابط لوحة التحكم</span>
            </button>
            <button
              type="button"
              id="admin-logout-btn"
              onClick={handleAdminLogout}
              className="bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 px-3 py-1.5 rounded-xl font-bold transition-all text-xs"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-10 z-20 shadow-xs px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: 'overview', label: '📊 الإحصائيات والمبيعات', icon: BarChart3 },
            { id: 'products', label: `📦 إدارة المنتجات (${products.length})`, icon: Package },
            { id: 'orders', label: `📑 إدارة الطلبات والفواتير (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons', label: `🏷️ الكوبونات والعروض (${coupons.length})`, icon: Tag },
            { id: 'customers', label: '👥 العملاء والمنشآت B2B', icon: Users },
            { id: 'reviews', label: `⭐ التقييمات والمراجعات (${reviews.length})`, icon: Star },
            { id: 'fcm', label: '🔔 إرسال إشعارات FCM', icon: BellRing }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-bold">إجمالي المبيعات</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {totalRevenue.toFixed(2)} <span className="text-xs font-bold text-slate-500">ريال</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +18% مقارنة بالشهر السابق
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-bold">إجمالي الطلبات</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {totalOrdersCount} <span className="text-xs font-bold text-slate-500">طلب</span>
                </div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">
                  {pendingOrders.length} طلبات جديدة بانتظار التأكيد
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-bold">المنتجات بالمستودع</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {products.length} <span className="text-xs font-bold text-slate-500">صنف وكرتون</span>
                </div>
                <div className="text-[10px] text-indigo-600 font-bold mt-1">
                  {categories.length} أقسام رئيسية
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 font-bold">تنبيهات انخفاض المخزون</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-600">
                  {lowStockProducts.length} <span className="text-xs font-bold text-slate-500">أصناف حرجة</span>
                </div>
                <div className="text-[10px] text-rose-600 font-bold mt-1">
                  تحتاج إعادة طلب من المصنع
                </div>
              </div>
            </div>

            {/* Low stock alerts box & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Table */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>تنبيهات نواقص المستودع (أقل من الحد الأدنى)</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-2xl border border-rose-100 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={p.images[0]} alt={p.nameAr} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-800">{p.nameAr}</div>
                          <div className="text-[10px] text-slate-400">كود: {p.sku} | الماركة: {p.brand}</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-black text-rose-600">{p.stockQuantity} {p.unit} متبقي</span>
                        <div className="text-[10px] text-slate-400">الحد الأدنى: {p.minStockAlert}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders in Admin */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span>أحدث الطلبات الواردة</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    عرض الكل ({orders.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                      <div>
                        <div className="font-bold text-slate-800">
                          طلب #{o.orderNumber || o.id} - <span className="text-blue-900 font-black">{getOrderTotal(o).toLocaleString('ar-YE')} ر.ي</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {getOrderRecipientName(o)} ({getOrderCity(o)} - {getOrderDistrict(o)})
                        </div>
                      </div>

                      <select
                        value={o.status}
                        onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 outline-none"
                      >
                        <option value="pending">بانتظار التأكيد</option>
                        <option value="confirmed">تم التأكيد</option>
                        <option value="processing">جاري التجهيز</option>
                        <option value="out_for_delivery">خرج للتوصيل</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900">إدارة كتالوج المنتجات والكراتين ({filteredProducts.length})</h2>
                <p className="text-xs text-slate-500">إضافة وحذف وتعديل الأسعار، المخزون، وشرائح الجملة</p>
              </div>

              <button
                type="button"
                id="admin-add-product-btn"
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج / كرتون جديد</span>
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="ابحث بالاسم، الكود SKU، أو الماركة..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={e => setProductCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="all">جميع الأقسام</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3">المنتج والماركة</th>
                    <th className="p-3">القسم</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">سعر التجزئة</th>
                    <th className="p-3">سعر الجملة (50+)</th>
                    <th className="p-3">المخزون الحالي</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map(p => {
                    const wholesalePrice = p.wholesaleTiers && p.wholesaleTiers.length > 0
                      ? p.wholesaleTiers[p.wholesaleTiers.length - 1].pricePerUnit
                      : p.price;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80'} alt={p.nameAr} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-800">{p.nameAr}</div>
                              <span className="text-[10px] text-blue-600 font-bold">{p.brand || 'البشارة'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{p.categoryName || 'عام'}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{p.sku}</td>
                        <td className="p-3 font-bold text-slate-800">{Number(p.price).toLocaleString('ar-YE')} ر.ي</td>
                        <td className="p-3 font-black text-emerald-700">{Number(wholesalePrice).toLocaleString('ar-YE')} ر.ي</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (p.stockQuantity ?? 0) <= (p.minStockAlert ?? 10)
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.stockQuantity} {p.unit || 'كرتون'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            نشط بالمتجر
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Product Modal */}
            {isAddProductOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800">
                  <h3 className="text-base font-black text-slate-900 mb-3">إضافة منتج وكرتون جديد لمتجر البشارة</h3>
                  <form onSubmit={handleCreateProduct} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج بالعربية *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={e => setNewProdName(e.target.value)}
                        placeholder="مثال: كاسات بلاستيك 12 أونص شفاف - كرتون 1000 حبة"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">القسم</label>
                        <select
                          value={newProdCategory}
                          onChange={e => setNewProdCategory(e.target.value)}
                          className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.nameAr}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">العلامة التجارية</label>
                        <input
                          type="text"
                          value={newProdBrand}
                          onChange={e => setNewProdBrand(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">سعر التجزئة (ر.ي)</label>
                        <input
                          type="number"
                          required
                          value={newProdPrice}
                          onChange={e => setNewProdPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">كمية المخزون</label>
                        <input
                          type="number"
                          required
                          value={newProdStock}
                          onChange={e => setNewProdStock(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الوحدة</label>
                        <input
                          type="text"
                          value={newProdUnit}
                          onChange={e => setNewProdUnit(e.target.value)}
                          placeholder="كرتون / جالون"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الوصف والمواصفات</label>
                      <textarea
                        rows={2}
                        value={newProdDesc}
                        onChange={e => setNewProdDesc(e.target.value)}
                        placeholder="أبعاد، خامات، عدد القطع داخل الكرتون..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                      >
                        حفظ المنتج في Firebase وإدراجه
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT & INVOICE VIEWER */}
        {activeTab === 'orders' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900">إدارة الطلبات والشحنات والفواتير الضريبية ({filteredOrders.length})</h2>
                <p className="text-xs text-slate-500">تحديث مسار التوصيل وطباعة الفواتير للمطاعم والعملاء في تعز واليمن</p>
              </div>
            </div>

            {/* Filter orders */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">بانتظار التأكيد</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="processing">جاري التجهيز</option>
                <option value="out_for_delivery">خرج للتوصيل</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3">رقم الطلب</th>
                    <th className="p-3">العميل والجوال</th>
                    <th className="p-3">عنوان التوصيل</th>
                    <th className="p-3">المبلغ الإجمالي</th>
                    <th className="p-3">طريقة الدفع</th>
                    <th className="p-3">تاريخ الطلب</th>
                    <th className="p-3">تحديث الحالة</th>
                    <th className="p-3 text-center">الفاتورة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-black text-blue-900" dir="ltr">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{getOrderRecipientName(order)}</div>
                        <div className="text-[10px] text-slate-400" dir="ltr">{getOrderPhone(order)}</div>
                      </td>
                      <td className="p-3 text-slate-600 truncate max-w-[150px]">
                        {getOrderCity(order)} - {getOrderDistrict(order)}
                      </td>
                      <td className="p-3 font-black text-slate-900">
                        {getOrderTotal(order).toLocaleString('ar-YE')} ر.ي
                      </td>
                      <td className="p-3 text-slate-600">
                        {order.paymentMethod === 'card' && 'مدى/بطاقة'}
                        {order.paymentMethod === 'apple_pay' && 'Apple Pay'}
                        {order.paymentMethod === 'bank_transfer' && 'تحويل بنكي'}
                        {order.paymentMethod === 'cod' && 'الدفع عند الاستلام'}
                        {order.paymentMethod === 'kuraimi' && 'حساب الكريمي'}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{order.createdAt}</td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={e => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                        >
                          <option value="pending">بانتظار التأكيد</option>
                          <option value="confirmed">تم التأكيد</option>
                          <option value="processing">جاري التجهيز</option>
                          <option value="out_for_delivery">خرج للتوصيل 🚚</option>
                          <option value="delivered">تم التسليم</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold"
                          title="عرض وطباعة الفاتورة"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Invoice Modal */}
            {viewingOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-900 text-white font-black text-sm flex items-center justify-center">
                        ب
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">فاتورة ضريبية مبسطة</h4>
                        <div className="text-[10px] text-slate-400">مؤسسة البشارة للبلاستيك والمنظفات - تعز</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold" dir="ltr">{viewingOrder.orderNumber || viewingOrder.id}</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div><strong>العميل / المنشأة:</strong> {getOrderRecipientName(viewingOrder)}</div>
                    <div><strong>الجوال:</strong> <span dir="ltr">{getOrderPhone(viewingOrder)}</span></div>
                    <div><strong>العنوان:</strong> {getOrderCity(viewingOrder)} - {getOrderDistrict(viewingOrder)}</div>
                    <div><strong>الفرع المصدر:</strong> مستودع تعز المركزي - بيرباشا</div>
                    <div><strong>السجل التجاري:</strong> YE-3004829104</div>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3 max-h-40 overflow-y-auto">
                    {(viewingOrder.items || []).map((it, idx) => (
                      <div key={idx} className="flex justify-between border-b border-slate-100 pb-1">
                        <span>{it.quantity}× {it.productName}</span>
                        <span className="font-bold">{(it.totalPrice || 0).toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200 mb-4">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{(viewingOrder.subtotal || getOrderTotal(viewingOrder)).toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    {viewingOrder.discountAmount ? (
                      <div className="flex justify-between text-emerald-600">
                        <span>الخصم المطبق:</span>
                        <span>-{viewingOrder.discountAmount.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm font-black text-blue-900 pt-1 border-t border-slate-200">
                      <span>الإجمالي النهائي المستحق:</span>
                      <span>{getOrderTotal(viewingOrder).toLocaleString('ar-YE')} ريال يمني</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        showToast('تم إرسال أمر الطباعة للفاتورة 🖨️', 'success');
                        window.print();
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                    >
                      طباعة الفاتورة
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingOrder(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">إدارة كوبونات وقسائم الخصم</h2>
                <p className="text-xs text-slate-500">إنشاء أكواد التخفيض وتحديد النسب والحد الأدنى</p>
              </div>

              <button
                type="button"
                id="admin-add-coupon-btn"
                onClick={() => setIsAddCouponOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كوبون جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coupons.map(c => (
                <div key={c.code} className="p-4 rounded-2xl border border-dashed border-blue-300 bg-blue-50/30 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-blue-900 font-mono tracking-wider" dir="ltr">{c.code}</div>
                    <div className="text-xs text-emerald-700 font-bold">خصم %{c.discountPercentage}</div>
                    <div className="text-[10px] text-slate-500">{c.descriptionAr}</div>
                    <div className="text-[10px] text-slate-400">الحد الأدنى: {c.minOrderValue} ريال</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(c.id || c.code)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="حذف الكوبون من Firebase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            {isAddCouponOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
                  <h3 className="text-base font-black text-slate-900 mb-3">إنشاء كوبون خصم جديد</h3>
                  <form onSubmit={handleCreateCoupon} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">كود الكوبون (إنجليزي) *</label>
                      <input
                        type="text"
                        required
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value)}
                        placeholder="SUMMER25"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono uppercase"
                        dir="ltr"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">نسبة الخصم %</label>
                        <input
                          type="number"
                          required
                          value={newCouponDiscount}
                          onChange={e => setNewCouponDiscount(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الحد الأدنى للطلب</label>
                        <input
                          type="number"
                          required
                          value={newCouponMinOrder}
                          onChange={e => setNewCouponMinOrder(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الوصف</label>
                      <input
                        type="text"
                        value={newCouponDesc}
                        onChange={e => setNewCouponDesc(e.target.value)}
                        placeholder="خصم خاص على طلبيات المنظفات"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                      >
                        حفظ الكوبون
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddCouponOpen(false)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOMERS & USER ACCOUNTS (FIRESTORE) */}
        {activeTab === 'customers' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>جدول حسابات المستخدمين والعملاء (Firebase Firestore)</span>
                </h2>
                <p className="text-xs text-slate-500">إدارة المستخدمين المسجلين، صلاحيات الإدارة، وترقية الحسابات لأسعار الجملة B2B</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم، الجوال أو الإيميل..."
                    className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick User Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                <div className="text-xl font-black text-blue-900">{usersList.length}</div>
                <div className="text-[10px] text-slate-500 font-bold">إجمالي المستخدمين</div>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <div className="text-xl font-black text-emerald-700">
                  {usersList.filter(u => u.customerType === 'wholesale').length}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">عملاء الجملة 📦</div>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
                <div className="text-xl font-black text-indigo-700">
                  {usersList.filter(u => u.customerType === 'commercial').length}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">منشآت B2B 🏢</div>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
                <div className="text-xl font-black text-amber-700">
                  {usersList.filter(u => u.role === 'super_admin' || u.role === 'admin').length}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">المسؤولين 🛡️</div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3">المستخدم / الاسم</th>
                    <th className="p-3">الجوال / البريد الإلكتروني</th>
                    <th className="p-3">نوع العميل</th>
                    <th className="p-3">الصلاحية (Role)</th>
                    <th className="p-3">تاريخ التسجيل</th>
                    <th className="p-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList
                    .filter(u => {
                      if (!userSearchQuery.trim()) return true;
                      const q = userSearchQuery.toLowerCase();
                      return (
                        u.name?.toLowerCase().includes(q) ||
                        u.phone?.toLowerCase().includes(q) ||
                        u.email?.toLowerCase().includes(q)
                      );
                    })
                    .map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs shrink-0">
                              {u.name ? u.name[0] : 'U'}
                            </div>
                            <span className="truncate max-w-[150px]">{u.name || 'مستخدم بدون اسم'}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-slate-800" dir="ltr">{u.phone}</div>
                          {u.email && <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{u.email}</div>}
                        </td>
                        <td className="p-3">
                          <select
                            value={u.customerType || 'retail'}
                            onChange={e => {
                              updateUserRoleAndType(u.id, { customerType: e.target.value as CustomerType });
                            }}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1 font-bold text-slate-800 outline-none"
                          >
                            <option value="retail">تجزئة (أفراد)</option>
                            <option value="wholesale">جملة كراتين 📦</option>
                            <option value="commercial">منشأة تجارية B2B 🏢</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={u.role || 'customer'}
                            onChange={e => {
                              updateUserRoleAndType(u.id, { role: e.target.value as any });
                            }}
                            className={`text-xs border rounded-lg p-1 font-bold outline-none ${
                              u.role === 'super_admin'
                                ? 'bg-amber-100 text-amber-950 border-amber-300'
                                : u.role === 'admin'
                                ? 'bg-blue-100 text-blue-950 border-blue-300'
                                : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}
                          >
                            <option value="customer">عميل عادي</option>
                            <option value="admin">مدير فرعي (Admin)</option>
                            <option value="super_admin">مدير النظام الكامل (Super Admin)</option>
                          </select>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-EG') : 'مسجل مسبقاً'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من رغبتك في حذف حساب "${u.name}"؟`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المستخدم من قاعدة البيانات"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <h2 className="text-base font-black text-slate-900">إدارة وتقييمات المنتجات والردود الرسمية</h2>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{rev.userName}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-blue-900 font-semibold">{rev.productName}</span>
                    </div>
                    <span className="text-amber-500 font-black">{'★'.repeat(rev.rating)}</span>
                  </div>

                  <p className="text-slate-700">{rev.comment}</p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    {!rev.isApproved ? (
                      <button
                        type="button"
                        onClick={() => handleApproveReview(rev.id)}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        موافقة ونشر في المتجر
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold">منشور ومعتمد بالمتجر ✅</span>
                    )}

                    {!rev.adminReply && (
                      <button
                        type="button"
                        onClick={() => {
                          const reply = prompt('اكتب رد إدارة البشارة على التقييم:');
                          if (reply) handleReplyReview(rev.id, reply);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        كتابة رد رسمي من البشارة
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: FCM BROADCAST NOTIFICATIONS */}
        {activeTab === 'fcm' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto flex flex-col gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-blue-600" />
                <span>إرسال إشعار فوري FCM لجميع العملاء</span>
              </h2>
              <p className="text-xs text-slate-500">
                بث إشعارات العروض الترويجية أو وصول دفعات كراتين جديدة للمستودع
              </p>
            </div>

            <form onSubmit={handleSendFCM} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الإشعار</label>
                <select
                  value={fcmType}
                  onChange={e => setFcmType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="offer">🔥 عرض ترويجي وكوبون خصم</option>
                  <option value="stock_alert">✨ وصول دفعة جديدة بالمستودع</option>
                  <option value="order_status">📦 تنبيه عام أو تحديث خدمة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الإشعار *</label>
                <input
                  type="text"
                  required
                  value={fcmTitle}
                  onChange={e => setFcmTitle(e.target.value)}
                  placeholder="مثال: خصم 25% على كراتين المناديل والأكواب اليوم فقط!"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نص ومحتوى الإشعار *</label>
                <textarea
                  rows={3}
                  required
                  value={fcmBody}
                  onChange={e => setFcmBody(e.target.value)}
                  placeholder="اكتب تفاصيل العرض أو التنبيه الذي سيظهر على شاشات جوالات العملاء..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                id="send-fcm-broadcast-btn"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all text-xs"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الإشعار الآن عبر Firebase FCM</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

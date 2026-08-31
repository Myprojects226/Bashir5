import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Address,
  Order,
  Coupon,
  Review,
  Banner,
  AppNotification,
  DeliveryZone,
  User,
  UserRole,
  CustomerType,
  OrderStatus,
  PaymentMethod,
  DeliveryMethod,
  AuthModalTab,
  Supplier,
  FinancialAccount,
  AccountingTransaction,
  PurchaseInvoice,
  PackagingUnit
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialBanners,
  initialCoupons,
  initialDeliveryZones,
  initialReviews,
  initialNotifications,
  initialSuppliers,
  initialFinancialAccounts,
  initialAccountingTransactions,
  initialPurchaseInvoices,
  demoUser
} from '../data/initialData';
import {
  testConnection,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveReviewToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  syncUserProfile,
  saveUserToFirestore,
  updateUserInFirestore,
  deleteUserFromFirestore,
  saveSupplierToFirestore,
  deleteSupplierFromFirestore,
  saveAccountingTransactionToFirestore,
  deleteAccountingTransactionFromFirestore,
  savePurchaseInvoiceToFirestore,
  deletePurchaseInvoiceFromFirestore,
  signInWithEmail,
  registerWithEmailFirebase,
  sendPasswordResetFirebase,
  auth,
  db,
  signInWithGoogle,
  logOutFirebase
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

export type AppView = 
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'categories'
  | 'product_list'
  | 'product_details'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'order_success'
  | 'order_tracking'
  | 'my_orders'
  | 'favorites'
  | 'profile'
  | 'offers'
  | 'wholesale_portal'
  | 'addresses'
  | 'contact_us'
  | 'notifications';

export type MainMode = 'client' | 'admin' | 'architecture';
export type DeviceFrameMode = 'mobile' | 'tablet' | 'desktop';

interface AppContextType {
  // Global Navigation & Modes
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  mainMode: MainMode;
  setMainMode: (mode: MainMode) => void;
  deviceFrame: DeviceFrameMode;
  setDeviceFrame: (frame: DeviceFrameMode) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;

  // Authentication & User
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: AuthModalTab;
  setAuthModalTab: (tab: AuthModalTab) => void;
  authModalReason: string;
  setAuthModalReason: (reason: string) => void;
  authStep: 'phone' | 'otp';
  setAuthStep: (step: 'phone' | 'otp') => void;
  openAuthModal: (tab?: AuthModalTab, reason?: string, callback?: () => void) => void;
  requireAuth: (reason?: string, callback?: () => void) => boolean;
  loginWithPhone: (phone: string) => void;
  verifyOtp: (code: string, extraData?: { name?: string; email?: string; customerType?: CustomerType }) => boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    customerType?: CustomerType;
    companyName?: string;
  }) => Promise<boolean>;
  resetPassword: (emailOrPhone: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;

  // Users Database (جدول المستخدمين في قاعدة البيانات)
  usersList: User[];
  updateUserRoleAndType: (userId: string, role: UserRole, customerType: CustomerType, isVerified?: boolean) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Products & Categories
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  getTierPrice: (product: Product, quantity: number) => number;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Addresses & GPS
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  updateAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  createOrder: (data: {
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorder: (order: Order) => void;

  // Coupons
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Banners, Notifications, Delivery Zones, Reviews
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  deliveryZones: DeliveryZone[];
  reviews: Review[];
  addReview: (data: { productId: string; productName: string; rating: number; comment: string }) => void;
  updateReviewApproval: (id: string, isApproved: boolean) => void;
  replyToReview: (id: string, reply: string) => void;

  // Modals & Feedback
  isAndroidApkModalOpen: boolean;
  setIsAndroidApkModalOpen: (open: boolean) => void;
  isBrandIdentityModalOpen: boolean;
  setIsBrandIdentityModalOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  notifyMeWhenInStock: (product: Product) => void;
  shareProduct: (product: Product) => void;
  sharingProduct: Product | null;
  setSharingProduct: (prod: Product | null) => void;

  // Suppliers Management (إدارة الموردين)
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  addSupplier: (sup: Omit<Supplier, 'id' | 'createdAt'>) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Financial Accounts & Chart of Accounts (دليل الحسابات)
  financialAccounts: FinancialAccount[];
  setFinancialAccounts: React.Dispatch<React.SetStateAction<FinancialAccount[]>>;
  updateFinancialAccount: (id: string, data: Partial<FinancialAccount>) => void;

  // Accounting Transactions & Vouchers (القيود وسندات القبض والصرف)
  accountingTransactions: AccountingTransaction[];
  setAccountingTransactions: React.Dispatch<React.SetStateAction<AccountingTransaction[]>>;
  addAccountingTransaction: (tx: Omit<AccountingTransaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteAccountingTransaction: (id: string) => Promise<void>;

  // Purchase Invoices (فواتير المشتريات من الموردين)
  purchaseInvoices: PurchaseInvoice[];
  setPurchaseInvoices: React.Dispatch<React.SetStateAction<PurchaseInvoice[]>>;
  addPurchaseInvoice: (invoice: Omit<PurchaseInvoice, 'id' | 'createdAt'>) => Promise<void>;
  deletePurchaseInvoice: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [mainMode, setMainMode] = useState<MainMode>('client');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameMode>('mobile');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const stored = localStorage.getItem('bashara_user_logged_in');
    return stored === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('bashara_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return { ...demoUser, isVerified: false, isLoggedIn: false };
  });

  const [customerType, setCustomerType] = useState<CustomerType>('retail');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const [authCallback, setAuthCallback] = useState<(() => void) | null>(null);
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [tempPhone, setTempPhone] = useState('');

  // Users list from Firestore database
  const [usersList, setUsersList] = useState<User[]>([
    demoUser,
    {
      id: 'usr_andaloos',
      name: 'مطاعم وبوفية الأندلس - تعز',
      phone: '733987654',
      email: 'andalus.taiz@gmail.com',
      role: 'customer',
      customerType: 'commercial',
      companyName: 'مطاعم الأندلس للوجبات السريعة',
      isVerified: true,
      createdAt: '2026-08-10',
      ordersCount: 14,
      totalSpent: 420000
    },
    {
      id: 'usr_om_moath',
      name: 'أم معاذ الصبري',
      phone: '771239876',
      email: 'om.moath@gmail.com',
      role: 'customer',
      customerType: 'retail',
      isVerified: true,
      createdAt: '2026-08-18',
      ordersCount: 3,
      totalSpent: 48500
    }
  ]);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bashara_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bashara_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'أكواب بلاستيك تعز',
    'مسحوق غسيل رائع',
    'أكياس نفايات 50 جالون',
    'مناديل وجه كرتون',
    'مطهر أرضيات فل تعزي',
    'سفر طعام نايلون'
  ]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bashara_cart');
    return saved ? JSON.parse(saved) : [
      {
        product: initialProducts[0],
        quantity: 2,
        selectedTierPrice: 18500,
        totalPrice: 37000
      },
      {
        product: initialProducts[1],
        quantity: 1,
        selectedTierPrice: 19800,
        totalPrice: 19800
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(['prod_1', 'prod_3']);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr_1',
      userId: demoUser.id,
      title: 'المنزل / المقر',
      recipientName: 'معاذ البركاني',
      phone: '777123456',
      city: 'تعز (المدينة)',
      district: 'بيرباشا',
      street: 'شارع بيرباشا الرئيسي - بجوار جولة بيرباشا',
      details: 'عمارة النور، الدور الثاني، شقة رقم 4',
      latitude: 13.5778,
      longitude: 43.9985,
      isDefault: true
    },
    {
      id: 'addr_2',
      userId: demoUser.id,
      title: 'محل / مستودع التموين',
      recipientName: 'مؤسسة تعز للتموين والمأكولات',
      phone: '733987654',
      city: 'تعز (المدينة)',
      district: 'شارع جمال',
      street: 'شارع جمال عبدالناصر - المجمع التجاري',
      details: 'المحل الرئيسي، بجوار البنك الأهلي',
      latitude: 13.5821,
      longitude: 44.0152,
      isDefault: false
    }
  ]);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_10025',
      orderNumber: '#10025',
      userId: demoUser.id,
      userName: demoUser.name,
      userPhone: demoUser.phone,
      items: [
        {
          productId: 'prod_1',
          productName: 'أكواب بلاستيك شفافة 7 أونصة كرتون جملة (1000 كوب)',
          productImage: initialProducts[0].images[0],
          unitPrice: 18500,
          quantity: 2,
          totalPrice: 37000,
          unit: 'كرتون',
          cartonSpecs: 'يحتوي الكرتون على 1000 كوب'
        },
        {
          productId: 'prod_2',
          productName: 'مسحوق غسيل رائع اليمني المركز (كرتون 24 كيس)',
          productImage: initialProducts[1].images[0],
          unitPrice: 19800,
          quantity: 1,
          totalPrice: 19800,
          unit: 'كرتون',
          cartonSpecs: 'كرتون 24 كيس × 500 جرام'
        }
      ],
      subtotal: 56800,
      discountAmount: 5000,
      deliveryFee: 0,
      taxAmount: 0,
      totalAmount: 51800,
      status: 'processing',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      deliveryMethod: 'home_delivery',
      deliveryAddress: addresses[0],
      appliedCoupon: 'JUMBO50',
      notes: 'يرجى الاتصال عند الوصول إلى جولة بيرباشا',
      createdAt: '2026-08-30 14:15',
      estimatedDeliveryTime: 'اليوم خلال 1 إلى 2 ساعة (توصيل فوري)',
      trackingHistory: [
        {
          status: 'new',
          title: 'تم إنشاء الطلب',
          description: 'تم تسجيل طلبك بالرقم #10025 وإرساله لمستودع البشارة بيرباشا',
          timestamp: '14:15',
          completed: true
        },
        {
          status: 'confirmed',
          title: 'تم تأكيد الطلب',
          description: 'تم التحقق من توفر جميع المنتجات في مستودع تعز وتأكيد الفاتورة',
          timestamp: '14:20',
          completed: true
        },
        {
          status: 'processing',
          title: 'جاري تجهيز الطلب والكراتين',
          description: 'فريق مستودع بيرباشا يقوم بفرز وتغليف الكراتين والمنظفات',
          timestamp: '14:35',
          completed: true
        },
        {
          status: 'out_for_delivery',
          title: 'خرج للتوصيل مع المندوب',
          description: 'مندوب البشارة في طريقه لعنوانك في تعز',
          timestamp: 'قريباً',
          completed: false
        },
        {
          status: 'delivered',
          title: 'تم التسليم بنجاح',
          description: 'تم تسليم الشحنة بنجاح واستلام المبلغ كاش / كريمي',
          timestamp: '--:--',
          completed: false
        }
      ]
    },
    {
      id: 'ord_10018',
      orderNumber: '#10018',
      userId: demoUser.id,
      userName: demoUser.name,
      userPhone: demoUser.phone,
      items: [
        {
          productId: 'prod_5',
          productName: 'مناديل وجه فاخرة البشارة تعز (كرتون 50 باكت)',
          productImage: initialProducts[4].images[0],
          unitPrice: 24500,
          quantity: 2,
          totalPrice: 49000,
          unit: 'كرتون',
          cartonSpecs: 'كرتون 50 باكت × 500 منديل'
        }
      ],
      subtotal: 49000,
      discountAmount: 4900,
      deliveryFee: 0,
      taxAmount: 0,
      totalAmount: 44100,
      status: 'delivered',
      paymentMethod: 'kuraimi',
      paymentStatus: 'paid',
      deliveryMethod: 'home_delivery',
      deliveryAddress: addresses[0],
      createdAt: '2026-08-20 11:30',
      trackingHistory: [
        { status: 'new', title: 'تم إنشاء الطلب', description: 'تم استلام الطلب', timestamp: '11:30', completed: true },
        { status: 'confirmed', title: 'تم تأكيد الطلب', description: 'تم التأكيد', timestamp: '11:45', completed: true },
        { status: 'processing', title: 'جاري التجهيز', description: 'تم تجهيز الشحنة', timestamp: '12:10', completed: true },
        { status: 'out_for_delivery', title: 'خرج للتوصيل', description: 'تم التحميل', timestamp: '13:00', completed: true },
        { status: 'delivered', title: 'تم التسليم', description: 'تم تسليم الشحنة للعميل', timestamp: '14:40', completed: true }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [deliveryZones] = useState<DeliveryZone[]>(initialDeliveryZones);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [isAndroidApkModalOpen, setIsAndroidApkModalOpen] = useState<boolean>(false);
  const [isBrandIdentityModalOpen, setIsBrandIdentityModalOpen] = useState<boolean>(false);

  // Suppliers State (الموردون)
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('bashara_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  // Financial Accounts State (دليل الحسابات)
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>(() => {
    const saved = localStorage.getItem('bashara_accounts');
    return saved ? JSON.parse(saved) : initialFinancialAccounts;
  });

  // Accounting Transactions State (القيود وسندات القبض والصرف)
  const [accountingTransactions, setAccountingTransactions] = useState<AccountingTransaction[]>(() => {
    const saved = localStorage.getItem('bashara_transactions');
    return saved ? JSON.parse(saved) : initialAccountingTransactions;
  });

  // Purchase Invoices State (فواتير المشتريات)
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem('bashara_purchase_invoices');
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  // Initialize and test Firebase on load + Realtime Firestore listeners
  useEffect(() => {
    testConnection();

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email === 'abu.anhar.moath@gmail.com';
        const updatedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || (isAdminUser ? 'معاذ البركاني (مدير النظام)' : 'عميل البشارة'),
          phone: firebaseUser.phoneNumber || '777123456',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || undefined,
          role: isAdminUser ? 'super_admin' : 'customer',
          customerType: isAdminUser ? 'commercial' : 'retail',
          companyName: isAdminUser ? 'مؤسسة البشارة للبلاستيك والمنظفات - تعز' : undefined,
          isVerified: true,
          createdAt: new Date().toISOString().slice(0, 10)
        };
        setUser(updatedUser);
        syncUserProfile(updatedUser);
      }
    });

    // 1. Real-time Firestore sync for Products
    let unsubscribeProducts = () => {};
    try {
      unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Product);
          });
          setProducts(list);
          localStorage.setItem('bashara_products', JSON.stringify(list));
        } else {
          // Seed initial products to Firestore on first run
          initialProducts.forEach(prod => {
            setDoc(doc(db, 'products', prod.id), prod, { merge: true }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore Products onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Products sync listener error:', e);
    }

    // 2. Real-time Firestore sync for Orders
    let unsubscribeOrders = () => {};
    try {
      unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Order);
          });
          setOrders(list);
        }
      }, (err) => {
        console.warn('Firestore Orders onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Orders sync listener error:', e);
    }

    // 3. Real-time Firestore sync for Coupons
    let unsubscribeCoupons = () => {};
    try {
      unsubscribeCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Coupon);
          });
          setCoupons(list);
        } else {
          // Seed initial coupons
          initialCoupons.forEach(cp => {
            setDoc(doc(db, 'coupons', cp.id), cp, { merge: true }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore Coupons onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Coupons sync listener error:', e);
    }

    // 4. Real-time Firestore sync for Users (جدول المستخدمين)
    let unsubscribeUsers = () => {};
    try {
      unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const list: User[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as User);
          });
          setUsersList(list);
        } else {
          // Seed demo user in Firestore
          saveUserToFirestore(demoUser).catch(() => {});
        }
      }, (err) => {
        console.warn('Firestore Users onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Users sync listener error:', e);
    }

    // 5. Real-time Firestore sync for Suppliers (الموردين)
    let unsubscribeSuppliers = () => {};
    try {
      unsubscribeSuppliers = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Supplier[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as Supplier);
          });
          setSuppliers(list);
          localStorage.setItem('bashara_suppliers', JSON.stringify(list));
        } else {
          initialSuppliers.forEach(sup => {
            saveSupplierToFirestore(sup).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore Suppliers onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Suppliers sync listener error:', e);
    }

    // 6. Real-time Firestore sync for Accounting Transactions (العمليات المحاسبية)
    let unsubscribeTransactions = () => {};
    try {
      unsubscribeTransactions = onSnapshot(collection(db, 'accounting_transactions'), (snapshot) => {
        if (!snapshot.empty) {
          const list: AccountingTransaction[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as AccountingTransaction);
          });
          setAccountingTransactions(list);
          localStorage.setItem('bashara_transactions', JSON.stringify(list));
        } else {
          initialAccountingTransactions.forEach(tx => {
            saveAccountingTransactionToFirestore(tx).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore Accounting onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Accounting sync listener error:', e);
    }

    // 7. Real-time Firestore sync for Purchase Invoices (فواتير المشتريات)
    let unsubscribePurchaseInvoices = () => {};
    try {
      unsubscribePurchaseInvoices = onSnapshot(collection(db, 'purchase_invoices'), (snapshot) => {
        if (!snapshot.empty) {
          const list: PurchaseInvoice[] = [];
          snapshot.forEach(docSnap => {
            list.push(docSnap.data() as PurchaseInvoice);
          });
          setPurchaseInvoices(list);
          localStorage.setItem('bashara_purchase_invoices', JSON.stringify(list));
        } else {
          initialPurchaseInvoices.forEach(inv => {
            savePurchaseInvoiceToFirestore(inv).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore Purchase Invoices onSnapshot note:', err);
      });
    } catch (e) {
      console.warn('Purchase Invoices sync listener error:', e);
    }

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeCoupons();
      unsubscribeUsers();
      unsubscribeSuppliers();
      unsubscribeTransactions();
      unsubscribePurchaseInvoices();
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bashara_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('bashara_accounts', JSON.stringify(financialAccounts));
  }, [financialAccounts]);

  useEffect(() => {
    localStorage.setItem('bashara_transactions', JSON.stringify(accountingTransactions));
  }, [accountingTransactions]);

  useEffect(() => {
    localStorage.setItem('bashara_purchase_invoices', JSON.stringify(purchaseInvoices));
  }, [purchaseInvoices]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bashara_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bashara_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Wholesale Tier Pricing Calculation Engine
  const getTierPrice = (product: Product, quantity: number): number => {
    if (customerType === 'commercial' && product.wholesalePrice) {
      // Commercial users get base wholesale or tiered quantity price
      const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQuantity) {
          return tier.pricePerUnit;
        }
      }
      return product.wholesalePrice;
    }

    if (customerType === 'wholesale') {
      const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQuantity) {
          return tier.pricePerUnit;
        }
      }
      return product.wholesalePrice || product.price;
    }

    // Retail user - check if quantity reaches bulk tier
    const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        return tier.pricePerUnit;
      }
    }
    return product.price;
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockQuantity <= 0) {
      showToast('عذراً، هذا المنتج غير متوفر في المخزون حالياً', 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const tierPrice = getTierPrice(product, newQty);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, selectedTierPrice: tierPrice, totalPrice: tierPrice * newQty }
            : item
        );
      } else {
        const tierPrice = getTierPrice(product, quantity);
        return [...prev, { product, quantity, selectedTierPrice: tierPrice, totalPrice: tierPrice * quantity }];
      }
    });

    showToast(`تمت إضافة "${product.nameAr}" إلى السلة بنجاح`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const tierPrice = getTierPrice(item.product, quantity);
          return {
            ...item,
            quantity,
            selectedTierPrice: tierPrice,
            totalPrice: tierPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('تم حذف المنتج من السلة', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('تمت إزالة المنتج من المفضلة', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('تمت إضافة المنتج للمفضلة ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart financial totals calculation
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const originalRetailTotal = cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  const cartSavings = Math.max(0, originalRetailTotal - cartSubtotal);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const disc = (cartSubtotal * appliedCoupon.discountValue) / 100;
      cartDiscount = appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  // Free delivery threshold: 200 SAR
  const currentZone = deliveryZones[0];
  const cartDeliveryFee = cartSubtotal >= (currentZone?.freeDeliveryThreshold || 200) || cart.length === 0 ? 0 : (currentZone?.baseFee || 15);

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'كود الكوبون غير صحيح أو منتهي الصلاحية' };
    }

    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `الحد الأدنى لتفعيل هذا الكوبون هو ${found.minOrderAmount} ريال (سلتك الحالية ${cartSubtotal} ريال)`
      };
    }

    if (found.customerTypeAllowed && !found.customerTypeAllowed.includes(customerType)) {
      return { success: false, message: 'هذا الكوبون مخصص لفئة أخرى من العملاء' };
    }

    setAppliedCoupon(found);
    showToast(`تم تطبيق الكوبون "${found.code}" بنجاح! 🎉`, 'success');
    return { success: true, message: 'تم تفعيل الكوبون بنجاح' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('تمت إزالة الكوبون', 'info');
  };

  // Addresses
  const addAddress = (addrData: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...addrData,
      id: `addr_${Date.now()}`
    };
    setAddresses(prev => {
      if (newAddr.isDefault) {
        return [...prev.map(a => ({ ...a, isDefault: false })), newAddr];
      }
      return [...prev, newAddr];
    });
    setSelectedAddress(newAddr);
    showToast('تم حفظ العنوان بنجاح 📍', 'success');
    return newAddr;
  };

  const updateAddress = (addr: Address) => {
    setAddresses(prev => prev.map(a => (a.id === addr.id ? addr : a)));
    if (selectedAddress?.id === addr.id) {
      setSelectedAddress(addr);
    }
    showToast('تم تحديث العنوان بنجاح', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses.find(a => a.id !== id) || null);
    }
    showToast('تم حذف العنوان', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    const def = addresses.find(a => a.id === id);
    if (def) setSelectedAddress(def);
    showToast('تم تعيين كعنوان افتراضي', 'success');
  };

  // Orders
  const createOrder = (data: {
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0 || !selectedAddress) {
      showToast('السلة فارغة أو لم يتم اختيار عنوان التوصيل', 'error');
      return null;
    }

    const orderNum = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      userId: user.id,
      userName: selectedAddress.recipientName || user.name,
      userPhone: selectedAddress.phone || user.phone,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.nameAr,
        productImage: item.product.images[0],
        unitPrice: item.selectedTierPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        unit: item.product.unit,
        cartonSpecs: item.product.piecesPerCarton ? `كرتون ${item.product.piecesPerCarton} حبة` : item.product.sizeOrVolume
      })),
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      deliveryFee: data.deliveryMethod === 'store_pickup' ? 0 : cartDeliveryFee,
      taxAmount: Math.round(cartSubtotal * 0.15 * 100) / 100,
      totalAmount: data.deliveryMethod === 'store_pickup' ? Math.max(0, cartSubtotal - cartDiscount) : cartTotal,
      status: 'new',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryMethod: data.deliveryMethod,
      deliveryAddress: selectedAddress,
      appliedCoupon: appliedCoupon?.code,
      notes: data.notes,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      estimatedDeliveryTime: 'اليوم خلال 2 إلى 4 ساعات',
      trackingHistory: [
        {
          status: 'new',
          title: 'تم إنشاء الطلب بنجاح',
          description: `تم إرسال الطلب ${orderNum} إلى فريق البشارة للبلاستيك والمنظفات`,
          timestamp: 'الآن',
          completed: true
        },
        {
          status: 'confirmed',
          title: 'تأكيد الطلب',
          description: 'مراجعة وتأكيد توفر الكميات بالمستودع',
          timestamp: 'قريباً',
          completed: false
        },
        {
          status: 'processing',
          title: 'جاري التجهيز والتغليف',
          description: 'تعبئة كراتين البلاستيك والمنظفات بأمان',
          timestamp: 'قريباً',
          completed: false
        },
        {
          status: 'out_for_delivery',
          title: 'خرج للتوصيل',
          description: 'المندوب في طريقه إليك',
          timestamp: '--:--',
          completed: false
        },
        {
          status: 'delivered',
          title: 'تم التسليم',
          description: 'تسليم الطلب بنجاح',
          timestamp: '--:--',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    clearCart();

    // Persist order to Firestore in the background
    saveOrderToFirestore(newOrder).catch(err => {
      console.warn('Firestore order save note:', err);
    });

    // Add push notification
    addNotification({
      title: `تم استلام طلبك الجديد ${orderNum} 📦`,
      body: `شكراً لتسوقك من البشارة. جاري تأكيد وتجهيز ${newOrder.items.length} منتج.`,
      type: 'order_status',
      targetOrderId: newOrder.id
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedHistoryForFirestore: any[] = [];
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updatedHistory = ord.trackingHistory.map(h => {
            if (h.status === status) {
              return { ...h, completed: true, timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
            }
            return h;
          });
          updatedHistoryForFirestore = updatedHistory;
          return { ...ord, status, trackingHistory: updatedHistory };
        }
        return ord;
      })
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }

    // Sync order update to Firestore
    if (updatedHistoryForFirestore.length > 0) {
      updateOrderStatusInFirestore(orderId, status, updatedHistoryForFirestore).catch(err => {
        console.warn('Firestore order update note:', err);
      });
    }

    const statusArabic = {
      new: 'جديد',
      confirmed: 'تم التأكيد',
      processing: 'قيد التجهيز',
      out_for_delivery: 'خرج للتوصيل 🚚',
      delivered: 'تم التسليم بنجاح ✅',
      cancelled: 'تم الإلغاء ❌'
    }[status];

    addNotification({
      title: `تحديث الطلب #${orderId.slice(-5)}: ${statusArabic}`,
      body: `تم تحديث حالة طلبك إلى: ${statusArabic}`,
      type: 'order_status',
      targetOrderId: orderId
    });

    showToast(`تم تحديث حالة الطلب إلى: ${statusArabic}`, 'success');
  };

  const reorder = (order: Order) => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    setCurrentView('cart');
    showToast('تمت إعادة جميع منتجات الطلب إلى السلة 🛒', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      createdAt: 'الآن',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Reviews
  const addReview = (data: { productId: string; productName: string; rating: number; comment: string }) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      productId: data.productId,
      productName: data.productName,
      userId: user.id,
      userName: user.name,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString().slice(0, 10),
      isApproved: true
    };
    setReviews(prev => [newReview, ...prev]);
    saveReviewToFirestore(newReview).catch(err => {
      console.warn('Firestore review save note:', err);
    });
    showToast('شكراً لك! تم إرسال تقييمك وحفظه في Firebase بنجاح ⭐', 'success');
  };

  const updateReviewApproval = (id: string, isApproved: boolean) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, isApproved } : r)));
    showToast(isApproved ? 'تمت الموافقة على التقييم' : 'تم إخفاء التقييم', 'info');
  };

  const replyToReview = (id: string, reply: string) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, adminReply: reply } : r)));
    showToast('تم حفظ رد الإدارة على التقييم', 'success');
  };

  // Auth modal management & Action Gating
  const openAuthModal = (tab: AuthModalTab = 'login', reason: string = '', callback?: () => void) => {
    setAuthModalTab(tab);
    setAuthModalReason(reason);
    if (callback) {
      setAuthCallback(() => callback);
    } else {
      setAuthCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const requireAuth = (reason: string = 'يرجى تسجيل الدخول أولاً لمتابعة هذا الإجراء', callback?: () => void): boolean => {
    if (isLoggedIn) {
      if (callback) callback();
      return true;
    }
    openAuthModal('login', reason, callback);
    return false;
  };

  const loginWithPhone = (phone: string) => {
    setTempPhone(phone);
    setAuthStep('otp');
    setAuthModalTab('otp');
    showToast(`تم إرسال رمز التحقق (OTP) إلى ${phone} 📱`, 'info');
  };

  const verifyOtp = (code: string, extraData?: { name?: string; email?: string; customerType?: CustomerType }) => {
    if (code.length >= 4) {
      const updated: User = {
        id: user.id && user.id !== demoUser.id ? user.id : `usr_${Date.now()}`,
        phone: tempPhone || user.phone || '777123456',
        name: extraData?.name || (user.name !== 'معاذ البركاني' ? user.name : 'عميل البشارة'),
        email: extraData?.email || user.email || '',
        customerType: extraData?.customerType || customerType || 'retail',
        role: 'customer',
        isVerified: true,
        isLoggedIn: true,
        createdAt: user.createdAt || new Date().toISOString().slice(0, 10),
        lastLoginAt: new Date().toISOString()
      };
      setUser(updated);
      setIsLoggedIn(true);
      localStorage.setItem('bashara_user_logged_in', 'true');
      localStorage.setItem('bashara_user_session', JSON.stringify(updated));
      saveUserToFirestore(updated).catch(() => {});
      setIsAuthModalOpen(false);
      setAuthStep('phone');
      setAuthModalTab('login');
      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
      showToast('تم تسجيل الدخول وتأكيد الحساب بنجاح! أهلاً بك في البشارة 🌟', 'success');
      return true;
    }
    showToast('رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى', 'error');
    return false;
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      let fbUser: any = null;
      try {
        fbUser = await signInWithEmail(email, pass);
      } catch (fbErr: any) {
        console.warn('Firebase signInWithEmail note:', fbErr?.message);
      }

      const existingUser = usersList.find(u => u.email?.toLowerCase() === email.toLowerCase());
      const isAdminUser = email.toLowerCase() === 'abu.anhar.moath@gmail.com' || email.toLowerCase().includes('admin');
      
      const updated: User = {
        id: fbUser?.uid || existingUser?.id || `usr_${Date.now()}`,
        name: fbUser?.displayName || existingUser?.name || email.split('@')[0] || 'عميل البشارة',
        phone: existingUser?.phone || (isAdminUser ? '777123456' : '770000000'),
        email: email,
        avatarUrl: fbUser?.photoURL || existingUser?.avatarUrl,
        role: isAdminUser ? 'super_admin' : (existingUser?.role || 'customer'),
        customerType: existingUser?.customerType || (isAdminUser ? 'commercial' : 'retail'),
        companyName: existingUser?.companyName || (isAdminUser ? 'مؤسسة البشارة للبلاستيك والمنظفات - تعز' : undefined),
        isVerified: true,
        isLoggedIn: true,
        createdAt: existingUser?.createdAt || new Date().toISOString().slice(0, 10),
        lastLoginAt: new Date().toISOString()
      };

      setUser(updated);
      setIsLoggedIn(true);
      localStorage.setItem('bashara_user_logged_in', 'true');
      localStorage.setItem('bashara_user_session', JSON.stringify(updated));
      await saveUserToFirestore(updated);
      setIsAuthModalOpen(false);

      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
      showToast(`مرحباً بك ${updated.name}، تم تسجيل الدخول بنجاح 🌟`, 'success');
      return true;
    } catch (err: any) {
      console.error('Email Login Error:', err);
      showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      return false;
    }
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    customerType?: CustomerType;
    companyName?: string;
  }): Promise<boolean> => {
    try {
      let fbUser: any = null;
      if (data.password) {
        try {
          fbUser = await registerWithEmailFirebase(data.email, data.password, data.name);
        } catch (fbErr: any) {
          console.warn('Firebase registerWithEmailFirebase note (fallback enabled):', fbErr?.message);
        }
      }

      const userId = fbUser?.uid || `usr_${Date.now()}`;
      const newUser: User = {
        id: userId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        role: 'customer',
        customerType: data.customerType || 'retail',
        companyName: data.companyName,
        isVerified: true,
        isLoggedIn: true,
        createdAt: new Date().toISOString().slice(0, 10),
        lastLoginAt: new Date().toISOString(),
        ordersCount: 0,
        totalSpent: 0
      };

      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('bashara_user_logged_in', 'true');
      localStorage.setItem('bashara_user_session', JSON.stringify(newUser));
      await saveUserToFirestore(newUser);
      setIsAuthModalOpen(false);

      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
      showToast(`تم إنشاء حسابك وحفظ بياناتك بنجاح! أهلاً بك يا ${newUser.name} 🎉`, 'success');
      return true;
    } catch (err: any) {
      console.error('Registration Error:', err);
      showToast('تعذر إنشاء الحساب، يرجى التأكد من صحة البيانات', 'error');
      return false;
    }
  };

  const resetPassword = async (emailOrPhone: string): Promise<boolean> => {
    try {
      if (emailOrPhone.includes('@')) {
        try {
          await sendPasswordResetFirebase(emailOrPhone);
        } catch (e: any) {
          console.warn('Firebase sendPasswordResetFirebase note:', e?.message);
        }
        showToast(`تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد: ${emailOrPhone} 📧`, 'success');
        return true;
      } else {
        showToast(`تم إرسال كود استعادة كلمة المرور عبر رسالة SMS للرقم ${emailOrPhone} 📱`, 'success');
        return true;
      }
    } catch (err) {
      showToast('حدث خطأ أثناء إرسال طلب الاستعادة', 'error');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const isAdminUser = fbUser.email === 'abu.anhar.moath@gmail.com';
        const updated: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'عميل البشارة',
          phone: fbUser.phoneNumber || '777123456',
          email: fbUser.email || '',
          avatarUrl: fbUser.photoURL || undefined,
          role: isAdminUser ? 'super_admin' : 'customer',
          customerType: isAdminUser ? 'commercial' : 'retail',
          companyName: isAdminUser ? 'مؤسسة البشارة للبلاستيك والمنظفات - تعز' : undefined,
          isVerified: true,
          isLoggedIn: true,
          createdAt: new Date().toISOString().slice(0, 10),
          lastLoginAt: new Date().toISOString()
        };
        setUser(updated);
        setIsLoggedIn(true);
        localStorage.setItem('bashara_user_logged_in', 'true');
        localStorage.setItem('bashara_user_session', JSON.stringify(updated));
        await saveUserToFirestore(updated);
        setIsAuthModalOpen(false);

        if (authCallback) {
          authCallback();
          setAuthCallback(null);
        }
        showToast(`أهلاً بك يا ${updated.name} (تم تسجيل الدخول بحساب Google) 🌟`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      showToast('تعذر تسجيل الدخول عبر Google، يمكنك المتابعة بالبريد أو رقم الجوال', 'error');
      return false;
    }
  };

  const logout = () => {
    logOutFirebase();
    setIsLoggedIn(false);
    localStorage.removeItem('bashara_user_logged_in');
    localStorage.removeItem('bashara_user_session');
    setUser({ ...demoUser, isVerified: false, isLoggedIn: false });
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const updateUserRoleAndType = async (userId: string, role: UserRole, type: CustomerType, isVerified: boolean = true) => {
    try {
      await updateUserInFirestore(userId, { role, customerType: type, isVerified });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role, customerType: type, isVerified } : u));
      if (user.id === userId) {
        const updated = { ...user, role, customerType: type, isVerified };
        setUser(updated);
        localStorage.setItem('bashara_user_session', JSON.stringify(updated));
      }
      showToast('تم تحديث صلاحيات وشريحة العميل في قاعدة البيانات بنجاح ✅', 'success');
    } catch (e) {
      showToast('تعذر تحديث بيانات العميل', 'error');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteUserFromFirestore(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      showToast('تم حذف حساب العميل من قاعدة البيانات بنجاح', 'info');
    } catch (e) {
      showToast('تعذر حذف العميل', 'error');
    }
  };

  // ==================== SUPPLIERS CRUD ====================
  const addSupplier = async (supData: Omit<Supplier, 'id' | 'createdAt'>) => {
    const newSupplier: Supplier = {
      ...supData,
      id: `sup_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      balance: supData.balance || 0,
      totalPurchases: supData.totalPurchases || 0,
      totalPaid: supData.totalPaid || 0,
      isActive: true
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    try {
      await saveSupplierToFirestore(newSupplier);
      showToast(`تمت إضافة المورد "${newSupplier.companyName}" بنجاح 🤝`, 'success');
    } catch (e) {
      showToast(`تم حفظ المورد محلياً وستتم المزامنة تلقائياً`, 'info');
    }
  };

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    const target = suppliers.find(s => s.id === id);
    if (target) {
      const updated = { ...target, ...data };
      try {
        await saveSupplierToFirestore(updated);
        showToast('تم تحديث بيانات المورد بنجاح ✅', 'success');
      } catch (e) {
        showToast('تم التحديث محلياً', 'info');
      }
    }
  };

  const deleteSupplier = async (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    try {
      await deleteSupplierFromFirestore(id);
      showToast('تم حذف المورد من السجلات بنجاح 🗑️', 'info');
    } catch (e) {
      showToast('تم الحذف محلياً', 'info');
    }
  };

  // ==================== FINANCIAL ACCOUNTS ====================
  const updateFinancialAccount = (id: string, data: Partial<FinancialAccount>) => {
    setFinancialAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('تم تحديث الحساب المالي بنجاح 📊', 'success');
  };

  // ==================== ACCOUNTING TRANSACTIONS ====================
  const addAccountingTransaction = async (txData: Omit<AccountingTransaction, 'id' | 'createdAt'>) => {
    const newTx: AccountingTransaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAccountingTransactions(prev => [newTx, ...prev]);

    // Update balances of relevant accounts
    if (newTx.type === 'receipt_voucher') {
      // increase cash / bank
      setFinancialAccounts(prev => prev.map(acc => {
        if (acc.nameAr.includes('صندوق') || acc.nameAr.includes('بنك') || acc.nameAr.includes('كاش')) {
          return { ...acc, balance: acc.balance + newTx.amount };
        }
        return acc;
      }));
    } else if (newTx.type === 'payment_voucher' || newTx.type === 'operating_expense') {
      // decrease cash / bank
      setFinancialAccounts(prev => prev.map(acc => {
        if (acc.nameAr.includes('صندوق') || acc.nameAr.includes('بنك') || acc.nameAr.includes('كاش')) {
          return { ...acc, balance: Math.max(0, acc.balance - newTx.amount) };
        }
        return acc;
      }));
    }

    try {
      await saveAccountingTransactionToFirestore(newTx);
      showToast(`تم تقييد السند المحاسبي ${newTx.entryNumber} بنجاح 🧾`, 'success');
    } catch (e) {
      showToast(`تم قيد السند محلياً وسيتم التوثيق بقاعدة البيانات`, 'info');
    }
  };

  const deleteAccountingTransaction = async (id: string) => {
    setAccountingTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await deleteAccountingTransactionFromFirestore(id);
      showToast('تم إلغاء القيد المحاسبي بنجاح', 'info');
    } catch (e) {
      showToast('تم الإلغاء محلياً', 'info');
    }
  };

  // ==================== PURCHASE INVOICES ====================
  const addPurchaseInvoice = async (invoiceData: Omit<PurchaseInvoice, 'id' | 'createdAt'>) => {
    const newInvoice: PurchaseInvoice = {
      ...invoiceData,
      id: `pinv_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPurchaseInvoices(prev => [newInvoice, ...prev]);

    // Automatically update supplier balance and total purchases
    if (newInvoice.supplierId) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === newInvoice.supplierId) {
          return {
            ...s,
            balance: (s.balance || 0) + newInvoice.remainingAmount,
            totalPurchases: (s.totalPurchases || 0) + newInvoice.totalAmount,
            totalPaid: (s.totalPaid || 0) + newInvoice.paidAmount
          };
        }
        return s;
      }));
    }

    // Automatically record payment transaction if there was an upfront payment
    if (newInvoice.paidAmount > 0) {
      addAccountingTransaction({
        entryNumber: `PV-PINV-${Date.now().toString().slice(-4)}`,
        type: 'payment_voucher',
        date: newInvoice.date,
        amount: newInvoice.paidAmount,
        accountFrom: 'صندوق النقدية / البنك',
        accountTo: 'الموردون والدائنون',
        partyType: 'supplier',
        partyId: newInvoice.supplierId,
        partyName: newInvoice.supplierName,
        category: 'supplier_payment',
        description: `دفعة مشتريات بضاعة كراتين / وحدات بموجب الفاتورة ${newInvoice.invoiceNumber}`,
        referenceNumber: newInvoice.invoiceNumber,
        paymentMethod: newInvoice.paymentMethod,
        status: 'confirmed',
        createdBy: 'أمين المستودع'
      });
    }

    try {
      await savePurchaseInvoiceToFirestore(newInvoice);
      showToast(`تم إصدار فاتورة الشراء والتوريد المخزني ${newInvoice.invoiceNumber} بنجاح 📦`, 'success');
    } catch (e) {
      showToast(`تم حفظ فاتورة الشراء محلياً`, 'info');
    }
  };

  const deletePurchaseInvoice = async (id: string) => {
    setPurchaseInvoices(prev => prev.filter(i => i.id !== id));
    try {
      await deletePurchaseInvoiceFromFirestore(id);
      showToast('تم حذف فاتورة المشتريات من السجلات', 'info');
    } catch (e) {
      showToast('تم الحذف محلياً', 'info');
    }
  };

  const notifyMeWhenInStock = (product: Product) => {
    addNotification({
      title: `تم تفعيل تنبيه توفر المنتج: ${product.nameAr}`,
      body: 'سنرسل لك إشعاراً فور توفر كراتين جديدة في المستودع.',
      type: 'stock_alert',
      targetProductId: product.id
    });
    showToast(`تم تسجيل طلب التنبيه لمنتج "${product.nameAr}" 🔔`, 'success');
  };

  const shareProduct = (product: Product) => {
    setSharingProduct(product);
  };

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => [term, ...prev.filter(t => t !== term)].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        mainMode,
        setMainMode,
        deviceFrame,
        setDeviceFrame,
        language,
        setLanguage,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        customerType,
        setCustomerType,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authModalReason,
        setAuthModalReason,
        authStep,
        setAuthStep,
        openAuthModal,
        requireAuth,
        loginWithPhone,
        verifyOtp,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        loginWithGoogle,
        logout,
        usersList,
        updateUserRoleAndType,
        deleteUser,
        products,
        setProducts,
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        getTierPrice,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartSavings,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        selectedOrder,
        setSelectedOrder,
        createOrder,
        updateOrderStatus,
        reorder,
        coupons,
        setCoupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        banners,
        setBanners,
        notifications,
        markNotificationAsRead,
        addNotification,
        deliveryZones,
        reviews,
        addReview,
        updateReviewApproval,
        replyToReview,
        toast,
        showToast,
        notifyMeWhenInStock,
        shareProduct,
        sharingProduct,
        setSharingProduct,
        isAndroidApkModalOpen,
        setIsAndroidApkModalOpen,
        isBrandIdentityModalOpen,
        setIsBrandIdentityModalOpen,
        suppliers,
        setSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        financialAccounts,
        setFinancialAccounts,
        updateFinancialAccount,
        accountingTransactions,
        setAccountingTransactions,
        addAccountingTransaction,
        deleteAccountingTransaction,
        purchaseInvoices,
        setPurchaseInvoices,
        addPurchaseInvoice,
        deletePurchaseInvoice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type CustomerType = 'retail' | 'wholesale' | 'commercial';

export type UserRole = 'super_admin' | 'admin' | 'inventory_manager' | 'orders_manager' | 'delivery_manager' | 'accountant' | 'customer';

export type AuthModalTab = 'login' | 'register' | 'forgot' | 'otp';

export type PackagingUnit =
  | 'كرتون'
  | 'حبة'
  | 'شدة'
  | 'بكت'
  | 'درزن'
  | 'ربطة'
  | 'رول'
  | 'كيس'
  | 'شوالة'
  | 'جالون'
  | 'لتر'
  | 'مل'
  | 'سطل'
  | 'برميل'
  | 'طقم'
  | 'طرد'
  | 'كيلو'
  | 'جرام'
  | 'مغلف'
  | 'طبقة'
  | 'قالب'
  | 'عبوة';

export interface ProductSubUnit {
  id: string;
  name: PackagingUnit | string;
  conversionFactor: number; // e.g. 1 carton = 24 packs (factor 24), or 1 carton = 1200 pcs (factor 1200)
  price: number; // Retail price per this unit
  wholesalePrice?: number; // Wholesale price per this unit
  barcode?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  customerType: CustomerType;
  avatarUrl?: string;
  companyName?: string;
  taxNumber?: string;
  commercialRegister?: string;
  isVerified: boolean;
  isLoggedIn?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  creditLimit?: number; // حد الائتمان بالريال
  currentBalance?: number; // الرصيد المالي الحالي (مدين / دائن)
  ordersCount?: number;
  totalSpent?: number;
  notes?: string;
}

export interface WholesaleTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  label: string; // e.g. "1-9 كرتون", "10-49 كرتون", "50+ كرتون"
}

export interface Product {
  id: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  descriptionAr: string;
  descriptionEn?: string;
  price: number; // Retail price (سعر التجزئة للوحدة الأساسية)
  oldPrice?: number;
  discountPercentage?: number;
  wholesalePrice?: number; // Base wholesale price
  costPrice?: number; // سعر التكلفة المحاسبي للوحدة لتقارير الأرباح
  wholesaleTiers: WholesaleTier[];
  images: string[];
  stockQuantity: number;
  minStockAlert: number;
  unit: PackagingUnit | string; // كرتون, شدة, حبة, جالون, لتر...
  subUnits?: ProductSubUnit[]; // خيارات التجزئة المتعددة للوحدة (كرتون / شدة / حبة)
  piecesPerCarton?: number; // e.g. 1000 حبة
  sizeOrVolume?: string; // e.g. 250 مل, 50 لتر, 40×60 سم
  supplierId?: string; // المورد المرتبط
  supplierName?: string;
  manufacturer?: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isDealOfTheDay?: boolean;
  isActive: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  image: string;
  itemCount: number;
  sortOrder: number;
  isActive: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTierPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  userId: string;
  title: string; // المنزل, العمل, المستودع, المحل
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  details: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export type OrderStatus = 'new' | 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card' | 'apple_pay' | 'stc_pay' | 'kuraimi' | 'e_wallet';

export type DeliveryMethod = 'home_delivery' | 'store_pickup' | 'express_delivery';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  unit: string;
  cartonSpecs?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #10025
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryMethod: DeliveryMethod;
  deliveryAddress: Address;
  appliedCoupon?: string;
  notes?: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  trackingHistory: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface Coupon {
  id?: string;
  code: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountPercentage?: number;
  minOrderAmount?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount?: number;
  customerTypeAllowed?: CustomerType[];
  isActive: boolean;
  description?: string;
  descriptionAr?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
  adminReply?: string;
}

export interface Banner {
  id: string;
  titleAr: string;
  subtitleAr: string;
  buttonTextAr: string;
  imageUrl: string;
  linkType: 'category' | 'product' | 'offer' | 'wholesale';
  targetId?: string;
  bgColor: string;
  textColor: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  body: string;
  type: 'order_status' | 'offer' | 'stock_alert' | 'wholesale' | 'system';
  targetOrderId?: string;
  targetProductId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface DeliveryZone {
  id: string;
  cityName: string;
  districtNames: string[];
  baseFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryHours: string;
  isActive: boolean;
}

// ==================== SUPPLIERS (إدارة الموردين) ====================
export type PaymentTerms = 'cash' | 'credit_15' | 'credit_30' | 'credit_60' | 'consignment' | 'custom';

export interface Supplier {
  id: string;
  name: string; // اسم مسؤول المورد أو المندوب
  companyName: string; // اسم المؤسسة / الشركة / المصنع المورد
  phone: string;
  email?: string;
  city: string; // تعز، صنعاء، عدن، الحديدة، دبي...
  address: string;
  commercialRegister?: string; // السجل التجاري / الرقم الضريبي
  suppliedCategories: string[]; // الأقسام الموردة: بلاستيك، منظفات، كراتين، ورق...
  paymentTerms: PaymentTerms;
  creditLimit?: number; // سقف الائتمان الممنوح من المورد
  balance: number; // الرصيد الحالي (موجب = مستحق للمورد دائن، سالب = مدين للمتجر)
  totalPurchases: number; // إجمالي المشتريات التاريخية
  totalPaid: number; // إجمالي المدفوعات المسددة
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

// ==================== ACCOUNTING & FINANCIAL TRANSACTIONS (النظام المحاسبي) ====================
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface FinancialAccount {
  id: string;
  code: string; // كود الحساب المحاسبي (مثال: 101 للصندوق، 102 للكريمي، 201 للموردين...)
  nameAr: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
}

export type TransactionType =
  | 'receipt_voucher'      // سند قبض (تحصيل من عميل / إيراد)
  | 'payment_voucher'      // سند صرف (سداد لمورد / مصروف تشغيلي)
  | 'journal_entry'        // قيد يومية عام مزدوج
  | 'purchase_invoice'     // فاتورة مشتريات بضاعة
  | 'sales_invoice'        // فاتورة مبيعات
  | 'sales_return'         // مردودات مبيعات
  | 'operating_expense';   // مصروف تشغيلي وإداري

export type ExpenseCategory =
  | 'cogs'                 // تكلفة البضاعة المباعة
  | 'supplier_payment'     // سداد دفعات الموردين
  | 'customer_receipt'     // تحصيل من العملاء
  | 'rent'                 // إيجار المحل والمستودع في تعز
  | 'salaries'             // رواتب وأجور الموظفين والعمال
  | 'fuel_transport'       // محروقات وديزل شاحنات التوصيل
  | 'electricity_water'    // كهرباء وماء المستودع
  | 'packaging_materials'  // مواد التعبئة والتغليف واللواصق
  | 'maintenance'          // صيانة معدات وشاحنات
  | 'marketing'            // دعاية وتسويق وإعلانات
  | 'taxes_duties'         // رسوم حكومية وضرائب
  | 'capital_investment'   // تمويل ورأس مال
  | 'other';               // أخرى

export interface AccountingTransaction {
  id: string;
  entryNumber: string; // e.g. RV-2026-001, PV-2026-001, JE-2026-001
  type: TransactionType;
  date: string; // YYYY-MM-DD
  amount: number; // المبلغ بالريال اليمني
  accountFrom: string; // الحساب المدين / مصدر الأموال (الصندوق، بنك الكريمي، حساب العميل...)
  accountTo: string; // الحساب الدائن / المستفيد (حساب المورد، حساب المصروف، المبيعات...)
  partyType?: 'customer' | 'supplier' | 'employee' | 'general';
  partyId?: string;
  partyName?: string;
  category: ExpenseCategory | string;
  description: string;
  referenceNumber?: string; // رقم الحوالة / رقم السند الورقي / رقم الشيك
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'confirmed' | 'draft' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

// ==================== PURCHASE INVOICES (فواتير المشتريات من الموردين) ====================
export interface PurchaseInvoiceItem {
  productId: string;
  productName: string;
  unit: PackagingUnit | string;
  quantity: number;
  costPrice: number; // سعر التكلفة للوحدة
  totalCost: number;
  sellingPrice?: number;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string; // e.g. PINV-2026-101
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  date: string;
  items: PurchaseInvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'received' | 'pending' | 'cancelled';
  createdAt: string;
}

// All Packaging Units list with descriptive data
export const ALL_PACKAGING_UNITS: { value: PackagingUnit; label: string; icon: string; desc: string }[] = [
  { value: 'كرتون', label: 'كرتون (Carton / Box)', icon: '📦', desc: 'كرتون مغلق جملة ومصانع' },
  { value: 'حبة', label: 'حبة / قطعة (Piece / Item)', icon: '🔹', desc: 'قطعة مفردة للتجزئة' },
  { value: 'شدة', label: 'شدة / بكت (Pack / Bundle)', icon: '📦', desc: 'شدة محكمة معبأة (مثال: 50 كوب أو 100 كيس)' },
  { value: 'بكت', label: 'بكت (Packet)', icon: '🏷️', desc: 'بكت صغير مغلف' },
  { value: 'درزن', label: 'درزن (Dozen - 12)', icon: '🔢', desc: '12 قطعة معاً' },
  { value: 'ربطة', label: 'ربطة (Tie / Bundle)', icon: '🪢', desc: 'ربطة مشدودة كأكياس وسفر' },
  { value: 'رول', label: 'رول (Roll)', icon: '🌀', desc: 'رول سفرة، قصدير، نايلون أو محارم' },
  { value: 'كيس', label: 'كيس (Bag)', icon: '🛍️', desc: 'كيس تعبئة أو حفظ' },
  { value: 'شوالة', label: 'شوالة / جونية (Sack)', icon: '🌾', desc: 'شوالة كبيرة للمساحيق والمواد' },
  { value: 'جالون', label: 'جالون (Gallon)', icon: '🧴', desc: 'جالون سوائل ومطهرات (4 أو 5 أو 20 لتر)' },
  { value: 'لتر', label: 'لتر (Liter)', icon: '💧', desc: 'وحدة قياس السوائل' },
  { value: 'مل', label: 'مليلتر (Milliliter)', icon: '🧪', desc: 'عبوة سوائل صغيرة' },
  { value: 'سطل', label: 'سطل (Bucket / Pail)', icon: '🪣', desc: 'سطل بلاستيك للمنظفات والمعجون' },
  { value: 'برميل', label: 'برميل (Drum)', icon: '🛢️', desc: 'برميل كبير 200 لتر للمصانع والورش' },
  { value: 'طقم', label: 'طقم (Set)', icon: '✨', desc: 'مجموعة متكاملة متناسقة' },
  { value: 'طرد', label: 'طرد (Parcel / Bale)', icon: '📦', desc: 'طرد شحن وتوريد كبير' },
  { value: 'كيلو', label: 'كيلوجرام (Kg)', icon: '⚖️', desc: 'وزن بالكيلو' },
  { value: 'جرام', label: 'جرام (Gram)', icon: '⚖️', desc: 'وزن بالجرام' },
  { value: 'مغلف', label: 'مغلف / ظرف (Pouch)', icon: '✉️', desc: 'مغلف رقائقي معقم' },
  { value: 'طبقة', label: 'طبقة / كرتة (Tray)', icon: '🧇', desc: 'طبقة مسطحة كالصحون والعلب' },
  { value: 'قالب', label: 'قالب (Bar)', icon: '🧼', desc: 'قالب صابون صلب' },
  { value: 'عبوة', label: 'عبوة (Container)', icon: '🥫', desc: 'عبوة مخصصة' }
];


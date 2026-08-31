import {
  Product,
  Category,
  Banner,
  Coupon,
  DeliveryZone,
  Review,
  AppNotification,
  User,
  Supplier,
  FinancialAccount,
  AccountingTransaction,
  PurchaseInvoice
} from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat_detergents',
    nameAr: 'المنظفات',
    nameEn: 'Detergents & Cleaners',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=60',
    itemCount: 68,
    sortOrder: 1,
    isActive: true,
    description: 'مساحيق غسيل يمنية، صابون صحون، صابون قوالب روعة، كلور ومطهرات أرضيات برائحة الفل'
  },
  {
    id: 'cat_plastic',
    nameAr: 'البلاستيك',
    nameEn: 'Plastics & Nylon',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=500&auto=format&fit=crop&q=60',
    itemCount: 52,
    sortOrder: 2,
    isActive: true,
    description: 'أكواب عصير، كاسات شاي، علب تعبئة، صحون بلاستيك وسفر طعام متينة بجميع المقاسات'
  },
  {
    id: 'cat_paper',
    nameAr: 'الورقيات',
    nameEn: 'Paper Products',
    icon: 'Scroll',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500&auto=format&fit=crop&q=60',
    itemCount: 38,
    sortOrder: 3,
    isActive: true,
    description: 'مناديل وجه ناعمة، رول مطبخ، مناديل رول جامبو للمطاعم والمنازل والمكاتب في تعز'
  },
  {
    id: 'cat_kitchen',
    nameAr: 'أدوات المطبخ',
    nameEn: 'Kitchen & Packaging Tools',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60',
    itemCount: 32,
    sortOrder: 4,
    isActive: true,
    description: 'قصدير ألومنيوم ثقيل، نايلون تغليف حراري، ورق زبدة، وقفازات نايلون ولاتكس'
  },
  {
    id: 'cat_houseware',
    nameAr: 'الأدوات المنزلية',
    nameEn: 'Household Cleaning Tools',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60',
    itemCount: 35,
    sortOrder: 5,
    isActive: true,
    description: 'مساحات أرضية دوارة، سطول عصر يمنية قوية، مكانس وخراطيم تنظيف'
  },
  {
    id: 'cat_bags',
    nameAr: 'الأكياس',
    nameEn: 'Bags & Trash Liners',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500&auto=format&fit=crop&q=60',
    itemCount: 44,
    sortOrder: 6,
    isActive: true,
    description: 'أكياس نايلون علاقي يمنية، أكياس حفظ طعام، وأكياس نفايات براميل ثقيلة ومقاومة للتمزق'
  },
  {
    id: 'cat_fresheners',
    nameAr: 'المعطرات',
    nameEn: 'Fresheners & Oud',
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500&auto=format&fit=crop&q=60',
    itemCount: 24,
    sortOrder: 7,
    isActive: true,
    description: 'معطرات جو فندقية، بخور عدني، عود ملكي ومعطرات مفارش تدوم طويلاً'
  },
  {
    id: 'cat_sponges',
    nameAr: 'الإسفنج واللياف',
    nameEn: 'Sponges & Scrubbers',
    icon: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=60',
    itemCount: 20,
    sortOrder: 8,
    isActive: true,
    description: 'سلك ستانلس ستيل قوي، إسفنج جلي عالي التحمل للمطابخ والمطاعم'
  },
  {
    id: 'cat_restaurants',
    nameAr: 'مستلزمات المطاعم',
    nameEn: 'Restaurant Supplies',
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60',
    itemCount: 58,
    sortOrder: 9,
    isActive: true,
    description: 'صحون قصدير للمندي، علب فلين، أكواب شاي كرك، ملاعق مغلفة ورول فواتير'
  },
  {
    id: 'cat_hotels',
    nameAr: 'مستلزمات الفنادق',
    nameEn: 'Hotel Supplies',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60',
    itemCount: 28,
    sortOrder: 10,
    isActive: true,
    description: 'أرواب وشامبوهات وصابون فندقي صغير، أكياس غسيل ومعقمات غرف وبطاقات نظافة'
  },
  {
    id: 'cat_companies',
    nameAr: 'مستلزمات الشركات',
    nameEn: 'Company & Office Supplies',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60',
    itemCount: 19,
    sortOrder: 11,
    isActive: true,
    description: 'معقمات مكتبية، محارم ورقية جامبو، أكياس أرشيف وأدوات تنظيف للمؤسسات والشركات'
  },
  {
    id: 'cat_others',
    nameAr: 'أخرى',
    nameEn: 'Other Supplies',
    icon: 'MoreHorizontal',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    itemCount: 22,
    sortOrder: 12,
    isActive: true,
    description: 'مستحضرات تجميل مختارة، مستلزمات صالونات، وعروض موسمية متنوعة'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    sku: 'BSH-YE-PLS-101',
    nameAr: 'أكواب بلاستيك شفافة 7 أونصة كرتون جملة (1000 كوب)',
    nameEn: 'Clear Plastic Cups 7oz Wholesale Carton (1000 pcs)',
    categoryId: 'cat_plastic',
    categoryName: 'البلاستيك والنايلون',
    brand: 'البشارة تعز',
    descriptionAr: 'أكواب بلاستيكية عالية الجودة والنقاء، مثالية للمياه، العصائر والمشروبات الباردة، مصنعة من مواد أولية آمنة غذائياً 100%. مناسبة للمنازل، البوافي، المطاعم والمناسبات في تعز.',
    price: 18500,
    oldPrice: 22000,
    discountPercentage: 16,
    wholesalePrice: 16500,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 18500, label: '1 - 4 كراتين (تجزئة)' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 16500, label: '5 - 19 كرتون (جملة)' },
      { minQuantity: 20, pricePerUnit: 15200, label: '20+ كرتون (سعر خاص للمحلات)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 350,
    minStockAlert: 40,
    unit: 'كرتون',
    piecesPerCarton: 1000,
    sizeOrVolume: '7 أونصة (200 مل)',
    manufacturer: 'مصنع البشارة للصناعات البلاستيكية - تعز بيرباشا',
    rating: 4.9,
    reviewsCount: 142,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    isActive: true,
    tags: ['أكواب', 'بلاستيك', 'كرتون', 'عصير', 'جملة', 'تعز']
  },
  {
    id: 'prod_2',
    sku: 'BSH-YE-DET-202',
    nameAr: 'مسحوق غسيل رائع اليمني المركز عالي الرغوة (كرتون 24 كيس × 500 جرام)',
    nameEn: 'Raea Yemeni High Foam Laundry Powder Carton (24x500g)',
    categoryId: 'cat_detergents',
    categoryName: 'المنظفات والمطهرات',
    brand: 'رائع اليمني',
    descriptionAr: 'مسحوق الغسيل اليمني الشهير بتركيبته الفائقة لإزالة أصعب البقع والدهون برائحة منعشة تدوم طويلاً. مناسب للغسالات العادية واليدوية والغسيل اليدوي في البيوت والمغاسل.',
    price: 19800,
    oldPrice: 24000,
    discountPercentage: 18,
    wholesalePrice: 17500,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 19800, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 17500, label: '5 - 19 كرتون (سعر البقالات)' },
      { minQuantity: 20, pricePerUnit: 16200, label: '20+ كرتون (سعر المستودع)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 280,
    minStockAlert: 35,
    unit: 'كرتون',
    piecesPerCarton: 24,
    sizeOrVolume: '24 كيس × 500 جرام (12 كجم إجمالي)',
    manufacturer: 'صناعة يمنية متميزة',
    rating: 4.9,
    reviewsCount: 165,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    isActive: true,
    tags: ['مسحوق غسيل', 'رائع', 'يمني', 'منظفات', 'كرتون', 'رغوة']
  },
  {
    id: 'prod_3',
    sku: 'BSH-YE-DET-203',
    nameAr: 'مطهر ومعقم أرضيات البشارة برائحة الفل والياسمين التعزي (جالون 4 لتر)',
    nameEn: 'Al-Bishara Floor Disinfectant Taiz Jasmine 4L',
    categoryId: 'cat_detergents',
    categoryName: 'المنظفات والمطهرات',
    brand: 'البشارة كير',
    descriptionAr: 'مطهر ومعقم فائق الفاعلية برائحة الفل التعزي الطبيعي الزكية، يقضي على البكتيريا والجراثيم ويعطي لمعاناً براقاً للبلاط والرخام والسيراميك يدوم حتى 48 ساعة.',
    price: 6800,
    oldPrice: 8500,
    discountPercentage: 20,
    wholesalePrice: 5600,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 5, pricePerUnit: 6800, label: '1 - 5 جوالين' },
      { minQuantity: 6, maxQuantity: 23, pricePerUnit: 5600, label: 'كرتون 6 جوالين' },
      { minQuantity: 24, pricePerUnit: 4900, label: '24 جالون فما فوق (مستلزمات مطاعم)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 210,
    minStockAlert: 30,
    unit: 'جالون',
    piecesPerCarton: 6,
    sizeOrVolume: '4 لتر مركز',
    manufacturer: 'معامل البشارة للمنظفات - تعز',
    rating: 4.8,
    reviewsCount: 98,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['مطهر', 'أرضيات', 'فل تعزي', 'معقم', 'جالون 4 لتر']
  },
  {
    id: 'prod_4',
    sku: 'BSH-YE-SOAP-204',
    nameAr: 'صابون غسيل قوالب روعة اليمني الأصلي (كرتون 72 حبة)',
    nameEn: 'Rowaa Authentic Yemeni Laundry Soap Bar Carton (72 pcs)',
    categoryId: 'cat_detergents',
    categoryName: 'المنظفات والمطهرات',
    brand: 'روعة اليمني',
    descriptionAr: 'صابون القوالب اليمني التراثي الشهير روعة، بقوة تنظيف فائقة للملابس والأيدي وإزالة الزيوت والشحوم دون أي تهيج للبشرة، خيار البيوت والمغاسل الأول.',
    price: 15400,
    oldPrice: 18000,
    discountPercentage: 14,
    wholesalePrice: 13800,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 15400, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 13800, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 12600, label: '20+ كرتون (محلات الجملة)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1607006314177-3e5e408d6d67?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 190,
    minStockAlert: 25,
    unit: 'كرتون',
    piecesPerCarton: 72,
    sizeOrVolume: '72 قالب × 120 جرام',
    manufacturer: 'صناعة يمنية أصيلة',
    rating: 4.9,
    reviewsCount: 114,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['صابون قوالب', 'روعة', 'غسيل', 'يمني', 'كرتون 72']
  },
  {
    id: 'prod_5',
    sku: 'BSH-YE-PAP-301',
    nameAr: 'مناديل وجه فاخرة البشارة تعز ناعمة الملمس (كرتون 50 باكت × 500 منديل)',
    nameEn: 'Al-Bishara Luxury Facial Tissues Taiz Carton (50 Packs)',
    categoryId: 'cat_paper',
    categoryName: 'الورقيات والمناديل',
    brand: 'البشارة سوفت',
    descriptionAr: 'مناديل ورقية فائقة النعومة والامتصاص 3 طبقات، خالية من المبيضات الضارة، ناعمة جداً على البشرة ومثالية للمنازل، المكاتب، السيارات والمطاعم في تعز والمحافظات.',
    price: 24500,
    oldPrice: 29000,
    discountPercentage: 16,
    wholesalePrice: 21800,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 24500, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 21800, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 19900, label: '20+ كرتون (سعر الجملة الكبرى)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 240,
    minStockAlert: 30,
    unit: 'كرتون',
    piecesPerCarton: 50,
    sizeOrVolume: '500 منديل مفرد للباكت',
    manufacturer: 'مصنع البشارة للمنتجات الورقية - تعز',
    rating: 5.0,
    reviewsCount: 178,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    isActive: true,
    tags: ['مناديل', 'ورقيات', 'وجه', 'كرتون', 'تعز', 'فنادق']
  },
  {
    id: 'prod_6',
    sku: 'BSH-YE-PLS-102',
    nameAr: 'سفرة طعام نايلون سميكة ومطرزة البشارة (رول جامبو 50 مفرش - صناعة تعز الممتازة)',
    nameEn: 'Heavy Duty Printed Table Cover Roll Jumbo (50 Sheets)',
    categoryId: 'cat_plastic',
    categoryName: 'البلاستيك والنايلون',
    brand: 'البشارة برو',
    descriptionAr: 'مفارش سفرة بلاستيكية سميكة ومنقوشة بنقوش عربية، عازلة للسوائل والدهون تماماً ومزودة بخطوط تقطيع سهلة. مثالية للمجالس والولائم ومطاعم السلتة والفتة والشوايات.',
    price: 4500,
    oldPrice: 5500,
    discountPercentage: 18,
    wholesalePrice: 3700,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 9, pricePerUnit: 4500, label: '1 - 9 رولات' },
      { minQuantity: 10, maxQuantity: 39, pricePerUnit: 3700, label: '10 - 39 رول (كرتون 10)' },
      { minQuantity: 40, pricePerUnit: 3200, label: '40+ رول (توريد مطاعم)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 420,
    minStockAlert: 50,
    unit: 'رول',
    piecesPerCarton: 10,
    sizeOrVolume: '100 × 120 سم (50 مفرش)',
    manufacturer: 'مصنع البشارة للبلاستيك - تعز بيرباشا',
    rating: 4.8,
    reviewsCount: 89,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['سفرة', 'مفارش', 'بلاستيك', 'مطاعم', 'عزائم', 'تعز']
  },
  {
    id: 'prod_7',
    sku: 'BSH-YE-BAG-401',
    nameAr: 'أكياس نايلون علاقي يمنية مقاس 3 كرتون شدات (تعبئة محلات وبقالات ومخابز)',
    nameEn: 'Yemeni Retail Shopping Bags Handle Size 3 Carton',
    categoryId: 'cat_bags',
    categoryName: 'الأكياس والنفايات',
    brand: 'البشارة تاف',
    descriptionAr: 'أكياس نايلون علاقي بيضاء متينة ومقاومة للتمزق، مصنعة من خامات بكر ممتازة. مثالية للمخابز، البقالات، محلات الخضار والمطاعم في تعز وبيرباشا.',
    price: 16800,
    oldPrice: 20000,
    discountPercentage: 16,
    wholesalePrice: 14900,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 16800, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 14900, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 13500, label: '20+ كرتون (عقود توريد)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 310,
    minStockAlert: 40,
    unit: 'كرتون',
    piecesPerCarton: 20,
    sizeOrVolume: '20 شدة × 100 كيس',
    manufacturer: 'البشارة للبلاستيك والنايلون - تعز',
    rating: 4.7,
    reviewsCount: 68,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['أكياس نايلون', 'علاقي', 'محلات', 'مخابز', 'جملة']
  },
  {
    id: 'prod_8',
    sku: 'BSH-YE-BAG-402',
    nameAr: 'أكياس نفايات براميل أسود ثقيل 50 جالون (كرتون 150 كيس شديد التحمل)',
    nameEn: 'Heavy Duty Black Trash Bags 50 Gallon (Carton 150 pcs)',
    categoryId: 'cat_bags',
    categoryName: 'الأكياس والنفايات',
    brand: 'البشارة تاف',
    descriptionAr: 'أكياس قمامة براميل كبرى مصنعة بسماكة عالية مقاومة للثقب والتسريب، مناسبة للمستشفيات، الفنادق، المطاعم والمجمعات السكنية والمنازل في تعز.',
    price: 17500,
    oldPrice: 21000,
    discountPercentage: 17,
    wholesalePrice: 15200,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 17500, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 15200, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 13900, label: '20+ كرتون' }
    ],
    images: [
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 180,
    minStockAlert: 25,
    unit: 'كرتون',
    piecesPerCarton: 150,
    sizeOrVolume: '50 جالون (100×120 سم)',
    manufacturer: 'البشارة تاف للبلاستيك - تعز',
    rating: 4.8,
    reviewsCount: 76,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['أكياس نفايات', '50 جالون', 'براميل', 'تحمل عالي', 'تعز']
  },
  {
    id: 'prod_9',
    sku: 'BSH-YE-RST-501',
    nameAr: 'صحون وقصدير ألومنيوم سفري للمندي والشوايات (كرتون 250 صحن مع أغطية كرتون)',
    nameEn: 'Aluminum Foil Food Containers with Lids (Carton 250 pcs)',
    categoryId: 'cat_restaurants',
    categoryName: 'مستلزمات المطاعم والبوافي',
    brand: 'البشارة باك',
    descriptionAr: 'صحون قصدير ألومنيوم سميكة عازلة للحرارة مع أغطية كرتونية محكمة الإغلاق، مثالية لمطاعم المندي والشوايات والمأكولات الشعبية السفرية في تعز.',
    price: 28500,
    oldPrice: 34000,
    discountPercentage: 16,
    wholesalePrice: 25000,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 28500, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 25000, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 22800, label: '20+ كرتون (توريد مطاعم)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 220,
    minStockAlert: 30,
    unit: 'كرتون',
    piecesPerCarton: 250,
    sizeOrVolume: 'مقاس رقم 1 سفري عائلي',
    manufacturer: 'البشارة باك - تعز',
    rating: 4.9,
    reviewsCount: 104,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['صحون قصدير', 'مندي', 'مطاعم', 'سفري', 'ألومنيوم']
  },
  {
    id: 'prod_10',
    sku: 'BSH-YE-DET-205',
    nameAr: 'صابون سائل جلي صحون البشارة ليمون يمني مركز عالي الرغوة (جالون 5 لتر اقتصادي)',
    nameEn: 'Al-Bishara Dishwashing Liquid Lemon 5L Gallon',
    categoryId: 'cat_detergents',
    categoryName: 'المنظفات والمطهرات',
    brand: 'البشارة كلين',
    descriptionAr: 'سائل غسيل صحون فائق الرغوة بخلاصة الليمون الطبيعي، يزيل أصعب دهون المندي والشواء والزيوت بقطرات قليلة دون أن يسبب جفافاً للأيدي.',
    price: 6500,
    oldPrice: 8000,
    discountPercentage: 19,
    wholesalePrice: 5200,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 3, pricePerUnit: 6500, label: '1 - 3 جوالين' },
      { minQuantity: 4, maxQuantity: 15, pricePerUnit: 5200, label: 'كرتون 4 جوالين' },
      { minQuantity: 16, pricePerUnit: 4500, label: '16 جالون فما فوق' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 190,
    minStockAlert: 25,
    unit: 'جالون',
    piecesPerCarton: 4,
    sizeOrVolume: '5 لتر',
    manufacturer: 'البشارة للمنظفات - تعز',
    rating: 4.8,
    reviewsCount: 88,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: true,
    isActive: true,
    tags: ['صابون صحون', 'ليمون', 'جالون 5 لتر', 'رغوة', 'مطاعم']
  },
  {
    id: 'prod_11',
    sku: 'BSH-YE-KIT-601',
    nameAr: 'قصدير ألومنيوم فندقي ثقيل 45 سم × 150 متر مع قطاعة مدمجة',
    nameEn: 'Heavy Duty Aluminum Foil Roll 45cm x 150m with Cutter',
    categoryId: 'cat_kitchen',
    categoryName: 'أدوات المطبخ والتغليف',
    brand: 'البشارة رول',
    descriptionAr: 'رول قصدير سميك شديد التحمل للشواء والأفران وتحضير اللحوم، مزود بقطاعة مدمجة لسهولة وسرعة العمل في مطابخ المطاعم والمنازل.',
    price: 13500,
    oldPrice: 16000,
    discountPercentage: 16,
    wholesalePrice: 11800,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 5, pricePerUnit: 13500, label: '1 - 5 رولات' },
      { minQuantity: 6, maxQuantity: 23, pricePerUnit: 11800, label: 'كرتون 6 رولات' },
      { minQuantity: 24, pricePerUnit: 10500, label: '24 رول فما فوق' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 160,
    minStockAlert: 20,
    unit: 'رول',
    piecesPerCarton: 6,
    sizeOrVolume: '45 سم عرض × 150 متر طول',
    manufacturer: 'البشارة ميتال - تعز',
    rating: 4.8,
    reviewsCount: 72,
    isNew: false,
    isBestSeller: false,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['قصدير', 'ألومنيوم', 'شواء', 'مطبخ', 'مطاعم']
  },
  {
    id: 'prod_12',
    sku: 'BSH-YE-FRS-701',
    nameAr: 'معطر جو ومفارش البشارة رويال عود وبخور عدني (عبوة رشاشة 500 مل)',
    nameEn: 'Al-Bishara Oud & Adeni Bukhoor Air Freshener 500ml',
    categoryId: 'cat_fresheners',
    categoryName: 'المعطرات والبخور',
    brand: 'البشارة للعطور',
    descriptionAr: 'مزيج فاخر من دهن العود والبخور العدني الأصيل والمسك، برائحة يمنية فواحة تدوم طويلاً، آمن تماماً على المفارش والمجالس والستائر.',
    price: 4800,
    oldPrice: 6000,
    discountPercentage: 20,
    wholesalePrice: 3800,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 11, pricePerUnit: 4800, label: '1 - 11 حبة' },
      { minQuantity: 12, maxQuantity: 47, pricePerUnit: 3800, label: 'كرتون درزن (12 حبة)' },
      { minQuantity: 48, pricePerUnit: 3200, label: '48 حبة فما فوق' }
    ],
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 185,
    minStockAlert: 25,
    unit: 'حبة',
    piecesPerCarton: 12,
    sizeOrVolume: '500 مل',
    manufacturer: 'معامل البشارة للعطور - تعز',
    rating: 4.9,
    reviewsCount: 92,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['معطر جو', 'بخور عدني', 'عود', 'مفارش', 'تعز']
  },
  {
    id: 'prod_13',
    sku: 'BSH-YE-DET-206',
    nameAr: 'كلور مبيض ومطهر البشارة الأصلي للملابس والتعقيم (جالون 4 لتر)',
    nameEn: 'Al-Bishara Pure Bleach & Disinfectant Gallon 4L',
    categoryId: 'cat_detergents',
    categoryName: 'المنظفات والمطهرات',
    brand: 'البشارة كلين',
    descriptionAr: 'مبيض ومطهر كلور مركز بنقاء 100% يزيل البقع الصعبة ويعقم الحمامات والأرضيات ويمنح الملابس البيضاء إشراقاً ناصعاً.',
    price: 3600,
    oldPrice: 4500,
    discountPercentage: 20,
    wholesalePrice: 2900,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 5, pricePerUnit: 3600, label: '1 - 5 جوالين' },
      { minQuantity: 6, maxQuantity: 23, pricePerUnit: 2900, label: 'كرتون 6 جوالين' },
      { minQuantity: 24, pricePerUnit: 2400, label: '24 جالون فما فوق' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 230,
    minStockAlert: 30,
    unit: 'جالون',
    piecesPerCarton: 6,
    sizeOrVolume: '4 لتر',
    manufacturer: 'البشارة كلين - تعز',
    rating: 4.7,
    reviewsCount: 58,
    isNew: false,
    isBestSeller: false,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['كلور', 'مبيض', 'مطهر', 'غسيل', 'تعقيم']
  },
  {
    id: 'prod_14',
    sku: 'BSH-YE-HSE-701',
    nameAr: 'ممسحة وسطل عصر ذكي دوار 360 درجة شديد التحمل للمنازل والمحلات',
    nameEn: 'Heavy Duty 360 Spin Mop & Bucket Set',
    categoryId: 'cat_houseware',
    categoryName: 'الأدوات والمستلزمات المنزلية',
    brand: 'البشارة هوم',
    descriptionAr: 'طقم مسح ذكي متطور مع سطل دوار يفصل الماء النظيف وعصارة ستانلس قوية مع 2 غيار مايكروفايبر إضافي لتنظيف فائق السرعة والسهولة.',
    price: 18500,
    oldPrice: 24000,
    discountPercentage: 23,
    wholesalePrice: 15500,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 3, pricePerUnit: 18500, label: '1 - 3 أطقم' },
      { minQuantity: 4, maxQuantity: 11, pricePerUnit: 15500, label: 'كرتون 4 أطقم' },
      { minQuantity: 12, pricePerUnit: 13800, label: '12 طقم فما فوق' }
    ],
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 95,
    minStockAlert: 15,
    unit: 'طقم',
    piecesPerCarton: 4,
    sizeOrVolume: 'سطل 8 لتر + عصا تلسكوبية + 2 غيار',
    manufacturer: 'البشارة للأدوات المنزلية - تعز',
    rating: 4.9,
    reviewsCount: 84,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: true,
    isActive: true,
    tags: ['ممسحة', 'سطل ذكي', 'تنظيف', 'منزل', 'أرضيات']
  },
  {
    id: 'prod_15',
    sku: 'BSH-YE-SPG-801',
    nameAr: 'سلك جلي مواعين ستانلس ستيل جامبو غير قابل للصدأ (كرتون 144 حبة للمطاعم والبيوت)',
    nameEn: 'Stainless Steel Heavy Duty Scourer Carton (144 pcs)',
    categoryId: 'cat_sponges',
    categoryName: 'الإسفنج واللياف',
    brand: 'البشارة باور',
    descriptionAr: 'سلك جلي عالي الكثافة مصنوع من الفولاذ المقاوم للصدأ 100% لإزالة الدهون المحروقة وأوساخ القدور والمقالي والشوايات بسهولة فائقة دون تفتت.',
    price: 12000,
    oldPrice: 15000,
    discountPercentage: 20,
    wholesalePrice: 10200,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 12000, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 10200, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 9200, label: '20+ كرتون (سعر توريد المطاعم)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 170,
    minStockAlert: 25,
    unit: 'كرتون',
    piecesPerCarton: 144,
    sizeOrVolume: '144 حبة مفردة',
    manufacturer: 'البشارة للأدوات والمستلزمات - تعز',
    rating: 4.9,
    reviewsCount: 62,
    isNew: false,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['سلك جلي', 'مواعين', 'ستانلس', 'مطاعم', 'تنظيف']
  },
  {
    id: 'prod_16',
    sku: 'BSH-YE-HTL-901',
    nameAr: 'طقم ضيافة فندقي فاخر (شامبو + شاور جل + صابون معطر 25 جم) كرتون 300 باكت',
    nameEn: 'Luxury Hotel Guest Amenities Set Carton (300 Sets)',
    categoryId: 'cat_hotels',
    categoryName: 'مستلزمات الفنادق',
    brand: 'البشارة رويال',
    descriptionAr: 'مجموعة ضيافة فندقية راقية مخصصة للفنادق والشقق المفروشة في تعز والمحافظات، معبأة ومغلفة بأناقة لحماية المنتجات وإعطاء انطباع فخم للنزلاء.',
    price: 34000,
    oldPrice: 40000,
    discountPercentage: 15,
    wholesalePrice: 29500,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 3, pricePerUnit: 34000, label: '1 - 3 كراتين' },
      { minQuantity: 4, maxQuantity: 11, pricePerUnit: 29500, label: '4 - 11 كرتون' },
      { minQuantity: 12, pricePerUnit: 26800, label: '12+ كرتون (عقود فنادق)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 120,
    minStockAlert: 20,
    unit: 'كرتون',
    piecesPerCarton: 300,
    sizeOrVolume: '300 طقم متكامل',
    manufacturer: 'البشارة للضيافة الفندقية - تعز',
    rating: 5.0,
    reviewsCount: 47,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['فنادق', 'شامبو فندقي', 'صابون صغير', 'ضيافة', 'تعز']
  },
  {
    id: 'prod_17',
    sku: 'BSH-YE-CMP-902',
    nameAr: 'مناديل رول جامبو للمكاتب والشركات والمؤسسات (كرتون 6 رولات ضخمة شديدة الامتصاص)',
    nameEn: 'Commercial Jumbo Roll Paper Towels Carton (6 Jumbo Rolls)',
    categoryId: 'cat_companies',
    categoryName: 'مستلزمات الشركات',
    brand: 'البشارة سوفت',
    descriptionAr: 'رولات ورقية جامبو تجارية متينة وعالية الامتصاص لحوامل التواليت والمطابخ في المؤسسات، الشركات، البنوك والمستشفيات بتعز.',
    price: 18000,
    oldPrice: 22000,
    discountPercentage: 18,
    wholesalePrice: 15600,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 18000, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 15600, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 14200, label: '20+ كرتون (توريد شركات)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 140,
    minStockAlert: 20,
    unit: 'كرتون',
    piecesPerCarton: 6,
    sizeOrVolume: '6 رولات جامبو × 300 متر',
    manufacturer: 'البشارة للمنتجات الورقية - تعز',
    rating: 4.8,
    reviewsCount: 39,
    isNew: false,
    isBestSeller: false,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['شركات', 'جامبو', 'مناديل مكاتب', 'بنوك', 'مؤسسات']
  },
  {
    id: 'prod_18',
    sku: 'BSH-YE-COS-903',
    nameAr: 'مجموعة العناية والتجميل: فازلين طبي نقي + كريم ترطيب اليدين والأظافر (كرتون 24 عبوة)',
    nameEn: 'Pure Medical Petroleum Jelly & Hand Cream Carton (24 pcs)',
    categoryId: 'cat_others',
    categoryName: 'أدوات التجميل والعناية',
    brand: 'البشارة بيوتي',
    descriptionAr: 'فازلين طبي وكريمات ترطيب للبشرة والجفاف عالية الجودة بدون عطور صناعية مهيجة، ممتازة للصالونات والمحلات والصيدليات والمنازل.',
    price: 14500,
    oldPrice: 18000,
    discountPercentage: 19,
    wholesalePrice: 12400,
    wholesaleTiers: [
      { minQuantity: 1, maxQuantity: 4, pricePerUnit: 14500, label: '1 - 4 كراتين' },
      { minQuantity: 5, maxQuantity: 19, pricePerUnit: 12400, label: '5 - 19 كرتون' },
      { minQuantity: 20, pricePerUnit: 11000, label: '20+ كرتون' }
    ],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 115,
    minStockAlert: 15,
    unit: 'كرتون',
    piecesPerCarton: 24,
    sizeOrVolume: '24 عبوة × 250 مل',
    manufacturer: 'البشارة للعناية والتجميل - تعز',
    rating: 4.9,
    reviewsCount: 53,
    isNew: true,
    isBestSeller: true,
    isDealOfTheDay: false,
    isActive: true,
    tags: ['تجميل', 'عناية', 'فازلين', 'ترطيب', 'صالونات']
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'ban_1',
    titleAr: 'البشارة.. عنوان الجودة',
    subtitleAr: 'كل ما تحتاجه بجودة عالية - بلاستيك، منظفات، أدوات تجميل، مستلزمات المطاعم والفنادق | تعز - جولة بيرباشا',
    buttonTextAr: 'تسوق عروض الجملة والكراتين',
    imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1200&auto=format&fit=crop&q=80',
    linkType: 'wholesale',
    bgColor: 'from-blue-900 via-sky-800 to-emerald-900',
    textColor: 'text-white',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'ban_2',
    titleAr: 'منظفات فعالة.. نظافة لا مثيل لها',
    subtitleAr: 'لمعان يدوم بكل سهولة مع أقوى مساحيق الغسيل، الصابون المركز، المعقمات ومطهرات الأرضيات في تعز',
    buttonTextAr: 'تصفح قسم المنظفات',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&auto=format&fit=crop&q=80',
    linkType: 'category',
    targetId: 'cat_detergents',
    bgColor: 'from-sky-900 via-blue-900 to-teal-950',
    textColor: 'text-white',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'ban_3',
    titleAr: 'مستحضرات التجميل.. كل لمسة جمال تبدأ من هنا',
    subtitleAr: 'منتجات مختارة لعناية أجمل - كريمات، زيوت، صابون عناية شخصية وأدوات تجميل أصلية بأسعار منافسة',
    buttonTextAr: 'قسم أدوات التجميل',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
    linkType: 'category',
    targetId: 'cat_personal_care',
    bgColor: 'from-teal-900 via-emerald-900 to-slate-900',
    textColor: 'text-white',
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'ban_4',
    titleAr: 'مستلزمات المطاعم والفنادق والبوافي',
    subtitleAr: 'صحون قصدير للمندي، علب فلين، أكواب ورقية وبلاستيكية، رول فواتير ومناديل سفر متينة بأسعار الجملة',
    buttonTextAr: 'اكتشف مستلزمات المطاعم',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&auto=format&fit=crop&q=80',
    linkType: 'category',
    targetId: 'cat_restaurants',
    bgColor: 'from-slate-950 via-blue-950 to-emerald-950',
    textColor: 'text-white',
    sortOrder: 4,
    isActive: true
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup_1',
    code: 'BASHARA20',
    discountType: 'percentage',
    discountValue: 20,
    discountPercentage: 20,
    minOrderAmount: 25000,
    minOrderValue: 25000,
    maxDiscount: 10000,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usageCount: 234,
    customerTypeAllowed: ['retail', 'wholesale', 'commercial'],
    isActive: true,
    description: 'خصم 20% بحد أقصى 10,000 ر.ي عند الشراء بقيمة 25,000 ر.ي فما فوق',
    descriptionAr: 'خصم 20% بحد أقصى 10,000 ر.ي عند الشراء بقيمة 25,000 ر.ي فما فوق'
  },
  {
    id: 'coup_2',
    code: 'TAIZ10',
    discountType: 'percentage',
    discountValue: 10,
    discountPercentage: 10,
    minOrderAmount: 15000,
    minOrderValue: 15000,
    maxDiscount: 5000,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    usageLimit: 5000,
    usageCount: 890,
    customerTypeAllowed: ['retail', 'wholesale', 'commercial'],
    isActive: true,
    description: 'خصم ترحيبي 10% لأهالي ومحلات تعز واليمن',
    descriptionAr: 'خصم ترحيبي 10% لأهالي ومحلات تعز واليمن'
  },
  {
    id: 'coup_3',
    code: 'JUMBO50',
    discountType: 'fixed',
    discountValue: 5000,
    discountPercentage: 0,
    minOrderAmount: 60000,
    minOrderValue: 60000,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 78,
    customerTypeAllowed: ['wholesale', 'commercial'],
    isActive: true,
    description: 'خصم ثابت 5,000 ر.ي لطلبات الجملة والكراتين التي تتجاوز 60,000 ر.ي',
    descriptionAr: 'خصم ثابت 5,000 ر.ي لطلبات الجملة والكراتين التي تتجاوز 60,000 ر.ي'
  }
];

export const initialDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone_taiz',
    cityName: 'تعز (المدينة)',
    districtNames: ['بيرباشا', 'المسبح', 'شارع جمال', 'الروضة', 'الحصب', 'الجمهوري', 'الدحي', 'عصيفرة', 'صالة', 'المطار القديم', 'كلابة'],
    baseFee: 1500,
    freeDeliveryThreshold: 35000,
    estimatedDeliveryHours: 'خلال 1 إلى 3 ساعات (توصيل فوري من مستودع بيرباشا)',
    isActive: true
  },
  {
    id: 'zone_ibb',
    cityName: 'إب والقاعدة',
    districtNames: ['الظهار', 'المشنة', 'شارع العدين', 'الدائري', 'القاعدة', 'يريم'],
    baseFee: 3500,
    freeDeliveryThreshold: 75000,
    estimatedDeliveryHours: 'خلال 24 ساعة (شحن يومي سريع)',
    isActive: true
  },
  {
    id: 'zone_sanaa',
    cityName: 'صنعاء',
    districtNames: ['حدة', 'الستين', 'الزبيري', 'شميلة', 'الحصبة', 'الأصبحي'],
    baseFee: 4500,
    freeDeliveryThreshold: 100000,
    estimatedDeliveryHours: 'خلال 24 إلى 48 ساعة عبر النقل السريع',
    isActive: true
  },
  {
    id: 'zone_aden',
    cityName: 'عدن',
    districtNames: ['المنصورة', 'الشيخ عثمان', 'كريتر', 'المعلا', 'خور مكسر'],
    baseFee: 4500,
    freeDeliveryThreshold: 100000,
    estimatedDeliveryHours: 'خلال 24 إلى 48 ساعة',
    isActive: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    productName: 'أكواب بلاستيك شفافة 7 أونصة كرتون جملة',
    userId: 'usr_2',
    userName: 'الأستاذ عبدالكريم الشميري (بوفية ومطعم الأندلس - تعز)',
    rating: 5,
    comment: 'جودة ممتازة جداً ونقاء البلاستيك عالي والكرتون وصل سليم ومرتب من فرع بيرباشا. نطلب منهم أسبوعياً لمطاعمنا والأسعار منافسة جداً بالريال اليمني.',
    createdAt: '2026-08-20',
    isApproved: true,
    adminReply: 'شكراً لثقتكم بمتجر ومستودع البشارة في تعز، نسعد دائماً بخدمتكم وتوفير مستلزماتكم بأفضل الأسعار.'
  },
  {
    id: 'rev_2',
    productId: 'prod_2',
    productName: 'مسحوق غسيل رائع اليمني المركز',
    userId: 'usr_3',
    userName: 'أم معاذ (تعز - حي المسبح)',
    rating: 5,
    comment: 'مسحوق رائع ممتاز جداً ورغوته قوية وينظف الملابس البيضاء والملونة برائحة زكية. التوصيل وصل للبيت في نفس اليوم.',
    createdAt: '2026-08-22',
    isApproved: true
  },
  {
    id: 'rev_3',
    productId: 'prod_5',
    productName: 'مناديل وجه فاخرة البشارة تعز',
    userId: 'usr_4',
    userName: 'عصام الصبري (فندق النخيل السياحي - تعز)',
    rating: 5,
    comment: 'مناديل ناعمة وممتازة 3 طبقات، والكرتون يحتوي على 50 باكت بسعر جملة مناسب جداً، خدمة التوصيل سريعة من بيرباشا.',
    createdAt: '2026-08-25',
    isApproved: true
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'تم استلام وتأكيد طلبك #10025 بنجاح! 🎉',
    body: 'جاري الآن تجهيز كراتين البلاستيك والمنظفات في مستودع البشارة المركزي - تعز بيرباشا.',
    type: 'order_status',
    targetOrderId: 'ord_10025',
    createdAt: 'منذ 10 دقائق',
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'عرض خاص لعملاء الجملة والمطاعم في تعز 🚚',
    body: 'احصل على خصم 5,000 ر.ي عند طلب كراتين الجملة بقيمة 60,000 ر.ي فما فوق باستخدام الكود JUMBO50.',
    type: 'offer',
    createdAt: 'منذ ساعتين',
    isRead: false
  },
  {
    id: 'notif_3',
    title: 'وصل حديثاً: صحون قصدير وسفر طعام البشارة الممتازة ✨',
    body: 'تشكيلة جديدة مخصصة للمطاعم والبوافي والبيوت متوفرة الآن في فرع بيرباشا بأسعار الجملة.',
    type: 'wholesale',
    targetProductId: 'prod_9',
    createdAt: 'منذ يوم',
    isRead: true
  }
];

export const demoUser: User = {
  id: 'usr_demo_1',
  name: 'معاذ البركاني',
  phone: '777123456',
  email: 'm.alburkani@albashara.ye',
  role: 'customer',
  customerType: 'retail',
  companyName: 'مؤسسة تعز للتموين والمأكولات',
  taxNumber: 'YE-102938475',
  isVerified: true,
  createdAt: '2025-01-15',
  ordersCount: 9,
  totalSpent: 185000,
  creditLimit: 500000,
  currentBalance: 0
};

// ==================== INITIAL SUPPLIERS (الموردون المعتمدون) ====================
export const initialSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'م. فؤاد الشرجبي',
    companyName: 'شركة تعز الوطنية للبلاستيك والنايلون',
    phone: '771234888',
    email: 'taiz.plastic@yemenpack.com',
    city: 'تعز - منطقة الحوبان الصناعية',
    address: 'الشارع العام - مجمع الصناعات البلاستيكية',
    commercialRegister: 'CR-TZ-98234',
    suppliedCategories: ['cat_plastic', 'cat_bags', 'cat_kitchen'],
    paymentTerms: 'credit_30',
    creditLimit: 5000000,
    balance: 450000, // مستحق للمورد
    totalPurchases: 3200000,
    totalPaid: 2750000,
    notes: 'المورد الرئيسي لأكواب العصائر والعلب البلاستيكية وسفر الطعام',
    isActive: true,
    createdAt: '2025-02-10'
  },
  {
    id: 'sup_2',
    name: 'الحاج صادق المخلافي',
    companyName: 'مصانع الهلال للمنظفات والمطهرات الكيماوية',
    phone: '733456789',
    email: 'alhelal.det@yemen.ye',
    city: 'تعز - بيرباشا',
    address: 'شارع الثلاثين - جوار محطة التوفيق',
    commercialRegister: 'CR-TZ-11409',
    suppliedCategories: ['cat_detergents', 'cat_sponges'],
    paymentTerms: 'credit_15',
    creditLimit: 3000000,
    balance: 280000,
    totalPurchases: 2150000,
    totalPaid: 1870000,
    notes: 'مورد مساحيق الغسيل رائع وصابون قوالب روعة ومطهر الفل التعزي',
    isActive: true,
    createdAt: '2025-03-01'
  },
  {
    id: 'sup_3',
    name: 'أ. وضاح السامعي',
    companyName: 'مؤسسة يمن بيبر لصناعة الورقيات والمناديل',
    phone: '775990011',
    email: 'samie.paper@yemenpaper.com',
    city: 'صنعاء / فرع تعز',
    address: 'شارع جمال - خلف بنك اليمن الدولي',
    commercialRegister: 'CR-YE-55612',
    suppliedCategories: ['cat_paper', 'cat_restaurants'],
    paymentTerms: 'credit_30',
    creditLimit: 4000000,
    balance: 310000,
    totalPurchases: 1980000,
    totalPaid: 1670000,
    notes: 'مورد مناديل الوجه 500 مفرد، ورول المطبخ والجامبو الفندقي',
    isActive: true,
    createdAt: '2025-04-12'
  },
  {
    id: 'sup_4',
    name: 'نبيل سعيد العديني',
    companyName: 'مجموعة التغليف الحديث للأكياس والقصدير',
    phone: '778112233',
    email: 'packmodern@gmail.com',
    city: 'تعز - المسبح',
    address: 'شارع 26 سبتمبر - مبنى النصر',
    commercialRegister: 'CR-TZ-77821',
    suppliedCategories: ['cat_bags', 'cat_kitchen', 'cat_restaurants'],
    paymentTerms: 'cash',
    creditLimit: 1500000,
    balance: 0,
    totalPurchases: 890000,
    totalPaid: 890000,
    notes: 'توريد أكياس القمامة البراميل وقصدير الألومنيوم والملاعق المغلفة',
    isActive: true,
    createdAt: '2025-05-20'
  }
];

// ==================== INITIAL FINANCIAL ACCOUNTS (دليل الحسابات) ====================
export const initialFinancialAccounts: FinancialAccount[] = [
  {
    id: 'acc_101',
    code: '10101',
    nameAr: 'صندوق النقدية الرئيسي (كاش تعز بيرباشا)',
    type: 'asset',
    balance: 1450000,
    currency: 'ريال يمني',
    description: 'النقدية المتوفرة في خزانة الفرع الرئيسي'
  },
  {
    id: 'acc_102',
    code: '10102',
    nameAr: 'حساب بنك الكريمي للتمويل الأصغر الإسلامي',
    type: 'asset',
    balance: 3820000,
    currency: 'ريال يمني',
    description: 'حساب تحويلات الكريمي إكسبرس والتطبيق'
  },
  {
    id: 'acc_103',
    code: '10103',
    nameAr: 'حساب بنك التضامن الإسلامي الدولي',
    type: 'asset',
    balance: 2100000,
    currency: 'ريال يمني',
    description: 'حساب التحويلات البنكية والشيكات'
  },
  {
    id: 'acc_104',
    code: '10104',
    nameAr: 'محفظة ون كاش / جيب / النجم للصرافة',
    type: 'asset',
    balance: 950000,
    currency: 'ريال يمني',
    description: 'المحافظ الإلكترونية وحوالات النجم الفورية'
  },
  {
    id: 'acc_110',
    code: '10201',
    nameAr: 'العملاء والمدينون (حسابات الآجل)',
    type: 'asset',
    balance: 620000,
    currency: 'ريال يمني',
    description: 'مستحقات البشارة لدى عملاء الجملة والمطاعم'
  },
  {
    id: 'acc_120',
    code: '10301',
    nameAr: 'المخزون السلعي للبضائع (بلاستيك ومنظفات)',
    type: 'asset',
    balance: 18450000,
    currency: 'ريال يمني',
    description: 'قيمة بضاعة المستودع بسعر التكلفة'
  },
  {
    id: 'acc_201',
    code: '20101',
    nameAr: 'الموردون والدائنون (التزامات شراء البضائع)',
    type: 'liability',
    balance: 1040000,
    currency: 'ريال يمني',
    description: 'إجمالي المبالغ المستحقة لموردي البلاستيك والمنظفات'
  },
  {
    id: 'acc_301',
    code: '30101',
    nameAr: 'رأس مال مشروع البشارة',
    type: 'equity',
    balance: 25000000,
    currency: 'ريال يمني',
    description: 'رأس المال التشغيلي المستثمر'
  },
  {
    id: 'acc_401',
    code: '40101',
    nameAr: 'إيرادات مبيعات التجزئة والجملة',
    type: 'revenue',
    balance: 7850000,
    currency: 'ريال يمني',
    description: 'إجمالي إيرادات المبيعات المحققة'
  },
  {
    id: 'acc_501',
    code: '50101',
    nameAr: 'تكلفة البضاعة المباعة (COGS)',
    type: 'expense',
    balance: 5120000,
    currency: 'ريال يمني',
    description: 'تكلفة مشتريات البضاعة التي تم بيعها'
  },
  {
    id: 'acc_502',
    code: '50201',
    nameAr: 'مصروفات الإيجار (المستودع والمحل)',
    type: 'expense',
    balance: 450000,
    currency: 'ريال يمني',
    description: 'إيجار فرع ومستودع بيرباشا - تعز'
  },
  {
    id: 'acc_503',
    code: '50301',
    nameAr: 'رواتب وأجور الموظفين ومندوبي التوصيل',
    type: 'expense',
    balance: 620000,
    currency: 'ريال يمني',
    description: 'رواتب العمال وسائقي الشاحنات'
  },
  {
    id: 'acc_504',
    code: '50401',
    nameAr: 'محروقات ونقل وصيانة شاحنات التوصيل',
    type: 'expense',
    balance: 185000,
    currency: 'ريال يمني',
    description: 'ديزل وبنزين لسيارات التوصيل في أحياء تعز'
  },
  {
    id: 'acc_505',
    code: '50501',
    nameAr: 'كهرباء ومياه وخدمات المستودع',
    type: 'expense',
    balance: 95000,
    currency: 'ريال يمني',
    description: 'اشتراك الكهرباء التجارية وتعبئة المياه'
  }
];

// ==================== INITIAL ACCOUNTING TRANSACTIONS (القيود والسندات) ====================
export const initialAccountingTransactions: AccountingTransaction[] = [
  {
    id: 'tx_101',
    entryNumber: 'RV-2026-001',
    type: 'receipt_voucher',
    date: '2026-08-30',
    amount: 148500,
    accountFrom: 'صندوق النقدية الرئيسي',
    accountTo: 'إيرادات مبيعات التجزئة والجملة',
    partyType: 'customer',
    partyName: 'مطاعم وبوفية الأندلس - تعز',
    category: 'customer_receipt',
    description: 'سند قبض قيمة طلب كراتين كاسات شاي وسفر طعام #10026 نقداً',
    referenceNumber: 'REC-9941',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: '2026-08-30T10:30:00',
    createdBy: 'مدير الصندوق'
  },
  {
    id: 'tx_102',
    entryNumber: 'PV-2026-001',
    type: 'payment_voucher',
    date: '2026-08-29',
    amount: 350000,
    accountFrom: 'حساب بنك الكريمي',
    accountTo: 'الموردون والدائنون',
    partyType: 'supplier',
    partyName: 'شركة تعز الوطنية للبلاستيك والنايلون',
    category: 'supplier_payment',
    description: 'سند صرف سداد دفعة من فاتورة توريد كراتين الأكواب البلاستيكية',
    referenceNumber: 'KUR-881204',
    paymentMethod: 'kuraimi',
    status: 'confirmed',
    createdAt: '2026-08-29T14:15:00',
    createdBy: 'المحاسب المالي'
  },
  {
    id: 'tx_103',
    entryNumber: 'PV-2026-002',
    type: 'operating_expense',
    date: '2026-08-28',
    amount: 45000,
    accountFrom: 'صندوق النقدية الرئيسي',
    accountTo: 'محروقات ونقل وصيانة شاحنات التوصيل',
    partyType: 'general',
    partyName: 'محطة بيرباشا للمحروقات',
    category: 'fuel_transport',
    description: 'تعبئة ديزل لشاحنة نقل وتوزيع كراتين الجملة',
    referenceNumber: 'GAS-4012',
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: '2026-08-28T09:00:00',
    createdBy: 'أمين الصندوق'
  },
  {
    id: 'tx_104',
    entryNumber: 'RV-2026-002',
    type: 'receipt_voucher',
    date: '2026-08-27',
    amount: 98000,
    accountFrom: 'حساب بنك الكريمي',
    accountTo: 'العملاء والمدينون',
    partyType: 'customer',
    partyName: 'فندق النخيل السياحي - تعز',
    category: 'customer_receipt',
    description: 'تحصيل دفعة من حساب الآجل لطلبية مناديل ومطهرات فندقية',
    referenceNumber: 'KUR-770192',
    paymentMethod: 'kuraimi',
    status: 'confirmed',
    createdAt: '2026-08-27T16:40:00',
    createdBy: 'المحاسب المالي'
  },
  {
    id: 'tx_105',
    entryNumber: 'PV-2026-003',
    type: 'operating_expense',
    date: '2026-08-25',
    amount: 150000,
    accountFrom: 'حساب بنك التضامن',
    accountTo: 'مصروفات الإيجار',
    partyType: 'general',
    partyName: 'مالك مبنى المستودع - بيرباشا',
    category: 'rent',
    description: 'سداد قسط إيجار مستودع البشارة المركزي لشهر أغسطس',
    referenceNumber: 'CHK-10045',
    paymentMethod: 'bank_transfer',
    status: 'confirmed',
    createdAt: '2026-08-25T11:00:00',
    createdBy: 'المدير العام'
  }
];

// ==================== INITIAL PURCHASE INVOICES (فواتير المشتريات من الموردين) ====================
export const initialPurchaseInvoices: PurchaseInvoice[] = [
  {
    id: 'pinv_101',
    invoiceNumber: 'PINV-2026-101',
    supplierId: 'sup_1',
    supplierName: 'شركة تعز الوطنية للبلاستيك والنايلون',
    supplierPhone: '771234888',
    date: '2026-08-24',
    items: [
      {
        productId: 'prod_1',
        productName: 'أكواب بلاستيك شفافة 7 أونصة كرتون جملة (1000 كوب)',
        unit: 'كرتون',
        quantity: 50,
        costPrice: 14200,
        totalCost: 710000,
        sellingPrice: 18500
      },
      {
        productId: 'prod_5',
        productName: 'علب مايكرويف بلاستيك مستطيلة مع الغطاء (كرتون 250 حبة)',
        unit: 'كرتون',
        quantity: 30,
        costPrice: 18000,
        totalCost: 540000,
        sellingPrice: 23500
      }
    ],
    subtotal: 1250000,
    discount: 50000,
    tax: 0,
    totalAmount: 1200000,
    paidAmount: 750000,
    remainingAmount: 450000,
    paymentStatus: 'partial',
    paymentMethod: 'kuraimi',
    notes: 'تم استلام وتخزين الكراتين بالكامل في مستودع بيرباشا',
    status: 'received',
    createdAt: '2026-08-24T12:00:00'
  },
  {
    id: 'pinv_102',
    invoiceNumber: 'PINV-2026-102',
    supplierId: 'sup_2',
    supplierName: 'مصانع الهلال للمنظفات والمطهرات الكيماوية',
    supplierPhone: '733456789',
    date: '2026-08-20',
    items: [
      {
        productId: 'prod_2',
        productName: 'مسحوق غسيل رائع اليمني عالي الرغوة (كرتون 24 كيس × 500 جرام)',
        unit: 'كرتون',
        quantity: 40,
        costPrice: 14800,
        totalCost: 592000,
        sellingPrice: 19800
      },
      {
        productId: 'prod_3',
        productName: 'مطهر ومعقم أرضيات البشارة برائحة الفل التعزي (جالون 4 لتر)',
        unit: 'جالون',
        quantity: 60,
        costPrice: 4200,
        totalCost: 252000,
        sellingPrice: 6800
      }
    ],
    subtotal: 844000,
    discount: 24000,
    tax: 0,
    totalAmount: 820000,
    paidAmount: 540000,
    remainingAmount: 280000,
    paymentStatus: 'partial',
    paymentMethod: 'bank_transfer',
    notes: 'دفعة توريد منتجات النظافة السائلة والمساحيق لفرع تعز',
    status: 'received',
    createdAt: '2026-08-20T10:00:00'
  }
];


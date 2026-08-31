import React, { useState } from 'react';
import {
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  Building2,
  Star,
  Check,
  BellRing,
  Info,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StarRating } from '../../components/common/StarRating';
import { QuantitySelector } from '../../components/common/QuantitySelector';
import { ReviewModal } from '../../components/common/ReviewModal';
import { ProductCard } from '../../components/common/ProductCard';

export const ProductDetailsScreen: React.FC = () => {
  const {
    selectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    shareProduct,
    notifyMeWhenInStock,
    getTierPrice,
    customerType,
    products,
    reviews
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">لم يتم اختيار أي منتج</p>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-3 text-xs text-blue-600 font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const isFavorite = isInWishlist(selectedProduct.id);
  const isOutOfStock = selectedProduct.stockQuantity <= 0;
  const isLowStock = selectedProduct.stockQuantity > 0 && selectedProduct.stockQuantity <= selectedProduct.minStockAlert;

  const currentTierPrice = getTierPrice(selectedProduct, quantity);
  const totalItemCost = currentTierPrice * quantity;

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === selectedProduct.id && r.isApproved);

  // Similar products in same category
  const similarProducts = products
    .filter(p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
    .slice(0, 4);

  // Frequently bought together products
  const frequentlyBought = products
    .filter(p => p.id !== selectedProduct.id && (p.isBestSeller || p.categoryId === 'cat_detergents'))
    .slice(0, 3);

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setCurrentView('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          id="back-to-products-btn"
          onClick={() => setCurrentView('product_list')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للمنتجات</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="share-product-top-btn"
            onClick={() => shareProduct(selectedProduct)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shadow-xs"
            aria-label="مشاركة"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="fav-product-top-btn"
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`p-2 rounded-xl bg-white border border-slate-200 transition-colors shadow-xs ${
              isFavorite ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-slate-600 hover:text-rose-500'
            }`}
            aria-label="المفضلة"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Layout (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Left: Image Gallery (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.nameAr}
              className="w-full h-full object-cover"
            />
            {selectedProduct.discountPercentage && selectedProduct.discountPercentage > 0 && (
              <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                %{selectedProduct.discountPercentage}- خصم
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                <span className="text-sm font-black bg-rose-600 px-4 py-1.5 rounded-full mb-2 shadow-lg">
                  غير متوفر حالياً بالمخزون
                </span>
                <p className="text-xs text-slate-200">
                  يمكنك تفعيل التنبيه ليصلك إشعار فوري عند وصول الشحنة الجديدة
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-600 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Pricing & Actions (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div>
            {/* Brand, Category & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {selectedProduct.brand}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedProduct.categoryName}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                SKU: {selectedProduct.sku}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug mb-2">
              {selectedProduct.nameAr}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating
                rating={selectedProduct.rating}
                size="md"
                showNumber={true}
                reviewsCount={selectedProduct.reviewsCount}
              />
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>اكتب تقييماً</span>
              </button>
            </div>

            {/* Pricing Section & Live Wholesale Tiers */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-0.5">
                    السعر الحالي للوحدة ({selectedProduct.unit}):
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-blue-900">
                      {currentTierPrice} <span className="text-sm font-bold">ريال</span>
                    </span>
                    {selectedProduct.oldPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {selectedProduct.oldPrice} ريال
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock status tag */}
                <div>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
                      غير متوفر
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                      متبقي {selectedProduct.stockQuantity} {selectedProduct.unit} فقط!
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> متوفر بالمستودع ({selectedProduct.stockQuantity} {selectedProduct.unit})
                    </span>
                  )}
                </div>
              </div>

              {/* Wholesale Pricing Tier Table */}
              {selectedProduct.wholesaleTiers && selectedProduct.wholesaleTiers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      جدول أسعار الجملة وتخفيض الكميات:
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      يُحسب آلياً بالسلة
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {selectedProduct.wholesaleTiers.map((tier, tIdx) => {
                      const isCurrentTierActive =
                        quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity);

                      return (
                        <div
                          key={tIdx}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            isCurrentTierActive
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className={`text-[10px] font-semibold ${isCurrentTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                            {tier.label}
                          </div>
                          <div className="text-sm font-black mt-0.5">
                            {tier.pricePerUnit} <span className="text-[10px] font-normal">ريال</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">نوع الوحدة:</span>
                <span className="font-bold text-slate-800">{selectedProduct.unit}</span>
              </div>

              {selectedProduct.piecesPerCarton && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">محتوى الكرتون:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.piecesPerCarton} حبة</span>
                </div>
              )}

              {selectedProduct.sizeOrVolume && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">الحجم / السعة:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.sizeOrVolume}</span>
                </div>
              )}

              {selectedProduct.manufacturer && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block text-[10px]">المصنع / المنشأ:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.manufacturer}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-900 mb-1.5">وصف المنتج:</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {selectedProduct.descriptionAr}
              </p>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {/* Quantity Selector with total price hint */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">حدد الكمية:</span>
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(q => q + 1)}
                  onDecrease={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
                  size="md"
                  unit={selectedProduct.unit}
                />
              </div>

              <div className="text-left">
                <div className="text-[10px] text-slate-500">الإجمالي لهذه الكمية:</div>
                <div className="text-base font-black text-blue-900">
                  {totalItemCost} ريال
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            {isOutOfStock ? (
              <button
                type="button"
                id="out-of-stock-notify-btn"
                onClick={() => notifyMeWhenInStock(selectedProduct)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-98 text-sm"
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>أبلغني فور توفر المنتج في المستودع</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="add-to-cart-details-btn"
                  onClick={() => addToCart(selectedProduct, quantity)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-98 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة إلى السلة ({quantity})</span>
                </button>

                <button
                  type="button"
                  id="buy-now-details-btn"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-98 text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>شراء الآن والدفع</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">تقييمات وآراء العملاء</h3>
              <p className="text-[11px] text-slate-500">تجارب حقيقية من عملاء ومطاعم اشتروا هذا المنتج</p>
            </div>
          </div>

          <button
            type="button"
            id="open-review-modal-btn"
            onClick={() => setIsReviewModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            + أضف تقييمك
          </button>
        </div>

        {productReviews.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 mb-2">كن أول من يقيّم هذا المنتج وشارك رأيك مع العملاء الآخرين</p>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs font-bold text-blue-600 underline"
            >
              اكتب تقييمك الآن
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {productReviews.map(rev => (
              <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                      {rev.userName[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rev.rating} size="sm" showNumber={false} />
                    <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pr-9">{rev.comment}</p>
                {rev.adminReply && (
                  <div className="mt-2 mr-9 p-2 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900">
                    <span className="font-bold block mb-0.5">رد مؤسسة البشارة:</span>
                    {rev.adminReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-bold text-slate-900 mb-3">منتجات مشابهة قد تهمك</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} layout="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
};

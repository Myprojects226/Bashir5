import React from 'react';
import { Heart, ShoppingCart, Share2, Sparkles, AlertCircle, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
  showWholesaleTiers?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  showWholesaleTiers = true
}) => {
  const {
    setSelectedProduct,
    setCurrentView,
    addToCart,
    cart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    shareProduct,
    customerType,
    getTierPrice
  } = useApp();

  const isFavorite = isInWishlist(product.id);
  const cartItem = cart.find(item => item.product.id === product.id);
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.minStockAlert;

  const currentPrice = getTierPrice(product, cartItem ? cartItem.quantity : 1);
  const lowestWholesaleTier = product.wholesaleTiers.length > 0
    ? [...product.wholesaleTiers].sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0]
    : null;

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentView('product_details');
  };

  if (layout === 'horizontal') {
    return (
      <div
        id={`product-card-horiz-${product.id}`}
        onClick={handleCardClick}
        className="group relative flex gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer overflow-hidden"
      >
        {/* Product Image */}
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
          <img
            src={product.images[0]}
            alt={product.nameAr}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
              %{product.discountPercentage}-
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] font-bold">
              نفد المخزون
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate">
                {product.brand || product.categoryName}
              </span>
              <button
                type="button"
                id={`wishlist-btn-h-${product.id}`}
                onClick={e => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                }`}
                aria-label="المفضلة"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {product.nameAr}
            </h4>

            {product.piecesPerCarton && (
              <p className="text-[11px] text-slate-500 mt-0.5">
                📦 كرتون يحتوي على {product.piecesPerCarton} حبة
              </p>
            )}
          </div>

          <div className="flex items-end justify-between gap-2 mt-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-blue-900">
                  {currentPrice} <span className="text-xs font-semibold">ريال</span>
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {product.oldPrice} ريال
                  </span>
                )}
              </div>
              {lowestWholesaleTier && (
                <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                  جملة: {lowestWholesaleTier.pricePerUnit} ريال (للكرتون)
                </div>
              )}
            </div>

            {/* Action */}
            <button
              type="button"
              id={`add-cart-btn-h-${product.id}`}
              disabled={isOutOfStock}
              onClick={e => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>إضافة</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-400/60 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top badges & Image */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
        <img
          src={product.images[0]}
          alt={product.nameAr}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              %{product.discountPercentage}-
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> الأكثر مبيعاً
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              جديد
            </span>
          )}
        </div>

        {/* Quick action buttons (Heart & Share) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            id={`wishlist-btn-${product.id}`}
            onClick={e => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xs shadow-sm transition-all active:scale-90 ${
              isFavorite ? 'text-rose-500 bg-white' : 'text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            id={`share-btn-${product.id}`}
            onClick={e => {
              e.stopPropagation();
              shareProduct(product);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xs shadow-sm text-slate-600 hover:text-blue-600 hover:bg-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
            aria-label="مشاركة المنتج"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Out of stock or low stock banner */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-2 text-center">
            <span className="text-xs font-black bg-rose-600 px-3 py-1 rounded-full mb-1">
              غير متوفر حالياً
            </span>
            <span className="text-[10px] text-slate-200">اضغط لطلب تنبيه عند التوفر</span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2 inset-x-2 bg-amber-500/90 text-white text-[10px] font-bold py-0.5 px-2 rounded-md text-center backdrop-blur-xs">
            متبقي {product.stockQuantity} {product.unit} فقط!
          </div>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {product.brand}
            </span>
            <StarRating rating={product.rating} size="sm" showNumber={true} />
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.nameAr}
          </h3>

          {/* Carton / Specs */}
          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
              {product.unit}
            </span>
            {product.piecesPerCarton && (
              <span className="truncate">
                {product.piecesPerCarton} حبة
              </span>
            )}
            {product.sizeOrVolume && (
              <span className="truncate border-r border-slate-200 pr-2">
                {product.sizeOrVolume}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Wholesale Tier */}
        <div>
          {showWholesaleTiers && lowestWholesaleTier && (
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-1.5 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800">
                سعر الجملة ({lowestWholesaleTier.label.split('(')[0]}):
              </span>
              <span className="text-xs font-extrabold text-emerald-700">
                {lowestWholesaleTier.pricePerUnit} ريال
              </span>
            </div>
          )}

          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-blue-950">
                {currentPrice}
              </span>
              <span className="text-xs font-bold text-blue-950">ريال</span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.oldPrice}
                </span>
              )}
            </div>

            {customerType === 'commercial' && (
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                سعر تجاري
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {cartItem ? (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-1">
              <button
                type="button"
                id={`cart-dec-${product.id}`}
                onClick={e => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity - 1);
                }}
                className="w-7 h-7 bg-white text-blue-700 font-bold rounded-lg flex items-center justify-center shadow-xs active:scale-95"
              >
                -
              </button>
              <div className="text-xs font-bold text-blue-900 px-2">
                {cartItem.quantity} في السلة
              </div>
              <button
                type="button"
                id={`cart-inc-${product.id}`}
                onClick={e => {
                  e.stopPropagation();
                  updateCartQuantity(product.id, cartItem.quantity + 1);
                }}
                className="w-7 h-7 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shadow-xs active:scale-95"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              id={`add-cart-btn-${product.id}`}
              disabled={isOutOfStock}
              onClick={e => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs active:scale-[0.98] transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? 'أبلغني عند التوفر' : 'إضافة إلى السلة'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

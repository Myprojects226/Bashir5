import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';

export const FavoritesScreen: React.FC = () => {
  const { wishlist, products, setCurrentView } = useApp();

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-slate-800">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">قائمة المفضلة فارغة</h2>
        <p className="text-xs text-slate-500 mb-6">
          اضغط على أيقونة القلب في أي منتج لإضافته إلى قائمة رغباتك والرجوع إليه لاحقاً.
        </p>
        <button
          type="button"
          id="fav-empty-browse-btn"
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all"
        >
          <span>استكشف المنتجات</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">المنتجات المفضلة</h2>
          <p className="text-xs text-slate-500">المنتجات التي قمت بحفظها لشرائها لاحقاً</p>
        </div>
        <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-xl">
          {favoriteProducts.length} منتجات
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {favoriteProducts.map(prod => (
          <ProductCard key={prod.id} product={prod} layout="grid" />
        ))}
      </div>
    </div>
  );
};

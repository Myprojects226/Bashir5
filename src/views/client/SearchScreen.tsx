import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  History,
  TrendingUp,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';

export const SearchScreen: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    setCurrentView
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  const trendingSearches = [
    'أكواب بلاستيك 8 أونص',
    'مناديل رول ماكسي',
    'صابون غسيل أيدي 5 لتر',
    'أكياس نفايات 50 جالون',
    'مطهر ومعقم أرضيات',
    'قفازات لاتكس طبية',
    'علب ميكروويف مستطيلة',
    'سفرة طعام بلاستيك'
  ];

  const searchResults = useMemo(() => {
    if (!inputVal.trim()) return [];
    const q = inputVal.trim().toLowerCase();
    return products.filter(p => {
      if (!p.isActive) return false;
      const matchNameAr = p.nameAr.toLowerCase().includes(q);
      const matchNameEn = p.nameEn ? p.nameEn.toLowerCase().includes(q) : false;
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      return matchNameAr || matchNameEn || matchSku || matchBrand || matchTags;
    });
  }, [products, inputVal]);

  const handleSearchSubmit = (keyword: string) => {
    setInputVal(keyword);
    setSearchQuery(keyword);
    addRecentSearch(keyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-24 text-slate-800">
      {/* Search Header Input */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          id="back-from-search-btn"
          onClick={() => setCurrentView('home')}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="الرجوع"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            id="main-search-input"
            autoFocus
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="ابحث بالاسم، الماركة، الكود (SKU)، أو المقاس..."
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium py-3 pr-10 pl-9 rounded-2xl border border-slate-200 shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          {inputVal && (
            <button
              type="button"
              id="clear-search-input-btn"
              onClick={() => {
                setInputVal('');
                setSearchQuery('');
              }}
              className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* When no query is typed yet: show recent searches & trending */}
      {!inputVal.trim() ? (
        <div className="flex flex-col gap-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>عمليات البحث الأخيرة</span>
                </div>
                <button
                  type="button"
                  id="clear-recent-searches-btn"
                  onClick={clearRecentSearches}
                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  مسح السجل
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearchSubmit(item)}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>الأكثر بحثاً في متجر البشارة</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`trending-tag-${idx}`}
                  onClick={() => handleSearchSubmit(term)}
                  className="flex items-center gap-1.5 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200/60 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Search Results */
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              نتائج البحث عن: <span className="text-blue-900 font-black">"{inputVal}"</span>
            </h3>
            <span className="text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-xl">
              {searchResults.length} منتج مطابق
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                عذراً، لم نعثر على منتجات تطابق بحثك
              </h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                تأكد من كتابة الكلمات بشكل صحيح، أو جرب البحث بكلمة عامة مثل "أكواب" أو "صابون" أو تصفح الأقسام مباشرة.
              </p>
              <button
                type="button"
                id="browse-categories-from-search-btn"
                onClick={() => setCurrentView('categories')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
              >
                تصفح كافة الأقسام
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {searchResults.map(p => (
                <ProductCard key={p.id} product={p} layout="grid" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

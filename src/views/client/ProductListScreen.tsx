import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Grid,
  List,
  ChevronRight,
  Search,
  X,
  Package,
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';

export const ProductListScreen: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    setCurrentView
  } = useApp();

  // Find maximum product price dynamically (Yemeni Riyal)
  const highestPriceInCatalog = useMemo(() => {
    if (!products.length) return 100000;
    const max = Math.max(...products.map(p => p.price || 0));
    return Math.max(max, 50000);
  }, [products]);

  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating' | 'best_seller' | 'newest' | 'discount'>('default');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(highestPriceInCatalog);
  const [searchInCat, setSearchInCat] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'horizontal'>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Sync maxPrice if catalog loads with higher numbers
  React.useEffect(() => {
    if (maxPrice < highestPriceInCatalog && maxPrice === 500) {
      setMaxPrice(highestPriceInCatalog);
    }
  }, [highestPriceInCatalog]);

  // Extract unique brands
  const brands = useMemo(() => {
    const bSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) bSet.add(p.brand);
    });
    return Array.from(bSet);
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!product.isActive) return false;

      // Category filter
      if (selectedCategory && product.categoryId !== selectedCategory.id) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // In stock filter
      if (inStockOnly && product.stockQuantity <= 0) {
        return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Search keyword filter
      if (searchInCat.trim()) {
        const q = searchInCat.trim().toLowerCase();
        const matchName = product.nameAr.toLowerCase().includes(q) || (product.nameEn && product.nameEn.toLowerCase().includes(q));
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchSku && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best_seller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return 0;
    });
  }, [products, selectedCategory, selectedBrand, inStockOnly, maxPrice, searchInCat, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-24 text-slate-800">
      {/* Category Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <button
              type="button"
              id="back-home-crumb"
              onClick={() => setCurrentView('home')}
              className="hover:text-blue-600 transition-colors"
            >
              الرئيسية
            </button>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
            <button
              type="button"
              id="categories-crumb"
              onClick={() => setCurrentView('categories')}
              className="hover:text-blue-600 transition-colors"
            >
              الأقسام
            </button>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
            <span className="font-bold text-blue-900">
              {selectedCategory ? selectedCategory.nameAr : 'جميع المنتجات'}
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>{selectedCategory ? selectedCategory.nameAr : 'جميع المنتجات والكراتين'}</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} منتج
            </span>
          </h2>
        </div>

        {/* Horizontal Category Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            id="cat-tab-all"
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory?.id === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>
      </div>

      {/* Control bar: Search inside category, Filters button, Sorting dropdown, Grid/List toggle */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Search within category */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            id="cat-search-input"
            value={searchInCat}
            onChange={e => setSearchInCat(e.target.value)}
            placeholder="بحث داخل هذا القسم..."
            className="w-full bg-slate-50 text-xs py-2 pr-9 pl-3 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          {searchInCat && (
            <button
              type="button"
              onClick={() => setSearchInCat('')}
              className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Modal Trigger */}
          <button
            type="button"
            id="open-filters-btn"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              selectedBrand !== 'all' || inStockOnly || maxPrice < 500
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>فلترة</span>
            {(selectedBrand !== 'all' || inStockOnly || maxPrice < 500) && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-xs"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً ★</option>
              <option value="best_seller">الأكثر مبيعاً</option>
              <option value="newest">الأحدث وصولاً</option>
              <option value="discount">أعلى نسبة خصم %</option>
            </select>
          </div>

          {/* Grid / List view toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              id="layout-grid-btn"
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="عرض شبكي"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="layout-list-btn"
              onClick={() => setLayout('horizontal')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'horizontal' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="عرض قائمة"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active filters badges */}
      {(selectedBrand !== 'all' || inStockOnly || maxPrice < highestPriceInCatalog) && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-slate-500 font-semibold">الفلاتر المطبقة:</span>
          {selectedBrand !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
              الماركة: {selectedBrand}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('all')} />
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
              متوفر بالمخزون فقط
              <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
            </span>
          )}
          {maxPrice < highestPriceInCatalog && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
              أقصى سعر: {maxPrice.toLocaleString()} ر.ي
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(highestPriceInCatalog)} />
            </span>
          )}
          <button
            type="button"
            id="clear-all-filters-btn"
            onClick={() => {
              setSelectedBrand('all');
              setInStockOnly(false);
              setMaxPrice(highestPriceInCatalog);
            }}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            إلغاء جميع الفلاتر
          </button>
        </div>
      )}

      {/* Products Grid or List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs my-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            لا توجد منتجات مطابقة لخيارات البحث أو الفلترة
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            جرب تغيير معايير البحث أو اختيار قسم آخر
          </p>
          <button
            type="button"
            id="reset-filter-empty-btn"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedBrand('all');
              setInStockOnly(false);
              setMaxPrice(highestPriceInCatalog);
              setSearchInCat('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            إعادة تعيين كافة الفلاتر
          </button>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} layout="horizontal" />
          ))}
        </div>
      )}

      {/* Filter Modal Drawer */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 relative text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">تصفية المنتجات</h3>
              </div>
              <button
                type="button"
                id="close-filter-modal-btn"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Brand filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العلامة التجارية / المصنع
                </label>
                <select
                  id="brand-filter-select"
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="all">جميع العلامات التجارية</option>
                  {brands.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>الحد الأقصى للسعر:</span>
                  <span className="text-blue-600">{maxPrice.toLocaleString()} ر.ي</span>
                </div>
                <input
                  type="range"
                  id="price-range-slider"
                  min="1000"
                  max={highestPriceInCatalog}
                  step="500"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1,000 ر.ي</span>
                  <span>{highestPriceInCatalog.toLocaleString()} ر.ي</span>
                </div>
              </div>

              {/* In Stock toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">المنتجات المتوفرة فقط بالمخزون</span>
                <input
                  type="checkbox"
                  id="stock-toggle-checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  id="apply-filter-btn"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all"
                >
                  تطبيق الفلاتر
                </button>
                <button
                  type="button"
                  id="reset-filter-btn"
                  onClick={() => {
                    setSelectedBrand('all');
                    setInStockOnly(false);
                    setMaxPrice(highestPriceInCatalog);
                  }}
                  className="px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

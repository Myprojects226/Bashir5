import React from 'react';
import { ChevronLeft, Package, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

export const CategoriesScreen: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView } = useApp();

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('product_list');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-24 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            أقسام وتصنيفات المتجر
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            اختر القسم لتصفح كافة كراتين البضائع والمنظفات ومستلزمات التوريد
          </p>
        </div>
        <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-xl">
          {categories.length} أقسام رئيسية
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            id={`category-full-${category.id}`}
            onClick={() => handleCategoryClick(category)}
            className="group flex gap-4 p-3.5 bg-white border border-slate-200/80 rounded-3xl shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer overflow-hidden items-center"
          >
            {/* Category Image */}
            <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform">
              <img
                src={category.image}
                alt={category.nameAr}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {category.nameAr}
                </h3>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                {category.description || 'تصفح تشكيلة متنوعة من المنتجات بأعلى معايير الجودة وبأسعار الجملة.'}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                  {category.itemCount} منتج وكرتون
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

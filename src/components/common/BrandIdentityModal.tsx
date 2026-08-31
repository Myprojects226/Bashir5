import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  Phone,
  MapPin,
  Palette,
  Quote,
  ShieldCheck,
  Layers,
  ShoppingBag,
  Store
} from 'lucide-react';
import { AlBisharaLogo } from './AlBisharaLogo';
import { useApp } from '../../context/AppContext';

interface BrandIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandIdentityModal: React.FC<BrandIdentityModalProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`تم نسخ: "${text}"`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Official Quotes from the uploaded billboards & banners
  const officialQuotes = [
    {
      id: 'main_motto',
      category: 'الشعار اللفظي الرئيسي',
      arabic: 'البشارة.. عنوان الجودة',
      english: 'Al-Bishara.. The Title of Quality',
      context: 'المعتمد في واجهة المتجر واللافتات الرسمية والأكياس'
    },
    {
      id: 'detergent_quote',
      category: 'اقتباس قسم المنظفات والمطهرات',
      arabic: 'منظفات فعالة - نظافة لا مثيل لها ولمعان يدوم بكل سهولة',
      english: 'Effective Detergents - Unmatched Cleanliness & Long-Lasting Shine',
      context: 'معتمد في حملات مساحيق الغسيل ومواد التلميع والتعقيم'
    },
    {
      id: 'cosmetics_quote',
      category: 'اقتباس قسم مستحضرات وأدوات التجميل',
      arabic: 'مستحضرات التجميل - كل لمسة جمال تبدأ من هنا | منتجات مختارة لعناية أجمل',
      english: 'Cosmetics - Every touch of beauty begins here | Selected products for finest care',
      context: 'معتمد في قسم العناية الشخصية ومستحضرات التجميل'
    },
    {
      id: 'welcome_quote',
      category: 'اقتباس الترحيب والجودة',
      arabic: 'كل ما تحتاجه بجودة عالية - زورونا تجدوا ما يسركم',
      english: 'Everything you need with top quality - Visit us to find what pleases you',
      context: 'معتمد في لافتة المستودع الرئيسية وحملات الافتتاح'
    }
  ];

  // Brand Color Palette
  const brandColors = [
    { name: 'أزرق البشارة الحيوي', hex: '#0284C7', rgb: 'rgb(2, 132, 199)', role: 'اللون الرئيسي للشعار والأزرار الرئيسية' },
    { name: 'أخضر النظافة والانتعاش', hex: '#10B981', rgb: 'rgb(16, 185, 129)', role: 'لون الغطاء وقطرة الانتعاش وعروض الجملة' },
    { name: 'أزرق كحلي عميق', hex: '#0F172A', rgb: 'rgb(15, 23, 42)', role: 'لون النصوص والعناوين والتباين' },
    { name: 'سماوي مائي نقي', hex: '#38BDF8', rgb: 'rgb(56, 189, 248)', role: 'لون الفقاعات واللمسات المضيئة' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-sky-700 to-emerald-600 p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white text-blue-700 flex items-center justify-center shadow-md">
              <AlBisharaLogo size="xs" variant="icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">دليل الهوية البصرية وشعارات البشارة</h3>
                <span className="text-[10px] font-bold bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full">
                  Official Brand Guide
                </span>
              </div>
              <p className="text-xs text-blue-100">
                الشعار الرسمي، الاقتباسات المعتمدة، لوحة الألوان وأرقام التواصل
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800 text-xs">
          {/* 1. Official Logo Preview Box */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
              <AlBisharaLogo size="xl" variant="full" showSlogan={true} showPhones={true} />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400">رمز الشعار (Emblem Concept)</div>
                <h4 className="text-sm font-black text-slate-900">
                  عبوة المنظفات المدمجة بحروف ABR وقطرة النظافة
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  يعبر الشعار عن التكامل بين مستلزمات البلاستيك ومنتجات المنظفات والتجميل، مدمجاً رمز العبوة بحروف الشهرة ABR مع قطرات وفقاعات اللمعان.
                </p>
              </div>

              {/* Verified Contact info */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold select-all" dir="ltr">+967 776 776 429 / 783 755 055 / 783 744 044</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>تعز - جولة بير باشا - خط المطار - جوار مطعم حضرموت</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Official Brand Quotes & Slogans */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Quote className="w-4 h-4 text-blue-600" />
                <span>الاقتباسات والشعارات المعتمدة للهوية</span>
              </h4>
              <span className="text-[11px] text-slate-400">انقر للنسخ الفوري</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {officialQuotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {q.category}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                      "{q.arabic}"
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans italic" dir="ltr">
                      "{q.english}"
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      📌 {q.context}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(q.arabic, q.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors shrink-0"
                    title="نسخ الاقتباس"
                  >
                    {copiedKey === q.id ? (
                      <Check className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Official Brand Palette */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>لوحة الألوان الرسمية (Brand Palette)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {brandColors.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => copyText(c.hex, c.hex)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer group transition-all"
                >
                  <div
                    className="h-12 w-full rounded-xl mb-2 shadow-xs flex items-end justify-end p-1"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="text-[9px] font-mono text-white/90 bg-black/30 px-1 rounded-sm">
                      {c.hex}
                    </span>
                  </div>
                  <div className="font-bold text-[11px] text-slate-800 truncate">{c.name}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                    {c.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Official Core Store Categories */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500">الأقسام المعتمدة في اللافتات الرسمية:</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'بلاستيك - منظفات',
                'أدوات تجميل ومستحضرات عناية',
                'مستلزمات المطاعم والبوافي',
                'مستلزمات الفنادق والشقق',
                'خردوات وورقيات ومنتجات التغليف'
              ].map((item, idx) => (
                <span
                  key={idx}
                  className="bg-white text-slate-800 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            هوية رسمية مسجلة © مستودع ومحلات البشارة - تعز
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

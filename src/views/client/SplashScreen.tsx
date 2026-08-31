import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AlBisharaLogo } from '../../components/common/AlBisharaLogo';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 text-white flex flex-col items-center justify-between p-6 select-none relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end">
        <button
          type="button"
          id="skip-splash-btn"
          onClick={onFinish}
          className="text-xs text-blue-200 hover:text-white bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1 transition-all"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Official Branding */}
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 max-w-sm">
        {/* Official Brand Logo SVG */}
        <div className="relative mb-4">
          <div className="p-4 rounded-3xl bg-white/95 shadow-2xl border-4 border-sky-400/80 transform hover:scale-105 transition-transform">
            <AlBisharaLogo size="xl" variant="icon" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-white mb-1">
          البشــــارة
        </h1>
        <div className="text-sm font-extrabold text-emerald-300 tracking-wider mb-2">
          للبلاستيك والمنظفات
        </div>

        {/* Official Slogan Badge */}
        <div className="text-xs font-black text-amber-300 bg-amber-400/15 px-4 py-1 rounded-full border border-amber-400/30 mb-3">
          "البشارة.. عنوان الجودة"
        </div>

        <p className="text-xs text-blue-200/90 leading-relaxed">
          منظفات فعالة • بلاستيك • مستحضرات تجميل • مستلزمات المطاعم والفنادق
        </p>

        <div className="text-[11px] text-slate-400 mt-2 font-mono" dir="ltr">
          تعز - جولة بيرباشا
        </div>
      </div>

      {/* Bottom Loading Progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700 p-0.5">
          <div
            className="bg-gradient-to-r from-sky-400 via-emerald-400 to-blue-500 h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] text-blue-200 font-semibold">
          <span>جاري تحميل أسعار الجملة والمنتجات...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

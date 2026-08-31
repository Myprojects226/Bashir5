import React, { useState } from 'react';
import { Package, Smartphone, Truck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { AlBisharaLogo } from '../../components/common/AlBisharaLogo';

export const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'كل احتياجاتك في مكان واحد',
      slogan: 'البشارة.. عنوان الجودة',
      subtitle: 'أكبر تشكيلة متكاملة من البلاستيك، المنظفات المركزة، الورقيات، المعطرات ومستلزمات المطاعم والفنادق بأسعار الجملة والتجزئة.',
      icon: Package,
      badge: 'تشكيلة متكاملة',
      image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'تسوق بسهولة من جوالك',
      slogan: 'تصفح آلاف المنتجات بضغطة زر وبأسعار الجملة',
      subtitle: 'بحث ذكي، مقارنة أسعار الكراتين والكميات، عروض حصرية يومية ودفع آمن عبر مختلف الوسائل البنكية والنقدية.',
      icon: Smartphone,
      badge: 'تسوق ذكي وسريع',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c55c5dfb?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'نوصّل طلبك إلى باب منزلك',
      slogan: 'نظافة لا مثيل لها ولمعان يدوم بكل سهولة',
      subtitle: 'شحن وتوصيل فوري مباشر من مستودع البشارة في تعز (بيرباشا) إلى باب محلك التجاري أو منزلك بأمان وسرعة فائقة.',
      icon: Truck,
      badge: 'توصيل فوري لبابك',
      image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Top Header: Logo & Skip */}
      <div className="flex items-center justify-between">
        <AlBisharaLogo size="xs" variant="horizontal" />

        {!isLast && (
          <button
            type="button"
            id="onboarding-skip-btn"
            onClick={onFinish}
            className="text-xs font-bold text-slate-500 hover:text-blue-900 bg-slate-200/70 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition-all"
          >
            تخطي
          </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="my-auto py-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Slide Visual Card */}
        <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-xl mb-5 bg-slate-900">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
          
          <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white">
            <span className="text-xs font-black bg-blue-600/90 backdrop-blur-xs px-3 py-1 rounded-xl shadow-xs">
              {slide.badge}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <slide.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mb-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5 leading-tight">
          {slide.title}
        </h2>

        {/* Highlighted Slogan */}
        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/60 mb-2">
          "{slide.slogan}"
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
          {slide.subtitle}
        </p>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full flex items-center gap-3 pt-2">
        {currentSlide > 0 && (
          <button
            type="button"
            id="onboarding-prev-btn"
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shrink-0"
            aria-label="السابق"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          id="onboarding-next-btn"
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md active:scale-98 transition-all text-sm"
        >
          <span>{isLast ? 'ابدأ الآن' : 'التالي'}</span>
          {isLast ? <Sparkles className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

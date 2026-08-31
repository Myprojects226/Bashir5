import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Share2,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'instant' | 'builder' | 'capacitor'>('instant');
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // App live URL
  const appUrl = window.location.origin;

  useEffect(() => {
    // Listen for beforeinstallprompt event (native Android Chrome / Samsung Internet)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('جاري تثبيت تطبيق البشارة على هاتفك الأندرويد 🎉', 'success');
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      showToast('قم بفتح القائمة (⋮) في متصفحك ثم اضغط "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"', 'info');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    showToast('تم نسخ رابط التطبيق بنجاح 📋', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`تفضل بتحميل وتثبيت تطبيق "متجر البشارة للبلاستيك والمنظفات - تعز":\n${appUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // QR code URL using standard QR image service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appUrl)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="android-apk-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Android Badge */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            id="close-android-modal-btn"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  تحويل وتثبيت تطبيق الأندرويد (APK)
                </h3>
                <span className="bg-emerald-400/30 text-emerald-100 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300/40">
                  Android APK & PWA
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                متجر البشارة للبلاستيك والمنظفات - نسخة الهاتف المحمول
              </p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-1.5 mt-5 bg-black/20 p-1.5 rounded-2xl backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setActiveTab('instant')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'instant'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>التثبيت الفوري (موصى به)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>توليد ملف APK فوري</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('capacitor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'capacitor'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>مشروع Capacitor أصلي</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: INSTANT INSTALL (PWA / WebAPK) */}
          {activeTab === 'instant' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <strong className="block text-sm font-bold text-emerald-950">
                    تثبيت مباشر كـ WebAPK أصلي بدون الحاجة لمتجر بلاي
                  </strong>
                  <p>
                    يدعم التطبيق معيار PWA / WebAPK المتطور من Google. يمكنك تثبيته فوراً على أي هاتف أندرويد ليعمل بكامل الشاشة وبأيقونة رسمية على الشاشة الرئيسية وسرعة عالية وإشعارات فورية.
                  </p>
                </div>
              </div>

              {/* Install Action Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  id="install-android-app-btn"
                  onClick={handleInstallClick}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>{isInstalled ? 'التطبيق مثبت بالفعل على جهازك ✅' : 'تثبيت التطبيق الآن على هاتف الأندرويد'}</span>
                </button>

                <button
                  type="button"
                  id="share-whatsapp-btn"
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-xs transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>إرسال الرابط للواتساب</span>
                </button>
              </div>

              {/* QR Code and Quick Link Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs shrink-0 text-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code للتطبيق"
                    className="w-32 h-32 rounded-xl object-contain mx-auto"
                  />
                  <span className="text-[10px] text-slate-500 font-bold mt-1.5 block">امسح بكاميرا الجوال</span>
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-right">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>افتح التطبيق وثبته من هاتفك مباشرة</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    وجّه كاميرا هاتفك الأندرويد نحو الرمز لفتح المتجر، ثم اضغط على زر <strong>(تثبيت التطبيق)</strong> أو من خيارات المتصفح اختر <strong>(إضافة إلى الشاشة الرئيسية)</strong>.
                  </p>

                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 px-3">
                    <input
                      type="text"
                      readOnly
                      value={appUrl}
                      className="flex-1 text-[11px] font-mono text-slate-600 bg-transparent outline-none truncate"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      id="copy-app-url-btn"
                      onClick={handleCopyUrl}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Step Guide for Chrome on Android */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>طريقة التثبيت اليدوي على متصفح Google Chrome للأندرويد:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white border border-slate-200 rounded-xl p-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center mb-2 text-xs">1</div>
                    <p className="text-slate-700">افتح الرابط في متصفح <strong>Google Chrome</strong> على هاتفك.</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center mb-2 text-xs">2</div>
                    <p className="text-slate-700">اضغط على زر القائمة <strong>(الثلاث نقاط ⋮)</strong> في أعلى يسار المتصفح.</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center mb-2 text-xs">3</div>
                    <p className="text-slate-700">اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTANT APK BUILDER (PWABuilder / Appflow) */}
          {activeTab === 'builder' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950 space-y-1">
                  <strong className="block text-sm font-bold text-blue-900">
                    توليد ملف APK جاهز للتثبيت بنقرة واحدة عبر PWABuilder
                  </strong>
                  <p>
                    أداة <strong>PWABuilder</strong> المدعومة رسمياً من Microsoft و Google تقوم بفحص التطبيق وتوليد ملف <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-bold">.apk</code> أو <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-bold">.aab</code> جاهز للتثبيت المباشر أو الرفع على Google Play Store خلال أقل من 30 ثانية.
                  </p>
                </div>
              </div>

              {/* Builder steps */}
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                    <span>انسخ رابط تطبيقك الحالي:</span>
                  </h4>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 px-3">
                    <input
                      type="text"
                      readOnly
                      value={appUrl}
                      className="flex-1 text-xs font-mono text-slate-700 bg-transparent outline-none truncate"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                      {copied ? 'تم النسخ ✅' : 'نسخ الرابط'}
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                    <span>افتح موقع PWABuilder وحمّل ملف APK:</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    الصق الرابط واضغط <strong>Start</strong> ثم اختر <strong>Package For Stores / Android</strong> لتحميل حزمة الأندرويد وملف APK الموقع فوراً.
                  </p>
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    <span>فتح أداة PWABuilder لتحميل ملف الـ APK المباشر</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITOR & ANDROID STUDIO */}
          {activeTab === 'capacitor' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>حزمة Capacitor مجهزة ومثبتة في المشروع بالكامل</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تم إعداد وتكوين ملف <code className="text-amber-300">capacitor.config.ts</code> وحزم <code className="text-amber-300">@capacitor/core</code> و <code className="text-amber-300">@capacitor/android</code> في الكود المصدري.
                </p>
              </div>

              {/* App Android Specs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">اسم الحزمة (Package ID):</span>
                  <span className="font-mono font-bold text-blue-900" dir="ltr">com.albishara.store</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">اسم التطبيق (App Name):</span>
                  <span className="font-bold text-slate-900">البشارة للبلاستيك والمنظفات</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">إصدار الأندرويد المستهدف:</span>
                  <span className="font-bold text-emerald-700">Android 7.0 (API 24) إلى Android 15+</span>
                </div>
              </div>

              {/* Steps to build APK locally */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900">خطوات استخراج وبناء ملف APK في Android Studio:</h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <p>قم بتصدير المشروع كملف <strong>ZIP</strong> من قائمة الإعدادات أو عبر GitHub.</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <div className="space-y-1">
                      <p>في الطرفية (Terminal)، نفّذ الأمر التالي لمزامنة ملفات الأندرويد:</p>
                      <pre className="bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[11px] select-all" dir="ltr">
                        npx cap sync android
                      </pre>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <div className="space-y-1">
                      <p>افتح مجلد <code className="font-mono font-bold">android/</code> في برنامج <strong>Android Studio</strong> واختر:</p>
                      <p className="font-mono text-[11px] text-blue-700 font-bold" dir="ltr">
                        Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
                      </p>
                      <p className="text-slate-500 text-[11px]">سيتم استخراج ملف <code className="font-bold text-slate-700">app-debug.apk</code> أو <code className="font-bold text-slate-700">app-release.apk</code> فوراً.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>متوافق وآمن 100% مع جميع أجهزة سامسونج، شاومي، هواوي، وريلمي</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

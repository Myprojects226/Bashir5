import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2, Facebook } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShareModal: React.FC = () => {
  const { sharingProduct, setSharingProduct, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!sharingProduct) return null;

  const shareUrl = `${window.location.origin}/product/${sharingProduct.id}`;
  const shareText = `شاهد هذا المنتج من متجر البشارة للبلاستيك والمنظفات: ${sharingProduct.nameAr} بسعر ${sharingProduct.price} ريال فقط! ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    showToast('تم نسخ رابط المنتج بنجاح! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(sharingProduct.nameAr)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sharingProduct.nameAr,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 relative">
        <button
          type="button"
          id="close-share-modal"
          onClick={() => setSharingProduct(null)}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">مشاركة المنتج</h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{sharingProduct.nameAr}</p>
        </div>

        {/* Product mini card */}
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/70 mb-4">
          <img
            src={sharingProduct.images[0]}
            alt={sharingProduct.nameAr}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 line-clamp-1">{sharingProduct.nameAr}</div>
            <div className="text-xs font-black text-blue-900 mt-0.5">{sharingProduct.price} ريال</div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            type="button"
            id="share-whatsapp-btn"
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">واتساب</span>
          </button>

          <button
            type="button"
            id="share-telegram-btn"
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">تيليجرام</span>
          </button>

          <button
            type="button"
            id="share-facebook-btn"
            onClick={handleFacebook}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Facebook className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">فيسبوك</span>
          </button>

          <button
            type="button"
            id="share-native-btn"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">المزيد</span>
          </button>
        </div>

        {/* Copy Link input */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2 text-[11px] text-slate-600 outline-none select-all"
            dir="ltr"
          />
          <button
            type="button"
            id="copy-share-link-btn"
            onClick={handleCopy}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

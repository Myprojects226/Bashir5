import React, { useState } from 'react';
import { X, Star, Camera, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { StarRating } from './StarRating';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose }) => {
  const { addReview, showToast } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('يرجى كتابة تعليقك حول المنتج', 'error');
      return;
    }

    addReview({
      productId: product.id,
      productName: product.nameAr,
      rating,
      comment
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 relative text-slate-800">
        <button
          type="button"
          id="close-review-modal"
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900">تقييم المنتج وتجربتك</h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.nameAr}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
            <span className="text-xs font-bold text-slate-700 mb-2">ما هو تقييمك العام للمنتج؟</span>
            <StarRating
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={setRating}
              showNumber={false}
            />
            <span className="text-xs font-bold text-amber-700 mt-2">
              {rating === 5 && 'ممتاز جداً ⭐⭐⭐⭐⭐'}
              {rating === 4 && 'جيد جداً ⭐⭐⭐⭐'}
              {rating === 3 && 'جيد ⭐⭐⭐'}
              {rating === 2 && 'مقبول ⭐⭐'}
              {rating === 1 && 'ضعيف ⭐'}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اكتب رأيك وتجربتك بالتفصيل *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="كيف كانت جودة الكرتون / المنظف والتغليف وسرعة التوصيل؟"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none"
            />
          </div>

          {/* Optional Photo upload simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              إضافة صورة للمنتج بعد الاستلام (اختياري)
            </label>
            <button
              type="button"
              id="upload-review-photo-btn"
              onClick={() => {
                setHasPhoto(!hasPhoto);
                showToast(hasPhoto ? 'تمت إزالة الصورة' : 'تم إرفاق صورة تجريبية للمنتج', 'info');
              }}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed text-xs font-bold transition-all ${
                hasPhoto
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{hasPhoto ? 'تم إرفاق الصورة بنجاح (اضغط للإلغاء)' : 'اضغط لاختيار صورة من الاستوديو'}</span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              id="submit-review-btn"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>إرسال التقييم</span>
            </button>
            <button
              type="button"
              id="cancel-review-btn"
              onClick={onClose}
              className="px-4 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

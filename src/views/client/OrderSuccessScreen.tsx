import React from 'react';
import { CheckCircle2, Package, MapPin, Truck, ArrowLeft, ArrowRight, Sparkles, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OrderSuccessScreen: React.FC = () => {
  const { currentOrder, setCurrentView, orders } = useApp();

  const order = currentOrder || orders[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-12 pb-24 text-center text-slate-800 animate-in fade-in zoom-in-95 duration-300">
      {/* Animated Success Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50">
          <CheckCircle2 className="w-14 h-14" />
        </div>
        <div className="absolute top-0 right-1/3 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-md animate-bounce">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        تم استلام طلبك بنجاح!
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
        شكراً لتسوقك من متجر البشارة للبلاستيك والمنظفات. تم إرسال تفاصيل الفاتورة وتجهيز الكراتين في مستودعنا.
      </p>

      {/* Order Summary Box */}
      {order && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-right mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs text-slate-500 font-semibold">رقم الطلب:</span>
            <span className="text-sm font-black text-blue-900 font-mono" dir="ltr">
              {order.orderNumber}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>تاريخ ووقت الطلب:</span>
              <span className="font-bold text-slate-800">{order.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>طريقة الدفع:</span>
              <span className="font-bold text-slate-800">
                {order.paymentMethod === 'card' && 'بطاقة مدى / ائتمان'}
                {order.paymentMethod === 'apple_pay' && 'Apple Pay'}
                {order.paymentMethod === 'bank_transfer' && 'تحويل بنكي مؤسسة البشارة'}
                {order.paymentMethod === 'cod' && 'الدفع عند الاستلام'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>عنوان التوصيل:</span>
              <span className="font-bold text-slate-800 truncate max-w-[200px]">
                {order.deliveryAddress?.city || (order as any).shippingAddress?.city || 'تعز'} - {order.deliveryAddress?.district || (order as any).shippingAddress?.district || 'بيرباشا'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900">المبلغ الإجمالي:</span>
              <span className="text-base font-black text-blue-900">
                {((order as any)?.grandTotal ?? (order as any)?.totalAmount ?? 0).toLocaleString('ar-YE')} ريال يمني
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <button
          type="button"
          id="track-order-success-btn"
          onClick={() => setCurrentView('order_tracking')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md active:scale-98 transition-all text-xs sm:text-sm"
        >
          <Truck className="w-4 h-4" />
          <span>تتبع مسار الشحنة مباشرة (GPS)</span>
        </button>

        <button
          type="button"
          id="home-order-success-btn"
          onClick={() => setCurrentView('home')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl active:scale-98 transition-all text-xs sm:text-sm"
        >
          <Home className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
};

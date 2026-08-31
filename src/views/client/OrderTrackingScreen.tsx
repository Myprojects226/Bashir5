import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrderTrackingScreen: React.FC = () => {
  const { currentOrder, orders, setCurrentView, showToast } = useApp();

  const order = currentOrder || orders[0];
  const [showItems, setShowItems] = useState(true);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">لا يوجد طلب لتتبعه حالياً</p>
        <button
          type="button"
          onClick={() => setCurrentView('orders')}
          className="mt-3 text-xs text-blue-600 font-bold"
        >
          عرض قائمة طلباتي
        </button>
      </div>
    );
  }

  // 5 Status Steps definition
  const steps: { key: OrderStatus; label: string; desc: string; time: string }[] = [
    {
      key: 'pending',
      label: 'تم استلام الطلب',
      desc: 'تم تسجيل الطلب في نظام مؤسسة البشارة',
      time: order.createdAt
    },
    {
      key: 'confirmed',
      label: 'تم تأكيد الطلب',
      desc: 'تم التحقق من الفاتورة وتوفر الكميات والكراتين',
      time: 'منذ ساعة'
    },
    {
      key: 'processing',
      label: 'جاري التجهيز والتحميل',
      desc: 'فريق المستودع المركزي يجهّز الكراتين ويغلّفها',
      time: 'منذ 30 دقيقة'
    },
    {
      key: 'out_for_delivery',
      label: 'خرج للتوصيل مع المندوب',
      desc: 'شاحنة التوصيل في طريقها لعنوانك الآن',
      time: 'الآن'
    },
    {
      key: 'delivered',
      label: 'تم التسليم بنجاح',
      desc: 'تم استلام الشحنة وتوقيع إشعار الاستلام',
      time: order.estimatedDelivery
    }
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          id="back-to-orders-list-btn"
          onClick={() => setCurrentView('orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>قائمة طلباتي</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">رقم الشحنة:</span>
          <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-mono" dir="ltr">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Simulated Live GPS Map View */}
      <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

        {/* Roads & Navigation path */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 180 Q 180 80, 320 140 T 580 90"
            fill="none"
            stroke="#2563eb"
            strokeWidth="5"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>

        {/* Origin: Central Warehouse */}
        <div className="absolute bottom-6 right-8 z-20 flex flex-col items-center">
          <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 mb-1">
            مستودع البشارة المركزي
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-400/30">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Destination: Customer Address */}
        <div className="absolute top-6 left-12 z-20 flex flex-col items-center">
          <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-700 mb-1">
            {order.deliveryAddress?.district || (order as any).shippingAddress?.district || 'تعز'}
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-4 ring-rose-400/30">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* Moving Delivery Truck */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center animate-bounce">
          <div className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-emerald-400 whitespace-nowrap mb-1">
            مندوب التوصيل في الطريق إليك 🚚
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-300/40">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* ETA Badge */}
        <div className="absolute bottom-3 left-3 z-30 bg-white/95 text-slate-900 text-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200 font-bold backdrop-blur-xs flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>الوقت المتوقع للوصول: {order.estimatedDeliveryTime || (order as any).estimatedDelivery || 'خلال ساعتين'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Stage Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 mb-5">
            مراحل تجهيز وتوصيل الشحنة
          </h3>

          <div className="relative pr-6">
            {/* Vertical Line */}
            <div className="absolute right-2.5 top-3 bottom-3 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Circle Node */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs sm:text-sm font-black ${
                            isCurrent ? 'text-blue-900' : isPassed ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Driver & Items Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Driver Contact Card */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-black text-slate-900 mb-3">بيانات مندوب الشاحنة والتوصيل:</h4>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/70 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                  أبو فهد
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">أبو فهد العتيبي</div>
                  <div className="text-[10px] text-slate-500">شاحنة إيسوزو نقل توريدات (لوحة: 4821 أ ب ج)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:0501234567"
                id="call-driver-btn"
                onClick={() => showToast('جاري الاتصال بالمندوب أبو فهد 📞', 'info')}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصال بالمندوب</span>
              </a>

              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noreferrer"
                id="whatsapp-driver-btn"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>مراسلة واتساب</span>
              </a>
            </div>
          </div>

          {/* Ordered Products Collapsible */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <button
              type="button"
              id="toggle-order-items-btn"
              onClick={() => setShowItems(!showItems)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-900"
            >
              <span>محتويات الشحنة والكراتين ({order.items.length} أصناف)</span>
              {showItems ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showItems && (
              <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100">
                {order.items.map(item => (
                  <div key={item.productId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                      />
                      <div className="truncate">
                        <div className="font-bold text-slate-800 truncate">{item.productName}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.unit} × {item.unitPrice} ريال
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 font-mono">
                      {(item.totalPrice ?? 0).toFixed(2)} ريال
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-xs">
                  <span>المبلغ المدفوع:</span>
                  <span className="text-blue-900 font-black">{((order as any)?.grandTotal ?? (order as any)?.totalAmount ?? 0).toLocaleString('ar-YE')} ر.ي</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Search,
  ChevronLeft,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  PhoneCall,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const MyOrdersScreen: React.FC = () => {
  const { orders, setCurrentOrder, setCurrentView, reorder, products, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Categorize orders
  const activeOrders = useMemo(
    () => orders.filter(o => ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(o.status)),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter(o => ['delivered', 'cancelled'].includes(o.status)),
    [orders]
  );

  const displayedOrders = useMemo(() => {
    let list = orders;
    if (activeTab === 'active') {
      list = activeOrders;
    } else if (activeTab === 'completed') {
      list = completedOrders;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.items.some(it => it.productName.toLowerCase().includes(q))
    );
  }, [orders, activeTab, activeOrders, completedOrders, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            بانتظار التأكيد
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم التأكيد
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200">
            <Package className="w-3.5 h-3.5" />
            جاري التجهيز بالمستودع
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-300 animate-pulse">
            <Truck className="w-3.5 h-3.5" />
            خرج للتوصيل 🚚
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم التسليم بنجاح
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            طلب ملغي
          </span>
        );
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
    }
  };

  const handleTrackOrder = (order: Order) => {
    setCurrentOrder(order);
    setCurrentView('order_tracking');
  };

  const handleReorder = (order: Order) => {
    reorder(order);
    showToast(`تمت إضافة منتجات الطلب (${order.orderNumber}) إلى سلة الشراء بنجاح 🛒`, 'success');
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">سجل طلباتي</h1>
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {orders.length} طلب
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة مسار الشحنات، تفاصيل الفواتير، وإعادة الطلب بنقرة واحدة
          </p>
        </div>

        <button
          type="button"
          id="new-order-shop-btn"
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>طلب بضائع جديدة</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs mb-4 flex items-center gap-1">
        <button
          type="button"
          id="tab-active-orders"
          onClick={() => setActiveTab('active')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>الطلبات النشطة</span>
          {activeOrders.length > 0 && (
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'active' ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          id="tab-completed-orders"
          onClick={() => setActiveTab('completed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>الطلبات السابقة والمكتملة</span>
          {completedOrders.length > 0 && (
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'completed' ? 'bg-white text-blue-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {completedOrders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          id="tab-all-orders"
          onClick={() => setActiveTab('all')}
          className={`hidden sm:flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>الكل ({orders.length})</span>
        </button>
      </div>

      {/* Search Input Filter */}
      {orders.length > 0 && (
        <div className="relative mb-4">
          <input
            type="text"
            id="orders-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الطلب أو اسم المنتج..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 pr-10 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>
      )}

      {/* Orders List / Empty States */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center text-slate-800 shadow-xs">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">
            {activeTab === 'active'
              ? 'لا توجد طلبات نشطة حالياً'
              : activeTab === 'completed'
              ? 'لا توجد طلبات سابقة مكتملة'
              : 'لا توجد طلبات مسجلة'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            {activeTab === 'active'
              ? 'جميع شحناتك السابقة تم تسليمها بنجاح أو يمكنك بدء طلب كراتين جديدة الآن.'
              : 'عند إتمام طلباتك ستظهر هنا لتتمكن من إعادة طلبها بنقرة واحدة والحصول على عروض التوفير.'}
          </p>
          <button
            type="button"
            id="empty-state-shop-btn"
            onClick={() => setCurrentView('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-6 rounded-2xl shadow-md transition-all active:scale-95"
          >
            تصفح منتجات البشارة
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedOrders.map(order => {
            const stepIdx = getStatusStepIndex(order.status);
            const isExpanded = expandedOrderId === order.id;
            const isOrderActive = ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(order.status);

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                  isOrderActive ? 'border-blue-200 ring-1 ring-blue-500/10' : 'border-slate-200/80'
                }`}
              >
                {/* Card Top Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-sm">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">طلب:</span>
                        <span className="text-sm font-black text-blue-900 font-mono" dir="ltr">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {order.createdAt}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} أصناف</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Stepper Progress Bar (for active orders) */}
                {isOrderActive && stepIdx >= 0 && (
                  <div className="px-4 sm:px-6 py-3 bg-blue-50/50 border-b border-blue-100">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-2">
                      <span className={stepIdx >= 0 ? 'text-blue-900 font-black' : ''}>تم الاستلام</span>
                      <span className={stepIdx >= 1 ? 'text-blue-900 font-black' : ''}>التأكيد</span>
                      <span className={stepIdx >= 2 ? 'text-blue-900 font-black' : ''}>تجهيز المستودع</span>
                      <span className={stepIdx >= 3 ? 'text-purple-700 font-black' : ''}>خرج للتوصيل</span>
                      <span className={stepIdx >= 4 ? 'text-emerald-700 font-black' : ''}>تم التسليم</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(15, (stepIdx / 4) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Middle: Items List Preview */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-2.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200/60 bg-white"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {item.productName}
                            </h4>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>
                                {item.quantity} {item.unit} × {item.unitPrice} ريال
                              </span>
                              {item.cartonSpecs && (
                                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                                  {item.cartonSpecs}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            {(item.totalPrice ?? 0).toFixed(2)} ريال
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Order Details (Address, Payment, Notes) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 animate-in fade-in duration-200">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>عنوان التوصيل</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {order.deliveryAddress ? (
                            <>
                              {order.deliveryAddress.city} - {order.deliveryAddress.district}
                              <br />
                              {order.deliveryAddress.street}
                              {order.deliveryAddress.details && ` (${order.deliveryAddress.details})`}
                            </>
                          ) : (
                            'استلام من فرع البشارة - تعز بيرباشا'
                          )}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تفاصيل الدفع والملاحظات</span>
                        </div>
                        <div className="text-[11px] space-y-1">
                          <div>طريقة الدفع: <span className="font-bold text-slate-800">{order.paymentMethod === 'cod' ? 'الدفع نقدياً عند الاستلام' : 'تحويل بنكي / إلكتروني'}</span></div>
                          {order.notes && <div>ملاحظات: <span className="text-slate-500">{order.notes}</span></div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toggle Expand details button */}
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 py-1"
                    >
                      <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض تفاصيل العنوان والفاتورة'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Card Bottom Row: Total and Action Buttons */}
                <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">المبلغ الإجمالي للفاتورة:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-blue-900">
                        {(order?.grandTotal ?? 0).toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-slate-600">ريال سعودي</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Reorder Button */}
                    <button
                      type="button"
                      id={`quick-reorder-btn-${order.id}`}
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
                      title="إعادة طلب هذه المنتجات مباشرة"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة الطلب</span>
                    </button>

                    {/* Track Order Button */}
                    {isOrderActive ? (
                      <button
                        type="button"
                        id={`track-order-btn-${order.id}`}
                        onClick={() => handleTrackOrder(order)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>تتبع الشحنة 🚚</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        id={`invoice-btn-${order.id}`}
                        onClick={() => handleTrackOrder(order)}
                        className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>الفاتورة</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


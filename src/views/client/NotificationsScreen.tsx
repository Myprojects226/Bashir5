import React from 'react';
import {
  Bell,
  CheckCircle2,
  Package,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentView } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'offer':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'stock_alert':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900">الإشعارات والتنبيهات (FCM)</h2>
            <p className="text-xs text-slate-500">متابعة حالة الشحنات والعروض والتنبيهات الفورية</p>
          </div>
        </div>

        <button
          type="button"
          id="mark-all-read-btn"
          onClick={markAllNotificationsRead}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            id={`notif-${notif.id}`}
            onClick={() => markNotificationRead(notif.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              notif.isRead
                ? 'bg-white border-slate-200/80 shadow-xs opacity-80'
                : 'bg-blue-50/50 border-blue-200 shadow-sm'
            }`}
          >
            <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-100 shrink-0">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className={`text-xs sm:text-sm font-bold ${notif.isRead ? 'text-slate-800' : 'text-blue-950 font-black'}`}>
                  {notif.titleAr}
                </h3>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{notif.createdAt}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{notif.bodyAr}</p>
            </div>

            {!notif.isRead && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

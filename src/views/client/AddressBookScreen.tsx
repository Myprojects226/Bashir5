import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Check, ArrowRight, Home, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapPicker } from '../../components/common/MapPicker';
import { Address } from '../../types';

export const AddressBookScreen: React.FC = () => {
  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addNewAddress,
    deleteAddress,
    setDefaultAddress,
    setCurrentView
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900">دفتر العناوين ومواقع GPS</h2>
            <p className="text-xs text-slate-500">إدارة مواقع التوصيل لمنازلك ومحلاتك</p>
          </div>
        </div>

        {!isAdding && (
          <button
            type="button"
            id="add-address-btn"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عنوان جديد</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs mb-6">
          <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>تحديد موقع جديد عبر GPS والخريطة</span>
          </h3>
          <MapPicker
            onLocationSelected={data => {
              const newAddr = addNewAddress(data);
              setSelectedAddress(newAddr);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id}
                id={`addr-item-${addr.id}`}
                className={`bg-white p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-3 shadow-xs ${
                  isSelected ? 'border-blue-600 bg-blue-50/20 ring-4 ring-blue-50' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        {addr.title.includes('المنزل') ? <Home className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-black text-slate-900">{addr.title}</span>
                    </div>

                    {addr.isDefault && (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        العنوان الافتراضي
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-semibold mb-1">
                    {addr.city} - {addr.district}، {addr.street}
                  </p>
                  {addr.details && (
                    <p className="text-[11px] text-slate-500 mb-2">{addr.details}</p>
                  )}

                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>المستلم: <strong>{addr.recipientName}</strong></span>
                    <span dir="ltr">{addr.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      id={`set-default-addr-${addr.id}`}
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      تعيين كافتراضي
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> معتمد للطلبات
                    </span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      type="button"
                      id={`delete-addr-${addr.id}`}
                      onClick={() => deleteAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      title="حذف العنوان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

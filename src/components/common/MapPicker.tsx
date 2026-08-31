import React, { useState } from 'react';
import { MapPin, Navigation, Check, Home, Building2, Store } from 'lucide-react';
import { Address } from '../../types';
import { useApp } from '../../context/AppContext';

interface MapPickerProps {
  onLocationSelected: (addressData: {
    title: string;
    recipientName: string;
    phone: string;
    city: string;
    district: string;
    street: string;
    details: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  }) => void;
  onCancel?: () => void;
  initialAddress?: Partial<Address>;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelected,
  onCancel,
  initialAddress
}) => {
  const { user, showToast } = useApp();

  const [lat, setLat] = useState(initialAddress?.latitude || 13.5778);
  const [lng, setLng] = useState(initialAddress?.longitude || 43.9985);
  const [city, setCity] = useState(initialAddress?.city || 'تعز (المدينة)');
  const [district, setDistrict] = useState(initialAddress?.district || 'بيرباشا');
  const [street, setStreet] = useState(initialAddress?.street || 'شارع بيرباشا الرئيسي');
  const [details, setDetails] = useState(initialAddress?.details || 'بجوار جولة بيرباشا - مجمع البشارة التجاري');
  const [title, setTitle] = useState(initialAddress?.title || 'المنزل');
  const [recipientName, setRecipientName] = useState(initialAddress?.recipientName || user.name);
  const [phone, setPhone] = useState(initialAddress?.phone || user.phone);
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault ?? true);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setDistrict('موقعك المباشر GPS');
          setStreet('الموقع الجغرافي المحدد بدقة');
          setIsLocating(false);
          showToast('تم تحديد إحداثيات موقعك الجغرافي GPS بنجاح 📍', 'success');
        },
        error => {
          console.warn('Geolocation failed or denied, using simulated accurate pin', error);
          setLat(13.5778);
          setLng(43.9985);
          setDistrict('بيرباشا - تعز');
          setIsLocating(false);
          showToast('تم تحديد الموقع الجغرافي لتعز بيرباشا 📍', 'info');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      showToast('خدمة GPS غير مفعلة، تم استخدام موقع افتراضي لتعز', 'info');
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    if (selectedCity === 'تعز (المدينة)') {
      setLat(13.5778);
      setLng(43.9985);
      setDistrict('بيرباشا');
      setStreet('شارع بيرباشا الرئيسي');
    } else if (selectedCity === 'إب والقاعدة') {
      setLat(13.9667);
      setLng(44.1833);
      setDistrict('الظهار');
      setStreet('شارع العدين');
    } else if (selectedCity === 'صنعاء') {
      setLat(15.3694);
      setLng(44.1910);
      setDistrict('حدة');
      setStreet('شارع الستين');
    } else if (selectedCity === 'عدن') {
      setLat(12.7855);
      setLng(45.0187);
      setDistrict('المنصورة');
      setStreet('شارع التسعين');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !street) {
      showToast('يرجى تعبئة كافة بيانات العنوان المطلوبة', 'error');
      return;
    }

    onLocationSelected({
      title,
      recipientName,
      phone,
      city,
      district,
      street,
      details,
      latitude: lat,
      longitude: lng,
      isDefault
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800">
      {/* Map simulation container */}
      <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        {/* Simulated Map Background Grid & Roads */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-200/70 opacity-80" />
        
        {/* Simulated Road Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#94a3b8" strokeWidth="8" />
          <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#94a3b8" strokeWidth="12" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#94a3b8" strokeWidth="10" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="6" />
        </svg>

        {/* Central Draggable / Floating Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center pointer-events-none animate-bounce">
          <div className="bg-blue-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-blue-400 whitespace-nowrap mb-1">
            {district}، {city} 📍
          </div>
          <div className="relative">
            <MapPin className="w-10 h-10 text-rose-600 fill-rose-600 drop-shadow-md" />
            <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
          </div>
          <div className="w-4 h-1.5 bg-slate-800/30 rounded-full blur-[1px] mt-0.5" />
        </div>

        {/* Location Controls on Map */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          <button
            type="button"
            id="gps-locate-btn"
            onClick={handleGetCurrentGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-blue-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-slate-200 hover:bg-blue-50 active:scale-95 transition-all"
          >
            <Navigation className={`w-4 h-4 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'جاري تحديد GPS...' : 'تحديد موقعي GPS (تعز)'}</span>
          </button>
        </div>

        {/* Store Location Badge on Map */}
        <div className="absolute top-3 left-3 z-30 bg-blue-900/90 text-white text-[10px] px-2.5 py-1.5 rounded-xl backdrop-blur-xs font-bold border border-blue-400/40">
          🏬 مستودع البشارة المركزي: تعز - بيرباشا
        </div>

        {/* Lat / Long overlay */}
        <div className="absolute bottom-3 left-3 z-30 bg-slate-900/80 text-white text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs font-mono" dir="ltr">
          GPS: {(lat ?? 13.5778).toFixed(4)}, {(lng ?? 43.9985).toFixed(4)}
        </div>
      </div>

      {/* Quick City Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          المدينة والمحافظة:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'تعز (المدينة)', label: 'تعز (المدينة - بيرباشا)' },
            { name: 'إب والقاعدة', label: 'إب والقاعدة' },
            { name: 'صنعاء', label: 'صنعاء' },
            { name: 'عدن', label: 'عدن' }
          ].map(c => (
            <button
              key={c.name}
              type="button"
              id={`city-select-${c.name}`}
              onClick={() => handleCitySelect(c.name)}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all truncate ${
                city === c.name
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Address Type (Home / Work / Shop / Restaurant) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          نوع العنوان:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'المنزل', label: 'المنزل', icon: Home },
            { id: 'محل / مستودع', label: 'محل / بقالة', icon: Store },
            { id: 'مطعم / بوفية / كافيه', label: 'مطعم / كافيه', icon: Building2 }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              id={`addr-type-${item.id}`}
              onClick={() => setTitle(item.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                title === item.id
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            اسم المستلم أو المنشأة *
          </label>
          <input
            type="text"
            id="addr-recipient"
            required
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            placeholder="مثال: معاذ البركاني / مطعم الأندلس"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            رقم الهاتف للتواصل والتوصيل *
          </label>
          <input
            type="tel"
            id="addr-phone"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            placeholder="77XXXXXXX / 73XXXXXXX"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            الحي أو المنطقة *
          </label>
          <input
            type="text"
            id="addr-district"
            required
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            placeholder="مثال: بيرباشا / المسبح / شارع جمال / الروضة"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            اسم الشارع *
          </label>
          <input
            type="text"
            id="addr-street"
            required
            value={street}
            onChange={e => setStreet(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            placeholder="مثال: شارع بيرباشا الرئيسي"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          تفاصيل أو معلم مميز (رقم العمارة / المحل / جوار مدرسة أو جامع)
        </label>
        <textarea
          id="addr-details"
          rows={2}
          value={details}
          onChange={e => setDetails(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none"
          placeholder="مثال: بجوار جولة بيرباشا، عمارة النور الدور الثاني"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="addr-is-default"
          checked={isDefault}
          onChange={e => setIsDefault(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <label htmlFor="addr-is-default" className="text-xs font-medium text-slate-700 cursor-pointer">
          تعيين كعنوان افتراضي لتوصيل طلبات البشارة
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          id="save-address-btn"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-98 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>حفظ العنوان وتأكيد الموقع في تعز</span>
        </button>
        {onCancel && (
          <button
            type="button"
            id="cancel-address-btn"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
};

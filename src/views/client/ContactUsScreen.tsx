import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  ArrowRight,
  CheckCircle2,
  Truck,
  Quote,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { saveContactMessageToFirestore } from '../../lib/firebase';
import { AlBisharaLogo } from '../../components/common/AlBisharaLogo';

export const ContactUsScreen: React.FC = () => {
  const { setCurrentView, showToast, setIsBrandIdentityModalOpen } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('استفسار عن أسعار الجملة والكراتين في تعز');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const copyPhoneNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPhone(num);
    showToast(`تم نسخ الرقم: ${num}`, 'success');
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('يرجى تعبئة كافة الحقول المطلوبة', 'error');
      return;
    }

    saveContactMessageToFirestore({
      name,
      phone,
      subject,
      message
    }).catch(err => {
      console.warn('Firestore contact message note:', err);
    });

    setIsSent(true);
    showToast('تم حفظ وإرسال رسالتك في Firebase لمستودع البشارة - تعز بيرباشا بنجاح 📨', 'success');
  };

  const officialPhones = [
    { label: 'الخط الرئيسي للمبيعات', number: '776776429', intl: '+967 776 776 429' },
    { label: 'قسم الجملة والطلبيات الكبيرة', number: '783755055', intl: '+967 783 755 055' },
    { label: 'خدمة العملاء والتوصيل', number: '783744044', intl: '+967 783 744 044' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-28 text-slate-800">
      {/* Header with Brand Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 shadow-xs shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">تواصل مع مستودع ومحلات البشارة</h2>
            <p className="text-xs text-slate-500">اليمن - تعز - بيرباشا | خدمة عملاء وتوريد مستمر للمحلات والمطاعم</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBrandIdentityModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors w-fit"
        >
          <Quote className="w-3.5 h-3.5" />
          <span>دليل الهوية والشعارات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Official Phones from Brand Asset */}
          <div className="bg-gradient-to-br from-blue-900 to-sky-950 text-white p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-sm">أرقام التواصل الرسمية</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                مباشر
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {officialPhones.map(item => (
                <div
                  key={item.number}
                  className="bg-white/10 hover:bg-white/15 p-2.5 rounded-xl border border-white/10 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-[10px] text-blue-200 font-medium">{item.label}</div>
                    <div className="text-xs sm:text-sm font-bold font-mono text-white tracking-wider" dir="ltr">
                      {item.intl}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyPhoneNumber(item.number)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="نسخ الرقم"
                    >
                      {copiedPhone === item.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`tel:+967${item.number}`}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      title="اتصال مباشر"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://wa.me/967783755055"
                target="_blank"
                rel="noreferrer"
                id="direct-whatsapp-btn"
                className="flex items-center justify-center gap-2 w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب سريعة (+967 783 755 055)</span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61589413543387"
                target="_blank"
                rel="noreferrer"
                id="direct-facebook-btn"
                className="flex items-center justify-center gap-2 w-full p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md transition-all font-bold text-xs"
              >
                <Globe className="w-4 h-4" />
                <span>صفحة المتجر الرسمية على فيسبوك</span>
              </a>
            </div>
          </div>

          {/* Location & Hours Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-0.5">موقع ومستودع البشارة في تعز:</strong>
                <p className="text-slate-600 leading-relaxed font-bold">
                  تعز - جولة بير باشا - خط المطار - جوار مطعم حضرموت
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  الجمهورية اليمنية | مجمع ومستودع البشارة لتجارة وتوريد البلاستيك والمنظفات
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-0.5">شحن وتوصيل فوري:</strong>
                <p className="text-slate-500">
                  توصيل فوري خلال 1-3 ساعات لكافة مناطق تعز (بيرباشا، المسبح، شارع جمال، الروضة، الحصب) وشحن يومي لمحافظة إب وصنعاء وعدن وباقي المحافظات.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-0.5">ساعات العمل واستقبال الطلبيات:</strong>
                <p className="text-slate-500">
                  السبت - الخميس: من 8:00 صباحاً حتى 10:00 مساءً متواصل<br />
                  الجمعة: من 2:00 ظهراً حتى 10:00 مساءً
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">إرسال استفسار أو طلب عرض أسعار</h3>
                <p className="text-xs text-slate-500">سيقوم فريق المبيعات بالرد عليك عبر الواتساب أو الهاتف خلال دقائق</p>
              </div>
            </div>

            {isSent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-slate-900">تم إرسال رسالتك بنجاح!</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  شكراً لتواصلك مع مستودع البشارة تعز بيرباشا. سيقوم مسؤول المبيعات بالتواصل معك على الرقم ({phone}).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم الكامل أو اسم المنشأة / المحل *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="مثال: مطعم الشرق / سوبرماركت الخير / عمار..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف أو الواتساب *
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    placeholder="مثال: 776776429 أو 783755055"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                    نوع الاستفسار / الطلب
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="استفسار عن أسعار الجملة والكراتين في تعز">استفسار عن أسعار الجملة والكراتين في تعز</option>
                    <option value="طلب تجهيز وتوريد مستلزمات مطعم أو كافيه">طلب تجهيز وتوريد مستلزمات مطعم أو كافيه</option>
                    <option value="استفسار عن مساحيق الغسيل والمنظفات المركزة">استفسار عن مساحيق الغسيل والمنظفات المركزة</option>
                    <option value="طلب توريد مستحضرات وأدوات تجميل">طلب توريد مستحضرات وأدوات تجميل</option>
                    <option value="متابعة شحنة أو توصيل فوري">متابعة شحنة أو توصيل فوري</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                    تفاصيل الرسالة أو الكميات المطلوبة *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="اكتب هنا استفسارك أو قائمة الأصناف والكميات التي تود الاستفسار عن أسعار كراتينها..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة إلى مستودع البشارة</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

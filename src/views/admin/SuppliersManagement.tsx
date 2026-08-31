import React, { useState } from 'react';
import {
  Building2,
  Users,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  CreditCard,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  FileText,
  DollarSign,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supplier, PurchaseInvoice } from '../../types';

export const SuppliersManagement: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    purchaseInvoices,
    accountingTransactions,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formCompanyName, setFormCompanyName] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCity, setFormCity] = useState('تعز');
  const [formAddress, setFormAddress] = useState('');
  const [formCategory, setFormCategory] = useState('بلاستيك ومواد تعبئة');
  const [formPaymentTerms, setFormPaymentTerms] = useState('آجل 30 يوم');
  const [formBankName, setFormBankName] = useState('بنك الكريمي');
  const [formBankAccount, setFormBankAccount] = useState('');
  const [formCreditLimit, setFormCreditLimit] = useState(2000000);
  const [formInitialBalance, setFormInitialBalance] = useState(0);

  // Statement modal state
  const [selectedSupplierForStatement, setSelectedSupplierForStatement] = useState<Supplier | null>(null);

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormCompanyName('');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormCity('تعز');
    setFormAddress('');
    setFormCategory('بلاستيك ومواد تعبئة');
    setFormPaymentTerms('آجل 30 يوم');
    setFormBankName('بنك الكريمي');
    setFormBankAccount('');
    setFormCreditLimit(2000000);
    setFormInitialBalance(0);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setFormCompanyName(s.companyName);
    setFormContactPerson(s.contactPerson || '');
    setFormPhone(s.phone);
    setFormEmail(s.email || '');
    setFormCity(s.city || 'تعز');
    setFormAddress(s.address || '');
    setFormCategory(s.category || 'بلاستيك ومواد تعبئة');
    setFormPaymentTerms(s.paymentTerms || 'آجل 30 يوم');
    setFormBankName(s.bankName || 'بنك الكريمي');
    setFormBankAccount(s.bankAccountNumber || '');
    setFormCreditLimit(s.creditLimit || 2000000);
    setFormInitialBalance(s.balance || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompanyName.trim() || !formPhone.trim()) {
      showToast('يرجى كتابة اسم الشركة ورقم الهاتف', 'error');
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        companyName: formCompanyName,
        contactPerson: formContactPerson,
        phone: formPhone,
        email: formEmail,
        city: formCity,
        address: formAddress,
        category: formCategory,
        paymentTerms: formPaymentTerms,
        bankName: formBankName,
        bankAccountNumber: formBankAccount,
        creditLimit: Number(formCreditLimit)
      });
    } else {
      addSupplier({
        companyName: formCompanyName,
        contactPerson: formContactPerson,
        phone: formPhone,
        email: formEmail,
        city: formCity,
        address: formAddress,
        category: formCategory,
        balance: Number(formInitialBalance),
        totalPurchases: Number(formInitialBalance),
        totalPaid: 0,
        paymentTerms: formPaymentTerms,
        bankName: formBankName,
        bankAccountNumber: formBankAccount,
        creditLimit: Number(formCreditLimit),
        isActive: true
      });
    }

    setIsModalOpen(false);
  };

  // Metrics
  const totalSuppliersCount = suppliers.length;
  const totalSuppliersBalanceDue = suppliers.reduce((sum, s) => sum + Number(s.balance || 0), 0);
  const totalPurchasesOverall = suppliers.reduce((sum, s) => sum + Number(s.totalPurchases || 0), 0);

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.companyName.toLowerCase().includes(q) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
      s.phone.includes(q) ||
      (s.category && s.category.toLowerCase().includes(q));

    const matchesCity = cityFilter === 'all' || s.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              إدارة الموردين ومصانع التوريد ({suppliers.length})
            </h2>
            <p className="text-xs text-slate-500">
              دليل مصانع البلاستيك والمنظفات، الأرصدة المستحقة، كشوفات الحسابات وحدود الائتمان
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة مورد جديد</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center justify-between text-indigo-800 text-xs font-bold mb-1">
            <span>إجمالي الموردين المعتمدين</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-indigo-950">{totalSuppliersCount} مورد ومصنع</div>
          <div className="text-[10px] text-indigo-700 mt-1">تعز، صنعاء، وعدن</div>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
            <span>إجمالي مستحقات الموردين (الديون)</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-950">
            {totalSuppliersBalanceDue.toLocaleString('ar-YE')}{' '}
            <span className="text-xs font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-rose-700 mt-1">أرصدة آجلة مستحقة السداد</div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
            <span>إجمالي التوريدات والمشتريات</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-950">
            {totalPurchasesOverall.toLocaleString('ar-YE')}{' '}
            <span className="text-xs font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">قيمة البضائع المستلمة</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المصنع، المسؤول، رقم الهاتف، أو التخصص..."
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
        >
          <option value="all">جميع المدن والمحافظات</option>
          <option value="تعز">تعز</option>
          <option value="صنعاء">صنعاء</option>
          <option value="عدن">عدن</option>
          <option value="الحديدة">الحديدة</option>
        </select>
      </div>

      {/* Suppliers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(sup => (
          <div
            key={sup.id}
            className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-4.5 flex flex-col justify-between gap-3 shadow-2xs hover:border-indigo-300 transition-all"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-sm shrink-0">
                    {sup.companyName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{sup.companyName}</h3>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {sup.category || 'بلاستيك ومنظفات'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(sup)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="تعديل بيانات المورد"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف المورد "${sup.companyName}"؟`)) {
                        deleteSupplier(sup.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="حذف المورد"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-600 mb-3 bg-white p-2.5 rounded-xl border border-slate-200/70">
                {sup.contactPerson && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">المسؤول:</span>
                    <span className="font-bold text-slate-800">{sup.contactPerson}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">الهاتف:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold" dir="ltr">
                      {sup.phone}
                    </span>
                    <a
                      href={`https://wa.me/967${sup.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                      title="مراسلة عبر واتساب"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                {sup.city && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">المدينة / الفرع:</span>
                    <span className="text-slate-700">{sup.city} - {sup.address}</span>
                  </div>
                )}
                {sup.bankName && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">الحساب البنكي:</span>
                    <span className="font-mono text-[10px] text-slate-600">
                      {sup.bankName} ({sup.bankAccountNumber})
                    </span>
                  </div>
                )}
              </div>

              {/* Balance & Limits */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-rose-50/60 border border-rose-100 p-2 rounded-xl">
                  <div className="text-[10px] text-rose-700 font-bold">الرصيد المستحق (الدين)</div>
                  <div className="text-xs font-black text-rose-900 mt-0.5">
                    {Number(sup.balance || 0).toLocaleString('ar-YE')} ر.ي
                  </div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-xl">
                  <div className="text-[10px] text-emerald-700 font-bold">إجمالي المشتريات</div>
                  <div className="text-xs font-black text-emerald-900 mt-0.5">
                    {Number(sup.totalPurchases || 0).toLocaleString('ar-YE')} ر.ي
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedSupplierForStatement(sup)}
                className="flex-1 text-center bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>كشف حساب المورد</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT SUPPLIER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-3">
              {editingSupplier ? `تعديل بيانات المورد: ${editingSupplier.companyName}` : 'إضافة مورد ومصنع جديد'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشركة / المصنع *</label>
                <input
                  type="text"
                  required
                  value={formCompanyName}
                  onChange={e => setFormCompanyName(e.target.value)}
                  placeholder="مثال: مصنع تعز للبلاستيك والعبوات"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الشخص المسؤول</label>
                  <input
                    type="text"
                    value={formContactPerson}
                    onChange={e => setFormContactPerson(e.target.value)}
                    placeholder="م. أحمد الشميري"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / الواتساب *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="771234567"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المدينة</label>
                  <select
                    value={formCity}
                    onChange={e => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="تعز">تعز (المدينة / الحوبان)</option>
                    <option value="صنعاء">صنعاء</option>
                    <option value="عدن">عدن</option>
                    <option value="الحديدة">الحديدة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع التوريد والنشاط</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="بلاستيك، صوابين، كرتون"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم البنك المفضل</label>
                  <input
                    type="text"
                    value={formBankName}
                    onChange={e => setFormBankName(e.target.value)}
                    placeholder="الكريمي / التضامن"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الحساب / الآيبان</label>
                  <input
                    type="text"
                    value={formBankAccount}
                    onChange={e => setFormBankAccount(e.target.value)}
                    placeholder="300456789"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {!editingSupplier && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الرصيد الافتتاحي المستحق (ر.ي)</label>
                    <input
                      type="number"
                      value={formInitialBalance}
                      onChange={e => setFormInitialBalance(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">شروط السداد</label>
                    <input
                      type="text"
                      value={formPaymentTerms}
                      onChange={e => setFormPaymentTerms(e.target.value)}
                      placeholder="آجل 30 يوم / نقداً"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  {editingSupplier ? 'حفظ التعديلات' : 'إضافة المورد في السجلات'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER STATEMENT MODAL */}
      {selectedSupplierForStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  كشف حساب تفصيلي: {selectedSupplierForStatement.companyName}
                </h3>
                <p className="text-xs text-slate-500">
                  سجل الفواتير وسندات السداد وحركة المشتريات
                </p>
              </div>
              <div className="text-left font-bold text-xs bg-rose-50 text-rose-700 p-2 rounded-xl border border-rose-200">
                <div>الرصيد المتبقي المستحق:</div>
                <div className="text-sm font-black">
                  {Number(selectedSupplierForStatement.balance || 0).toLocaleString('ar-YE')} ر.ي
                </div>
              </div>
            </div>

            {/* Invoices from this supplier */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">فواتير التوريد المخزني:</h4>
              <div className="space-y-2">
                {purchaseInvoices
                  .filter(inv => inv.supplierId === selectedSupplierForStatement.id)
                  .map(inv => (
                    <div
                      key={inv.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">فاتورة #{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-500">{inv.date} - {inv.items.length} أصناف</div>
                      </div>
                      <div className="text-left font-bold">
                        <div className="text-slate-900">{inv.totalAmount.toLocaleString('ar-YE')} ر.ي</div>
                        <div className="text-[10px] text-emerald-700">مدفوع: {inv.paidAmount.toLocaleString('ar-YE')} ر.ي</div>
                      </div>
                    </div>
                  ))}
                {purchaseInvoices.filter(inv => inv.supplierId === selectedSupplierForStatement.id).length === 0 && (
                  <div className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                    لا توجد فواتير مشتريات مسجلة لهذا المورد حتى الآن
                  </div>
                )}
              </div>

              {/* Payment transactions to this supplier */}
              <h4 className="text-xs font-bold text-slate-800 pt-2">سندات الصرف والتحويل للمورد:</h4>
              <div className="space-y-2">
                {accountingTransactions
                  .filter(tx => tx.partyId === selectedSupplierForStatement.id || tx.partyName === selectedSupplierForStatement.companyName)
                  .map(tx => (
                    <div
                      key={tx.id}
                      className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-emerald-900">سند صرف #{tx.entryNumber}</div>
                        <div className="text-[10px] text-slate-500">{tx.date} - {tx.description}</div>
                      </div>
                      <div className="font-black text-emerald-800">
                        {Number(tx.amount).toLocaleString('ar-YE')} ر.ي
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setSelectedSupplierForStatement(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

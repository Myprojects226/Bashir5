import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  Trash2,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  CreditCard,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Scale,
  Percent,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AccountingTransaction,
  FinancialAccount,
  PurchaseInvoice,
  PackagingUnit,
  Supplier
} from '../../types';

export const AccountingManagement: React.FC = () => {
  const {
    financialAccounts,
    setFinancialAccounts,
    updateFinancialAccount,
    accountingTransactions,
    addAccountingTransaction,
    deleteAccountingTransaction,
    purchaseInvoices,
    addPurchaseInvoice,
    deletePurchaseInvoice,
    suppliers,
    orders,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'vouchers' | 'invoices' | 'chart' | 'pnl'>('vouchers');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'receipt_voucher' | 'payment_voucher' | 'operating_expense'>('all');

  // Modal states
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txType, setTxType] = useState<'receipt_voucher' | 'payment_voucher' | 'operating_expense'>('receipt_voucher');
  const [txAmount, setTxAmount] = useState<number>(50000);
  const [txAccountFrom, setTxAccountFrom] = useState('صندوق النقدية الرئيسي (كاش تعز)');
  const [txAccountTo, setTxAccountTo] = useState('إيرادات مبيعات التجزئة والجملة');
  const [txPartyName, setTxPartyName] = useState('');
  const [txPartyType, setTxPartyType] = useState<'customer' | 'supplier' | 'employee' | 'general'>('customer');
  const [txCategory, setTxCategory] = useState('customer_receipt');
  const [txDescription, setTxDescription] = useState('');
  const [txPaymentMethod, setTxPaymentMethod] = useState<'cod' | 'kuraimi' | 'bank_transfer' | 'one_cash' | 'cash'>('cod');
  const [txReference, setTxReference] = useState('');

  // New Purchase Invoice modal state
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [invSupplierId, setInvSupplierId] = useState(suppliers[0]?.id || '');
  const [invDate, setInvDate] = useState(new Date().toISOString().slice(0, 10));
  const [invItems, setInvItems] = useState<Array<{
    productName: string;
    unit: PackagingUnit;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
  }>>([
    {
      productName: 'كرتون كاسات بلاستيك 7 أونصة (1000 حبة)',
      unit: 'كرتون',
      quantity: 20,
      costPrice: 14500,
      sellingPrice: 18500
    }
  ]);
  const [invPaidAmount, setInvPaidAmount] = useState(200000);
  const [invDiscount, setInvDiscount] = useState(0);
  const [invNotes, setInvNotes] = useState('توريد بضاعة لمستودع بيرباشا');
  const [invPaymentMethod, setInvPaymentMethod] = useState<'kuraimi' | 'bank_transfer' | 'cash' | 'one_cash'>('kuraimi');

  // Selected Voucher for printable receipt modal
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<AccountingTransaction | null>(null);

  // Totals calculations
  const totalSalesRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? (o.totalAmount || 0) : 0), 0);
  const totalReceipts = accountingTransactions
    .filter(t => t.type === 'receipt_voucher')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalPayments = accountingTransactions
    .filter(t => t.type === 'payment_voucher')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalOperatingExpenses = accountingTransactions
    .filter(t => t.type === 'operating_expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalPurchasesAmount = purchaseInvoices
    .reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

  // Net Cash Flow & Estimated Gross Profit
  const netCashFlow = totalReceipts - (totalPayments + totalOperatingExpenses);
  const totalLiquidAssets = financialAccounts
    .filter(a => a.type === 'asset' && !a.nameAr.includes('المخزون') && !a.nameAr.includes('العملاء'))
    .reduce((sum, a) => sum + Number(a.balance || 0), 0);

  // Available Packaging Units
  const packagingUnitsList: PackagingUnit[] = [
    'كرتون',
    'حبة',
    'شدة',
    'باكت',
    'درزن',
    'لفة',
    'ربطة',
    'رول',
    'كيس',
    'بالة',
    'طقم',
    'جالون',
    'لتر',
    'متر',
    'كيلو',
    'علبة'
  ];

  // Submit new transaction
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || txAmount <= 0) {
      showToast('يرجى إدخال مبلغ صحيح', 'error');
      return;
    }

    const prefix = txType === 'receipt_voucher' ? 'RV' : txType === 'payment_voucher' ? 'PV' : 'EXP';
    const entryNum = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addAccountingTransaction({
      entryNumber: entryNum,
      type: txType,
      date: new Date().toISOString().slice(0, 10),
      amount: Number(txAmount),
      accountFrom: txAccountFrom,
      accountTo: txAccountTo,
      partyType: txPartyType,
      partyName: txPartyName || 'جهة عامة',
      category: txCategory,
      description: txDescription || `سند ${txType === 'receipt_voucher' ? 'قبض' : 'صرف'} مالي`,
      referenceNumber: txReference,
      paymentMethod: txPaymentMethod,
      status: 'confirmed',
      createdBy: 'مدير الحسابات'
    });

    setIsAddTxOpen(false);
    setTxAmount(50000);
    setTxPartyName('');
    setTxDescription('');
    setTxReference('');
  };

  // Submit new purchase invoice
  const handleCreatePurchaseInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === invSupplierId);
    if (!sup) {
      showToast('يرجى اختيار المورد', 'error');
      return;
    }

    const itemsCalculated = invItems.map((it, idx) => ({
      productId: `prod_inv_${Date.now()}_${idx}`,
      productName: it.productName,
      unit: it.unit,
      quantity: Number(it.quantity),
      costPrice: Number(it.costPrice),
      totalCost: Number(it.quantity) * Number(it.costPrice),
      sellingPrice: Number(it.sellingPrice)
    }));

    const subtotal = itemsCalculated.reduce((sum, it) => sum + it.totalCost, 0);
    const totalAmount = Math.max(0, subtotal - Number(invDiscount));
    const paid = Math.min(Number(invPaidAmount), totalAmount);
    const remaining = totalAmount - paid;

    const invNum = `PINV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addPurchaseInvoice({
      invoiceNumber: invNum,
      supplierId: sup.id,
      supplierName: sup.companyName,
      supplierPhone: sup.phone,
      date: invDate,
      items: itemsCalculated,
      subtotal,
      discount: Number(invDiscount),
      tax: 0,
      totalAmount,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentStatus: remaining === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
      paymentMethod: invPaymentMethod,
      notes: invNotes,
      status: 'received'
    });

    setIsAddInvoiceOpen(false);
  };

  // Filtered transactions
  const filteredTransactions = accountingTransactions.filter(tx => {
    const matchesSearch =
      !searchTerm ||
      tx.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                النظام المحاسبي والمالي المتكامل (Accounting & General Ledger)
              </h2>
              <p className="text-xs text-slate-500">
                سندات القبض والصرف، فواتير المشتريات، دليل الحسابات، وقائمة الأرباح والخسائر
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTxType('receipt_voucher');
              setTxCategory('customer_receipt');
              setTxAccountTo('إيرادات مبيعات التجزئة والجملة');
              setIsAddTxOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ سند قبض (تحصيل)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTxType('payment_voucher');
              setTxCategory('supplier_payment');
              setTxAccountTo('الموردون والدائنون');
              setIsAddTxOpen(true);
            }}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ سند صرف (سداد مورد)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTxType('operating_expense');
              setTxCategory('rent');
              setTxAccountTo('مصروفات الإيجار والتشغيل');
              setIsAddTxOpen(true);
            }}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ قيد مصروف تشغيلي</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddInvoiceOpen(true)}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ فاتورة مشتريات (توريد)</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
            <span>إجمالي المقبوضات</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-900">
            {totalReceipts.toLocaleString('ar-YE')} <span className="text-[10px] font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">تحصيلات المبيعات والعملاء</div>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
            <span>المدفوعات والمصروفات</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg font-black text-rose-900">
            {(totalPayments + totalOperatingExpenses).toLocaleString('ar-YE')}{' '}
            <span className="text-[10px] font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-rose-700 mt-1">سداد موردين + مصاريف تشغيلية</div>
        </div>

        <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold mb-1">
            <span>رصيد السيولة النقدية</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-blue-900">
            {totalLiquidAssets.toLocaleString('ar-YE')} <span className="text-[10px] font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-blue-700 mt-1">الصندوق + الكريمي + التضامن</div>
        </div>

        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center justify-between text-indigo-800 text-xs font-bold mb-1">
            <span>فواتير المشتريات</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-indigo-900">
            {totalPurchasesAmount.toLocaleString('ar-YE')} <span className="text-[10px] font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-indigo-700 mt-1">{purchaseInvoices.length} فواتير توريد مخزني</div>
        </div>

        <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-purple-800 text-xs font-bold mb-1">
            <span>صافي التدفق النقدي</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className={`text-lg font-black ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {netCashFlow.toLocaleString('ar-YE')} <span className="text-[10px] font-normal">ر.ي</span>
          </div>
          <div className="text-[10px] text-purple-700 mt-1">الفارق النقدي المحقق</div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'vouchers', label: `🧾 سندات القبض والصرف والقيود (${accountingTransactions.length})` },
          { id: 'invoices', label: `📦 فواتير مشتريات الموردين (${purchaseInvoices.length})` },
          { id: 'chart', label: `📊 دليل الحسابات وأرصدة البنوك (${financialAccounts.length})` },
          { id: 'pnl', label: `📈 قائمة الأرباح والخسائر والتدفق المالي` }
        ].map(sub => (
          <button
            key={sub.id}
            type="button"
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === sub.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: VOUCHERS & JOURNAL ENTRIES */}
      {activeSubTab === 'vouchers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث برقم السند، اسم الطرف، البيان أو رقم المرجع..."
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="all">جميع أنواع القيود والسندات</option>
                <option value="receipt_voucher">سندات قبض (تحصيل مالي)</option>
                <option value="payment_voucher">سندات صرف (سداد موردين)</option>
                <option value="operating_expense">مصروفات تشغيلية (إيجار/وقود/رواتب)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3">رقم السند</th>
                  <th className="p-3">النوع</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الطرف / العميل / المورد</th>
                  <th className="p-3">البيان والشرح</th>
                  <th className="p-3">طريقة الدفع</th>
                  <th className="p-3">المبلغ (ر.ي)</th>
                  <th className="p-3 text-center">طباعة / إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map(tx => {
                  const isReceipt = tx.type === 'receipt_voucher';
                  const isPayment = tx.type === 'payment_voucher';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{tx.entryNumber}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isReceipt
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPayment
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isReceipt ? 'سند قبض' : isPayment ? 'سند صرف' : 'مصروف تشغيلي'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{tx.date}</td>
                      <td className="p-3 font-bold text-slate-800">{tx.partyName || 'طرف عام'}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {tx.paymentMethod === 'kuraimi'
                            ? 'الكريمي'
                            : tx.paymentMethod === 'bank_transfer'
                            ? 'تحويل بنكي'
                            : tx.paymentMethod === 'one_cash'
                            ? 'محفظة ون كاش'
                            : 'نقداً (كاش)'}
                        </span>
                      </td>
                      <td className="p-3 font-black text-sm">
                        <span className={isReceipt ? 'text-emerald-700' : 'text-rose-700'}>
                          {isReceipt ? '+' : '-'} {Number(tx.amount).toLocaleString('ar-YE')} ر.ي
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVoucherForPrint(tx)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="طباعة السند المالي"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا القيد المحاسبي؟')) {
                                deleteAccountingTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="حذف القيد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: PURCHASE INVOICES FROM SUPPLIERS */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">
              سجل فواتير الشراء والتوريد المخزني من مصانع وموردي البلاستيك والمنظفات
            </h3>
            <button
              type="button"
              onClick={() => setIsAddInvoiceOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إصدار فاتورة مشتريات جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {purchaseInvoices.map(inv => (
              <div
                key={inv.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2.5">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{inv.invoiceNumber}</div>
                      <div className="text-xs text-blue-900 font-bold flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{inv.supplierName}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.paymentStatus === 'paid'
                          ? 'مسددة بالكامل'
                          : inv.paymentStatus === 'partial'
                          ? 'مسددة جزئياً'
                          : 'آجل غير مسدد'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{inv.date}</div>
                    </div>
                  </div>

                  {/* Invoice Items summary */}
                  <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80 mb-2">
                    <div className="text-[11px] font-bold text-slate-500 mb-1">الأصناف والوحدات الموردة:</div>
                    {inv.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 font-medium">
                          • {it.productName} ({it.quantity} {it.unit})
                        </span>
                        <span className="font-bold text-slate-900">{it.totalCost.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">إجمالي الفاتورة: </span>
                    <span className="font-black text-slate-900 text-sm">
                      {inv.totalAmount.toLocaleString('ar-YE')} ر.ي
                    </span>
                    {inv.remainingAmount > 0 && (
                      <div className="text-[11px] font-bold text-rose-600">
                        متبقي آجل: {inv.remainingAmount.toLocaleString('ar-YE')} ر.ي
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من رغبتك في حذف فاتورة المشتريات هذه؟')) {
                          deletePurchaseInvoice(inv.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="حذف الفاتورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: CHART OF ACCOUNTS */}
      {activeSubTab === 'chart' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">دليل الحسابات المالي وأرصدة الخزائن والبنوك</h3>
              <p className="text-xs text-slate-500">متابعة أرصدة الأصول والالتزامات والمصروفات والإيرادات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {financialAccounts.map(acc => (
              <div
                key={acc.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      كود: {acc.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        acc.type === 'asset'
                          ? 'bg-blue-100 text-blue-800'
                          : acc.type === 'liability'
                          ? 'bg-rose-100 text-rose-800'
                          : acc.type === 'revenue'
                          ? 'bg-emerald-100 text-emerald-800'
                          : acc.type === 'expense'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {acc.type === 'asset'
                        ? 'أصول / نقدية'
                        : acc.type === 'liability'
                        ? 'خصوم والتزامات'
                        : acc.type === 'revenue'
                        ? 'إيرادات مبيعات'
                        : acc.type === 'expense'
                        ? 'مصروفات تشغيل'
                        : 'حقوق ملكية'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mb-1">{acc.nameAr}</h4>
                  <p className="text-[11px] text-slate-500">{acc.description}</p>
                </div>

                <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">الرصيد الدفتري:</span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {Number(acc.balance).toLocaleString('ar-YE')} {acc.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: PROFIT & LOSS STATEMENT */}
      {activeSubTab === 'pnl' && (
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-base font-black text-slate-900">
              قائمة الأرباح والخسائر والتدفقات المالية التقديرية
            </h3>
            <p className="text-xs text-slate-500">مؤسسة البشارة للبلاستيك والمنظفات - فرع تعز بيرباشا</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Revenue */}
            <div>
              <div className="flex items-center justify-between text-sm font-bold text-emerald-800 border-b border-slate-200 pb-2">
                <span>1. إجمالي إيرادات المبيعات (Sales Revenue)</span>
                <span className="text-base font-black font-mono">
                  {totalSalesRevenue.toLocaleString('ar-YE')} ر.ي
                </span>
              </div>
            </div>

            {/* Cost of Goods Sold */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1">
                <span>2. تكلفة مشتريات وتوريد البضاعة (COGS)</span>
                <span className="font-mono text-rose-700">
                  - {totalPurchasesAmount.toLocaleString('ar-YE')} ر.ي
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-blue-900 bg-blue-50/50 p-2.5 rounded-xl">
                <span>= إجمالي مجمل الربح التقديري (Gross Profit)</span>
                <span className="font-mono">
                  {Math.max(0, totalSalesRevenue - totalPurchasesAmount).toLocaleString('ar-YE')} ر.ي
                </span>
              </div>
            </div>

            {/* Operating Expenses Breakdown */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1">
                3. المصروفات التشغيلية والإدارية (Operating Expenses):
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pr-2">
                <span>• إيجار المستودع والمعرض (بيرباشا)</span>
                <span className="font-mono">450,000 ر.ي</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pr-2">
                <span>• رواتب عمال التجهيز وسائقي شاحنات التوزيع</span>
                <span className="font-mono">620,000 ر.ي</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pr-2">
                <span>• ديزل ومحروقات شاحنات التوزيع وصيانتها</span>
                <span className="font-mono">185,000 ر.ي</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pr-2">
                <span>• كهرباء وماء ومصروفات نثرية</span>
                <span className="font-mono">95,000 ر.ي</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 pt-1 border-t border-slate-100">
                <span>إجمالي المصاريف التشغيلية</span>
                <span className="font-mono">- {totalOperatingExpenses.toLocaleString('ar-YE')} ر.ي</span>
              </div>
            </div>

            {/* Net Operating Profit */}
            <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">
                صافي الربح التشغيلي المحقق (Net Operating Income)
              </span>
              <span className="text-lg font-black text-emerald-700 font-mono">
                {(totalReceipts - totalPayments - totalOperatingExpenses).toLocaleString('ar-YE')} ر.ي
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TRANSACTION MODAL */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-3">
              {txType === 'receipt_voucher'
                ? 'تحرير سند قبض مالي (تحصيل)'
                : txType === 'payment_voucher'
                ? 'تحرير سند صرف مالي (سداد مورد)'
                : 'تقييد مصروف تشغيلي'}
            </h3>

            <form onSubmit={handleCreateTransaction} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ بالريال اليمني *</label>
                <input
                  type="number"
                  required
                  value={txAmount}
                  onChange={e => setTxAmount(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطرف (العميل / المورد / الجهة) *</label>
                <input
                  type="text"
                  required
                  value={txPartyName}
                  onChange={e => setTxPartyName(e.target.value)}
                  placeholder="مثال: مطاعم الأندلس / شركة تعز للبلاستيك"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">طريقة الدفع</label>
                  <select
                    value={txPaymentMethod}
                    onChange={e => setTxPaymentMethod(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="cod">نقداً (كاش خزانة)</option>
                    <option value="kuraimi">بنك الكريمي</option>
                    <option value="bank_transfer">بنك التضامن</option>
                    <option value="one_cash">محفظة ون كاش / جيب</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم المرجع / الحوالة</label>
                  <input
                    type="text"
                    value={txReference}
                    onChange={e => setTxReference(e.target.value)}
                    placeholder="KUR-99012"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البيان والشرح التفصيلي</label>
                <textarea
                  rows={2}
                  value={txDescription}
                  onChange={e => setTxDescription(e.target.value)}
                  placeholder="سند قبض قيمة طلب كراتين كاسات / سداد دفعة حساب..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  حفظ وتوثيق السند المالي
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PURCHASE INVOICE MODAL */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-slate-900 mb-3">
              إصدار فاتورة مشتريات وتوريد بضاعة مخزنية
            </h3>

            <form onSubmit={handleCreatePurchaseInvoice} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المورد المعتمد *</label>
                  <select
                    value={invSupplierId}
                    onChange={e => setInvSupplierId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    required
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={invDate}
                    onChange={e => setInvDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Items in Invoice */}
              <div className="border border-slate-200 p-3 rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">الأصناف والوحدات المشتراة:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInvItems(prev => [
                        ...prev,
                        {
                          productName: '',
                          unit: 'كرتون',
                          quantity: 10,
                          costPrice: 15000,
                          sellingPrice: 19000
                        }
                      ]);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة صنف آخر</span>
                  </button>
                </div>

                {invItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="اسم الصنف المشتري (مثال: كرتون صحون قصدير)"
                        value={item.productName}
                        onChange={e => {
                          const val = e.target.value;
                          setInvItems(prev => prev.map((it, i) => (i === idx ? { ...it, productName: val } : it)));
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">الوحدة</label>
                        <select
                          value={item.unit}
                          onChange={e => {
                            const val = e.target.value as PackagingUnit;
                            setInvItems(prev => prev.map((it, i) => (i === idx ? { ...it, unit: val } : it)));
                          }}
                          className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        >
                          {packagingUnitsList.map(u => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500">الكمية</label>
                        <input
                          type="number"
                          required
                          value={item.quantity}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setInvItems(prev => prev.map((it, i) => (i === idx ? { ...it, quantity: val } : it)));
                          }}
                          className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500">سعر التكلفة (ر.ي)</label>
                        <input
                          type="number"
                          required
                          value={item.costPrice}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setInvItems(prev => prev.map((it, i) => (i === idx ? { ...it, costPrice: val } : it)));
                          }}
                          className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500">سعر البيع المقترح</label>
                        <input
                          type="number"
                          value={item.sellingPrice}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setInvItems(prev => prev.map((it, i) => (i === idx ? { ...it, sellingPrice: val } : it)));
                          }}
                          className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المدفوع مقدماً (ر.ي)</label>
                  <input
                    type="number"
                    value={invPaidAmount}
                    onChange={e => setInvPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">طريقة دفع الدفعة</label>
                  <select
                    value={invPaymentMethod}
                    onChange={e => setInvPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="kuraimi">الكريمي إكسبرس</option>
                    <option value="bank_transfer">بنك التضامن</option>
                    <option value="cash">نقداً من الصندوق</option>
                    <option value="one_cash">محفظة ون كاش</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الاستلام والمستودع</label>
                <input
                  type="text"
                  value={invNotes}
                  onChange={e => setInvNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  حفظ الفاتورة وتحديث رصيد المورد
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT VOUCHER MODAL */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-slate-800">
            <div className="border-2 border-slate-900 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 text-center">
                <div>
                  <h2 className="text-base font-black text-slate-900">مؤسسة البشارة للبلاستيك والمنظفات</h2>
                  <p className="text-[10px] text-slate-600">تعز - بيرباشا - هاتف: 777123456</p>
                </div>
                <div className="text-left font-mono">
                  <div className="text-sm font-black text-blue-900">{selectedVoucherForPrint.entryNumber}</div>
                  <div className="text-[10px] text-slate-500">{selectedVoucherForPrint.date}</div>
                </div>
              </div>

              <div className="text-center font-black text-sm bg-slate-100 py-1 rounded-lg">
                {selectedVoucherForPrint.type === 'receipt_voucher'
                  ? 'ســـنـد قــبـــض مـــالـــي'
                  : selectedVoucherForPrint.type === 'payment_voucher'
                  ? 'ســـنـد صـــرف مـــالـــي'
                  : 'ســـنـد مــصــروف تـشـغـيـلـي'}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-600">
                    {selectedVoucherForPrint.type === 'receipt_voucher' ? 'استلمنا من الأخ / السادة:' : 'صرفنا للأخ / السادة:'}
                  </span>
                  <span className="font-black text-slate-900">{selectedVoucherForPrint.partyName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-600">مبلغ وقدره:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {Number(selectedVoucherForPrint.amount).toLocaleString('ar-YE')} ريال يمني فقط لا غير
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-600">وذلك عن:</span>
                  <span className="text-slate-800">{selectedVoucherForPrint.description}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">طريقة الدفع:</span>
                  <span className="font-bold text-slate-800">
                    {selectedVoucherForPrint.paymentMethod === 'kuraimi'
                      ? 'حوالة بنك الكريمي'
                      : selectedVoucherForPrint.paymentMethod === 'bank_transfer'
                      ? 'تحويل بنك التضامن'
                      : 'نقداً'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-300 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-600 mb-6">توقيع المحاسب / أمين الصندوق</div>
                  <div className="font-mono text-[10px] text-slate-400">.............................</div>
                </div>
                <div>
                  <div className="font-bold text-slate-600 mb-6">توقيع المستلم / العميل</div>
                  <div className="font-mono text-[10px] text-slate-400">.............................</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة السند</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVoucherForPrint(null)}
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

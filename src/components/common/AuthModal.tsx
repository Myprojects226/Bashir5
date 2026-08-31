import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerType, AuthModalTab } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    authModalReason,
    authStep,
    setAuthStep,
    loginWithPhone,
    verifyOtp,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    loginWithGoogle,
    showToast
  } = useApp();

  // Login form state
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regCustomerType, setRegCustomerType] = useState<CustomerType>('retail');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Forgot password state
  const [forgotInput, setForgotInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // OTP state
  const [phoneForOtp, setPhoneForOtp] = useState('777123456');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    let interval: any;
    if (authModalTab === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [authModalTab, timer]);

  if (!isAuthModalOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone.trim()) {
      showToast('يرجى إدخال البريد الإلكتروني أو رقم الجوال', 'error');
      return;
    }

    // Check if input is a phone number without password (switch to OTP)
    if (!loginEmailOrPhone.includes('@') && !loginPassword) {
      setPhoneForOtp(loginEmailOrPhone.trim());
      setTimer(45);
      setCanResend(false);
      setAuthModalTab('otp');
      loginWithPhone(loginEmailOrPhone.trim());
      return;
    }

    if (!loginPassword) {
      showToast('يرجى إدخال كلمة المرور', 'error');
      return;
    }

    setIsLoggingIn(true);
    const emailToUse = loginEmailOrPhone.includes('@') 
      ? loginEmailOrPhone.trim() 
      : `${loginEmailOrPhone.trim()}@albashara.ye`;

    const success = await loginWithEmail(emailToUse, loginPassword);
    setIsLoggingIn(false);
    if (success) {
      setLoginEmailOrPhone('');
      setLoginPassword('');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast('يرجى كتابة الاسم الكامل', 'error');
      return;
    }
    if (!regPhone.trim()) {
      showToast('يرجى إدخال رقم الجوال', 'error');
      return;
    }
    if (!regEmail.trim()) {
      showToast('يرجى إدخال البريد الإلكتروني', 'error');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      showToast('يجب أن تتكون كلمة المرور من 6 خانات على الأقل', 'error');
      return;
    }

    setIsRegistering(true);
    const success = await registerWithEmail({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      password: regPassword,
      customerType: regCustomerType,
      companyName: regCompanyName.trim() || undefined
    });
    setIsRegistering(false);
    if (success) {
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
      setRegCompanyName('');
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) {
      showToast('يرجى إدخال البريد الإلكتروني أو رقم الجوال المسجل', 'error');
      return;
    }
    setIsResetting(true);
    const success = await resetPassword(forgotInput.trim());
    setIsResetting(false);
    if (success) {
      setResetSuccess(true);
    }
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 4) {
      showToast('يرجى إدخال رمز التحقق المكون من 4 أرقام', 'error');
      return;
    }
    setIsVerifyingOtp(true);
    verifyOtp(fullCode, {
      name: regName || undefined,
      email: regEmail || undefined,
      customerType: regCustomerType
    });
    setIsVerifyingOtp(false);
  };

  const handleResendOtp = () => {
    setTimer(45);
    setCanResend(false);
    showToast('تمت إعادة إرسال رمز التحقق SMS 📲', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative text-slate-800 my-auto">
        {/* Close Button */}
        <button
          type="button"
          id="close-auth-modal-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action / Requirement Banner if triggered from cart/checkout/profile */}
        {authModalReason && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-2.5 text-blue-900 text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{authModalReason}</span>
              <p className="text-[11px] text-blue-700/90 mt-0.5">
                سجل الدخول أو أنشئ حساباً لحفظ عنوانك، متابعة حالة الشحنة، والحصول على عروض الجملة.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-full">
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setAuthModalTab('login');
                setResetSuccess(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setAuthModalTab('register');
                setResetSuccess(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalTab === 'register'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              إنشاء حساب جديد
            </button>
            <button
              type="button"
              id="auth-tab-forgot"
              onClick={() => setAuthModalTab('forgot')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                authModalTab === 'forgot'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="استعادة كلمة المرور"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================= TAB 1: LOGIN ======================= */}
        {authModalTab === 'login' && (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-5">
              <h3 className="text-base font-black text-slate-900">تسجيل الدخول إلى حسابك</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                أدخل بريدك الإلكتروني أو رقم جوالك وكلمة المرور
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني أو رقم الجوال *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="login-email-phone-input"
                    required
                    value={loginEmailOrPhone}
                    onChange={e => setLoginEmailOrPhone(e.target.value)}
                    placeholder="example@gmail.com أو 777123456"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    dir="ltr"
                  />
                  <Mail className="absolute right-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    كلمة المرور *
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-password-input"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 pl-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                    dir="ltr"
                  />
                  <Lock className="absolute right-3 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-email-login-btn"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all mt-1"
              >
                {isLoggingIn ? (
                  <span>جاري تسجيل الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              {/* Quick OTP Alternative */}
              <button
                type="button"
                id="switch-to-phone-otp-btn"
                onClick={() => {
                  if (loginEmailOrPhone && !loginEmailOrPhone.includes('@')) {
                    setPhoneForOtp(loginEmailOrPhone);
                  }
                  setAuthModalTab('otp');
                  setTimer(45);
                  setCanResend(false);
                }}
                className="w-full text-center text-xs font-bold text-slate-600 hover:text-blue-700 py-1"
              >
                📱 أو الدخول السريع برمز التحقق SMS (OTP)
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400">
                أو تسجيل الدخول بنقرة واحدة
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              id="google-login-action-btn"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-98 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>المتابعة بحساب Google</span>
            </button>

            {/* Switch to Register link */}
            <div className="text-center mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                id="link-go-to-register"
                onClick={() => setAuthModalTab('register')}
                className="font-black text-blue-600 hover:underline"
              >
                تسجيل حساب جديد الآن
              </button>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: REGISTER ======================= */}
        {authModalTab === 'register' && (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-4">
              <h3 className="text-base font-black text-slate-900">إنشاء حساب جديد في متجر البشارة</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                احصل على أسعار الجملة، خصومات الكراتين، ومتابعة شحناتك في تعز
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع العميل / الحساب *
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { id: 'retail', label: 'عميل أفراد / تجزئة' },
                    { id: 'wholesale', label: 'تاجر كراتين جملة' },
                    { id: 'commercial', label: 'مطاعم وبوفيات B2B' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRegCustomerType(t.id as CustomerType)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        regCustomerType === t.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل / اسم المسؤول *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="register-name-input"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="مثال: معاذ البركاني"
                    className="w-full px-3.5 py-2.5 pr-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                  <UserIcon className="absolute right-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Company / Shop Name if wholesale or commercial */}
              {(regCustomerType === 'wholesale' || regCustomerType === 'commercial') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المحل أو المطعم أو المنشأة
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="register-company-input"
                      value={regCompanyName}
                      onChange={e => setRegCompanyName(e.target.value)}
                      placeholder="مثال: مطاعم الأندلس - تعز"
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    />
                    <Building2 className="absolute right-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الجوال *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="tel"
                      id="register-phone-input"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="777123456"
                      className="w-full px-3 py-2.5 pr-8 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      dir="ltr"
                    />
                    <Phone className="absolute right-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      id="register-email-input"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full px-3 py-2.5 pr-8 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      dir="ltr"
                    />
                    <Mail className="absolute right-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور (6 خانات على الأقل) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    id="register-password-input"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 pl-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    dir="ltr"
                  />
                  <Lock className="absolute right-3 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute left-3 text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-register-btn"
                disabled={isRegistering}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all mt-1"
              >
                {isRegistering ? (
                  <span>جاري إنشاء الحساب وحفظ البيانات...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>إنشاء الحساب والتسجيل</span>
                  </>
                )}
              </button>
            </form>

            {/* Google Signup */}
            <div className="mt-3">
              <button
                type="button"
                id="google-register-action-btn"
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>أو التسجيل الفوري بحساب Google</span>
              </button>
            </div>

            {/* Switch to Login link */}
            <div className="text-center mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                id="link-go-to-login"
                onClick={() => setAuthModalTab('login')}
                className="font-black text-blue-600 hover:underline"
              >
                تسجيل الدخول هنا
              </button>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: FORGOT PASSWORD ======================= */}
        {authModalTab === 'forgot' && (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">استعادة كلمة المرور</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                أدخل البريد الإلكتروني أو رقم الجوال لاستلام رابط أو كود إعادة التعيين
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-900 mb-4">
                <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <span className="font-bold block mb-1">تم إرسال تعليمات الاستعادة بنجاح!</span>
                <p className="text-[11px] text-emerald-700">
                  يرجى فحص بريدك الإلكتروني أو رسائل الجوال واتباع التعليمات لتعيين كلمة مرور جديدة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSuccess(false);
                    setAuthModalTab('login');
                  }}
                  className="mt-3 bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني أو رقم الجوال المسجل *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="forgot-input"
                      required
                      value={forgotInput}
                      onChange={e => setForgotInput(e.target.value)}
                      placeholder="user@gmail.com أو 777123456"
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      dir="ltr"
                    />
                    <Mail className="absolute right-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-forgot-btn"
                  disabled={isResetting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md active:scale-98 transition-all"
                >
                  {isResetting ? (
                    <span>جاري إرسال الطلب...</span>
                  ) : (
                    <span>إرسال رابط إعادة التعيين</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="text-center text-xs font-bold text-slate-500 hover:text-slate-800 pt-2"
                >
                  العودة لتسجيل الدخول
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================= TAB 4: OTP VERIFICATION ======================= */}
        {authModalTab === 'otp' && (
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">رمز التحقق السريع OTP</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تم إرسال كود التحقق إلى الجوال{' '}
                <span className="font-bold text-slate-800 font-mono" dir="ltr">{phoneForOtp}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-3" dir="ltr">
                {[0, 1, 2, 3].map(idx => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx]}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-black text-blue-900 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all shadow-xs"
                  />
                ))}
              </div>

              <div className="text-center text-xs text-slate-500">
                {canResend ? (
                  <button
                    type="button"
                    id="resend-otp-now-btn"
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة إرسال الرمز الآن</span>
                  </button>
                ) : (
                  <span>إعادة الإرسال بعد ({timer} ثانية)</span>
                )}
              </div>

              <button
                type="submit"
                id="submit-verify-otp-btn"
                disabled={isVerifyingOtp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md active:scale-98 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد الرمز والدخول</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                العودة للخيارات الأخرى
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

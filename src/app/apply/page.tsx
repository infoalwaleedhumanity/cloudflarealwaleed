'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Copy, Check, Briefcase, CreditCard, AlertCircle, 
  ChevronDown, Landmark, User, Lock, ArrowRight, ShieldCheck, FileText, 
  Sparkles, Coins, Landmark as BankIcon,
  Mail, Globe, MapPin, Heart, Home, Car
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSupabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import PhoneInput from '@/components/PhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNum] = useState(
    `WF-${Math.floor(10000000 + Math.random() * 90000000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );
  const [copied, setCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Custom dropdowns state
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isMaritalDropdownOpen, setIsMaritalDropdownOpen] = useState(false);
    
  const dropdownRef = useRef<HTMLDivElement>(null);
  const maritalDropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: '', idNumber: '', phone: '', email: '',
    country: '', otherCountry: '', city: '', requestType: '', description: '', iban: '', bankName: '', otherBankName: '', maritalStatus: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false);
      }
      if (maritalDropdownRef.current && !maritalDropdownRef.current.contains(event.target as Node)) {
        setIsMaritalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form Progress Calculator
  const calculateCompleteness = () => {
    const fields = [
      form.fullName, form.idNumber, form.phone, form.email,
      form.country, form.city, form.maritalStatus, form.requestType,
      form.description, form.iban, form.bankName
    ];
    const filled = fields.filter(f => f && f.trim() !== '').length;
    const extraScore = agreed ? 1 : 0;
    const totalFields = fields.length + 1; // +1 for agreement
    return Math.round(((filled + extraScore) / totalFields) * 100);
  };

  const completeness = calculateCompleteness();

  const validateField = (name: string, value: string) => {
    let err = '';
    if (!value || value.trim() === '') {
      if (name === 'fullName') err = 'الاسم الكامل مطلوب لتطابق السجلات';
      if (name === 'idNumber') err = 'رقم الهوية الوطنية أو الجواز مطلوب للتحقق';
      if (name === 'phone') err = 'رقم الهاتف مطلوب للتواصل معك';
      if (name === 'email') err = 'البريد الإلكتروني مطلوب لتلقي الإشعارات';
      if (name === 'country') err = 'الجنسية مطلوبة لتحديد فرع الخدمة';
      if (name === 'otherCountry') err = 'يرجى كتابة اسم جنسيتك أو بلدك';
      if (name === 'city') err = 'المدينة مطلوبة لإحالة الطلب جغرافياً';
      if (name === 'maritalStatus') err = 'الحالة الاجتماعية مطلوبة لتسجيل بيانات الأسرة';
      if (name === 'requestType') err = 'نوع البرنامج مطلوب لتصنيف الطلب';
      if (name === 'description') err = 'وصف الحالة مطلوب بالتفصيل لدراستها بعناية';
      if (name === 'iban') err = 'رقم الآيبان أو الحساب البنكي مطلوب لتحويل الدعم مباشرة';
      if (name === 'bankName') err = 'اسم البنك مطلوب لتأكيد بيانات التحويل';
    } else {
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        err = 'الرجاء إدخال بريد إلكتروني صحيح (مثال: email@example.com)';
      }
      if (name === 'phone' && !isValidPhoneNumber(value)) {
        err = 'يرجى إدخال رقم هاتف صحيح للدولة المحددة.';
      }
      if (name === 'idNumber' && !/^[A-Za-z0-9\-_]{5,20}$/.test(value.replace(/\s+/g, ''))) {
        err = 'رقم الهوية أو الجواز يجب أن يتكون من 5 إلى 20 خانة (أحرف أو أرقام)';
      }
      if (name === 'iban') {
        const cleanIban = value.replace(/\s+/g, '').toUpperCase();
        if (cleanIban.length < 8 || cleanIban.length > 34) {
          err = 'يرجى إدخال رقم آيبان (IBAN) أو رقم حساب بنكي صحيح (بين 8 إلى 34 خانة)';
        }
      }
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    validateField(e.target.name, e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectValue = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateStep = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!form.fullName) errs.fullName = 'الاسم الكامل مطلوب لتطابق السجلات';
      if (!form.idNumber) errs.idNumber = 'رقم الهوية الوطنية أو الجواز مطلوب للتحقق';
      if (!form.phone) errs.phone = 'رقم الهاتف مطلوب للتواصل معك';
      if (!form.email) errs.email = 'البريد الإلكتروني مطلوب لتلقي الإشعارات';
      if (!form.maritalStatus) errs.maritalStatus = 'الحالة الاجتماعية مطلوبة لتسجيل بيانات الأسرة';
      
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errs.email = 'الرجاء إدخال بريد إلكتروني صحيح';
      }
      if (form.phone && !isValidPhoneNumber(form.phone)) {
        errs.phone = 'يرجى إدخال رقم هاتف صحيح للدولة المحددة.';
      }
      if (form.idNumber && !/^[A-Za-z0-9\-_]{5,20}$/.test(form.idNumber.replace(/\s+/g, ''))) {
        errs.idNumber = 'رقم الهوية أو الجواز يجب أن يتكون من 5 إلى 20 خانة (أحرف أو أرقام)';
      }
    } else if (currentStep === 2) {
      if (!form.country) errs.country = 'الجنسية مطلوبة لتحديد فرع الخدمة';
      if (form.country === 'أخرى' && !form.otherCountry) {
        errs.country = 'يرجى كتابة اسم جنسيتك أو بلدك';
      }
      if (!form.city) errs.city = 'المدينة مطلوبة لإحالة الطلب جغرافياً';
      if (!form.iban) errs.iban = 'رقم الآيبان أو الحساب البنكي مطلوب لتحويل الدعم مباشرة';
      if (!form.bankName) errs.bankName = 'اسم البنك مطلوب لتأكيد بيانات التحويل';
      if (!form.requestType) errs.requestType = 'نوع البرنامج مطلوب لتصنيف الطلب';
      if (!form.description) errs.description = 'وصف الحالة مطلوب بالتفصيل لدراستها بعناية';
      
      if (form.bankName === 'آخر' && !form.otherBankName) {
        errs.bankName = 'يرجى إدخال اسم البنك الخاص بك';
      }
      
      if (form.iban) {
        const cleanIban = form.iban.replace(/\s+/g, '').toUpperCase();
        if (cleanIban.length < 8 || cleanIban.length > 34) {
          errs.iban = 'يرجى إدخال رقم آيبان (IBAN) أو رقم حساب بنكي صحيح (بين 8 إلى 34 خانة)';
        }
      }
    }
    
    setErrors(errs);
    const touchedFields: Record<string, boolean> = {};
    Object.keys(errs).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(prev => ({ ...prev, ...touchedFields }));

    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 3));
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } else {
      toast.error('الرجاء التأكد من إدخال كافة الحقول المطلوبة بشكل صحيح قبل الانتقال.');
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const formatIban = (val: string) => {
    const clean = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    if (!agreed) {
      setErrors(prev => ({ ...prev, agreed: 'يجب الإقرار بصحة البيانات والموافقة على الشروط والأحكام' }));
      toast.error('يرجى الموافقة على الشروط والأحكام لتقديم الطلب.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const supabase = getSupabase();

      const applicationData = {
        full_name: form.fullName,
        id_number: form.idNumber,
        phone: form.phone,
        email: form.email,
        country: form.country === 'أخرى' ? form.otherCountry : form.country,
        city: form.city,
        marital_status: form.maritalStatus,
        bank_name: form.bankName === 'آخر' ? form.otherBankName : form.bankName,
        iban: form.iban.replace(/\s+/g, '').toUpperCase(),
        request_type: form.requestType,
        description: form.description,
        tracking_number: trackingNum,
        status: 'تم الاستلام',
      };

      const { error } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (error) throw error;
      
      setSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح للمؤسسة!');
    } catch (supabaseErr: any) {
      console.error('Supabase submission failed:', supabaseErr);
      if (supabaseErr.message && supabaseErr.message.includes('NEXT_PUBLIC_SUPABASE')) {
        setSubmitError('إعدادات الاتصال بقاعدة البيانات غير مهيأة بعد. يرجى مراجعة إعدادات البيئة.');
      } else if (supabaseErr.code === '42P01') {
        setSubmitError('الجدول غير موجود في قاعدة البيانات. يرجى تنفيذ ملف supabase-schema.sql في قاعدة بيانات Supabase.');
      } else {
        setSubmitError(`حدث خطأ أثناء حفظ الطلب في قاعدة البيانات: ${supabaseErr.message || 'خطأ غير معروف'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNum);
    setCopied(true);
    toast.success('تم نسخ رقم التتبع للحافظة');
    setTimeout(() => setCopied(false), 2000);
  };

  const assistancePrograms = [
    {
      id: 'housing',
      title: 'برنامج الإسكان والترميم',
      dbValue: 'برنامج الإسكان',
      description: 'دعم تملك المنازل الملائمة، وترميم البيوت الآيلة للسقوط للأسر الأشد حاجة لضمان حياة كريمة ومستقرة.',
      icon: Home,
      badge: 'الاستقرار السكني'
    },
    {
      id: 'financial',
      title: 'برنامج الدعم المالي المباشر',
      dbValue: 'برنامج الدعم المالي',
      description: 'مساعدات نقدية عاجلة مخصصة لسداد الاحتياجات المعيشية الأساسية، الفواتير، والأعباء المالية الطارئة.',
      icon: Coins,
      badge: 'التمكين الاقتصادي'
    },
    {
      id: 'transport',
      title: 'برنامج دعم وسائل النقل والمواصلات',
      dbValue: 'برنامج دعم وسائل النقل',
      description: 'منح مركبات حديثة مجهزة ومخصصة لمساندة الأفراد والعائلات على التوجه للعمل، الدراسة والخدمات الأساسية.',
      icon: Car,
      badge: 'تسهيل التنقل'
    },
    {
      id: 'investment',
      title: 'برنامج تمويل المشاريع المتناهية الصغر',
      dbValue: 'برنامج تمويل المشاريع ودعم الاستثمارات',
      description: 'تقديم رأس مال تشغيلي مع تدريب وإشراف مهني متكامل لتمكين الأسر المنتجة وتحويلها للاعتماد الذاتي المستدام.',
      icon: Briefcase,
      badge: 'ريادة ومشاريع'
    }
  ];

  const labelClass = "block text-xs sm:text-sm font-bold text-[var(--primary)] mb-1.5 sm:mb-2 px-0.5";
  const fieldContainerClass = "relative rounded-xl sm:rounded-2xl border bg-white transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--gold)]/20 focus-within:border-[var(--gold)]";

  if (submitted) {
    return (
      <div className="bg-[var(--background)] min-h-screen pb-24">
        <SEO title="تم تقديم طلب المساعدة بنجاح" description="تم استلام طلب المساعدة بنجاح وسنقوم بمراجعته قريباً." type="WebPage" />
        
        <div className="page-header text-center">
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-white font-black mb-3" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontFamily: 'var(--font-heading)' }}>أمان وتنمية مستدامة</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 -mt-14 relative z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_-15px_rgba(var(--primary-rgb),0.08)] border border-[var(--primary)]/5 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--primary)] via-[var(--gold)] to-[var(--primary)]"></div>
            
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--primary)] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl relative">
              <CheckCircle size={40} className="text-[var(--gold)] sm:w-12 sm:h-12" strokeWidth={2.5} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute inset-0 rounded-full border border-[var(--gold)]/20"
              />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--primary)]/5 text-[var(--primary)] mb-3 sm:mb-4">
              <Sparkles size={12} className="text-[var(--gold)]" /> تم تسجيل الطلب رسمياً في الخوادم
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              تم استلام طلبك بنجاح وبسرية تامة!
            </h2>
            
            <p className="text-[var(--primary)]/75 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              أخي الكريم / أختي الكريمة،<br />
              نشكركم على ثقتكم بمؤسسة الوليد للإنسانية. نفيدكم بأنه تم استلام طلبكم وإحالته إلى الجهة المختصة لدراسة الحالة وإجراء التحقق من البيانات وذلك وفق الإجراءات والمعايير المعتمدة لدى المؤسسة وسيتم التواصل معكم عند استكمال إجراءات المراجعة أو عند الحاجة إلى أي معلومات إضافية. مع خالص التقدير لتعاونكم وثقتكم.
            </p>

            <div className="bg-[var(--background)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 sm:mb-10 border border-[var(--primary)]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-[var(--gold)]"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-[var(--primary)]/50 block mb-1">رقم تتبع المعاملة الموحد</span>
                  <span className="text-2xl sm:text-3xl font-black text-[var(--primary)] tracking-wider block font-mono break-all">{trackingNum}</span>
                </div>
                
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button 
                    onClick={handleCopy} 
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-50 border border-[var(--primary)]/10 text-xs font-bold rounded-xl text-[var(--primary)] transition-all hover:shadow-sm"
                  >
                    {copied ? <Check size={15} className="text-[var(--success)]" /> : <Copy size={15} className="text-[var(--gold)]" />}
                    {copied ? 'تم النسخ!' : 'نسخ الرقم'}
                  </button>
                  <button 
                    onClick={() => window.print()} 
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white hover:bg-slate-50 border border-[var(--primary)]/10 text-xs font-bold rounded-xl text-[var(--primary)] transition-all hover:shadow-sm"
                  >
                    <FileText size={15} className="text-[var(--gold)]" />
                    طباعة الإيصال
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--primary)]/5 flex flex-wrap gap-y-2 justify-between text-[11px] sm:text-xs text-[var(--primary)]/60 font-medium">
                <span>تاريخ التقديم: {new Date().toLocaleDateString('ar-SA')}</span>
                <span>حالة المعاملة: <strong className="text-[var(--warning)]">تحت الدراسة المبدئية</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/track"
                className="btn-royal py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/10" 
              >
                تتبع المعاملة الآن
              </Link>
              <Link 
                className="btn-secondary py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-[var(--primary)] border-2 border-[var(--primary)]/20 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 flex items-center justify-center gap-2" 
                href="/"
              >
                العودة للرئيسية
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      <SEO title="تقديم طلب مساعدة إنسانية" description="بوابة تقديم طلبات المساعدة لمؤسسة الوليد للإنسانية - إسكان، سيارات، ودعم مالي مباشر." type="WebPage" />
      
      {/* Luxury Page Header */}
      <div className="page-header text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold mb-3 sm:mb-4 text-white/70">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-white">بوابة المساعدات</span>
            <span>/</span>
            <span className="text-[var(--gold)]">تقديم طلب جديد</span>
          </div>
          <h1 className="text-white font-black mb-3 sm:mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            بوابة المساعدات الإنسانية
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] mx-auto rounded-full mb-3 sm:mb-4" />
          <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            بوابة إلكترونية آمنة لخدمتكم وتمكينكم. نسعى في مؤسسة الوليد للإنسانية إلى تسريع دراسة طلباتكم بموثوقية وسرية تامة.
          </p>
        </div>
      </div>

      <div className="max-w-4xl lg:max-w-5xl w-full mx-auto px-3.5 sm:px-6 md:px-8 -mt-12 relative z-30">
        
        {/* Dynamic Completeness Meter & Visual Steps Map */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(var(--primary-rgb),0.04)] border border-[var(--primary)]/5 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[var(--primary)]/5">
            <div className="text-right">
              <h3 className="text-[var(--primary)] font-black text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1">مؤشر جاهزية واستكمال الطلب</h3>
              <p className="text-[11px] sm:text-xs text-[var(--primary)]/60 font-medium">كلما كانت البيانات مكتملة وأدق، زادت سرعة دراسة طلبك واعتماده.</p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-60 shrink-0">
              <div className="w-full bg-[var(--primary)]/5 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--gold)] rounded-full"
                />
              </div>
              <span className="text-xs sm:text-sm font-black text-[var(--primary)] font-mono whitespace-nowrap">{completeness}%</span>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-between px-1 sm:px-4">
            <div className="absolute top-[20px] sm:top-[26px] inset-x-4 sm:inset-x-8 h-1 bg-slate-100 z-0 rounded-full" />
            <div 
              className="absolute top-[20px] sm:top-[26px] right-4 sm:right-8 h-1 bg-[var(--gold)] z-0 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `calc(${(step - 1) * 50}% - ${(step - 1) * 8}px)`, left: 'auto' }} 
            />

            {[
              { label: 'البيانات الشخصية', id: 1, desc: 'الاسم، الهوية والمعلومات' },
              { label: 'البرامج والدراسة المالية', id: 2, desc: 'نوع المساعدة والحساب البنكي' },
              { label: 'مراجعة الطلب', id: 3, desc: 'التأكيد والاعتماد النهائي' },
            ].map((item) => {
              const isActive = step === item.id;
              const isCompleted = step > item.id;
              return (
                <div key={item.id} className="relative z-10 flex flex-col items-center text-center max-w-[95px] sm:max-w-[180px]">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (item.id < step) setStep(item.id);
                      else if (item.id === 2 && validateStep(1)) setStep(2);
                      else if (item.id === 3 && validateStep(1) && validateStep(2)) setStep(3);
                    }}
                    className={`w-10 h-10 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-[var(--primary)] text-[var(--gold)] border-[var(--gold)] shadow-lg shadow-[var(--gold)]/20' 
                        : isCompleted 
                          ? 'bg-[var(--gold)] text-white border-[var(--gold)]'
                          : 'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : <span className="text-xs sm:text-sm">{item.id}</span>}
                  </motion.button>
                  
                  <span className={`text-[11px] sm:text-xs md:text-sm font-bold mt-2 sm:mt-3 leading-tight ${isActive ? 'text-[var(--primary)]' : 'text-slate-500'}`} style={{ fontFamily: 'var(--font-body)' }}>
                    {item.label}
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-400 mt-1 max-w-[140px] leading-tight">
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        <div className="bg-white rounded-2xl sm:rounded-[2.2rem] shadow-[0_30px_70px_-15px_rgba(var(--primary-rgb),0.06)] border border-[var(--primary)]/5 p-4 sm:p-7 md:p-10">
          
          <form onSubmit={handleSubmit} className="text-slate-800">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Personal Identification */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, type: "tween" }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="text-right pb-4 border-b border-[var(--primary)]/5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--gold)] shrink-0">
                      <User size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[var(--primary)]">البيانات الشخصية</h2>
                      <p className="text-[11px] sm:text-xs text-[var(--primary)]/60 mt-0.5">يرجى تعبئة الحقول التالية بدقة متناهية لمطابقتها مع السجلات الرسمية.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Full Name */}
                    <div>
                      <label className={labelClass}>الأسم الكامل <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.fullName ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                          <User size={18} />
                        </div>
                        <input 
                          className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-10 sm:pl-12 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                          name="fullName" 
                          value={form.fullName} 
                          onChange={handleChange} 
                          onBlur={handleBlur} 
                          placeholder="أدخل الأسم الكامل"
                        />
                        {touched.fullName && !errors.fullName && form.fullName && (
                          <Check className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--success)]" size={17} />
                        )}
                        {errors.fullName && (
                          <AlertCircle className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--gold)]" size={17} />
                        )}
                      </div>
                      {errors.fullName && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
                    </div>

                    {/* ID / Passport number */}
                    <div>
                      <label className={labelClass}>رقم الهوية الوطنية أو الإقامة <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.idNumber ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                          <ShieldCheck size={18} />
                        </div>
                        <input 
                          className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-10 sm:pl-12 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                          name="idNumber" 
                          value={form.idNumber} 
                          onChange={handleChange} 
                          onBlur={handleBlur} 
                          placeholder="أدخل رقم الهوية"
                        />
                        <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300">
                          <Lock size={15} />
                        </div>
                      </div>
                      {errors.idNumber && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.idNumber}</p>}
                    </div>

                    {/* Email address */}
                    <div>
                      <label className={labelClass}>البريد الإلكتروني <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.email ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                          <Mail size={18} />
                        </div>
                        <input 
                          className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-4 sm:pl-5 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                          name="email" 
                          type="email"
                          value={form.email} 
                          onChange={handleChange} 
                          onBlur={handleBlur} 
                          placeholder="example@domain.com"
                          dir="ltr"
                          style={{ textAlign: 'right' }}
                        />
                      </div>
                      {errors.email && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                    </div>

                    {/* Phone number */}
                    <div>
                      <label className={labelClass}>رقم الهاتف <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.phone ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'} p-0`}>
                        <PhoneInput 
                          name="phone"
                          value={form.phone} 
                          onChange={(val) => {
                            setForm(prev => ({ ...prev, phone: val }));
                            if (touched.phone) validateField('phone', val);
                            else if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          onBlur={() => {
                            setTouched(prev => ({ ...prev, phone: true }));
                            validateField('phone', form.phone);
                          }}
                        />
                      </div>
                      {errors.phone && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
                    </div>

                    {/* Marital status custom dropdown */}
                    <div className="md:col-span-2">
                      <label className={labelClass}>الحالة الاجتماعية <span className="text-rose-500">*</span></label>
                      <div className="relative" ref={maritalDropdownRef}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none z-10">
                          <Heart size={18} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMaritalDropdownOpen(!isMaritalDropdownOpen)}
                          className={`w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-4 sm:pl-5 bg-white border rounded-xl sm:rounded-2xl text-right flex items-center justify-between font-semibold text-xs sm:text-sm text-[var(--primary)] transition-all duration-300 ${
                            errors.maritalStatus ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'
                          }`}
                        >
                          <span className={form.maritalStatus ? 'text-[var(--primary)]' : 'text-slate-400'}>
                            {form.maritalStatus || 'اختر الحالة الاجتماعية'}
                          </span>
                          <ChevronDown size={17} className={`text-[var(--primary)]/40 shrink-0 transition-transform duration-300 ${isMaritalDropdownOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isMaritalDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              className="absolute top-full mt-1.5 w-full bg-white border border-[var(--primary)]/10 rounded-xl sm:rounded-2xl shadow-xl z-50 overflow-hidden"
                            >
                              {['أعزب', 'متزوج', 'مطلق', 'أرمل'].map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    selectValue('maritalStatus', status);
                                    setIsMaritalDropdownOpen(false);
                                  }}
                                  className="w-full text-right px-4 sm:px-5 py-3 hover:bg-[var(--background)] text-xs sm:text-sm font-semibold text-[var(--primary)] border-b border-[var(--primary)]/5 last:border-0 transition-colors"
                                >
                                  {status}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {errors.maritalStatus && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.maritalStatus}</p>}
                    </div>

                  </div>

                  <div className="pt-6 sm:pt-8 border-t border-[var(--primary)]/5 flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleNext} 
                      className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-l from-[var(--primary)] to-[var(--primary)] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-x-1 shadow-lg shadow-[var(--primary)]/10"
                    >
                      متابعة ملء تفاصيل الطلب <ArrowRight size={17} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Request Details & Banking Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-8 sm:space-y-10"
                >
                  <div className="text-right pb-4 border-b border-[var(--primary)]/5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--gold)] shrink-0">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[var(--primary)]">تفاصيل برنامج الدعم والبيانات البنكية</h2>
                      <p className="text-[11px] sm:text-xs text-[var(--primary)]/60 mt-0.5">يرجى تحديد البرنامج المناسب وإدخال بيانات الحساب البنكي لتحويل الدعم عند الاعتماد.</p>
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label className="block text-xs sm:text-sm font-black text-[var(--primary)] mb-3 sm:mb-4 px-0.5">
                      اختر البرنامج الإنساني المناسب لاحتياجك <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      {assistancePrograms.map((prog) => {
                        const isSelected = form.requestType === prog.dbValue;
                        const IconComponent = prog.icon;
                        return (
                          <motion.div
                            key={prog.id}
                            whileHover={{ y: -2 }}
                            onClick={() => selectValue('requestType', prog.dbValue)}
                            className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-right cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${
                              isSelected 
                                ? 'border-[var(--gold)] bg-[var(--primary)]/5 shadow-md shadow-[var(--gold)]/5' 
                                : 'border-[var(--primary)]/15 bg-white hover:border-[var(--primary)]/35'
                            }`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-2.5 sm:mb-3 gap-2">
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[var(--primary)] text-[var(--gold)]' : 'bg-[var(--primary)]/5 text-[var(--primary)]'}`}>
                                  <IconComponent size={19} />
                                </div>
                                <span className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${isSelected ? 'bg-[var(--gold)]/20 text-[var(--gold-dark)]' : 'bg-slate-100 text-slate-600'}`}>
                                  {prog.badge}
                                </span>
                              </div>
                              <h3 className="font-bold text-[var(--primary)] text-xs sm:text-sm mb-1">{prog.title}</h3>
                              <p className="text-[11px] sm:text-xs text-[var(--primary)]/70 leading-relaxed line-clamp-2">{prog.description}</p>
                            </div>
                            
                            {isSelected && (
                              <div className="absolute top-2 left-2 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center shadow-sm">
                                <Check size={12} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    {errors.requestType && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.requestType}</p>}
                  </div>

                  {/* Nationality & City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Nationality */}
                    <div>
                      <label className={labelClass}>الجنسية <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.country ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                          <Globe size={18} />
                        </div>
                        <input 
                          className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-4 sm:pl-5 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                          name="country" 
                          value={form.country} 
                          onChange={handleChange} 
                          onBlur={handleBlur} 
                          placeholder="أدخل جنسيتك"
                        />
                      </div>
                      {errors.country && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.country}</p>}
                    </div>

                    {/* City / Address */}
                    <div>
                      <label className={labelClass}>العنوان / المدينة <span className="text-rose-500">*</span></label>
                      <div className={`${fieldContainerClass} ${errors.city ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                        <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                          <MapPin size={18} />
                        </div>
                        <input 
                          className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-4 sm:pl-5 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                          name="city" 
                          value={form.city} 
                          onChange={handleChange} 
                          onBlur={handleBlur} 
                          placeholder="أدخل العنوان أو المدينة"
                        />
                      </div>
                      {errors.city && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.city}</p>}
                    </div>
                  </div>

                  {/* Banking Info Section */}
                  <div className="pt-6 border-t border-[var(--primary)]/5">
                    <h3 className="text-base sm:text-lg font-black text-[var(--primary)] mb-5 sm:mb-6 flex items-center gap-2">
                      <BankIcon size={19} className="text-[var(--gold)]" /> بيانات الحساب البنكي المعتمد
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                      
                      {/* Form Inputs (Bank, IBAN) */}
                      <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                        
                        {/* Custom Bank Dropdown */}
                        <div>
                          <label className={labelClass}>اسم البنك <span className="text-rose-500">*</span></label>
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                              className={`w-full h-12 sm:h-14 px-4 sm:px-5 bg-white border rounded-xl sm:rounded-2xl text-right flex items-center justify-between font-semibold text-xs sm:text-sm text-[var(--primary)] transition-all duration-300 ${
                                errors.bankName ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'
                              }`}
                            >
                              <span className={form.bankName ? 'text-[var(--primary)]' : 'text-slate-400'}>
                                {form.bankName || 'اختر البنك'}
                              </span>
                              <ChevronDown size={17} className={`text-[var(--primary)]/40 shrink-0 transition-transform duration-300 ${isBankDropdownOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                              {isBankDropdownOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                  className="absolute top-full mt-1.5 w-full bg-white border border-[var(--primary)]/10 rounded-xl sm:rounded-2xl shadow-xl z-50 overflow-hidden"
                                >
                                  {['مصرف الراجحي', 'البنك الأهلي السعودي', 'بنك الرياض', 'مصرف الإنماء', 'بنك البلاد', 'آخر'].map((bank) => (
                                    <button
                                      key={bank}
                                      type="button"
                                      onClick={() => {
                                        selectValue('bankName', bank);
                                        setIsBankDropdownOpen(false);
                                      }}
                                      className="w-full text-right px-4 sm:px-5 py-3 hover:bg-[var(--background)] text-xs sm:text-sm font-semibold text-[var(--primary)] border-b border-[var(--primary)]/5 last:border-0 transition-colors"
                                    >
                                      {bank}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {errors.bankName && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.bankName}</p>}
                        </div>

                        {/* Other Bank input if selected */}
                        {form.bankName === 'آخر' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-1.5"
                          >
                            <label className={labelClass}>يرجى كتابة اسم البنك <span className="text-rose-500">*</span></label>
                            <div className={`${fieldContainerClass} border-[var(--primary)]/15`}>
                              <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                                <Landmark size={18} />
                              </div>
                              <input 
                                className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-4 sm:pl-5 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] placeholder:text-slate-400" 
                                name="otherBankName" 
                                value={form.otherBankName} 
                                onChange={handleChange} 
                                placeholder="أدخل اسم البنك"
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* IBAN */}
                        <div>
                          <label className={labelClass}>رقم الآيبان البنكي (IBAN) أو رقم الحساب <span className="text-rose-500">*</span></label>
                          <div className={`${fieldContainerClass} ${errors.iban ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'}`}>
                            <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--primary)]/40 pointer-events-none">
                              <CreditCard size={18} />
                            </div>
                            <input 
                              className="w-full h-12 sm:h-14 pr-11 sm:pr-12 pl-20 sm:pl-24 bg-transparent outline-none text-xs sm:text-sm font-bold text-[var(--primary)] placeholder:text-slate-400 placeholder:font-normal" 
                              name="iban" 
                              value={form.iban} 
                              onChange={(e) => {
                                const formatted = formatIban(e.target.value);
                                e.target.value = formatted;
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              placeholder="SA00 0000 0000 0000 0000 0000"
                              dir="ltr"
                              style={{ textAlign: 'left' }}
                            />
                            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-black text-[var(--primary)]/35 pointer-events-none">
                              IBAN
                            </div>
                          </div>
                          {errors.iban && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.iban}</p>}
                        </div>

                      </div>

                      {/* Premium Dynamic Virtual Bank Card Renders in Real-Time */}
                      <div className="lg:col-span-5 flex justify-center items-center w-full">
                        <div className="w-full max-w-sm sm:max-w-md min-h-[190px] sm:h-52 rounded-2xl sm:rounded-[2rem] bg-gradient-to-tr from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden border border-[var(--gold)]/20 flex flex-col justify-between">
                          <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-white to-transparent pattern-overlay"></div>
                          
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-right">
                              <span className="text-[9px] sm:text-[10px] text-white/50 block">الجهة المانحة</span>
                              <span className="text-xs sm:text-sm font-black text-[var(--gold)]" style={{ fontFamily: 'var(--font-body)' }}>الوليد للإنسانية</span>
                            </div>
                            <div className="w-9 h-6 sm:w-10 sm:h-7 rounded bg-gradient-to-r from-amber-400 to-yellow-200 opacity-90 shadow"></div>
                          </div>

                          <div className="mb-3">
                            <span className="text-[8px] sm:text-[9px] text-white/50 block">البنك المسجل للاستلام</span>
                            <span className="text-sm sm:text-base font-black text-[var(--gold)] tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                              {form.bankName === 'آخر' ? (form.otherBankName || 'أخرى') : (form.bankName || 'يرجى اختيار البنك')}
                            </span>
                          </div>

                          <div className="mb-3 font-mono text-xs sm:text-sm md:text-base font-black text-[var(--gold)] tracking-wider whitespace-nowrap overflow-hidden text-ellipsis" dir="ltr">
                            {form.iban || 'SA00 0000 0000 0000 0000 0000'}
                          </div>

                          <div className="flex justify-between items-end pt-1">
                            <div className="min-w-0 pr-2">
                              <span className="text-[8px] text-white/40 block">المستفيد</span>
                              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide max-w-[170px] sm:max-w-[200px] block truncate" style={{ fontFamily: 'var(--font-body)' }}>
                                {form.fullName || 'الاسم الكامل لمقدم الطلب'}
                              </span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-black text-[var(--gold)] px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 uppercase font-mono shrink-0">
                              BANK CARD
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Case Description */}
                  <div className="pt-6 border-t border-[var(--primary)]/5">
                    <label className={labelClass}>تفاصيل الحالة <span className="text-rose-500">*</span></label>
                    <p className="text-[11px] sm:text-xs text-slate-400 mb-2.5 sm:mb-3">يرجى كتابة شرح ومفصل عن ظروف المعيشة والدوافع لتقديم هذا الطلب، لضمان دراسة الحالة بشكل كامل.</p>
                    <div className={`${fieldContainerClass} ${errors.description ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/10' : 'border-[var(--primary)]/15 hover:border-[var(--primary)]/35'} rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 relative`}>
                      <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 text-[var(--primary)]/40 pointer-events-none">
                        <FileText size={18} />
                      </div>
                      <textarea
                        className="w-full pr-8 sm:pr-10 bg-transparent outline-none text-xs sm:text-sm font-semibold text-[var(--primary)] leading-relaxed placeholder:text-slate-400"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={5}
                        placeholder="الرجاء كتابة وصف شامل لظروف الحالة والطلب بالتفصيل هنا..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    {errors.description && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.description}</p>}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-6 sm:pt-8 border-t border-[var(--primary)]/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
                    <button 
                      type="button" 
                      onClick={handleBack} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <ArrowRight size={16} /> العودة للسابق
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleNext} 
                      className="w-full sm:w-auto sm:min-w-[220px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-l from-[var(--primary)] to-[var(--primary)] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-x-1 shadow-lg shadow-[var(--primary)]/10"
                    >
                      متابعة للمراجعة <ArrowRight size={16} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review and Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-8 sm:space-y-10"
                >
                  <div className="text-right pb-4 border-b border-[var(--primary)]/5 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--gold)] shrink-0">
                      <FileText size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[var(--primary)]">مراجعة الطلب</h2>
                      <p className="text-[11px] sm:text-xs text-[var(--primary)]/60 mt-0.5">يرجى مراجعة كافة التفاصيل المسجلة بدقة قبل الاعتماد النهائي.</p>
                    </div>
                  </div>

                  {/* Structured Review Panel */}
                  <div className="bg-[var(--background)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-[var(--primary)]/10 space-y-6 sm:space-y-8">
                    
                    {/* Part 1: Persona */}
                    <div>
                      <h4 className="flex items-center gap-2 text-[var(--primary)] font-black text-sm sm:text-base md:text-lg mb-3 sm:mb-4 pb-2 border-b border-[var(--primary)]/10">
                        <span className="w-1.5 h-4 bg-[var(--gold)] rounded-full"></span> بيانات المستفيد
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">الاسم الكامل</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5 break-words">{form.fullName}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">رقم الهوية / الجواز</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5 break-words">{form.idNumber}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">الحالة الاجتماعية</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5">{form.maritalStatus}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">البريد الإلكتروني</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5 font-mono break-all" dir="ltr">{form.email}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">رقم الجوال</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5 font-mono" dir="ltr">{form.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Part 2: Program and account */}
                    <div className="pt-4 border-t border-[var(--primary)]/10">
                      <h4 className="flex items-center gap-2 text-[var(--primary)] font-black text-sm sm:text-base md:text-lg mb-3 sm:mb-4 pb-2 border-b border-[var(--primary)]/10">
                        <span className="w-1.5 h-4 bg-[var(--gold)] rounded-full"></span> تفاصيل البرنامج الإنساني والحساب البنكي
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">البرنامج الإنساني المستهدف</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--gold)] block mt-0.5">{form.requestType}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">الجنسية الحالية</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5">{form.country}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">العنوان / المدينة</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5">{form.city}</span>
                        </div>
                        <div className="bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">اسم البنك</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5">
                            {form.bankName === 'آخر' ? form.otherBankName : form.bankName}
                          </span>
                        </div>
                        <div className="sm:col-span-2 bg-white/60 p-3 sm:p-3.5 rounded-xl border border-[var(--primary)]/5">
                          <span className="text-[10px] text-[var(--primary)]/50 block font-bold">رقم الحساب الدولي (IBAN)</span>
                          <span className="text-xs sm:text-sm font-black text-[var(--primary)] block mt-0.5 font-mono break-all" dir="ltr">{form.iban}</span>
                        </div>
                      </div>
                    </div>

                    {/* Part 3: Description text block */}
                    <div className="pt-4 border-t border-[var(--primary)]/10">
                      <span className="text-[10px] sm:text-xs text-[var(--primary)]/50 block font-bold mb-2">وصف وشرح تفاصيل الحالة</span>
                      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--primary)]/10 text-xs sm:text-sm font-semibold text-[var(--primary)] leading-relaxed break-words">
                        {form.description}
                      </div>
                    </div>

                  </div>

                  {/* Declaration and Legal Consent Banner */}
                  <div
                    onClick={() => {
                      setAgreed(!agreed);
                      if (errors.agreed) setErrors(prev => ({ ...prev, agreed: '' }));
                    }}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-3 sm:gap-4 ${
                      errors.agreed 
                        ? 'border-[var(--gold)] bg-[var(--gold)]/5' 
                        : agreed 
                          ? 'border-[var(--primary)]/25 bg-[var(--primary)]/5' 
                          : 'border-[var(--primary)]/15 bg-white hover:border-[var(--primary)]/35'
                    }`}
                  >
                    <button
                      type="button"
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 mt-0.5 ${
                        agreed ? 'bg-[var(--gold)] text-white border-[var(--gold)]' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {agreed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[var(--primary)] mb-1">إقرار صحة البيانات وأحكام تقديم الطلبات</h4>
                      <p className="text-[11px] sm:text-xs text-[var(--primary)]/70 leading-relaxed">
                        أقر أنا مقدم الطلب بأن كافة البيانات المدخلة والمستندات المرفقة هي صحيحة وتحت مسؤوليتي الكاملة. كما أوافق على شروط استحقاق الدعم الإنساني المعمول بها في مؤسسة الوليد للإنسانية وتخويل المؤسسة بالتحقق من صحة المستندات بالتكامل مع الجهات المختصة.
                      </p>
                      {errors.agreed && <p className="text-[var(--gold)] text-[11px] sm:text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.agreed}</p>}
                    </div>
                  </div>

                  {/* Error Box if Submission Failed */}
                  {submitError && (
                    <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 text-rose-800 text-xs font-bold">
                      <AlertCircle className="shrink-0 text-rose-500" size={17} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submission Flow Footers */}
                  <div className="pt-6 sm:pt-8 border-t border-[var(--primary)]/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
                    <button 
                      type="button" 
                      onClick={handleBack} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <ArrowRight size={16} /> تعديل بيانات الطلب
                    </button>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto sm:min-w-[260px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-l from-[var(--primary)] to-[var(--primary)] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-[var(--primary)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري مراجعة وإرسال الطلب...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} className="text-[var(--gold)]" />
                          <span>اعتماد وإرسال الطلب نهائياً</span>
                        </>
                      )}
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </form>

        </div>

      </div>
    </div>
  );
}

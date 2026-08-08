'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Clock, CheckCircle, XCircle, FileText, ChevronLeft, 
  Copy, Check, Landmark, User, ShieldCheck, Sparkles, 
  Home, Car, Coins, Download, Share2, Printer, ArrowLeft, 
  AlertCircle, Calendar, MapPin, CreditCard, HelpCircle, 
  MessageSquare, Phone, ArrowUpRight, Award, Trash2
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplicationData {
  id: string;
  tracking_number: string;
  full_name: string;
  id_number: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  marital_status: string;
  bank_name: string;
  iban: string;
  request_type: string;
  description: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface RecentSearch {
  trackingNumber: string;
  idNumber: string;
  fullName: string;
  requestType: string;
  status: string;
  date: string;
}

export default function TrackPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'national'>('id');
  const [result, setResult] = useState<ApplicationData | null | 'not-found'>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'dossier' | 'notes' | 'receipt'>('roadmap');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('alwaleed_recent_tracks');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save successful search to history
  const saveSearchToHistory = (app: ApplicationData) => {
    const newEntry: RecentSearch = {
      trackingNumber: app.tracking_number,
      idNumber: app.id_number,
      fullName: app.full_name,
      requestType: app.request_type,
      status: app.status,
      date: new Date().toLocaleDateString('ar-SA')
    };

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.trackingNumber !== app.tracking_number);
      const updated = [newEntry, ...filtered].slice(0, 3); // Keep last 3
      localStorage.setItem('alwaleed_recent_tracks', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearchHistory = (trackingNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.trackingNumber !== trackingNum);
      localStorage.setItem('alwaleed_recent_tracks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (e: React.FormEvent, customVal?: string, customType?: 'id' | 'national') => {
    if (e) e.preventDefault();
    setError('');
    
    const typeToUse = customType || searchType;
    let rawVal = customVal !== undefined ? customVal : searchValue;
    
    if (!rawVal.trim()) {
      setError(typeToUse === 'id' ? 'يرجى إدخال رقم الطلب الموحد' : 'يرجى إدخال رقم الهوية الوطنية');
      return;
    }

    let val = rawVal.replace(/\s+/g, '').toUpperCase();
    // Convert Arabic numerals to English numerals
    val = val.replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
    
    if (typeToUse === 'id') {
      if (!val.startsWith('WF-') && /^\d+$/.test(val)) {
        val = `WF-${val}`;
      }
      if (!/^WF-[A-Z0-9\-]+$/.test(val)) {
        setError('صيغة رقم الطلب غير صحيحة، يجب أن يبدأ بـ WF- متبوعاً بالرقم المرجعي');
        return;
      }
    } else if (typeToUse === 'national') {
      if (!/^[A-Za-z0-9\-_]{5,20}$/.test(val)) {
        setError('رقم الهوية أو الجواز يجب أن يتكون من 5 إلى 20 خانة (أحرف أو أرقام)');
        return;
      }
    }

    if (customVal === undefined) {
      setSearchValue(val);
    }
    setLoading(true);
    
    try {
      const supabase = getSupabase();
      let query = supabase.from('applications').select('*');
      
      if (typeToUse === 'id') {
        query = query.eq('tracking_number', val);
      } else {
        query = query.eq('id_number', val);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false }).limit(1).single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setResult('not-found');
        } else if (fetchError.code === '42P01') {
          setError('الجدول غير موجود في قاعدة البيانات. يرجى مراجعة إعدادات الهيكل.');
        } else {
          console.error("Supabase Error:", fetchError);
          setError('حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً.');
        }
      } else if (data) {
        const appData = data as ApplicationData;
        setResult(appData);
        saveSearchToHistory(appData);
        setActiveTab('roadmap');
      } else {
        setResult('not-found');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء عملية الاستعلام.');
    } finally {
      setLoading(false);
    }
  };

  const getStagePercentage = (status: string) => {
    const s = status.trim();
    if (['مرفوض', 'تم الرفض'].includes(s)) return 100;
    if (['مكتمل'].includes(s)) return 100;
    if (['تم الموافقة', 'مقبول'].includes(s)) return 85;
    if (['قيد المعالجة'].includes(s)) return 70;
    if (['قيد الدراسة', 'بانتظار المستندات'].includes(s)) return 50;
    if (['قيد المراجعة'].includes(s)) return 30;
    return 15; // جديد or تم الاستلام
  };

  const getStageText = (status: string) => {
    const s = status.trim();
    if (['مرفوض', 'تم الرفض'].includes(s)) return 'انتهت دراسة الطلب بالرفض';
    if (['مكتمل'].includes(s)) return 'تم اكتمال المعاملة وصرف الدعم بنجاح';
    if (['تم الموافقة', 'مقبول'].includes(s)) return 'تمت الموافقة الرسمية وبانتظار الصرف';
    if (['قيد المعالجة'].includes(s)) return 'جاري إعداد الشيكات والحوالات المالية';
    if (['قيد الدراسة'].includes(s)) return 'في مرحلة البحث الاجتماعي ودراسة الحالة';
    if (['بانتظار المستندات'].includes(s)) return 'بانتظار استكمال بعض الأوراق الثبوتية من طرفكم';
    if (['قيد المراجعة'].includes(s)) return 'قيد المراجعة والتدقيق الإداري والمستندي';
    return 'تم استلام طلبكم وبانتظار الفرز الإداري المبدئي';
  };

  const getStageBadgeColor = (status: string) => {
    const s = status.trim();
    if (['مكتمل', 'تم الموافقة', 'مقبول'].includes(s)) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (['مرفوض', 'تم الرفض'].includes(s)) return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    if (['بانتظار المستندات'].includes(s)) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-[#033500]/5 text-[#033500] border-[#033500]/10';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (result && result !== 'not-found') {
      const shareUrl = `${window.location.origin}/track?id=${result.tracking_number}`;
      navigator.clipboard.writeText(shareUrl);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 3000);
    }
  };

  const staticSteps = [
    { 
      id: 1, 
      title: 'تم الاستلام والتسجيل', 
      desc: 'تسجيل طلب المساعدة بنجاح في البوابة وتوليد الرقم المرجعي الموحد للمعاملة لإتاحة التتبع الفوري.',
      duration: 'خلال 24 ساعة',
      detail: 'يتم استلام الطلب وتأمينه في قاعدة البيانات السحابية لفرز الحالة مبدئياً وتعيينها لواحد من باحثينا الاجتماعيين المختصين.'
    },
    { 
      id: 2, 
      title: 'التدقيق ومراجعة المستندات', 
      desc: 'فحص مطابقة الهوية الوطنية، إثباتات السكن، والبيانات البنكية المدخلة لضمان استيفاء شروط القبول المبدئية.',
      duration: '2 - 3 أيام عمل',
      detail: 'مراجعة الأوراق والمستندات المرفقة (صورة الهوية، تعريف بالراتب، صك المنزل، صك الإعسار). في حال وجود نواقص، سيتم إرسال تنبيه فوري.'
    },
    { 
      id: 3, 
      title: 'البحث الاجتماعي والدراسة الميدانية', 
      desc: 'دراسة الوضع الاجتماعي والمالي للأسرة من خلال باحث اجتماعي لتقييم مدى استحقاق وأولوية الدعم الإنساني.',
      duration: '5 - 7 أيام عمل',
      detail: 'أهم مرحلة حيث تخضع البيانات للدراسة ومقارنتها بالمعايير الرسمية المعتمدة لتقدير حجم الاحتياج ونوع الدعم المناسب.'
    },
    { 
      id: 4, 
      title: 'قرار اللجنة والاعتماد', 
      desc: 'عرض المعاملة على اللجنة التنفيذية لمؤسسة الوليد للإنسانية لإصدار القرار النهائي بالقبول ومقدار الدعم.',
      duration: '1 - 2 أيام عمل',
      detail: 'يتم اتخاذ قرار بالاعتماد الكامل أو الجزئي أو إحالة الطلب لجهات شريكة مساندة، ويصدر الإقرار رسمياً.'
    },
    { 
      id: 5, 
      title: 'المعالجة وصرف الدعم المالي', 
      desc: 'تحويل مبالغ الدعم المالي لحساب المستفيد، أو تنسيق تسليم المسكن أو المركبة وإغلاق المعاملة بنجاح.',
      duration: '3 - 5 أيام عمل',
      detail: 'الخطوة الختامية حيث تتواصل الإدارة المالية لصرف المبلغ مباشرة للآيبان المعتمد، أو تسليم مفاتيح السكن/المركبة للمستفيد.'
    }
  ];

  const getStatusLevel = (status: string) => {
    const s = status.trim();
    if (['جديد', 'تم الاستلام'].includes(s)) return 1;
    if (['قيد المراجعة'].includes(s)) return 2;
    if (['قيد الدراسة', 'بانتظار المستندات'].includes(s)) return 3;
    if (['تم الموافقة', 'مقبول', 'مرفوض', 'تم الرفض'].includes(s)) return 4;
    if (['قيد المعالجة', 'مكتمل'].includes(s)) return 5;
    return 1;
  };

  return (
    <div className="bg-[#F8FAF7] min-h-screen pb-24 relative overflow-hidden">
      <SEO title="بوابة تتبع المعاملات والطلبات" description="استعلم عن حالة طلبك الإنساني من مؤسسة الوليد للإنسانية بكل شفافية باستخدام الرقم المرجعي أو السجل المدني." type="WebPage" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#033500]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#C9A84C]/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Luxury Page Header */}
      <div className="relative pt-20 pb-36 bg-[#033500] text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-white/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="flex items-center justify-center gap-3 text-xs font-semibold mb-6 text-white/60">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-white">بوابة الاستعلام</span>
            <span>/</span>
            <span className="text-[#C9A84C]">تتبع حالة طلبك</span>
          </div>
          
          <h1 className="text-white font-black mb-6" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontFamily: 'Cairo, sans-serif', letterSpacing: '-0.02em' }}>
            نظام تتبع الطلبات الموحد
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#C9A84C] to-[#e6c467] mx-auto rounded-full mb-6 shadow-md" />
          
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
            مواكبة لرؤية التحول الرقمي، نتيح لكم الاستعلام اللحظي والمباشر عن معاملاتكم الإنسانية والاجتماعية بموثوقية تامة وبخطوات مبسطة.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 -mt-20 relative z-30">
        
        {/* Search Panel */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_70px_-15px_rgba(3,53,0,0.06)] border border-[#033500]/5 mb-8">
          
          {/* Segmented Controller */}
          <div className="flex bg-[#F8FAF7] p-1.5 rounded-2xl mb-8 w-full max-w-md mx-auto relative border border-[#033500]/5">
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-[#033500] shadow-lg shadow-[#033500]/10 transition-all duration-500 ease-out z-0"
              style={{ right: searchType === 'id' ? '0.375rem' : 'calc(50% + 0.375rem)' }}
            ></div>
            {[
              { label: 'رقم المعاملة الموحد', value: 'id' },
              { label: 'رقم الهوية / الجواز', value: 'national' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSearchType(opt.value as 'id' | 'national');
                  setError('');
                }}
                className={`flex-1 py-3 relative z-10 font-bold text-sm transition-colors duration-300 ${
                  searchType === opt.value ? 'text-white' : 'text-[#033500]/60 hover:text-[#033500]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSearch(e)} className="max-w-3xl mx-auto">
            <div className="relative mb-6">
              <input
                className={`w-full h-16 pl-16 pr-6 rounded-2xl text-lg font-bold transition-all duration-300 bg-[#F8FAF7] outline-none border-2 ${
                  error 
                    ? 'border-[#C9A84C] text-[#C9A84C] bg-red-50/10' 
                    : 'border-[#033500]/5 focus:border-[#C9A84C] focus:bg-white text-[#033500] placeholder-[#033500]/30'
                }`}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (error) setError('');
                }}
                placeholder={searchType === 'id' ? 'مثال: WF-95198743-W95V' : 'أدخل رقم الهوية أو الجواز المرفق بالطلب'}
                style={{ fontFamily: 'Cairo, sans-serif' }}
                dir="auto"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-[#033500] text-white flex items-center justify-center transition-all hover:bg-[#044c00] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#C9A84C] text-sm font-bold flex items-center gap-1.5 justify-center mb-6"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#033500]/5 text-xs">
              <div className="text-slate-400 font-semibold">
                💡 طلب تجريبي للاختبار: 
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('WF-95198743-W95V');
                    setSearchType('id');
                    setError('');
                  }}
                  className="font-black text-[#033500] hover:text-[#C9A84C] underline decoration-dotted transition-colors ml-1.5"
                >
                  WF-95198743-W95V
                </button>
              </div>

              {recentSearches.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">المحفوظات الأخيرة:</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {recentSearches.map((history) => (
                      <div
                        key={history.trackingNumber}
                        onClick={() => {
                          setSearchValue(history.trackingNumber);
                          setSearchType('id');
                          handleSearch(undefined as any, history.trackingNumber, 'id');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#033500]/5 hover:bg-[#033500]/10 border border-[#033500]/10 rounded-full text-[10px] text-[#033500] font-black cursor-pointer transition-colors"
                      >
                        <span>{history.trackingNumber}</span>
                        <button
                          type="button"
                          onClick={(e) => removeSearchHistory(history.trackingNumber, e)}
                          className="hover:text-rose-600 p-0.5"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

        </div>

        {/* NOT FOUND VIEW */}
        {result === 'not-found' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-10 md:p-14 text-center border-2 border-dashed border-[#C9A84C]/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-50 to-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#C9A84C]/20 shadow-inner">
              <XCircle size={40} className="text-[#C9A84C]" />
            </div>
            
            <h3 className="font-black text-2xl text-[#033500] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
              عذراً، لم يتم العثور على المعاملة
            </h3>
            
            <p className="text-[#033500]/70 text-base max-w-md mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              لم نجد أي طلبات مسجلة تطابق البيانات المدخلة. يرجى التأكد من كتابة الرموز والأرقام بشكل دقيق ومطابقة السجل المدني.
            </p>
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => { setResult(null); setSearchValue(''); }}
                className="px-6 py-3 bg-[#F8FAF7] hover:bg-[#033500]/5 text-[#033500] border border-[#033500]/10 font-bold text-sm rounded-xl transition-all"
              >
                تحديث البحث
              </button>
              <Link 
                href="/apply"
                className="px-6 py-3 bg-[#033500] hover:bg-[#044c00] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#033500]/10 cursor-pointer inline-block"
              >
                تقديم طلب جديد
              </Link>
            </div>
          </motion.div>
        )}

        {/* RESULTS FOUND */}
        {result && result !== 'not-found' && (
          <div className="space-y-6">

            {['تم الموافقة', 'مقبول', 'مكتمل'].includes(result.status.trim()) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#033500] via-[#054d00] to-[#033500] rounded-3xl p-6 text-white text-right relative overflow-hidden border border-[#C9A84C]/30 shadow-xl shadow-[#033500]/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-4 left-6 text-[#C9A84C] animate-pulse">
                  <Award size={48} className="stroke-1" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9A84C]/20 border border-[#C9A84C]/30 rounded-full text-xs font-black text-[#C9A84C] mb-2">
                      <Sparkles size={12} /> تهانينا والحمد لله
                    </span>
                    <h4 className="text-xl md:text-2xl font-black mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      تمت الموافقة الرسمية واعتماد طلبكم!
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      الطلب معتمد ومسجل لدى الإدارة العامة للوليد للإنسانية، وجاري ترتيب تسليم الدعم المالي/العيني إليكم في أقرب فرصة.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className="shrink-0 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#bfa044] text-[#033500] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    عرض التوجيهات الرسمية
                  </button>
                </div>
              </motion.div>
            )}

            {/* Smart Passport Card */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(3,53,0,0.05)] border border-[#033500]/5">
              
              <div className="relative p-6 md:p-10 overflow-hidden text-white border-b border-[#033500]/5 bg-[#033500]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/15 rounded-full filter blur-[80px]" />
                <div className="absolute -bottom-10 left-10 w-48 h-48 bg-[#065500] rounded-full filter blur-[60px]" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-black text-[#C9A84C] block mb-1">
                      المعاملة المسجلة رسمياً
                    </span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl md:text-4xl font-black font-mono tracking-wider text-white">
                        {result.tracking_number}
                      </h2>
                      <button 
                        onClick={() => handleCopy(result.tracking_number)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-all"
                        title="نسخ رقم الطلب"
                      >
                        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                    
                    <span className="text-white/60 text-xs font-semibold block mt-1.5 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#C9A84C]" />
                      تاريخ التسجيل: {formatDate(result.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] text-white/50 font-bold">الحالة الإدارية الحالية</span>
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-black text-lg md:text-xl text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {result.status.trim() === 'جديد' ? 'تم الاستلام' : result.status}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-[#F8FAF7] px-6 md:px-10 border-b border-[#033500]/5 flex overflow-x-auto gap-2 py-3 scrollbar-none">
                {[
                  { id: 'roadmap', label: 'حالة ومسار المعاملة', icon: Clock },
                  { id: 'dossier', label: 'تفاصيل السجل والبيانات', icon: User },
                  { id: 'notes', label: 'التوجيهات والقرارات', icon: FileText },
                  { id: 'receipt', label: 'المعاينة والإيصال الرسمي', icon: ShieldCheck },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#033500] text-[#C9A84C] shadow-lg shadow-[#033500]/10' 
                          : 'text-[#033500]/60 hover:text-[#033500] hover:bg-[#033500]/5'
                      }`}
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Panels */}
              <div className="p-6 md:p-10">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'roadmap' && (
                    <motion.div
                      key="roadmap-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid md:grid-cols-12 gap-8 items-start"
                    >
                      <div className="md:col-span-4 bg-[#F8FAF7] p-6 rounded-3xl border border-[#033500]/5 text-center">
                        <span className="text-xs font-bold text-[#033500]/50 block mb-4">مؤشر الإنجاز الكلي</span>
                        
                        <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="64" className="stroke-slate-100 fill-none" strokeWidth="8" />
                            <motion.circle 
                              cx="80" cy="80" r="64" className="stroke-[#033500] fill-none" strokeWidth="10" 
                              strokeDasharray={2 * Math.PI * 64}
                              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - getStagePercentage(result.status) / 100) }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              strokeLinecap="round"
                            />
                            <motion.circle 
                              cx="80" cy="80" r="64" className="stroke-[#C9A84C] fill-none" strokeWidth="4" 
                              strokeDasharray={2 * Math.PI * 64}
                              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - getStagePercentage(result.status) / 100) }}
                              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                              strokeLinecap="round"
                              opacity={0.6}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-[#033500] font-mono leading-none">
                              {getStagePercentage(result.status)}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold mt-1">مرحلة المعالجة</span>
                          </div>
                        </div>

                        <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${getStageBadgeColor(result.status)} mb-3`}>
                          {result.status}
                        </div>

                        <p className="text-xs text-[#033500]/85 font-bold leading-relaxed max-w-xs mx-auto" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {getStageText(result.status)}
                        </p>
                      </div>

                      <div className="md:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-black text-lg text-[#033500] flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            <div className="w-1.5 h-6 bg-[#C9A84C] rounded-full" />
                            تفاصيل مسار دراسة المعاملة
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400">💡 اضغط على الخطوة لعرض التفاصيل</span>
                        </div>

                        <div className="relative pr-8 pl-2 space-y-4">
                          <div className="absolute top-4 bottom-4 right-3.5 w-1 bg-slate-100 rounded-full z-0" />
                          <div 
                            className="absolute top-4 right-3.5 w-1 bg-gradient-to-b from-[#C9A84C] to-[#033500] rounded-full z-0 transition-all duration-1000 ease-out" 
                            style={{ 
                              height: `${Math.max(0, (getStatusLevel(result.status) - 1) * 25)}%`, 
                              maxHeight: '100%' 
                            }} 
                          />

                          {staticSteps.map((step, idx) => {
                            const isCompleted = getStatusLevel(result.status) > step.id;
                            const isCurrent = getStatusLevel(result.status) === step.id;
                            const isUpcoming = getStatusLevel(result.status) < step.id;
                            const isExpanded = hoveredStep === step.id;

                            let nodeColor = 'bg-white border-slate-200 text-slate-400';
                            if (isCompleted) nodeColor = 'bg-[#C9A84C] border-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/10';
                            if (isCurrent) nodeColor = 'bg-[#033500] border-[#C9A84C] text-[#C9A84C] ring-4 ring-[#033500]/10 scale-110';

                            return (
                              <div 
                                key={step.id} 
                                onClick={() => setHoveredStep(isExpanded ? null : step.id)}
                                className={`relative group cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-slate-50/50 p-4 rounded-2xl -mx-4 border border-[#033500]/5' : ''}`}
                              >
                                <div className={`absolute -right-7 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 z-10 ${nodeColor}`}>
                                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                                </div>

                                <div className="pr-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <h4 className={`font-black text-sm transition-colors ${isUpcoming ? 'text-slate-400' : 'text-[#033500]'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                      {step.title}
                                      {isCurrent && (
                                        <span className="mr-2 inline-flex px-2 py-0.5 rounded-full text-[9px] font-black bg-[#C9A84C]/10 text-[#C9A84C] animate-pulse">
                                          المرحلة الجارية
                                        </span>
                                      )}
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400 sm:text-left">{step.duration}</span>
                                  </div>
                                  
                                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
                                    {step.desc}
                                  </p>

                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3 p-3.5 bg-white border border-[#033500]/5 rounded-xl shadow-inner text-xs text-[#033500]/70 leading-relaxed font-semibold relative"
                                      >
                                        <div className="absolute top-0 right-3 transform -translate-y-1/2 w-3.5 h-3.5 bg-white border-t border-r border-[#033500]/5 rotate-[315deg] hidden sm:block" />
                                        {step.detail}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {activeTab === 'dossier' && (
                    <motion.div
                      key="dossier-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <h3 className="font-black text-lg text-[#033500] flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        <div className="w-1.5 h-6 bg-[#C9A84C] rounded-full" />
                        السجل الشخصي للمستفيد
                      </h3>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                          { label: 'الاسم الرباعي الكامل', value: result.full_name, icon: User },
                          { label: 'رقم الهوية / الجواز', value: result.id_number, icon: ShieldCheck },
                          { label: 'رقم جوال المستفيد', value: result.phone, icon: Phone },
                          { label: 'البريد الإلكتروني', value: result.email || 'غير مدخل', icon: FileText },
                          { label: 'موقع الإقامة الحالية', value: `${result.country || ''} - ${result.city || ''}`, icon: MapPin },
                          { label: 'الحالة الاجتماعية', value: result.marital_status || 'غير محددة', icon: Clock },
                        ].map((item, idx) => {
                          const IconComponent = item.icon;
                          return (
                            <div key={idx} className="bg-[#F8FAF7] border border-[#033500]/5 rounded-2xl p-4.5 hover:shadow-sm transition-all duration-300">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1.5">{item.label}</span>
                              <div className="flex items-center gap-2 text-[#033500]">
                                <IconComponent size={15} className="text-[#C9A84C]" />
                                <span className="font-black text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  {item.value}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-6 border-t border-[#033500]/5">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-black text-sm text-[#033500] flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            <Landmark size={16} className="text-[#C9A84C]" />
                            بيانات الحساب البنكي للتسليم والمطابقة
                          </h4>
                        </div>

                        <div className="grid md:grid-cols-12 gap-8 items-center">
                          <div className="md:col-span-6 relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#032500] via-[#043b00] to-[#0d5900] shadow-xl shadow-[#033500]/10 border border-[#C9A84C]/20 p-6 flex flex-col justify-between text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
                            
                            <div className="flex justify-between items-start relative z-10">
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-black block">الحساب البنكي المعتمد</span>
                                <span className="text-sm font-black mt-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                  {result.bank_name || 'البنك المعتمد'}
                                </span>
                              </div>
                              <Landmark size={28} className="text-[#C9A84C]" />
                            </div>

                            <div className="relative z-10">
                              <span className="text-[9px] text-[#C9A84C] block font-bold mb-1">رقم الآيبان (IBAN)</span>
                              <div className="flex items-center justify-between bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl font-mono text-xs tracking-wider">
                                <span>{result.iban}</span>
                                <button
                                  onClick={() => handleCopy(result.iban)}
                                  className="text-[#C9A84C] hover:text-white transition-colors"
                                  title="نسخ الآيبان"
                                >
                                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-6 space-y-4">
                            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-2xl p-5 text-right relative">
                              <div className="absolute top-4 left-4 text-[#C9A84C]">
                                <ShieldCheck size={20} />
                              </div>
                              <h5 className="font-black text-xs text-[#033500] mb-1.5">حماية البيانات والتحويل المباشر</h5>
                              <p className="text-[11px] text-[#033500]/75 leading-relaxed font-semibold">
                                تلتزم المؤسسة بتحويل المساعدات المالية بقرارات رسمية معتمدة مباشرة للآيبان البنكي المطابق لاسم المستفيد، لضمان السرية التامة وتفادي الوسطاء.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {activeTab === 'notes' && (
                    <motion.div
                      key="notes-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="font-black text-lg text-[#033500] flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        <div className="w-1.5 h-6 bg-[#C9A84C] rounded-full" />
                        القرارات والتوجيهات الإدارية المباشرة
                      </h3>

                      <div className="bg-[#FAF9F6] rounded-3xl p-6 md:p-10 border border-slate-200 relative overflow-hidden shadow-inner text-right">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/60 pb-6 mb-8 gap-4">
                          <div>
                            <span className="text-xs text-[#033500] font-black block">مؤسسة الوليد للإنسانية</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-bold">قسم دراسة وبحث المعاملات</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block font-bold">الرقم المرجعي: {result.tracking_number}</span>
                            <span className="text-[10px] text-slate-400 block font-bold">تاريخ القرار: {formatDate(result.updated_at || result.created_at)}</span>
                          </div>
                        </div>

                        <div className="min-h-36 relative">
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                            <Award size={180} className="text-[#033500]" />
                          </div>

                          <span className="text-xs font-bold text-slate-400 block mb-3">نص القرار الرسمي المعتمد:</span>
                          <p className="text-base md:text-lg text-[#033500] font-bold leading-relaxed whitespace-pre-line relative z-10">
                            {result.notes || (
                              result.status === 'تم الموافقة' || result.status === 'مقبول' || result.status === 'مكتمل'
                                ? `الحمد لله الذي بنعمته تتم الصالحات،\nبعد دراسة الوثائق الثبوتية والاجتماعية المرفقة من قبل المستفيد الكريم (${result.full_name})، تقرر بموجب لجنة الاعتمادات بمؤسسة الوليد للإنسانية اعتماد هذا الطلب لبرنامج (${result.request_type}) لمواجهة الأعباء المعيشية وتحقيق التنمية المستدامة.\n\nتجري الآن ترتيبات تسليم الدعم المعتمد بالتواصل مع البنك المستقبل والجهات المنفذة للشراكة التنموية.`
                                : result.status === 'مرفوض' || result.status === 'تم الرفض'
                                  ? `إلى المستعلم الكريم (${result.full_name})،\nبعد دراسة طلبكم برقم المرجعية الموحد (${result.tracking_number}) لبرنامج (${result.request_type})، نأسف لإخطاركم بأن الطلب لا يستوفي معايير الاستحقاق المعتمدة للجمعية في الوقت الحالي لعدم تطابق شروط فئات الدعم الأشد عوزاً.\n\nيمكنكم التواصل مع الدعم الفني للاستفسار عن إمكانية تقديم مستندات إضافية وتعديل الطلب.`
                                  : `إلى المستفيد الكريم (${result.full_name})،\nلقد تم تسجيل وتدقيق معاملتكم الإنسانية بنجاح برقم التتبع (${result.tracking_number}). جاري مراجعة الطلب والتأكد من مطابقة الأوراق من قبل الباحثين لتأهيلها للجنة التنفيذية.\n\nيرجى متابعة هذه البوابة بانتظام لمعرفة أي تحديثات فورية.`
                            )}
                          </p>
                        </div>

                        <div className="mt-12 pt-6 border-t border-slate-300/40 flex flex-wrap justify-between items-center gap-6">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">توقيع اللجنة والاعتماد</span>
                            <div className="w-24 h-8 bg-[url('https://www.transparenttextures.com/patterns/fabric.png')] bg-[#C9A84C]/5 border border-dashed border-[#C9A84C]/30 rounded-lg mt-1 flex items-center justify-center opacity-50">
                              <span className="text-[10px] text-[#C9A84C] font-bold font-serif">Alwaleed SEAL</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center bg-white shadow-sm relative">
                              <Award size={20} className="text-[#C9A84C]" />
                              <div className="absolute inset-0 rounded-full border border-[#C9A84C] opacity-30 animate-ping" />
                            </div>
                            <span className="text-xs text-[#033500] font-black">جمعية معتمدة وآمنة</span>
                          </div>
                        </div>

                      </div>

                      {['مرفوض', 'تم الرفض', 'بانتظار المستندات'].includes(result.status.trim()) && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="text-right">
                            <h4 className="font-black text-sm text-[#033500] flex items-center gap-1.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              <AlertCircle size={16} className="text-[#C9A84C]" />
                              بوابة الاستفسار واستكمال الأوراق مع الباحث المختص
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              في حال رغبتكم في الاستفسار أو إرفاق صكوك ثبوتية إضافية، يمكنكم التواصل الفوري بلمسة واحدة.
                            </p>
                          </div>
                          
                          <a 
                            href="https://wa.me/966500000000"
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all hover:scale-105"
                          >
                            <MessageSquare size={14} />
                            التحدث مع الباحث الاجتماعي عبر واتساب
                          </a>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {activeTab === 'receipt' && (
                    <motion.div
                      key="receipt-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-black text-lg text-[#033500]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            بطاقة إثبات المعاملة الرسمية
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">يمكنك طباعة هذا الإيصال كإثبات على تسجيل طلبك رسمياً بمؤسستنا الإنسانية.</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-[#033500] hover:bg-[#044c00] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
                          >
                            <Printer size={14} />
                            طباعة الإيصال
                          </button>
                          <button 
                            onClick={handleShare}
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#033500] border border-[#033500]/10 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all relative"
                          >
                            <Share2 size={14} />
                            مشاركة الرابط
                            {showShareTooltip && (
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#033500] text-[#C9A84C] text-[10px] font-bold rounded-md whitespace-nowrap shadow-md">
                                تم نسخ رابط التتبع اللحظي!
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="max-w-xl mx-auto bg-white border-[10px] border-[#033500]/5 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden text-right">
                        <div className="absolute inset-2 border border-[#C9A84C]/30 rounded-2xl pointer-events-none" />
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                          <Award size={250} className="text-[#033500]" />
                        </div>

                        <div className="flex justify-between items-center border-b border-[#033500]/10 pb-4 mb-6">
                          <div className="text-right">
                            <span className="text-[10px] font-black text-[#033500] block">مؤسسة الوليد للإنسانية</span>
                            <span className="text-[8px] font-semibold text-slate-400 block">شعارنا الريادة والعطاء</span>
                          </div>
                          
                          <div className="w-10 h-10 rounded-full border border-[#C9A84C]/50 flex items-center justify-center bg-[#F8FAF7]">
                            <Award size={18} className="text-[#C9A84C]" />
                          </div>

                          <div className="text-left font-mono text-[8px] text-slate-400">
                            <span>ALWALEED-TRACKING</span>
                          </div>
                        </div>

                        <div className="text-center mb-6">
                          <h4 className="text-[#033500] text-base font-black tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            إيصال قيد معاملة معتمدة
                          </h4>
                          <span className="text-[9px] font-bold text-[#C9A84C] tracking-widest mt-0.5 block">OFFICIAL RECORD RECEIPT</span>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div className="flex justify-between items-center bg-[#F8FAF7] p-2.5 rounded-lg border border-[#033500]/5">
                            <span className="text-slate-400 font-semibold">الرقم المرجعي الموحد:</span>
                            <span className="font-black text-[#033500] font-mono tracking-wider">{result.tracking_number}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-400 font-semibold">اسم صاحب المعاملة:</span>
                            <span className="font-black text-[#033500]">{result.full_name}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-400 font-semibold">رقم الهوية الوطنية:</span>
                            <span className="font-black text-[#033500] font-mono">{result.id_number}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-400 font-semibold">نوع الدعم والمساعدة:</span>
                            <span className="font-black text-[#033500]">{result.request_type}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-400 font-semibold">البنك المعتمد:</span>
                            <span className="font-black text-[#033500]">{result.bank_name}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-slate-400 font-semibold">الحالة الحالية للطلب:</span>
                            <span className="font-black text-amber-600">{result.status}</span>
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                          <div className="text-right">
                            <span className="text-[8px] text-slate-400 block font-bold">تاريخ إصدار المستند</span>
                            <span className="text-[9px] font-black text-[#033500]">{new Date().toLocaleDateString('ar-SA')}</span>
                          </div>

                          <div className="bg-[#033500] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold">
                            الوليد للإنسانية
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => { setResult(null); setSearchValue(''); }}
                className="flex-1 py-4.5 px-6 rounded-2xl bg-[#033500] hover:bg-[#044c00] text-white font-black text-base transition-all hover:scale-[1.02] shadow-lg shadow-[#033500]/10 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                إجراء استعلام جديد
              </button>
              <Link 
                href="/contact"
                className="flex-1 py-4.5 px-6 rounded-2xl bg-white border-2 border-[#033500]/10 hover:border-[#033500] text-[#033500] hover:bg-[#033500]/5 font-black text-base transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                الدعم الفني والشكاوى
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

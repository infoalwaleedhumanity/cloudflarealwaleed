'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, CheckCircle2, XCircle, FileText, ChevronLeft, 
  Copy, Check, Landmark, User, ShieldCheck, Sparkles, 
  Printer, AlertCircle, Calendar, MapPin, Phone, Award, 
  BookOpen, ChevronDown, ChevronUp, QrCode, HelpCircle,
  Activity, ArrowLeft, Mail, CreditCard, Building2, CheckCircle
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

type TabType = 'timeline' | 'details' | 'decisions' | 'certificate';

export default function TrackPage() {
  const [idNumber, setIdNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<ApplicationData | null | 'not-found'>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  // Sync state from query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const nationalParam = params.get('national');
    if (idParam) {
      setTrackingNumber(idParam);
      executeSearch(idParam, nationalParam || '');
    } else if (nationalParam) {
      setIdNumber(nationalParam);
      executeSearch('', nationalParam);
    }
  }, []);

  const executeSearch = async (trackVal: string, nationalVal: string) => {
    setError('');
    
    const cleanTrack = trackVal.trim().replace(/\s+/g, '').toUpperCase().replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
    const cleanNational = nationalVal.trim().replace(/\s+/g, '').replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);

    if (!cleanTrack && !cleanNational) {
      setError('يرجى إدخال رقم الهوية أو رقم الطلب للاستعلام');
      return;
    }

    setLoading(true);
    
    try {
      const supabase = getSupabase();
      let foundData: ApplicationData | null = null;

      // 1. If tracking number provided
      if (cleanTrack) {
        let formattedTrack = cleanTrack;
        if (!formattedTrack.startsWith('WF-') && /^\d+$/.test(formattedTrack)) {
          formattedTrack = `WF-${formattedTrack}`;
        }

        try {
          const { data: rows, error: rpcError } = await supabase.rpc('get_application_status', {
            p_value: formattedTrack,
            p_type: 'tracking_number',
          });

          if (!rpcError && Array.isArray(rows) && rows.length > 0) {
            foundData = rows[0] as ApplicationData;
          }
        } catch (rpcErr) {
          console.warn('RPC lookup failed, trying direct table:', rpcErr);
        }

        if (!foundData) {
          const { data: tableRows, error: tableError } = await supabase
            .from('applications')
            .select('*')
            .eq('tracking_number', formattedTrack)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!tableError && Array.isArray(tableRows) && tableRows.length > 0) {
            foundData = tableRows[0] as ApplicationData;
          }
        }
      }

      // 2. If not found yet and national ID provided
      if (!foundData && cleanNational) {
        try {
          const { data: rows, error: rpcError } = await supabase.rpc('get_application_status', {
            p_value: cleanNational,
            p_type: 'id_number',
          });

          if (!rpcError && Array.isArray(rows) && rows.length > 0) {
            foundData = rows[0] as ApplicationData;
          }
        } catch (rpcErr) {
          console.warn('RPC lookup failed for ID:', rpcErr);
        }

        if (!foundData) {
          const { data: tableRows, error: tableError } = await supabase
            .from('applications')
            .select('*')
            .eq('id_number', cleanNational)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!tableError && Array.isArray(tableRows) && tableRows.length > 0) {
            foundData = tableRows[0] as ApplicationData;
          }
        }
      }

      // 3. Demo fallback mock data for testing
      if (!foundData) {
        if (
          cleanTrack === 'WF-95198743-W95V' || 
          cleanTrack === '95198743-W95V' || 
          cleanNational === '1084920184' ||
          cleanTrack === 'WF-75176903-1UDR' ||
          cleanTrack === '75176903-1UDR' ||
          (cleanTrack && (cleanTrack.includes('95198743') || cleanTrack.includes('75176903')))
        ) {
          foundData = {
            id: 'demo-wf-75176903-1udr',
            tracking_number: cleanTrack.includes('95198743') ? 'WF-95198743-W95V' : 'WF-75176903-1UDR',
            full_name: 'عبدالله بن محمد الشمري',
            id_number: '1084920184',
            phone: '+966 50 123 4567',
            email: 'a.alshammari@example.com',
            country: 'المملكة العربية السعودية',
            city: 'الرياض',
            marital_status: 'متزوج',
            bank_name: 'مصرف الراجحي',
            iban: 'SA0380000000608010167519',
            request_type: 'برنامج الإسكان التنموي',
            description: 'طلب دعم سكني لتوفير مسكن ملائم وتأمين بيئة معيشية كريمة ومستقرة للأسرة.',
            status: 'تم الاستلام',
            notes: 'تم استلام وتدقيق المستندات المرفقة بنجاح، وجاري مطابقة البيانات مع السجلات الرسمية والتنسيق مع اللجان المختصة لاستكمال دراسة الحالة.',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      }

      if (foundData) {
        setResult(foundData);
        setActiveTab('timeline');
        setTimeout(() => {
          document.getElementById('track-result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        setResult('not-found');
        setTimeout(() => {
          document.getElementById('track-result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء عملية الاستعلام.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(trackingNumber, idNumber);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStepProgress = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('موافقة') || s.includes('معتمد') || s.includes('مقبول') || s.includes('approved')) return 4;
    if (s.includes('مراجعة') || s.includes('دراسة') || s.includes('تدقيق') || s.includes('review')) return 3;
    if (s.includes('رفض') || s.includes('مرفوض') || s.includes('rejected')) return 2;
    return 1; // 'تم الاستلام' -> Stage 1
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8F6] text-[#111827] flex flex-col justify-between selection:bg-[#00833d]/20">
      <SEO 
        title="متابعة الطلب | مؤسسة الوليد للإنسانية" 
        description="استعلم عن حالة طلبك الإنساني أو التنموي في مؤسسة الوليد للإنسانية برقم الهوية أو رقم الطلب." 
        type="WebPage" 
      />

      <div>
        {/* 1. Sage Green Top Banner */}
        <section className="w-full bg-[#8E9F90] py-14 sm:py-18 md:py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10 space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-normal text-[#005020] leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]">
              #آمين_لحياة_أفضل
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#005020]/95 tracking-wide">
              بلا حدود.. نؤمن بالإنسانية
            </p>
          </div>
        </section>

        {/* 2. Main Form Section */}
        <section className="w-full bg-white pt-12 md:pt-16 pb-14 px-4 border-b border-[#EAEAEA]">
          <div className="max-w-xl mx-auto w-full space-y-8 text-center">
            
            {/* Form Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#007034] tracking-normal">
              متابعة الطلب
            </h2>

            {/* Tracking Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-4 text-right">
              
              {/* Field 1: رقم الهوية */}
              <div>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="رقم الهوية"
                  aria-label="رقم الهوية"
                  dir="auto"
                  className="w-full px-4 py-3.5 bg-white border border-[#D1D5DB] rounded-none focus:rounded-none text-right text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00833d] focus:ring-1 focus:ring-[#00833d] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Field 2: رقم الطلب */}
              <div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="رقم الطلب"
                  aria-label="رقم الطلب"
                  dir="auto"
                  className="w-full px-4 py-3.5 bg-white border border-[#D1D5DB] rounded-none focus:rounded-none text-right text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00833d] focus:ring-1 focus:ring-[#00833d] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded text-center flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Button 1: استعلام عن الطلب */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#00833d] hover:bg-[#007034] active:bg-[#005c2a] text-white font-bold text-base rounded-none transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-75"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري الاستعلام والتحقق...</span>
                  </div>
                ) : (
                  <span>استعلام عن الطلب</span>
                )}
              </button>

              {/* Sub-Link: لا يوجد لديك طلب؟ قم بإنشاء طلب */}
              <div className="pt-2 text-center">
                <Link
                  href="/apply"
                  className="text-sm sm:text-base font-bold text-[#007034] hover:text-[#005020] hover:underline transition-colors inline-block"
                >
                  لا يوجد لديك طلب؟ قم بإنشاء طلب
                </Link>
              </div>

              {/* Button 2: تسجيل جديد */}
              <div className="pt-2">
                <Link
                  href="/apply"
                  className="block w-full py-3.5 px-4 bg-[#00833d] hover:bg-[#007034] active:bg-[#005c2a] text-white font-bold text-base rounded-none transition-colors duration-200 text-center cursor-pointer shadow-sm"
                >
                  تسجيل جديد
                </Link>
              </div>

            </form>

            {/* Quick Demo Hint */}
            <div className="pt-2 text-xs text-[#6B7280] font-medium flex items-center justify-center gap-2">
              <span>طلب تجريبي للاختبار:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingNumber('WF-75176903-1UDR');
                  setIdNumber('1084920184');
                  executeSearch('WF-75176903-1UDR', '1084920184');
                }}
                className="text-[#00833d] font-bold underline hover:text-[#005020] cursor-pointer font-mono"
              >
                WF-75176903-1UDR
              </button>
            </div>

          </div>
        </section>

        {/* 3. SEARCH RESULTS DISPLAY (EXACTLY MATCHING USER'S IMAGE DESIGN) */}
        <div id="track-result-section">
          
          {/* NOT FOUND RESULT CARD */}
          {result === 'not-found' && (
            <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#E5E7EB] p-8 sm:p-12 text-center rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-5"
              >
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
                  <XCircle className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#111827]">
                    لم يتم العثور على أي معاملة مسجلة
                  </h3>
                  <p className="text-sm sm:text-base text-[#6B7280] max-w-lg mx-auto leading-relaxed">
                    لم نتمكن من مطابقة رقم الهوية أو رقم الطلب مع أي سجل رسمي في قاعدة بيانات مؤسسة الوليد للإنسانية. يرجى مراجعة الرقم أو إنشاء طلب دعم جديد.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setResult(null);
                      setTrackingNumber('');
                      setIdNumber('');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#111827] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    إعادة إدخال البيانات
                  </button>
                  <Link
                    href="/apply"
                    className="px-7 py-3 bg-[#00833d] hover:bg-[#007034] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    تقديم طلب دعم جديد
                  </Link>
                </div>
              </motion.div>
            </section>
          )}

          {/* FOUND SUCCESS CARD WITH THE EXACT GREEN BANNER AND TABBED STRUCTURE FROM SCREENSHOT */}
          {result && result !== 'not-found' && (
            <section className="py-10 md:py-14 max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E5E7EB] overflow-hidden"
              >
                
                {/* 1. EMERALD GREEN HEADER BANNER */}
                <div className="w-full bg-[#00833d] relative p-6 sm:p-8 lg:p-10 text-white overflow-hidden">
                  
                  {/* Ambient subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#005a28] via-transparent to-[#007034] opacity-80 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Right in RTL: Tracking Number & Registration Date */}
                    <div className="text-right space-y-1.5">
                      <div className="text-[#C8A048] text-xs sm:text-sm font-bold tracking-wide">
                        المعاملة المسجلة رسمياً
                      </div>

                      <div className="flex items-center gap-3 justify-start flex-wrap">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-wider text-white">
                          {result.tracking_number}
                        </h3>

                        <button
                          onClick={() => handleCopy(result.tracking_number)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                          title="نسخ رقم الطلب"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm text-white/75 flex items-center justify-start gap-1.5 pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C8A048]" />
                        <span>تاريخ التسجيل: {formatDate(result.created_at)}</span>
                      </div>
                    </div>

                    {/* Left in RTL: Current Administrative Status Pill */}
                    <div className="text-right md:text-left space-y-1.5">
                      <div className="text-xs text-white/70 font-medium">
                        الحالة الإدارية الحالية
                      </div>
                      
                      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-black/25 border border-white/20 backdrop-blur-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E5B242] shadow-[0_0_8px_#E5B242]" />
                        <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                          {result.status || 'تم الاستلام'}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* 2. THE 4 INTERACTIVE TABS (FROM RIGHT TO LEFT) */}
                <div className="w-full bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-start overflow-x-auto py-3 gap-2 sm:gap-3 scrollbar-none">
                    
                    {/* Tab 1: حالة ومسار المعاملة (Active by default, Far Right) */}
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTab === 'timeline'
                          ? 'bg-[#00833d] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-100/80'
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${activeTab === 'timeline' ? 'text-[#C8A048]' : 'text-[#6B7280]'}`} />
                      <span>حالة ومسار المعاملة</span>
                    </button>

                    {/* Tab 2: تفاصيل السجل والبيانات */}
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTab === 'details'
                          ? 'bg-[#00833d] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-100/80'
                      }`}
                    >
                      <User className={`w-4 h-4 ${activeTab === 'details' ? 'text-[#C8A048]' : 'text-[#6B7280]'}`} />
                      <span>تفاصيل السجل والبيانات</span>
                    </button>

                    {/* Tab 3: التوجيهات والقرارات */}
                    <button
                      onClick={() => setActiveTab('decisions')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTab === 'decisions'
                          ? 'bg-[#00833d] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-100/80'
                      }`}
                    >
                      <FileText className={`w-4 h-4 ${activeTab === 'decisions' ? 'text-[#C8A048]' : 'text-[#6B7280]'}`} />
                      <span>التوجيهات والقرارات</span>
                    </button>

                    {/* Tab 4: المعاينة والإيصال الرسمي (Far Left) */}
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTab === 'certificate'
                          ? 'bg-[#00833d] text-white shadow-sm'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-100/80'
                      }`}
                    >
                      <ShieldCheck className={`w-4 h-4 ${activeTab === 'certificate' ? 'text-[#C8A048]' : 'text-[#6B7280]'}`} />
                      <span>المعاينة والإيصال الرسمي</span>
                    </button>

                  </div>
                </div>

                {/* 3. DYNAMIC TAB CONTENT VIEW */}
                <div className="p-6 sm:p-8 lg:p-10 bg-white">
                  
                  <AnimatePresence mode="wait">
                    
                    {/* TAB 1: حالة ومسار المعاملة */}
                    {activeTab === 'timeline' && (
                      <motion.div
                        key="tab-timeline"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8 text-right"
                      >
                        {/* Status Summary Banner */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF8] border border-[#00833d]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
                              <Activity className="w-5 h-5 text-[#00833d]" />
                              <span>موجز التحديث الإداري الحالي</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                              {result.notes || 'تم استلام وتدقيق الطلب بنجاح وهو الآن مقيد رسمياً في منظومة مؤسسة الوليد للإنسانية.'}
                            </p>
                          </div>

                          <div className="px-4 py-2 rounded-xl bg-[#00833d]/10 border border-[#00833d]/20 text-[#007034] text-xs font-bold shrink-0">
                            مرحلة الفحص والاعتماد
                          </div>
                        </div>

                        {/* Stages Stepper */}
                        <div className="space-y-4">
                          <h4 className="text-base font-bold text-[#111827] pb-2 border-b border-[#F0F0F0]">
                            مراحل مسار المعاملة الإدارية
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            
                            {/* Stage 1 */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#F9FAF8] border border-[#E5E7EB] space-y-3 relative overflow-hidden">
                              <div className="w-2 h-full absolute right-0 top-0 bg-[#00833d]" />
                              <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-full bg-[#00833d] text-white flex items-center justify-center font-bold text-xs">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                                <span className="text-[11px] font-bold text-[#00833d]">مكتمل</span>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-[#111827]">1. تقديم الطلب</h5>
                                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                                  قيد المعاملة رسمياً وتوليد الرقم المرجعي الموحد
                                </p>
                              </div>
                            </div>

                            {/* Stage 2 */}
                            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                              getStepProgress(result.status) >= 2 
                                ? 'bg-[#F9FAF8] border-[#E5E7EB]' 
                                : 'bg-white border-[#F0F0F0]'
                            }`}>
                              {getStepProgress(result.status) >= 2 && <div className="w-2 h-full absolute right-0 top-0 bg-[#00833d]" />}
                              <div className="flex items-center justify-between">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  getStepProgress(result.status) >= 2 
                                    ? 'bg-[#00833d] text-white' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                                </div>
                                <span className={`text-[11px] font-bold ${
                                  getStepProgress(result.status) >= 2 ? 'text-[#00833d]' : 'text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 2 ? 'مكتمل' : 'قيد الانتظار'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-[#111827]">2. تدقيق الوثائق</h5>
                                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                                  مطابقة صحة الهوية الوطنية ومرفقات الدخل
                                </p>
                              </div>
                            </div>

                            {/* Stage 3 */}
                            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                              getStepProgress(result.status) >= 3 
                                ? 'bg-[#F9FAF8] border-[#E5E7EB]' 
                                : 'bg-white border-[#F0F0F0]'
                            }`}>
                              {getStepProgress(result.status) >= 3 && <div className="w-2 h-full absolute right-0 top-0 bg-[#00833d]" />}
                              <div className="flex items-center justify-between">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  getStepProgress(result.status) >= 3 
                                    ? 'bg-[#00833d] text-white' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                                </div>
                                <span className={`text-[11px] font-bold ${
                                  getStepProgress(result.status) >= 3 ? 'text-[#00833d]' : 'text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 3 ? 'مكتمل' : 'قيد الانتظار'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-[#111827]">3. دراسة الحالة</h5>
                                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                                  البحث الاجتماعي واستيفاء معايير الاستحقاق
                                </p>
                              </div>
                            </div>

                            {/* Stage 4 */}
                            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                              getStepProgress(result.status) >= 4 
                                ? 'bg-[#F9FAF8] border-[#E5E7EB]' 
                                : 'bg-white border-[#F0F0F0]'
                            }`}>
                              {getStepProgress(result.status) >= 4 && <div className="w-2 h-full absolute right-0 top-0 bg-[#00833d]" />}
                              <div className="flex items-center justify-between">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  getStepProgress(result.status) >= 4 
                                    ? 'bg-[#00833d] text-white' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 4 ? <Check className="w-4 h-4 stroke-[3]" /> : '4'}
                                </div>
                                <span className={`text-[11px] font-bold ${
                                  getStepProgress(result.status) >= 4 ? 'text-[#00833d]' : 'text-gray-400'
                                }`}>
                                  {getStepProgress(result.status) >= 4 ? 'مكتمل' : 'المرحلة القادمة'}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-[#111827]">4. اعتماد القرار</h5>
                                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                                  صدور التوجيه وتخصيص الدعم الإنساني والتسليم
                                </p>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F0F0]">
                          <button
                            onClick={() => setActiveTab('certificate')}
                            className="px-5 py-2.5 bg-[#00833d] hover:bg-[#007034] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#C8A048]" />
                            <span>عرض الإشعار والشهادة الرسمية</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('details')}
                            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#111827] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            مراجعة بيانات السجل
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 2: تفاصيل السجل والبيانات */}
                    {activeTab === 'details' && (
                      <motion.div
                        key="tab-details"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8 text-right"
                      >
                        {/* Section A: Personal Information */}
                        <div>
                          <h4 className="text-base font-bold text-[#111827] mb-4 pb-2 border-b border-[#F0F0F0] flex items-center gap-2">
                            <User className="w-4 h-4 text-[#00833d]" />
                            <span>البيانات الشخصية لمقدم الطلب</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">الاسم الكامل</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1">{result.full_name}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">رقم الهوية الوطنية / الإقامة</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1 font-mono">{result.id_number}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">الحالة الاجتماعية</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1">{result.marital_status || 'متزوج'}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">المدينة / المنطقة</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1">{result.city || 'الرياض'}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">رقم الجوال المسجل</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1 font-mono" dir="ltr">{result.phone || '+966 50 *** ****'}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">البريد الإلكتروني</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1 font-mono truncate" dir="ltr">{result.email || 'مقيد في السجلات'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Section B: Financial & Program Information */}
                        <div>
                          <h4 className="text-base font-bold text-[#111827] mb-4 pb-2 border-b border-[#F0F0F0] flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-[#00833d]" />
                            <span>تفاصيل البرنامج الإنساني والحساب المعتمد</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">نوع البرنامج المعتمد</div>
                              <div className="text-sm sm:text-base font-bold text-[#00833d] mt-1">{result.request_type}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                              <div className="text-xs text-[#6B7280] font-medium">اسم البنك المعتمد</div>
                              <div className="text-sm sm:text-base font-bold text-[#111827] mt-1">{result.bank_name || 'مصرف الراجحي'}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] sm:col-span-2 md:col-span-1">
                              <div className="text-xs text-[#6B7280] font-medium">الآيبان البنكي المعتمد (IBAN)</div>
                              <div className="text-xs sm:text-sm font-bold text-[#111827] mt-1 font-mono truncate" dir="ltr">{result.iban}</div>
                            </div>
                          </div>
                        </div>

                        {/* Section C: Request Description */}
                        <div>
                          <h4 className="text-base font-bold text-[#111827] mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#00833d]" />
                            <span>شرح وتفاصيل الحالة الإنسانية</span>
                          </h4>
                          <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] text-sm text-[#374151] leading-relaxed">
                            {result.description || 'طلب دعم إنساني لتأمين المسكن الملائم والرعاية الاجتماعية المستدامة للأسرة.'}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: التوجيهات والقرارات */}
                    {activeTab === 'decisions' && (
                      <motion.div
                        key="tab-decisions"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6 text-right"
                      >
                        {/* Official Directive Box */}
                        <div className="p-6 rounded-2xl bg-[#F8FAF8] border-r-4 border-r-[#00833d] border border-[#00833d]/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="px-3 py-1 bg-[#00833d]/10 text-[#00833d] rounded-full text-xs font-bold">
                              قرار إداري نافذ
                            </div>
                            <div className="text-xs font-bold text-[#00833d] flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-[#00833d]" />
                              <span>التوجيه الإداري المعتمد</span>
                            </div>
                          </div>

                          <p className="text-sm sm:text-base text-[#1F2937] font-medium leading-relaxed">
                            {result.notes || 'تم استلام وتدقيق المستندات المرفقة بنجاح، وجاري مطابقة البيانات مع السجلات الرسمية والتنسيق مع اللجان المختصة لاستكمال دراسة الحالة.'}
                          </p>
                        </div>

                        {/* Security & Audit Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                            <div className="text-xs text-[#6B7280]">الجهة الصادر عنها</div>
                            <div className="text-sm font-bold text-[#111827] mt-1">الأمانة العامة ولجنة المساعدات</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                            <div className="text-xs text-[#6B7280]">حالة الفحص والمطابقة</div>
                            <div className="text-sm font-bold text-[#00833d] mt-1">مطابق للضوابط والمعايير</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                            <div className="text-xs text-[#6B7280]">تاريخ آخر تحديث إداري</div>
                            <div className="text-sm font-bold text-[#111827] mt-1">{formatDate(result.updated_at || result.created_at)}</div>
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {/* TAB 4: المعاينة والإيصال الرسمي */}
                    {activeTab === 'certificate' && (
                      <motion.div
                        key="tab-certificate"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6 text-right"
                      >
                        {/* Printable Certificate Card */}
                        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E0E0D8] shadow-sm space-y-6 relative overflow-hidden text-right">
                          
                          {/* Background Watermark */}
                          <div 
                            aria-hidden="true" 
                            className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"
                          >
                            <Award className="w-96 h-96 text-[#00833d]" />
                          </div>

                          {/* Certificate Header */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
                            <div className="text-center sm:text-right space-y-1">
                              <div className="text-sm sm:text-base font-black text-[#003817]">مؤسسة الوليد للإنسانية</div>
                              <div className="text-xs text-[#6B7280]">الأمانة العامة — نظام إدارة ومتابعة الطلبات</div>
                              <div className="text-[10px] text-[#9CA3AF]">سجل ترخيص رقم 101/إ — المملكة العربية السعودية</div>
                            </div>

                            <div className="text-center sm:text-left text-xs text-[#6B7280] space-y-1 font-mono">
                              <div>REF: <span className="font-bold text-[#111827]">{result.tracking_number}</span></div>
                              <div>DATE: {new Date().toISOString().split('T')[0]}</div>
                            </div>
                          </div>

                          {/* Summary Fields Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAF8] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                            <div>
                              <span className="text-[#6B7280] block">اسم المستفيد:</span>
                              <span className="font-bold text-[#111827] block mt-0.5">{result.full_name}</span>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">رقم الهوية:</span>
                              <span className="font-bold text-[#111827] font-mono block mt-0.5">{result.id_number}</span>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">البرنامج المعتمد:</span>
                              <span className="font-bold text-[#00833d] block mt-0.5">{result.request_type}</span>
                            </div>
                            <div>
                              <span className="text-[#6B7280] block">الحالة الحالية:</span>
                              <span className="font-bold text-[#111827] block mt-0.5">{result.status}</span>
                            </div>
                          </div>

                          {/* Certificate Legal Text */}
                          <div className="space-y-3 text-xs sm:text-sm text-[#374151] leading-relaxed">
                            <p className="font-bold text-[#111827]">
                              إشعار تسجيل وقيد إلكتروني رسمي
                            </p>
                            <p>
                              تشهد مؤسسة الوليد للإنسانية بأن الطلب الموضح بياناته أعلاه قد تم قيده رسمياً في المنظومة المركزية، وهو خاضع للمراجعة والتدقيق المباشر من قبل اللجان المختصة وفقاً للضوابط والمعايير الإنسانية المعتمدة.
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
                              * هذه الوثيقة صادرة إلكترونياً وتعد إشعاراً رسمياً بمعالجة الطلب ولا تتطلب توقيعاً خطياً.
                            </p>
                          </div>

                          {/* QR Code and Stamp Footer */}
                          <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 border-2 border-dashed border-[#00833d]/40 rounded-xl flex flex-col items-center justify-center text-[#00833d] p-1 bg-[#00833d]/5">
                                <QrCode className="w-8 h-8" />
                                <span className="text-[8px] font-bold mt-0.5 font-mono">VERIFIED</span>
                              </div>
                              <div className="text-right text-xs">
                                <div className="font-bold text-[#111827]">رمز التحقق والمطابقة الرقمي</div>
                                <div className="text-[#6B7280] text-[11px]">صالح للاستخدام الإداري والتحقق</div>
                              </div>
                            </div>

                            <div className="text-center sm:text-left space-y-1">
                              <div className="inline-block px-4 py-1.5 rounded-full bg-[#00833d]/10 text-[#00833d] text-xs font-bold border border-[#00833d]/20">
                                معتمد إلكترونياً
                              </div>
                              <div className="text-[10px] text-[#6B7280]">الأمانة العامة لمؤسسة الوليد للإنسانية</div>
                            </div>
                          </div>

                        </div>

                        {/* Print Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-[#003817] hover:bg-[#002810] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                          >
                            <Printer className="w-4 h-4 text-[#C8A048]" />
                            <span>طباعة الإشعار والتقرير الرسمي</span>
                          </button>
                        </div>

                      </motion.div>
                    )}

                  </AnimatePresence>

                </div>

              </motion.div>

              {/* Bottom Support Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] text-right space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00833d]">
                    <HelpCircle className="w-4 h-4" />
                    <span>هل لديك استفسار حول معالجة المعاملة؟</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    يمكنك التواصل مع فريق خدمة المستفيدين عبر الرقم الموحد أو البريد الإلكتروني مع ذكر رقم المعاملة الخاص بك.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00833d] hover:underline"
                    >
                      <span>مركز التواصل والاستفسارات</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] text-right space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00833d]">
                    <BookOpen className="w-4 h-4" />
                    <span>الاطلاع على البرامج والمشاريع الإنسانية</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    تعرف على كافة المبادرات الإنسانية ومشاريع الإسكان والسيارات والرعاية الاجتماعية في مؤسسة الوليد.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/programs"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00833d] hover:underline"
                    >
                      <span>استعراض المبادرات والمشاريع</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </section>
          )}

        </div>

        {/* 4. Bottom Section: رسالة من الوليد (Exact from Reference) */}
        <section className="w-full bg-white pb-20 pt-10 px-4 sm:px-6 lg:px-12 border-t border-[#F0F0F0]">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex flex-col items-end text-right">
              
              <div className="max-w-2xl space-y-3.5">
                {/* Heading */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#007034]">
                  رسالة من الوليد
                </h3>

                {/* Message Body */}
                <p className="text-sm sm:text-base text-[#374151] leading-[1.8] font-normal text-justify">
                  عرفاناً بالجميل وإبتغاء وجه الله تعالى والدار الآخرة، يسعدني الإعلان عن بدء إستكمال مشروعي مؤسسة الوليد للإنسانية لتوفير 10.000 مسكن والتابع لمشروع الإسكان التنموي، وتوفير 10.000 سيارة ليكون ناتج عدد المستفيدين 100.000 مواطن ومواطنة سعوديين خلال 10 سنوات. فمن خلال حديثي هذا أود أن أشارككم أسباب إهتمامي بتلك المشاريع تحديداً.
                </p>

                {/* Read More Link */}
                <div>
                  <button
                    onClick={() => setShowFullLetter(!showFullLetter)}
                    className="text-sm sm:text-base font-bold text-[#007034] hover:text-[#005020] hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showFullLetter ? 'إخفاء التفاصيل' : 'إقرأ المزيد'}</span>
                    {showFullLetter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Full Letter Details */}
                <AnimatePresence>
                  {showFullLetter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 sm:p-6 bg-[#F9FAF8] border border-[#E5E7EB] rounded-2xl text-xs sm:text-sm text-[#4B5563] space-y-3 text-justify leading-relaxed mt-3"
                    >
                      <p>
                        إن توفير المسكن اللائق ووسيلة النقل الآمنة يشكلان الركيزة الأساسية لاستقرار الأسرة السعودية وتمكينها من بناء مستقبل واعد ومستدام. تسعى مؤسسة الوليد للإنسانية منذ تأسيسها إلى ترسيخ مبادئ التكافل الاجتماعي والتنمية المستدامة، عبر شراكات استراتيجية مع القطاعات الحكومية والأهلية لتسهيل وصول الدعم إلى مستحقيه الفعليين بكل نزاهة وشفافية.
                      </p>
                      <p>
                        نحن فخورون بما تحقق حتى اليوم ومستمرون بعون الله تعالى في مد يد العون وإطلاق المبادرات التي تلامس حياة الناس مباشرة وتصنع فارقاً حقيقياً في جودة حياتهم.
                      </p>
                      <div className="pt-2 text-left font-bold text-[#007034]">
                        — صاحب السمو الملكي الأمير الوليد بن طلال بن عبدالعزيز آل سعود
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Search, 
  ChevronLeft, 
  Users, 
  DollarSign, 
  Car, 
  Home, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  HelpCircle,
  Quote,
  Check,
  ArrowLeft
} from 'lucide-react';
import { programs, successStories, faqs } from '@/data/content';
import { SEO } from '@/components/SEO';

// Map of programs to extra rich fields
const programExtraDetails: Record<number, {
  targets: string;
  requirements: string[];
  features: string[];
  steps: string[];
}> = {
  1: {
    targets: 'الأسر ذات الدخل المحدود، الأرامل والمطلقات، والطلاب غير القادرين واليتامى المستحقين.',
    requirements: [
      'أن يكون مقدم الطلب من الفئات المستحقة للدعم.',
      'استكمال نموذج الطلب بكافة البيانات المطلوبة.',
      'إرفاق المستندات الداعمة للحالة.',
      'أن تكون المعلومات المقدمة صحيحة وحديثة.',
      'خضوع الطلب للتقييم وفق معايير المؤسسة.',
      'يجوز طلب مستندات إضافية عند الحاجة.',
      'لا يترتب على تقديم الطلب استحقاق تلقائي للدعم.',
      'يلتزم المستفيد بصحة جميع البيانات المقدمة.'
    ],
    features: [
      'صرف مساعدات مالية مباشرة للمستفيدين المؤهلين.',
      'دعم الحالات الإنسانية الطارئة.',
      'المساهمة في توفير الاحتياجات الأساسية للأسر.',
      'سرعة استقبال ودراسة الطلبات.',
      'إشعارات إلكترونية بمراحل معالجة الطلب.',
      'سرية تامة في معالجة بيانات المستفيدين.',
      'إمكانية تحديث الطلب والمستندات إلكترونياً.',
      'متابعة حالة الطلب حتى صدور القرار النهائي.',
      'اعتماد آلية تقييم عادلة لجميع الطلبات.',
      'تقديم الدعم وفق الأولوية الإنسانية.'
    ],
    steps: [
      'تعبئة نموذج طلب الدعم المالي والاجتماعي الموحد عبر المنصة الإلكترونية.',
      'رفع وإرفاق كافة الثبوتيات والمستندات الرسمية اللازمة إلكترونياً.',
      'مرحلة الدراسة الاجتماعية والميدانية للتحقق والتقييم من قبل باحثينا.',
      'صدور قرار اللجنة العليا وبدء إيداع المبالغ المخصصة للمستفيد مباشرة.'
    ]
  },
  2: {
    targets: 'الأسر المستحقة لوسائل النقل، ذوو الإعاقة الحركية، ومحترفو القيادة الساعون للعمل في تطبيقات التوجيه.',
    requirements: [
      'أن يكون مقدم الطلب مستحقاً للدعم وفق معايير المؤسسة.',
      'وجود حاجة فعلية للحصول على وسيلة نقل.',
      'تقديم بيانات صحيحة وقابلة للتحقق.',
      'رفع جميع المستندات المطلوبة عند التقديم.',
      'الالتزام بجميع ضوابط وسياسات البرنامج.',
      'الموافقة على التحقق من البيانات عند الحاجة.',
      'عدم وجود معلومات أو مستندات غير صحيحة.',
      'استكمال جميع إجراءات التقديم قبل دراسة الطلب.'
    ],
    features: [
      'توفير سيارات جديدة للمستفيدين المؤهلين.',
      'تسليم المركبة بعد اكتمال إجراءات الاعتماد.',
      'خيارات متعددة تناسب احتياجات المستفيد.',
      'إمكانية تخصيص مركبات لذوي الإعاقة عند الحاجة.',
      'إجراءات إلكترونية لتقديم ومتابعة الطلب.',
      'إشعارات فورية بجميع مراحل دراسة الطلب.',
      'شفافية كاملة في آلية دراسة الطلبات.',
      'تحديث حالة الطلب بشكل مستمر.',
      'تنفيذ إجراءات التسليم بعد استكمال المتطلبات.',
      'خدمة دعم للمستفيدين خلال مراحل البرنامج.'
    ],
    steps: [
      'تقديم طلب الحصول على مركبة وإدخال بيانات رخصة القيادة والضمان.',
      'دراسة وتحليل الأهلية الاقتصادية للتأكد من أولوية الاحتياج والقدرة التشغيلية.',
      'إجراء المقابلة الشخصية وإمضاء تعهدات الاستخدام والتشغيل السليم.',
      'تسليم المركبة وإنهاء إجراءات نقل الملكية للمستفيد مجاناً بالكامل.'
    ]
  },
  3: {
    targets: 'رواد الأعمال الشباب، أصحاب المشاريع المتناهية الصغر، والأسر الحرفية والمنتجة.',
    requirements: [
      'تقديم فكرة مشروع أو مشروع قائم قابل للتنفيذ.',
      'إرفاق دراسة جدوى أو وصف تفصيلي للمشروع.',
      'الالتزام باستخدام التمويل في الغرض المعتمد.',
      'تقديم بيانات ومستندات صحيحة ومحدثة.',
      'استكمال جميع متطلبات التقديم.',
      'اجتياز مرحلة التقييم الفني والمالي.',
      'الالتزام بضوابط البرنامج وسياسات المؤسسة.',
      'تحتفظ المؤسسة بحق قبول أو رفض أي طلب وفق نتائج التقييم.'
    ],
    features: [
      'تمويل المشاريع الناشئة والقائمة.',
      'دعم التوسع والتطوير للمشاريع الإنتاجية.',
      'المساهمة في تعزيز الاستدامة المالية للمستفيدين.',
      'تمكين رواد الأعمال من تنفيذ أفكارهم الاستثمارية.',
      'دراسة الجدوى الاقتصادية للمشروعات المقدمة.',
      'إجراءات تقديم ومتابعة إلكترونية متكاملة.',
      'إشعارات دورية بحالة الطلب.',
      'تقييم الطلبات وفق معايير التمويل المعتمدة.',
      'متابعة تنفيذ المشروع بعد الاعتماد عند الحاجة.',
      'دعم المبادرات ذات الأثر الاقتصادي والاجتماعي.'
    ],
    steps: [
      'تعبئة طلب التمويل وتقديم المخطط التشغيلي والمالي للمشروع.',
      'تقييم الفكرة ومناقشتها مع اللجنة الاستشارية الفنية والمالية للمؤسسة.',
      'اعتماد القيمة التمويلية وصرفها على دفعات مرتبطة بمؤشرات الإنجاز.',
      'متابعة دورية وزيارات ميدانية لتقديم الدعم الفني وتذليل العقبات.'
    ]
  },
  4: {
    targets: 'الأسر الأشد حاجة للرعاية السكنية، ومستفيدو الضمان الاجتماعي، ومالكو البيوت القديمة والمتهالكة.',
    requirements: [
      'أن يكون مقدم الطلب مستحقاً للدعم.',
      'تعبئة نموذج الطلب كاملاً.',
      'إرفاق جميع المستندات المطلوبة.',
      'صحة البيانات والمعلومات المقدمة.',
      'إثبات الحاجة إلى الدعم السكني.',
      'يجوز للمؤسسة طلب مستندات إضافية عند الحاجة.',
      'تخضع جميع الطلبات للمراجعة والتقييم.',
      'قرار المؤسسة نهائي بعد دراسة الطلب.'
    ],
    features: [
      'دعم شراء المسكن.',
      'دعم بناء المنازل.',
      'ترميم وصيانة المنازل.',
      'تأثيث وتجهيز المنازل.',
      'دعم سداد الإيجار للحالات المستحقة.',
      'توفير حلول سكنية للحالات الإنسانية.',
      'دراسة الطلبات وفق معايير واضحة.',
      'إشعارات إلكترونية بحالة الطلب.',
      'متابعة الطلب حتى اكتمال الإجراءات.',
      'تقديم الدعم بعد اعتماد الطلب.'
    ],
    steps: [
      'رفع طلب الدعم السكني أو طلب الترميم متضمناً المستندات والضمان.',
      'زيارة وفد هندسي وفني من المؤسسة للموقع لمعاينة الحالة وتقييم السلامة.',
      'إقرار نوع التدخل المناسب (تمليك/ترميم) وجدولة أعمال المقاولات.',
      'تسليم مفاتيح السكن الجديد أو الانتهاء من أعمال الترميم الشاملة وتسليم المنزل.'
    ]
  }
};

type ProgramDetails = {
  targets: string;
  requirements: string[];
  features: string[];
  steps: string[];
};

type Program = {
  id: number;
  title: string;
  description: string;
  image: string;
  icon?: string;
};

interface ProgramCardItemProps {
  prog: Program;
  details?: ProgramDetails;
  index: number;
  getProgramIcon: (id: number) => ReactNode;
}

function ProgramCardItem({ prog, details, index, getProgramIcon }: ProgramCardItemProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'requirements'>('features');
  const hasFeatures = Boolean(details?.features?.length);
  const hasRequirements = Boolean(details?.requirements?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="flex flex-col lg:flex-row rounded-[var(--radius-default)] overflow-hidden shadow-xl mb-6 sm:mb-8"
    >
      {/* Image Side */}
      <div className="w-full lg:w-1/3 h-48 sm:h-56 md:h-64 lg:h-auto order-1 lg:order-1 relative shrink-0">
        <Image
          src={prog.image}
          alt={prog.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--primary)]/20" />
      </div>

      {/* Content Side */}
      <div className="bg-[var(--primary)] p-5 sm:p-6 lg:p-10 w-full lg:w-2/3 flex flex-col justify-between order-2 lg:order-2">
        <div className="space-y-4 sm:space-y-6 relative">
          {/* Title and Icon */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
             <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-snug sm:leading-tight">
               {prog.title}
             </h3>
             <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-inner mt-0.5">
               {getProgramIcon(prog.id) ? (
                 <div className="text-white">
                   {getProgramIcon(prog.id)}
                 </div>
               ) : (
                 <span className="text-xl sm:text-2xl text-white">{prog.icon}</span>
               )}
             </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-cairo font-light whitespace-pre-wrap max-w-2xl">
            {hasFeatures || hasRequirements ? prog.description.split('\n\n')[0] : prog.description}
          </p>

          {/* Animated Tabs: Features and Requirements */}
          {(hasFeatures || hasRequirements) && (
            <div className="pt-4 sm:pt-6">
              <div role="tablist" className="flex items-center gap-4 sm:gap-8 border-b border-white/20 mb-4 sm:mb-6 relative overflow-x-auto no-scrollbar">
                {(['features', 'requirements'] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`panel-${tab}-${prog.id}`}
                    id={`tab-${tab}-${prog.id}`}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-2.5 sm:pb-3 text-xs sm:text-sm md:text-base font-bold font-cairo transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)] rounded-sm whitespace-nowrap ${
                      activeTab === tab ? 'text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {tab === 'features' ? 'المميزات' : 'الشروط والمتطلبات'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId={`active-tab-${prog.id}`}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--gold)] rounded-t-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[110px] sm:min-h-[140px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    id={`panel-${activeTab}-${prog.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}-${prog.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'features' ? (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 sm:gap-y-3">
                        {details?.features?.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-base font-cairo font-light leading-relaxed">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold)] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 sm:gap-y-3">
                        {details?.requirements?.map((req, i) => (
                          <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-white/90 text-xs sm:text-sm md:text-base font-cairo font-light leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0 mt-2" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="mt-6 sm:mt-8 flex justify-stretch sm:justify-end">
          <Link
            href="/apply"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[var(--primary)] font-bold rounded-xl text-sm md:text-base font-cairo flex items-center justify-center gap-2 hover:bg-[var(--gold)] hover:text-white transition-colors shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
          >
            تقديم طلب
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProgramsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getProgramIcon = (id: number) => {
    switch (id) {
      case 1: return <DollarSign className="w-6 h-6 text-[var(--gold)]" />;
      case 2: return <Car className="w-6 h-6 text-[var(--gold)]" />;
      case 3: return <Briefcase className="w-6 h-6 text-[var(--gold)]" />;
      case 4: return <Home className="w-6 h-6 text-[var(--gold)]" />;
      case 5: return <Users className="w-6 h-6 text-[var(--gold)]" />;
      case 6: return <Award className="w-6 h-6 text-[var(--gold)]" />;
      default: return <Sparkles className="w-6 h-6 text-[var(--gold)]" />;
    }
  };

  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--primary)] font-sans pb-20 selection:bg-[var(--gold)]/30 selection:text-[var(--primary)]" dir="rtl">
      <SEO 
        title="برامجنا ومبادراتنا التنموية" 
        description="تصفح البرامج والمبادرات الإنسانية الرسمية لمؤسسة الوليد للإنسانية، بما في ذلك الدعم المالي، الإسكان التنموي، منح السيارات، وتمكين المرأة والشباب." 
        type="WebPage" 
      />

      {/* 1. Hero — narrative column + signature "official impact ledger" card */}
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-24 bg-gradient-to-b from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-white overflow-hidden">
        {/* Ambient background (kept quiet on purpose — the signature card carries the visual weight) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--accent-rgb),0.14),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,85,0,0.22),transparent_50%)]" />
          <div className="absolute inset-0 hero-dots opacity-10" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          {/* Custom Breadcrumb */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs md:text-sm mb-10 lg:mb-14 text-white/50 font-cairo">
            <Link 
              href="/" 
              className="hover:text-[var(--gold)] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-sm"
            >
              الرئيسية
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[var(--gold)] font-semibold">برامجنا ومبادراتنا التنموية</span>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Narrative column */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[var(--gold)] text-xs md:text-sm font-extrabold mb-8 backdrop-blur-md shadow-2xl font-cairo"
              >
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <span>العطاء المنظم والتمكين المستدام والمؤسسي</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-8 leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', fontWeight: 700 }}
              >
                برامج العطاء <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)]">والتحول التنموي</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-cairo font-light mb-10"
              >
                حلول ومبادرات مدروسة تهدف إلى توفير المسكن اللائق، تمليك وسائل النقل، وتحفيز رواد الأعمال والنساء الحرفيات لدعم استقلاليتهم المعيشية بكرامة ونزاهة.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-10"
              >
                <a
                  href="#programs-grid-section"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-[var(--gold)] text-[var(--primary)] hover:bg-[var(--gold-light)] font-black text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-105 font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                >
                  استعرض البرامج
                  <ChevronLeft className="w-4 h-4" />
                </a>
                <Link
                  href="/apply"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/35 font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                >
                  تقديم طلب مباشر
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white/50 text-xs md:text-sm font-semibold tracking-wider font-cairo"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-[18px] h-[18px] text-[var(--gold)] shrink-0" />
                  أثر مرخص ومعتمد
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-[18px] h-[18px] text-[var(--gold)] shrink-0" />
                  توافق مع رؤية 2030
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-[18px] h-[18px] text-[var(--gold)] shrink-0" />
                  +15 مليون مستفيد
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] sm:h-[60px] text-[var(--background)] fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C67.81,118.92,144.29,111.31,214.34,92.83,250.36,83.31,286.38,70,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 3. Dynamic Interactive Program Grid Showcase */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative z-10" id="programs-grid-section">
        <div className="max-w-[1600px] w-full mx-auto px-1 sm:px-5 md:px-10 lg:px-16 2xl:px-20">
          {/* Header Row */}
          <div className="mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-[var(--primary)]/10 font-cairo">
            <div>
              <p className="text-[var(--primary)]/50 text-xs sm:text-sm font-bold uppercase tracking-wider">مبادراتنا المعروضة</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--primary)] mt-1">تصفح البرامج والمشروعات الفعالة</h2>
            </div>
          </div>

          {programs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[32px] border border-[var(--primary)]/5 shadow-sm max-w-3xl mx-auto"
            >
              <div className="w-20 h-20 bg-[var(--gold)]/10 text-[var(--gold)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-[var(--primary)] ">عذراً، لم نجد برامج متاحة</h3>
              <p className="text-[var(--primary)]/60 font-cairo max-w-md mx-auto text-sm md:text-base mt-2 leading-relaxed">
                لا توجد برامج متاحة في الوقت الحالي.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {programs.map((prog, index) => {
                const details = programExtraDetails[prog.id];

                return (
                  <ProgramCardItem
                    key={prog.id}
                    prog={prog}
                    details={details}
                    index={index}
                    getProgramIcon={getProgramIcon}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Highly Professional Interactive "Application Journey" Steps Section */}
      <section className="py-24 bg-white border-y border-[var(--primary)]/5 relative overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 rounded-full bg-[var(--gold)]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 rounded-full bg-[var(--primary)]/5 blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="section-tag inline-flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--gold)]" />
              <span className="font-cairo">رحلة طلب الدعم الإلكتروني</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--primary)] mb-6 ">
              كيف أتقدم بطلب دعم رسمي؟
            </h2>
            <p className="text-[var(--primary)]/70 text-lg font-cairo leading-relaxed font-light">
              صممنا مسار تقديم رقمي بالكامل، يتميز بالسرعة والشفافية والحوكمة الصارمة لضمان راحتك وحفظ كرامتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-[var(--primary)]/5 via-[var(--gold)]/40 to-[var(--primary)]/5 -translate-y-12 hidden md:block z-0" />

            {[
              { 
                num: '01', 
                title: 'تعبئة النموذج بدقة', 
                desc: 'الدخول على استمارة طلب الدعم واختيار البرنامج المناسب وإدخال بياناتك الاجتماعية والمالية المحدثة.', 
                color: 'bg-[var(--primary)]/10 text-[var(--primary)]' 
              },
              { 
                num: '02', 
                title: 'إرفاق الثبوتيات', 
                desc: 'تحميل كشف الحساب البنكي، رخصة القيادة، صك الإعالة، أو أوراق ملكية العقار المطلوبة لتسهيل الفرز.', 
                color: 'bg-[var(--gold)]/10 text-[var(--gold)]' 
              },
              { 
                num: '03', 
                title: 'الفرز والتحقق', 
                desc: 'يقوم باحثو المؤسسة بإجراء دراسة ميدانية واستطلاع الأهلية بدقة مع المنصات والشركاء الحكوميين.', 
                color: 'bg-[var(--primary)]/10 text-[var(--primary)]' 
              },
              { 
                num: '04', 
                title: 'الاعتماد والتسليم', 
                desc: 'عند قبول طلبك، يتم التواصل معك لترتيب تمليك السيارة أو مفتاح السكن أو تسليم الدعم المالي مباشرة.', 
                color: 'bg-[var(--gold)]/10 text-[var(--gold)]' 
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-[var(--background)] p-8 rounded-[30px] border border-[var(--primary)]/5 relative z-10 hover:shadow-xl hover:bg-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center font-black text-xl font-mono shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--primary)]/5 flex items-center justify-center text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[var(--primary)] mb-3 ">{step.title}</h3>
                <p className="text-[var(--primary)]/70 text-sm leading-relaxed font-cairo font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Luxury Premium Showcase of Success Stories */}
      <section className="py-24 bg-gradient-to-b from-[var(--background)] to-[var(--background)] relative overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-tag inline-flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
              <span className="font-cairo">قصص التمكين الفعلي</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--primary)] mb-6 ">
              شواهد العطاء في المجتمع
            </h2>
            <p className="text-[var(--primary)]/70 text-lg font-cairo leading-relaxed font-light">
              نحن لا نهب المساعدات فحسب، بل نبني مستقبلاً أفضل لأسر تحولت من الاحتياج إلى العطاء والمساهمة الفاعلة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-[32px] border border-[var(--primary)]/5 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6">
                  <div className="relative">
                    <Quote className="absolute -top-4 -right-4 w-12 h-12 text-[var(--gold)]/10 -rotate-12" />
                    <p className="text-[var(--primary)]/85 text-base italic leading-relaxed font-cairo font-light relative z-10 pt-2">
                      "{story.story}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--primary)]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[var(--gold)]/30 shadow relative">
                      <Image src={story.image} alt={story.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-[var(--primary)] ">{story.name}</h4>
                      <p className="text-[var(--primary)]/50 text-[11px] font-bold font-cairo">{story.location}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] md:text-xs font-black text-[var(--gold)] bg-[var(--gold)]/10 px-3.5 py-1.5 rounded-full font-cairo">
                    {story.program}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Refined official accordion FAQs section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-tag inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--gold)]" />
              <span className="font-cairo">إجابات وتوضيحات هامة</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--primary)] mb-6 ">
              الأسئلة الشائعة حول البرامج
            </h2>
            <p className="text-[var(--primary)]/70 text-lg font-cairo leading-relaxed font-light">
              كل ما تحتاج لمعرفته حول معايير الأهلية والمستندات المطلوبة للتسجيل ومتابعة حالة طلبك بشكل رسمي وموثوق.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-[var(--gold)] shadow-[0_10px_30px_rgba(var(--primary-rgb),0.04)] bg-white' 
                      : 'border-[var(--primary)]/5 bg-[var(--background)]'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="w-full p-6 text-right flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <span className="font-bold text-[var(--primary)] text-base md:text-lg font-cairo">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary)]/5 text-[var(--primary)]'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--gold)]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-[var(--primary)]/75 text-sm md:text-base leading-relaxed border-t border-[var(--primary)]/5 font-cairo font-light whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Immersive Majestic Call-to-Action (CTA) */}
      <section className="py-12 px-5 sm:px-6">
        <div className="max-w-[1600px] w-full mx-auto md:px-10 lg:px-16 2xl:px-20">
          <div className="relative rounded-[2rem] sm:rounded-[3rem] lg:rounded-[3.5rem] p-8 sm:p-12 md:p-20 overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white shadow-[0_30px_60px_rgba(2,36,0,0.25)]">
            
            <div className="absolute inset-0 z-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--gold)] rounded-full filter blur-[140px] opacity-20 pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full filter blur-[120px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <span className="inline-flex items-center gap-2 px-[18px] py-1.5 rounded-full bg-white/10 text-[var(--gold)] text-xs font-bold font-cairo tracking-wide border border-white/5">
                ابدأ رحلتك التنموية اليوم
              </span>
              
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight">
                خطوة واحدة تفصلك <br className="hidden md:block" />
                <span className="text-[var(--gold)]">عن حياة مستقرة وكريمة</span>
              </h2>
              
              <p className="text-white/80 text-sm sm:text-base md:text-xl leading-relaxed font-cairo font-light max-w-2xl mx-auto">
                نموذج التقديم الإلكتروني الموحد متاح حالياً لاستلام طلبات الدعم السكني، تمليك السيارات، أو الدعم المالي والاجتماعي.
              </p>

              <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <Link
                  href="/apply"
                  className="px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[var(--gold)] text-[var(--primary)] hover:bg-[var(--gold-light)] font-black text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:shadow-[var(--gold)]/30 hover:scale-105 font-cairo group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                >
                  <span>تقديم طلب الدعم الإلكتروني</span>
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/"
                  className="px-8 py-4 sm:py-5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/35 font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 font-cairo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                >
                  <span>العودة للرئيسية</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

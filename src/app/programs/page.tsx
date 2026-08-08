'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
import { useRouter } from 'next/navigation';

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

function ProgramCardItem({ prog, details, index, getProgramIcon, onApply }: any) {
  const [activeTab, setActiveTab] = useState<'features' | 'requirements'>('features');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="flex flex-col lg:flex-row rounded-[32px] overflow-hidden shadow-xl mb-8"
    >
      {/* Image Side */}
      <div className="w-full lg:w-1/3 h-64 lg:h-auto order-1 lg:order-1 relative">
        <img 
          src={prog.image} 
          alt={prog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0B4A23]/20" />
      </div>

      {/* Content Side */}
      <div className="bg-[#0B4A23] p-6 lg:p-10 w-full lg:w-2/3 flex flex-col justify-between order-2 lg:order-2">
        <div className="space-y-6 relative">
          {/* Title and Icon */}
          <div className="flex justify-between items-start gap-4 mb-6">
             <h3 className="text-3xl md:text-4xl font-black text-white font-cairo leading-tight mt-2">
               {prog.title}
             </h3>
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
               {getProgramIcon(prog.id) ? (
                 <div className="text-white">
                   {getProgramIcon(prog.id)}
                 </div>
               ) : (
                 <span className="text-2xl text-white">{prog.icon}</span>
               )}
             </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-cairo font-light whitespace-pre-wrap max-w-2xl">
            {prog.description.split('\n\n')[0]}
          </p>

          {/* Animated Tabs: Features and Requirements */}
          <div className="pt-6">
            <div className="flex items-center gap-8 border-b border-white/20 mb-6 relative">
              {(['features', 'requirements'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm md:text-base font-bold font-cairo transition-colors duration-300 ${
                    activeTab === tab ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {tab === 'features' ? 'المميزات' : 'الشروط والمتطلبات'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId={`active-tab-${prog.id}`}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C] rounded-t-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[150px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'features' ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {details?.features?.map((feat: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-white/90 text-sm md:text-base font-cairo font-light">
                          <Check className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {details?.requirements?.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-white/90 text-sm md:text-base font-cairo font-light">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0 mt-2" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/apply"
            className="px-8 py-3.5 bg-white text-[#0B4A23] font-bold rounded-xl text-sm md:text-base font-cairo flex items-center gap-2 hover:bg-[#C9A84C] hover:text-white transition-colors shadow-md cursor-pointer"
          >
            تقديم طلب
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProgramsPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getProgramIcon = (id: number) => {
    switch (id) {
      case 1: return <DollarSign className="w-6 h-6 text-[#C9A84C]" />;
      case 2: return <Car className="w-6 h-6 text-[#C9A84C]" />;
      case 3: return <Briefcase className="w-6 h-6 text-[#C9A84C]" />;
      case 4: return <Home className="w-6 h-6 text-[#C9A84C]" />;
      case 5: return <Users className="w-6 h-6 text-[#C9A84C]" />;
      case 6: return <Award className="w-6 h-6 text-[#C9A84C]" />;
      default: return <Sparkles className="w-6 h-6 text-[#C9A84C]" />;
    }
  };

  return (
    <div className="bg-[#FAFBF9] min-h-screen text-[#033500] font-sans pb-20 selection:bg-[#C9A84C]/30 selection:text-[#033500]" dir="rtl">
      <SEO 
        title="برامجنا ومبادراتنا التنموية" 
        description="تصفح البرامج والمبادرات الإنسانية الرسمية لمؤسسة الوليد للإنسانية، بما في ذلك الدعم المالي، الإسكان التنموي، منح السيارات، وتمكين المرأة والشباب." 
        type="WebPage" 
      />

      {/* 1. Ultra Premium Cinematic Hero Header */}
      <section className="relative pt-32 pb-44 md:pt-40 md:pb-52 bg-[#022400] text-white overflow-hidden">
        {/* Background & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800" 
            alt="برامج تمكين الوليد للإنسانية" 
            className="w-full h-full object-cover opacity-10 object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022400] via-[#022400]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#033500]/90 via-transparent to-[#022400]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.15),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,85,0,0.2),transparent_50%)]" />
          <div className="absolute inset-0 hero-dots opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-[#C9A84C]/40 blur-[1px] animate-pulse" />
          <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 blur-[1px] animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-[#C9A84C]/30 blur-[2px] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 text-center">
          {/* Custom Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm mb-8 text-white/50 font-cairo">
            <Link 
              href="/" 
              className="hover:text-[#C9A84C] transition-all font-medium"
            >
              الرئيسية
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#C9A84C] font-semibold">برامجنا ومبادراتنا التنموية</span>
          </div>

          {/* Section Indicator Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#C9A84C] text-xs md:text-sm font-extrabold mb-8 backdrop-blur-md shadow-2xl font-cairo"
          >
            <Sparkles className="w-4 h-4 text-[#C9A84C] animate-spin" style={{ animationDuration: '8s' }} />
            <span>العطاء المنظم والتمكين المستدام والمؤسسي</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-8 leading-tight font-cairo tracking-tight"
          >
            برامج العطاء <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E1C273] to-[#C9A84C]">والتحول التنموي</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-lg md:text-2xl max-w-3.5xl mx-auto leading-relaxed font-cairo font-light mb-10"
          >
            حلول ومبادرات مدروسة تهدف إلى توفير المسكن اللائق، تمليك وسائل النقل، وتحفيز رواد الأعمال والنساء الحرفيات لدعم استقلاليتهم المعيشية بكرامة ونزاهة.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-6 text-white/50 text-xs md:text-sm font-semibold tracking-wider font-cairo"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-[#C9A84C]" />
              أثر مرخص ومعتمد
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Zap className="w-4.5 h-4.5 text-[#C9A84C]" />
              توافق مع رؤية 2030
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-[#C9A84C]" />
              +15 مليون مستفيد
            </span>
          </motion.div>
        </div>

        {/* Dynamic Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden line-height-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-[#FAFBF9] fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C67.81,118.92,144.29,111.31,214.34,92.83,250.36,83.31,286.38,70,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 3. Dynamic Interactive Program Grid Showcase */}
      <section className="py-24 px-6 relative z-10" id="programs-grid-section">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          {/* Header Row */}
          <div className="mb-12 pb-6 border-b border-[#033500]/10 font-cairo">
            <div>
              <p className="text-[#033500]/50 text-sm font-bold uppercase tracking-wider">مبادراتنا المعروضة</p>
              <h2 className="text-2xl md:text-3xl font-black text-[#033500] mt-1">تصفح البرامج والمشروعات الفعالة</h2>
            </div>
          </div>

          {programs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[32px] border border-[#033500]/5 shadow-sm max-w-3xl mx-auto"
            >
              <div className="w-20 h-20 bg-[#C9A84C]/10 text-[#C9A84C] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-[#033500] font-cairo">عذراً، لم نجد برامج متاحة</h3>
              <p className="text-[#033500]/60 font-cairo max-w-md mx-auto text-sm md:text-base mt-2 leading-relaxed">
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
                    onApply={() => router.push('/apply')}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Highly Professional Interactive "Application Journey" Steps Section */}
      <section className="py-24 bg-white border-y border-[#033500]/5 relative overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 rounded-full bg-[#033500]/5 blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="section-tag inline-flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-cairo">رحلة طلب الدعم الإلكتروني</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#033500] mb-6 font-cairo">
              كيف أتقدم بطلب دعم رسمي؟
            </h2>
            <p className="text-[#033500]/70 text-lg font-cairo leading-relaxed font-light">
              صممنا مسار تقديم رقمي بالكامل، يتميز بالسرعة والشفافية والحوكمة الصارمة لضمان راحتك وحفظ كرامتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-[#033500]/5 via-[#C9A84C]/40 to-[#033500]/5 -translate-y-12 hidden md:block z-0" />

            {[
              { 
                num: '01', 
                title: 'تعبئة النموذج بدقة', 
                desc: 'الدخول على استمارة طلب الدعم واختيار البرنامج المناسب وإدخال بياناتك الاجتماعية والمالية المحدثة.', 
                color: 'bg-[#033500]/10 text-[#033500]' 
              },
              { 
                num: '02', 
                title: 'إرفاق الثبوتيات', 
                desc: 'تحميل كشف الحساب البنكي، رخصة القيادة، صك الإعالة، أو أوراق ملكية العقار المطلوبة لتسهيل الفرز.', 
                color: 'bg-[#C9A84C]/10 text-[#C9A84C]' 
              },
              { 
                num: '03', 
                title: 'الفرز والتحقق', 
                desc: 'يقوم باحثو المؤسسة بإجراء دراسة ميدانية واستطلاع الأهلية بدقة مع المنصات والشركاء الحكوميين.', 
                color: 'bg-[#033500]/10 text-[#033500]' 
              },
              { 
                num: '04', 
                title: 'الاعتماد والتسليم', 
                desc: 'عند قبول طلبك، يتم التواصل معك لترتيب تمليك السيارة أو مفتاح السكن أو تسليم الدعم المالي مباشرة.', 
                color: 'bg-[#C9A84C]/10 text-[#C9A84C]' 
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-[#FAFBF9] p-8 rounded-[30px] border border-[#033500]/5 relative z-10 hover:shadow-xl hover:bg-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center font-black text-xl font-mono shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAFBF9] border border-[#033500]/5 flex items-center justify-center text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#033500] mb-3 font-cairo">{step.title}</h3>
                <p className="text-[#033500]/70 text-sm leading-relaxed font-cairo font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Luxury Premium Showcase of Success Stories */}
      <section className="py-24 bg-gradient-to-b from-[#FAFBF9] to-[#F3F6F1] relative overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-tag inline-flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" />
              <span className="font-cairo">قصص التمكين الفعلي</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#033500] mb-6 font-cairo">
              شواهد العطاء في المجتمع
            </h2>
            <p className="text-[#033500]/70 text-lg font-cairo leading-relaxed font-light">
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
                className="bg-white rounded-[32px] border border-[#033500]/5 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="space-y-6">
                  <div className="relative">
                    <Quote className="absolute -top-4 -right-4 w-12 h-12 text-[#C9A84C]/10 -rotate-12" />
                    <p className="text-[#033500]/85 text-base italic leading-relaxed font-cairo font-light relative z-10 pt-2">
                      "{story.story}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#033500]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#C9A84C]/30 shadow">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-[#033500] font-cairo">{story.name}</h4>
                      <p className="text-[#033500]/50 text-[11px] font-bold font-cairo">{story.location}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] md:text-xs font-black text-[#C9A84C] bg-[#C9A84C]/10 px-3.5 py-1.5 rounded-full font-cairo">
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
              <HelpCircle className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-cairo">إجابات وتوضيحات هامة</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#033500] mb-6 font-cairo">
              الأسئلة الشائعة حول البرامج
            </h2>
            <p className="text-[#033500]/70 text-lg font-cairo leading-relaxed font-light">
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
                      ? 'border-[#C9A84C] shadow-[0_10px_30px_rgba(3,53,0,0.04)] bg-white' 
                      : 'border-[#033500]/5 bg-[#FAFBF9]'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-6 text-right flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-[#033500] text-base md:text-lg font-cairo">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? 'bg-[#033500] text-white' : 'bg-[#033500]/5 text-[#033500]'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#C9A84C]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-[#033500]/75 text-sm md:text-base leading-relaxed border-t border-[#033500]/5 font-cairo font-light whitespace-pre-line">
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
      <section className="py-12 px-6">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="relative rounded-[3.5rem] p-10 md:p-20 overflow-hidden bg-gradient-to-br from-[#022400] to-[#043d00] text-white shadow-[0_30px_60px_rgba(2,36,0,0.25)]">
            
            <div className="absolute inset-0 z-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C9A84C] rounded-full filter blur-[140px] opacity-20 pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full filter blur-[120px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
              <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white/10 text-[#C9A84C] text-xs font-bold font-cairo tracking-wide border border-white/5">
                ابدأ رحلتك التنموية اليوم
              </span>
              
              <h2 className="text-3xl md:text-6xl font-black font-cairo leading-tight tracking-tight">
                خطوة واحدة تفصلك <br className="hidden md:block" />
                <span className="text-[#C9A84C]">عن حياة مستقرة وكريمة</span>
              </h2>
              
              <p className="text-white/80 text-base md:text-xl leading-relaxed font-cairo font-light max-w-2xl mx-auto">
                نموذج التقديم الإلكتروني الموحد متاح حالياً لاستلام طلبات الدعم السكني، تمليك السيارات، أو الدعم المالي والاجتماعي.
              </p>

              <div className="pt-6 flex flex-wrap justify-center gap-4.5">
                <Link
                  href="/apply"
                  className="px-10 py-5 rounded-full bg-[#C9A84C] text-[#033500] hover:bg-[#D9B85C] font-black text-base md:text-lg transition-all duration-300 flex items-center gap-2 shadow-2xl hover:shadow-[#C9A84C]/30 hover:scale-105 font-cairo group"
                >
                  <span>تقديم طلب الدعم الإلكتروني</span>
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/"
                  className="px-8 py-5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/35 font-bold text-base transition-all duration-300 flex items-center gap-2 font-cairo"
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

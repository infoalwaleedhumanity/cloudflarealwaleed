import Link from 'next/link';
import { SEO } from '@/components/SEO';
import { institutionalNewsData } from '@/data/institutionalNews';
import { projects } from '@/data/content';
import {
  ShieldCheck, HeartHandshake, Globe, Award,
  Building, Car, DollarSign, Calendar, Clock, Users, ArrowLeft,
} from 'lucide-react';

import { C, WIDE, Eyebrow, Kicker, TextLink } from '@/components/home/ui';
import Reveal from '@/components/home/Reveal';
import HeroSection from '@/components/home/HeroSection';
import MissionTabs from '@/components/home/MissionTabs';
import ProgramsGrid from '@/components/home/ProgramsGrid';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import FaqAccordion from '@/components/home/FaqAccordion';
import Pillars from '@/components/home/Pillars';

/* =============================================================
   STATIC CONTENT
   Lives on the server now — none of this ships as client JS.
   ============================================================= */

const impactStats = [
  { number: '35+', label: 'دولة حول العالم', icon: Globe, desc: 'امتدت مشاريعنا الإنسانية والتنموية' },
  { number: '4 عقود', label: 'من العمل الخيري', icon: Award, desc: 'ريادة مستمرة في العطاء والتنمية' },
  { number: 'ملايين', label: 'المستفيدين المباشرين', icon: Users, desc: 'تحسين جودة الحياة وتمكين الأسر' },
  { number: '100%', label: 'شفافية وموثوقية', icon: ShieldCheck, desc: 'أعلى معايير الحوكمة المؤسسية' },
];

const humanitarianPrograms = [
  {
    id: 'housing',
    title: 'برنامج الإسكان التنموي',
    description: 'توفير وحدات سكنية ملائمة ومستدامة للأسر المحتاجة لضمان الاستقرار المعيشي والأمان الاجتماعي.',
    image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1785252968/oqDsG599S1WekY0pVYtfZD2L2yinW0r8dCdLPGo7_nseyf6.jpg',
    iconName: 'Building',
    category: 'السكن الكريم',
  },
  {
    id: 'transport',
    title: 'برنامج دعم التنقل والسيارات',
    description: 'توفير سيارات مجهزة ووسائل نقل للأسر والأفراد ذوي الاحتياجات الخاصة والأسر المنتجة لدعم استقلالهم.',
    image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1785252970/oJWfhsxsbyNJLu2uzEKiKZOn5DO8Vzmj1GGfjdbJ_vgeldj.jpg',
    iconName: 'Car',
    category: 'التمكين الحركي',
  },
  {
    id: 'financial',
    title: 'برنامج الدعم المالي والإغاثي',
    description: 'مساعدات مالية عاجلة ومدروسة لدعم الأسر المتعففة وتخفيف الأعباء المعيشية الطارئة.',
    image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1785252994/UJMrmjmNMHclVipEEOk1claa0Grs4QWbLNJgWHTs_opc5kr.jpg',
    iconName: 'DollarSign',
    category: 'الأمن الاقتصادي',
  },
];

const successStories = [
  {
    quote: 'غيّر برنامج الإسكان التنموي حياة عائلتي بالكامل، وأصبح لدينا مسكن آمن ومستقر بفضل الله ثم بجهود مؤسسة الوليد للإنسانية.',
    name: 'أبو فهد',
    location: 'الرياض، المملكة العربية السعودية',
    program: 'برنامج الإسكان التنموي',
  },
  {
    quote: 'من خلال سيارة الدعم المقدمة، تمكنت من بدء مشروعي الخاص وتحقيق الاستقلال المالي لأسرتي بكل كرامة وثقة.',
    name: 'أم أحمد',
    location: 'جدة، المملكة العربية السعودية',
    program: 'برنامج دعم التنقل',
  },
  {
    quote: 'سرعة الاستجابة ودقة دراسة الطلبات تعكس الاحترافية العالية والشفافية التي تتميز بها المؤسسة عالمياً.',
    name: 'د. عبد الله المعمري',
    location: 'عمان، الأردن',
    program: 'برنامج الإغاثة الدولية',
  },
];

const faqs = [
  {
    question: 'كيف يمكنني تقديم طلب مساعدة من المؤسسة؟',
    answer:
      "يمكنك تقديم طلب مساعدة بكل سهولة عبر الانتقال إلى قسم 'المساعدات والبرامج'، اختيار البرنامج المناسب لاحتياجك، ثم الضغط على 'تقديم طلب' وتعبئة النموذج الإلكتروني بالمستندات المطلوبة.",
  },
  {
    question: 'ما هي معايير استحقاق برامج الإسكان والدعم المالي؟',
    answer:
      'تخضع كافة الطلبات لدراسة بحثية واجتماعية دقيقة وفق آليات معتمدة تضمن وصول الدعم للأسر والأفراد الأكثر احتياجاً في مختلف مناطق المملكة.',
  },
  {
    question: 'كيف يمكنني متابعة حالة طلبي بعد إرساله؟',
    answer:
      "تتيح لك منصتنا الرقمية ميزة تتبع الطلبات عبر إدخال رقم الهوية أو رقم الطلب في صفحة 'تتبع الطلب' للاطلاع على حالة المعاملة لحظة بلحظة.",
  },
  {
    question: 'هل تتوفر برامج لدعم ريادة الأعمال والمشاريع الناشئة؟',
    answer:
      'نعم، توفر المؤسسة مسارات متخصصة لتمويل ودعم المشاريع التنموية والريادية لتمكين الشباب والمرأة وتحقيق الاستقلال الاقتصادي.',
  },
];

const pillars = [
  { iconName: 'ShieldCheck', title: 'حوكمة وشفافية كاملة', description: 'معايير دقيقة ومراجعات دورية لضمان النزاهة والوضوح في كافة العمليات والمبادرات.' },
  { iconName: 'HeartHandshake', title: 'أثر مستدام ومستمر', description: 'مشاريع تنموية بعيدة المدى تهدف لتمكين الأفراد وتحقيق استقلالهم المالي والاجتماعي.' },
  { iconName: 'Globe', title: 'حضور عالمي وإقليمي', description: 'مبادرات إنسانية امتدت لأكثر من 35 دولة حول العالم لدعم الفئات الأكثر احتياجاً.' },
  { iconName: 'Award', title: 'ريادة العمل الخيري', description: 'أكثر من 4 عقود من العطاء المستمر والابتكار في تقديم المساعدات الإنسانية.' },
];

const marqueeStats = [...impactStats, ...impactStats];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden font-cairo selection:bg-[#00833D]/20" style={{ backgroundColor: C.bg, color: C.ink }}>
      <style>{`
        @keyframes ap-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ap-marquee-track { animation: ap-marquee 26s linear infinite; }
        .ap-marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <SEO
        title="مؤسسة الوليد للإنسانية - الصفحة الرئيسية"
        description="نصل إلى كل من يحتاج مساعدة بحضور في أكثر من 35 دولة، لا نتركهم وحدهم نحن نصل إليهم أينما كانوا."
        type="WebSite"
      />

      {/* 1. HERO -------------------------------------------------- */}
      <HeroSection />

      {/* 2. IMPACT MARQUEE — pure CSS animation, no client JS needed */}
      <section className="py-10 border-y overflow-hidden" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
        <div className="flex w-max ap-marquee-track">
          {marqueeStats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4 px-10 shrink-0">
              <stat.icon className="w-6 h-6" style={{ color: C.green }} />
              <div>
                <span className="text-3xl font-black" style={{ color: C.ink }}>{stat.number}</span>
                <span className="text-sm font-bold mr-2" style={{ color: C.muted }}>{stat.label}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full mr-6" style={{ backgroundColor: C.border }} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED BANNER */}
      <Reveal className={`py-20 sm:py-28 ${WIDE}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <Eyebrow>إرث من العطاء العالمي والريادة</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight" style={{ color: C.ink }}>
              أكثر من أربعة عقود من العمل الإنساني والتمكين المستدام
            </h2>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.muted }}>
              تأسست مؤسسة الوليد للإنسانية لترسخ مفاهيم التكافل الاجتماعي وبناء الجسور بين الثقافات، من خلال مبادرات نوعية ومشاريع تنموية استراتيجية أحدثت أثراً إيجابياً مستداماً في حياة ملايين البشر في أكثر من 35 دولة.
            </p>

            {/* Vision / Mission / Values — the only interactive bit here */}
            <MissionTabs />

            <div className="pt-2">
              <TextLink href="/about">تعرف على تاريخ المؤسسة</TextLink>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <img
              src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1785604741/alwaleed_philanthropy_0_ycmdfy.jpg"
              alt="مؤسسة الوليد للإنسانية"
              className="w-full h-[420px] sm:h-[480px] object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>

      {/* 4. HUMANITARIAN PROGRAMS */}
      <Reveal className="py-20 sm:py-28 border-t" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
        <div className={WIDE}>
          <div className="mb-14">
            <Kicker
              eyebrow="المسارات التنموية"
              title="برامجنا الإنسانية والتنموية المصممة لخدمتك"
              description="نقدم مجموعة متنوعة من برامج المساعدات لتلبية احتياجات المستفيدين المختلفة، تُصمم وفق معايير واضحة وآليات معتمدة لدعم الفئات الأكثر احتياجاً."
              action={<TextLink href="/programs">عرض كافة المسارات والبرامج</TextLink>}
            />
          </div>

          <ProgramsGrid programs={humanitarianPrograms} />
        </div>
      </Reveal>

      {/* 5. STRATEGIC PROJECTS — plain links, no client JS needed */}
      <Reveal className={`py-20 sm:py-28 ${WIDE}`}>
        <div className="mb-14">
          <Kicker
            eyebrow="مشاريعنا الاستراتيجية"
            title="مشاريع تنموية كبرى تترك أثراً مستداماً"
            description="تنفذ المؤسسة مشاريع نوعية واسعة النطاق في مجالات الإسكان التنموي، التمكين الاقتصادي، الرعاية الصحية، والمحافظة على التراث الثقافي محلياً وعالمياً."
            action={<TextLink href="/projects">استعراض كافة المشاريع</TextLink>}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projects.slice(0, 3).map((proj: any) => (
            <Link key={proj.id} href="/projects" className="group block">
              <div className="rounded-lg overflow-hidden mb-5">
                <img src={proj.image} alt={proj.title} className="w-full h-56 object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
              </div>
              <div className="text-xs font-bold mb-2" style={{ color: C.green }}>{proj.category}</div>
              <h3 className="text-xl font-black leading-snug mb-2" style={{ color: C.ink }}>{proj.title}</h3>
              <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: C.muted }}>{proj.description}</p>
              <div className="text-xs font-black inline-flex items-center gap-1.5" style={{ color: C.green }}>
                <span>تفاصيل المشروع</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* 6. SUCCESS STORIES */}
      <Reveal className="py-20 sm:py-28 border-t" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
        <div className={WIDE}>
          <div className="mb-14">
            <Kicker eyebrow="قصص الأثر الإنساني" title="أثر حقيقي في حياة المستفيدين" align="center" />
          </div>
          <TestimonialsCarousel stories={successStories} />
        </div>
      </Reveal>

      {/* 7. INSTITUTIONAL NEWS — plain links, no client JS needed */}
      <Reveal className={`py-20 sm:py-28 ${WIDE}`}>
        <div className="mb-14">
          <Kicker
            eyebrow="المركز الإعلامي والأخبار"
            title="آخر الأخبار والبيانات الرسمية"
            description="تغطية مؤسسية موثقة وشاملة لأهم المبادرات الإنسانية، الشراكات الدولية، والفعاليات الميدانية حول العالم."
            action={<TextLink href="/news">عرض جميع الأخبار والبيانات</TextLink>}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {institutionalNewsData.slice(0, 3).map((item: any) => (
            <Link key={item.id} href="/news" className="group block">
              <div className="rounded-lg overflow-hidden mb-5">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
              </div>
              <div className="flex items-center gap-4 text-xs font-medium mb-2" style={{ color: C.muted }}>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: C.green }} />{item.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: C.green }} />{item.readTime}</span>
              </div>
              <h3 className="text-lg font-black leading-snug mb-2" style={{ color: C.ink }}>{item.title}</h3>
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: C.muted }}>{item.summary}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* 8. WHY CHOOSE US */}
      <Reveal className="py-20 sm:py-28 border-t" style={{ borderColor: C.border }}>
        <div className={WIDE}>
          <div className="mb-14">
            <Kicker eyebrow="معايير التميز المؤسسي" title="لماذا مؤسسة الوليد للإنسانية؟" align="center" />
          </div>
          <Pillars items={pillars} />
        </div>
      </Reveal>

      {/* 9. FAQ */}
      <Reveal className="py-20 sm:py-28 max-w-3xl mx-auto px-6 border-t" style={{ borderColor: C.border }}>
        <div className="mb-14">
          <Kicker eyebrow="الأسئلة الشائعة" title="كل ما تحتاج معرفته عن خدماتنا" align="center" />
        </div>
        <FaqAccordion faqs={faqs} />
      </Reveal>

      {/* 10. FINAL CTA */}
      <Reveal className="py-24 sm:py-32 px-6" style={{ backgroundColor: C.green }}>
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-white/80">معاً من أجل الإنسانية</span>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white">
            هل تحتاج إلى مساعدة أو استفسار عن برامجنا؟
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-white/85">
            فريقنا متخصص في دراسة الطلبات وتوفير الدعم اللازم للأسر والأفراد المستحقين بكل سرية وشفافية.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/apply"
              className="font-black py-4 px-10 rounded-md transition-all duration-300 cursor-pointer text-sm hover:brightness-95 inline-block"
              style={{ backgroundColor: '#fff', color: C.green }}
            >
              تقديم طلب مساعدة الآن
            </Link>
            <Link
              href="/track"
              className="font-bold py-4 px-10 rounded-md border-2 border-white/40 text-white hover:bg-white/10 transition-all cursor-pointer text-sm inline-block"
            >
              تتبع حالة الطلب
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

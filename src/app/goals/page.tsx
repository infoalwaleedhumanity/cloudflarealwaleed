'use client';

import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';
import { GraduationCap, HeartPulse, Droplets, Wheat, Home, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function GoalsPage() {
  const router = useRouter();

  const goals = [
    { icon: GraduationCap, title: 'محو الأمية وتعزيز التعليم', desc: 'القضاء على الأمية وضمان وصول التعليم الجيد لكل طفل بصرف النظر عن ظروفه الجغرافية أو الاجتماعية.', target: '1M+ طفل مستفيد' },
    { icon: HeartPulse, title: 'توفير الرعاية الصحية', desc: 'ضمان حصول المجتمعات المهمشة على خدمات صحية أساسية عالية الجودة بأسعار مناسبة أو مجانية.', target: '500K+ مريض سنوياً' },
    { icon: Droplets, title: 'المياه النظيفة والصرف الصحي', desc: 'توفير مياه الشرب النظيفة ومرافق الصرف الصحي للمجتمعات المحرومة في أفريقيا وآسيا.', target: '2M+ شخص مستفيد' },
    { icon: Wheat, title: 'الأمن الغذائي', desc: 'دعم برامج الزراعة المستدامة وتوزيع الغذاء لضمان عدم تعرض أي إنسان للجوع.', target: '300K+ أسرة مستفيدة' },
    { icon: Home, title: 'المأوى اللائق', desc: 'توفير السكن الملائم للأسر النازحة واللاجئين وضحايا الكوارث الطبيعية.', target: '50K+ وحدة سكنية' },
    { icon: Briefcase, title: 'فرص العمل والدخل', desc: 'دعم المشاريع الصغيرة وتوفير التدريب المهني لتمكين الأسر من تحقيق الاستقلال الاقتصادي.', target: '100K+ مستفيد اقتصادياً' },
  ];

  return (
    <div>
      <SEO title="أهدافنا" description="تعرف على الأهداف الاستراتيجية لمؤسسة الوليد للإنسانية ومجالات عملنا الرئيسية." type="WebPage" />
      <div className="page-header text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 ">أهداف المؤسسة</h1>
        <div className="w-24 h-1.5 bg-[var(--gold)] mx-auto rounded-full" />
        <p className="text-white/80 mt-6 text-xl font-cairo max-w-2xl mx-auto">أهداف واضحة وقابلة للقياس نسعى لتحقيقها لصالح البشرية</p>
      </div>

      <section className="py-24 bg-[var(--background)] overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[var(--text)]">ماذا نريد أن نحقق؟</h2>
            <div className="w-20 h-1 bg-[var(--gold)] mx-auto mt-4 rounded-full"/>
          </div>

          {/* Strategic Impact Hub - Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((g, i) => (
              <motion.div 
                key={g.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/5 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 bg-[var(--primary)]/5 rounded-2xl flex items-center justify-center mb-6 border border-[var(--primary)]/10">
                   <g.icon className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-[var(--text)] ">{g.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-cairo">{g.desc}</p>
                <div className="inline-block py-2 px-4 rounded-full text-xs font-bold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 font-cairo">
                   🎯 الهدف: {g.target}
                </div>
              </motion.div>
            ))}
          </div>

          {/* SDGs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mt-24 rounded-[40px] p-12 md:p-20 text-center bg-[var(--primary)] text-white relative overflow-hidden"
          >
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
             <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 ">التوافق مع أهداف التنمية المستدامة</h2>
              <p className="text-white/70 max-w-2xl mx-auto mb-10 font-cairo text-lg">
                تتوافق برامج ومشاريع مؤسسة الوليد للإنسانية مع أهداف التنمية المستدامة للأمم المتحدة 2030، وتساهم بشكل مباشر في تحقيق 12 هدفاً من أصل 17 هدفاً.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {['القضاء على الفقر', 'الصحة الجيدة', 'التعليم الجيد', 'المساواة بين الجنسين', 'المياه النظيفة', 'العمل اللائق', 'الحد من أوجه التفاوت', 'السلام والعدالة'].map((g) => (
                  <span key={g} className="px-6 py-3 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 font-cairo hover:bg-white/20 transition-colors">
                    {g}
                  </span>
                ))}
              </div>
              <Link href="/apply" className="mt-12 px-10 py-4 bg-[var(--gold)] text-[var(--text)] rounded-full font-bold font-cairo text-lg hover:bg-[var(--gold-dark)] transition-colors inline-block">
                تقدم بطلب الآن
              </Link>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { SEO } from '@/components/SEO';
import { Target, Rocket, Users, GraduationCap, HeartPulse, Leaf, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisionPage() {
  return (
    <div>
      <SEO title="رؤيتنا" description="رؤية مؤسسة الوليد للإنسانية في بناء عالم أفضل وأكثر تسامحاً من خلال العمل الإنساني." type="WebPage" />
      <div className="page-header text-white">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 ">رؤيتنا ورسالتنا</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-cairo">
            نعمل بشغف وإخلاص لبناء مستقبل أفضل للجميع من خلال رؤية واضحة ورسالة سامية تضع الإنسان أولاً.
          </p>
        </div>
      </div>

      <section className="py-10 md:py-20 bg-[var(--background)]">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col lg:flex-row gap-6 md:gap-12 items-start py-5 md:py-10 mb-10 md:mb-20"
          >
            {/* Left Hero */}
            <div className="w-full lg:w-[55%] h-[300px] md:h-[500px] relative bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-[20px] md:rounded-[32px] p-6 md:p-12 overflow-hidden shadow-2xl flex items-center justify-center">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
               <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-3xl rounded-full absolute top-1/4 -right-10 blur-3xl"></div>
               <div className="relative z-10 text-white text-center">
                  <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">نحن نصنع الأثر</h3>
                  <p className="text-white/70 text-base md:text-lg font-cairo">بناء عالم أفضل للإنسانية</p>
               </div>
            </div>

            {/* Right Stack */}
            <div className="w-full lg:w-[45%] flex flex-col gap-4 md:gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white/70 backdrop-blur-lg border border-white/50 rounded-[20px] md:rounded-[32px] p-6 md:p-10 shadow-xl shadow-gray-200/50"
              >
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
                   <Target className="w-6 h-6 md:w-8 md:h-8 text-[var(--primary)]" />
                 </div>
                 <h2 className="text-[var(--primary)] font-bold text-xl md:text-2xl mb-2 md:mb-4 ">رؤيتنا</h2>
                 <p className="text-gray-600 leading-relaxed text-base md:text-lg font-cairo">
                    عالمٌ خالٍ من الفقر والجهل والمرض، يتمتع فيه كل إنسان بكرامته الكاملة وحقوقه الأساسية في التعليم والصحة والحياة الكريمة.
                 </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white/70 backdrop-blur-lg border border-white/50 rounded-[20px] md:rounded-[32px] p-6 md:p-10 shadow-xl shadow-gray-200/50"
              >
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
                   <Rocket className="w-6 h-6 md:w-8 md:h-8 text-[var(--gold)]" />
                 </div>
                 <h2 className="text-[var(--gold)] font-bold text-xl md:text-2xl mb-2 md:mb-4 ">رسالتنا</h2>
                 <p className="text-gray-600 leading-relaxed text-base md:text-lg font-cairo">
                    تحويل حياة الأكثر احتياجاً من خلال برامج إنسانية مستدامة وشراكات استراتيجية تحقق أثراً حقيقياً وقابلاً للقياس.
                 </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Strategic Goals Roadmap */}
          <div className="text-center mb-8 md:mb-14">
            <div className="section-tag mx-auto w-fit">الأهداف الاستراتيجية</div>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 text-[var(--text)]">أهدافنا الاستراتيجية 2025-2030</h2>
            <div className="w-20 h-1 bg-[var(--gold)] mx-auto mt-4 rounded-full"/>
          </div>

          <div className="relative max-w-4xl mx-auto py-5 md:py-10">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--gold)] to-[var(--primary)] opacity-30 transform -translate-x-1/2 hidden md:block"></div>
            
            {[
              { id: 1, title: 'توسيع قاعدة المستفيدين', desc: 'الوصول إلى 5 ملايين مستفيد بحلول عام 2030 من خلال توسعة البرامج وإضافة دول جديدة.', icon: Users },
              { id: 2, title: 'تعزيز التعليم الشامل', desc: 'ضمان الحصول على تعليم جيد لمليون طفل في المناطق المحرومة خلال الفترة المقبلة.', icon: GraduationCap },
              { id: 3, title: 'الصحة للجميع', desc: 'تقديم خدمات صحية أساسية لكل الفئات المستضعفة في المناطق التي تعاني من نقص الرعاية الطبية.', icon: HeartPulse },
              { id: 4, title: 'التنمية المستدامة', desc: 'بناء مجتمعات قادرة على الاستدامة الذاتية من خلال برامج توليد الدخل وتمكين الأسر.', icon: Leaf },
              { id: 5, title: 'تمكين المرأة', desc: 'رفع نسبة مشاركة المرأة في مشاريع التنمية إلى 50% وتوسيع برامج تمكين المرأة.', icon: Shield },
              { id: 6, title: 'الشراكات الدولية', desc: 'بناء 50 شراكة استراتيجية جديدة مع منظمات دولية بارزة لتعزيز قدراتنا وأثرنا.', icon: Globe },
            ].map((g, i) => (
              <motion.div 
                key={g.id} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row justify-between items-center w-full mb-8 md:mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                 <div className="w-full md:w-5/12 hidden md:block"></div>
                 <div className="z-10 w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-[var(--gold)] rounded-full flex items-center justify-center shadow-lg my-2 md:my-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-[var(--gold)] rounded-full"></div>
                 </div>
                 <motion.div 
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    className="w-full md:w-5/12 bg-white/70 backdrop-blur-lg border border-white/50 rounded-[20px] md:rounded-[32px] p-6 md:p-8 shadow-xl shadow-gray-200/50"
                 >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--primary)]/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                        <g.icon className="w-6 h-6 md:w-8 md:h-8 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-[var(--text)] ">0{g.id} {g.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm font-cairo leading-relaxed">{g.desc}</p>
                 </motion.div>
              </motion.div>
            ))}
          </div>
          {/* Values */}
          <div className="mt-10 md:mt-20 rounded-[20px] md:rounded-3xl p-6 md:p-10 text-center bg-white border border-gray-100 shadow-xl shadow-gray-100">
            <h3 className="font-black text-xl md:text-2xl mb-4 md:mb-6 text-[var(--primary)]">مبادئنا الراسخة</h3>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {['الإنسانية أولاً', 'الشفافية التامة', 'الكفاءة العالية', 'الاستدامة', 'الشمولية', 'الابتكار', 'التعاون', 'الأثر الحقيقي'].map((v) => (
                <span key={v} className="px-4 md:px-5 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-sm font-cairo bg-gray-50 text-[var(--primary)] border border-gray-100">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

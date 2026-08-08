'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';

const C = {
  green: '#00833D',
  greenDark: '#00612D',
  ink: '#111110',
  muted: '#5B5B56',
  bg: '#FFFFFF',
  bgSoft: '#F6F6F3',
  border: '#E7E5DF',
};

const WIDE = "max-w-[1320px] w-full mx-auto px-6 md:px-10 lg:px-14";

const timeline = [
  { year: 'الثمانينات', title: 'خطواتنا الأولى', desc: 'تعود مسيرة "مؤسسة الوليد للإنسانية" إلى أكثر من أربعين عاماً، حين بدأ الأمير الوليد بن طلال مسيرته كمستثمر ورجل أعمال، وقد نبع شغف سموه للأعمال الخيرية من إيمانه العميق بأهمية العطاء والمشاركة كواجب إنساني له جذور صلبة في الإسلام والتقاليد العربية، ولطالما حرص على إيتاء الزكاة بمعناها الحقيقي، حتى أصبحت جزءاً أساسياً من حياته.\n\nتتمحور استراتيجية تقديم المساعدات لدى الأمير الوليد حول المرونة والنظرة الشمولية، حيث تجاوزت تقديم العون الغذائي والمادي والبشري ليصبح مفهوم الاستثمار تنموياً، ثقافياً، تعليمياً، وصحياً من خلال تعزيز دور الفرد والمجتمع بصفة عامة، والمرأة والطفل بصفة خاصة، وقد أتاحت هذه الاستراتيجية فرصة التنوع في مساندة العديد من المؤسسات والجمعيات الخيرية والإنسانية.' },
  { year: 'التسعينات', title: 'العطاء للمجتمع', desc: 'مع مرور السنوات، توسعت أعمال الأمير الوليد تحت راية "شركة المملكة القابضة"، وموازاةً لها توسعت أعماله الخيرية. وعند قدوم التسعينات، أصبح الأمير الوليد بن طلال مستثمراً عالمياً رائداً ومليارديراً يحصد عائدات استثماراته العديدة حول العالم. واستمرت أرباح الأمير الوليد بالتصاعد، فحرص بشدة على الاستمرار في رد الجميل للمجتمع والعطاء للغير، لا سيما في المجتمعات ذات الحاجة الماسة للمساعدات الإنسانية ولأبسط الاحتياجات الضرورية للعيش.' },
  { year: '2000', title: 'مؤسسة المملكة للمبادرات الإستراتيجية', desc: 'يولى الأمير الوليد الأعمال الخيرية اهتمامه الشخصي، فيحرص على وصول التبرعات إلى المستفيدين المحددين مسبقاً كي تؤثر إيجاباً على حياتهم وتحدث التغيير المستهدف.\n\nولإضفاء الطابع الرسمي على أعمال الأمير الخيرية، وتطبيقاً لركائز الشفافية والتأثير الفعلي والإدارة بكل دقة وحزم، تم تأسيس «مؤسسة المملكة للمبادرات الإستراتيجية» في عام 2000م.' },
  { year: '2010', title: 'مؤسسة الوليد بن طلال الخيرية', desc: 'في عام 2010، ومع توسع نطاق الأنشطة الخيرية، تم إصدار ترخيص المؤسسة من قبل وزارة الشؤون الاجتماعية، وأعيدت تسميتها لتصبح معروفة بمؤسسة الوليد بن طلال الخيرية، حيث ساهمت في مجموعة واسعة من المشاريع والمبادرات الإنسانية الخاصة.' },
  { year: '2020', title: 'مؤسسة الوليد للإنسانية', desc: 'خلال العقود الأربعة من العمل الخيري المستمر، شهد عمل مؤسسات الوليد تطورات جذرية، وتغير نطاق العمل عبر السنين ليتكيف مع تبدل الظروف والأزمنة.\n\nونتيجة لذلك، تم توحيد عمل مؤسسة الوليد بن طلال ومؤسساتها الخيرية الثلاث تحت مسمى واحد: «مؤسسة الوليد للإنسانية» تقودها رؤية واحدة: المساهمة في بناء عالم يسوده التسامح، والتقبل، والمساواة، والفرص للجميع.' },
];

const trustees = [
  { name: 'الأمير الوليد بن طلال آل سعود', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197690/alwaleed-1_q3efnz.jpg' },
  { name: 'الأمير خالد بن الوليد بن طلال آل سعود', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197697/khaled_1_hwohxe.jpg' },
  { name: 'الأميرة ريم بنت الوليد بن طلال آل سعود', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197697/member3_gzmzol.jpg' },
  { name: 'الأميرة لمياء بنت ماجد بن سعود آل سعود', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197695/lamia_nazxet.jpg' },
  { name: 'الأستاذ فهد بن نافل', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197692/fahad_y6nmya.webp' },
  { name: 'الشيخ الدكتور علي بن عبدالعزيز النشوان', image: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1783197690/atli_tbltod.webp' },
];

export default function AboutPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden font-cairo" style={{ backgroundColor: C.bg, color: C.ink }} dir="rtl">
      <SEO title="من نحن" description="تعرف على مؤسسة الوليد للإنسانية، رؤيتنا، رسالتنا، وتاريخنا في خدمة الإنسانية في أكثر من 35 دولة حول العالم." type="Organization" />

      {/* Hero */}
      <header className="relative h-[70vh] sm:h-[80vh] flex items-end overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1785604741/alwaleed_philanthropy_0_ycmdfy.jpg"
          alt="مؤسسة الوليد للإنسانية - نبذة عن المؤسسة"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,16,0.65), rgba(17,17,16,0.15) 55%, transparent 75%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: C.green }} />
      </header>

      {/* Intro */}
      <section className={`py-20 sm:py-28 text-center ${WIDE}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-black tracking-[0.2em]" style={{ color: C.green }}>من نحن</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-4 mb-8" style={{ color: C.ink }}>
            كانت البداية قبل 45 سنة
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: C.muted }}>
            الوليد للإنسانية هي منظمة غير ربحية سعودية مبنية بناء الجسور للتفاهم الثقافي، وتنمية المجتمع، وتمكين المرأة والشباب، والإغاثة في حال وقوع الكوارث، فالتزمنا هو للإنسانية بلا حدود.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-28 border-t" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
        <div className={WIDE}>
          <div className="relative">
            {/* connecting line */}
            <div className="absolute top-0 bottom-0 right-[7px] sm:right-[9px] w-px" style={{ backgroundColor: C.border }} />

            <div className="space-y-16 sm:space-y-20">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="relative pr-10 sm:pr-12"
                >
                  <span
                    className="absolute top-2 right-0 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full border-4"
                    style={{ backgroundColor: C.bg, borderColor: C.green }}
                  />
                  <div className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: C.green }}>{item.year}</div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-4" style={{ color: C.ink }}>{item.title}</h3>
                  <p className="text-base leading-relaxed whitespace-pre-line max-w-3xl" style={{ color: C.muted }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Board of Trustees */}
      <section className="py-20 sm:py-28">
        <div className={WIDE}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center text-4xl sm:text-5xl font-black tracking-tight mb-16 sm:mb-20"
            style={{ color: C.ink }}
          >
            مجلس الأمناء
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {trustees.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="flex flex-col gap-5 group cursor-default"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full aspect-[4/3] object-cover transition-all duration-500 ${hoveredIndex === i ? 'grayscale-0 scale-[1.03]' : 'grayscale'}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: C.green }} />
                </div>
                <h3 className="font-black text-xl text-right" style={{ color: C.ink }}>{member.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 px-6" style={{ backgroundColor: C.green }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tight text-white">نسلك طريق التسامح والتقبل</h2>
          <p className="text-lg sm:text-2xl font-light text-white/85 max-w-2xl mx-auto">
            نؤمن بإنسانية لا يحدها عرق ولا دين ولا جنس، وعلى ذلك فإن أعمالنا تعتمد بشكل أساسي على سد الاحتياجات أينما كانت.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

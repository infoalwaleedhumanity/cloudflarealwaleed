'use client';

import Link from 'next/link';
import { SEO } from '@/components/SEO';

export default function TermsPage() {

  const sections = [
    {
      title: 'قبول الشروط',
      content: 'باستخدامك لموقع مؤسسة الوليد للإنسانية أو خدماتها، فإنك تقر بأنك قرأت هذه الشروط والأحكام وفهمتها ووافقت على الالتزام بها. إذا كنت لا توافق على هذه الشروط، يُرجى التوقف عن استخدام موقعنا وخدماتنا.'
    },
    {
      title: 'تقديم الطلبات',
      content: 'يتعهد مقدم الطلب بصحة جميع المعلومات المقدمة. أي معلومات كاذبة أو مضللة تؤدي إلى رفض الطلب فوراً وقد تعرض صاحبها للمساءلة القانونية. تحتفظ المؤسسة بحق قبول أو رفض أي طلب وفقاً لتقديرها وسياساتها الداخلية.'
    },
    {
      title: 'استخدام الموقع',
      content: 'يُحظر استخدام الموقع لأي غرض غير قانوني أو مخالف لهذه الشروط. لا يجوز محاولة الوصول غير المصرح به إلى أنظمة المؤسسة. لا يجوز نشر أو نقل أي محتوى ضار أو مضلل أو منتهك لحقوق الملكية الفكرية.'
    },
    {
      title: 'الملكية الفكرية',
      content: 'جميع محتويات هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصاميم، هي ملك حصري لمؤسسة الوليد للإنسانية ومحمية بموجب قوانين حقوق الملكية الفكرية. لا يجوز إعادة إنتاج أي محتوى أو توزيعه دون إذن كتابي مسبق.'
    },
    {
      title: 'التبرعات والمساهمات',
      content: 'جميع التبرعات المقدمة للمؤسسة نهائية وغير قابلة للاسترداد ما لم يُتفق على خلاف ذلك كتابياً. تُستخدم التبرعات وفق السياسات المالية للمؤسسة وبما يخدم أهدافها الإنسانية. تصدر المؤسسة تقارير مالية دورية للشفافية.'
    },
    {
      title: 'تحديد المسؤولية',
      content: 'تُقدَّم خدمات وبرامج المؤسسة "كما هي" دون ضمانات صريحة أو ضمنية. المؤسسة غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو الخدمات، باستثناء ما يكون مخالفاً للقانون المعمول به.'
    },
    {
      title: 'القانون الواجب التطبيق',
      content: 'تخضع هذه الشروط والأحكام للقوانين المعمول بها في المملكة العربية السعودية. أي نزاع ينشأ عن هذه الشروط يُحسم وفق الأنظمة والتشريعات السعودية أمام المحاكم المختصة في المملكة.'
    },
    {
      title: 'التعديلات',
      content: 'تحتفظ المؤسسة بحق تعديل هذه الشروط في أي وقت. ستُخطر المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع. استمرار استخدام الموقع بعد التعديلات يُعدّ قبولاً ضمنياً لها.'
    },
  ];

  return (
    <div>
      <SEO title="الشروط والأحكام" description="الشروط والأحكام الخاصة باستخدام خدمات وموقع مؤسسة الوليد للإنسانية." type="WebPage" />
      <div className="page-header text-center">
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="breadcrumb-item hover:text-[#C9A84C] transition-colors" style={{fontFamily:'Cairo,sans-serif'}}>الرئيسية</Link>
            <span className="text-white/30">/</span>
            <span className="breadcrumb-item active" style={{fontFamily:'Cairo,sans-serif'}}>الشروط والأحكام</span>
          </div>
          <h1 className="text-white font-black mb-4" style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontFamily:'Cairo,sans-serif'}}>الشروط والأحكام</h1>
          <div className="gold-line mx-auto" />
          <p className="text-white/70 mt-4" style={{fontFamily:'Cairo,sans-serif'}}>آخر تحديث: يناير 2025</p>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="rounded-3xl p-8 mb-8" style={{background:'rgba(201, 168, 76,0.06)',border:'1px solid rgba(201, 168, 76,0.2)'}}>
            <p className="text-[#033500] leading-relaxed" style={{fontFamily:'Cairo,sans-serif'}}>
              تحكم الشروط والأحكام التالية استخدامك لموقع مؤسسة الوليد للإنسانية وجميع خدماتها الإلكترونية. يُرجى قراءتها بعناية قبل استخدام الموقع أو تقديم أي طلب.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(3, 53, 0,0.08)'}}>
                <div className="p-5 flex items-center gap-4" style={{background:'linear-gradient(135deg,rgba(3, 53, 0,0.04),rgba(201, 168, 76,0.06))'}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{background:'linear-gradient(135deg,#C9A84C,#C9A84C)'}}>
                    {i + 1}
                  </div>
                  <h2 className="font-bold text-xl" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>{section.title}</h2>
                </div>
                <div className="p-6">
                  <p className="text-[#033500]/80 leading-relaxed" style={{fontFamily:'Cairo,sans-serif'}}>{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl text-center" style={{background:'linear-gradient(135deg,#F8FAF7,rgba(3, 53, 0, 0.05))'}}>
            <h3 className="font-black text-xl mb-3" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>هل لديك استفسار قانوني؟</h3>
            <p className="text-[#033500]/60 mb-6" style={{fontFamily:'Cairo,sans-serif'}}>فريقنا القانوني جاهز للإجابة على تساؤلاتك</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-royal inline-block">تواصل معنا</Link>
              <Link href="/privacy" className="btn-primary inline-block">سياسة الخصوصية</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

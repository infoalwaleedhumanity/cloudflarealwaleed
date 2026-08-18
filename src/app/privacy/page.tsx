'use client';

import Link from 'next/link';
import { SEO } from '@/components/SEO';

export default function PrivacyPage() {

  const sections = [
    {
      title: 'جمع المعلومات',
      content: 'نجمع المعلومات التي تقدمها لنا مباشرةً عند تقديم طلب أو التواصل معنا، بما في ذلك الاسم ورقم الهوية ورقم الجوال والبريد الإلكتروني والعنوان ووصف الحالة. نجمع أيضاً معلومات تقنية مثل عنوان IP ونوع المتصفح لتحسين تجربة المستخدم.'
    },
    {
      title: 'استخدام المعلومات',
      content: 'نستخدم معلوماتك الشخصية لمعالجة طلبات المساعدة، والتواصل معك بشأن طلباتك، وإرسال التحديثات المتعلقة ببرامجنا ومشاريعنا إذا وافقت على ذلك، وتحسين خدماتنا، والامتثال للمتطلبات القانونية.'
    },
    {
      title: 'مشاركة المعلومات',
      content: 'لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية مع أطراف ثالثة. قد نشارك معلوماتك مع شركائنا الموثوق بهم لتقديم الخدمات والبرامج المطلوبة، وذلك بشكل مقيد ووفق اتفاقيات سرية صارمة.'
    },
    {
      title: 'حماية المعلومات',
      content: 'نطبق أعلى معايير الأمان لحماية معلوماتك الشخصية، بما في ذلك تشفير البيانات (SSL/TLS)، وضوابط الوصول الصارمة، والمراجعات الأمنية الدورية. لا يمكن الوصول إلى معلوماتك إلا للموظفين المخولين.'
    },
    {
      title: 'حقوقك',
      content: 'يحق لك الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها في أي وقت. يمكنك أيضاً طلب نسخة من بياناتك أو إلغاء الاشتراك في نشرتنا البريدية. لممارسة هذه الحقوق، تواصل معنا عبر البريد الإلكتروني.'
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا وتحليل استخدام الموقع. يمكنك التحكم في هذه الملفات من خلال إعدادات متصفحك، مع العلم أن تعطيلها قد يؤثر على بعض وظائف الموقع.'
    },
    {
      title: 'التغييرات على السياسة',
      content: 'نحتفظ بحق تعديل هذه السياسة في أي وقت. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو بإشعار واضح على موقعنا. استمرارك في استخدام الموقع بعد إجراء التعديلات يعني موافقتك عليها.'
    },
  ];

  return (
    <div>
      <SEO title="سياسة الخصوصية" description="سياسة الخصوصية وحماية البيانات في مؤسسة الوليد للإنسانية." type="WebPage" />
      <div className="page-header text-center">
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="breadcrumb-item hover:text-[var(--gold)] transition-colors" style={{fontFamily: 'var(--font-body)'}}>الرئيسية</Link>
            <span className="text-white/30">/</span>
            <span className="breadcrumb-item active" style={{fontFamily: 'var(--font-body)'}}>سياسة الخصوصية</span>
          </div>
          <h1 className="text-white font-black mb-4" style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontFamily: 'var(--font-heading)'}}>سياسة الخصوصية</h1>
          <div className="gold-line mx-auto" />
          <p className="text-white/70 mt-4" style={{fontFamily: 'var(--font-body)'}}>آخر تحديث: يناير 2025</p>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="rounded-3xl p-8 mb-8" style={{background:'rgba(var(--accent-rgb),0.06)',border:'1px solid rgba(var(--accent-rgb),0.2)'}}>
            <p className="text-[var(--primary)] leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>
              تحرص مؤسسة الوليد للإنسانية على حماية خصوصيتك وأمان بياناتك الشخصية. تشرح هذه السياسة كيفية جمع معلوماتك واستخدامها ومشاركتها وحمايتها عند استخدامك لموقعنا الإلكتروني أو خدماتنا.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{border:'1px solid rgba(var(--primary-rgb),0.08)'}}>
                <div className="p-5 flex items-center gap-4" style={{background:'linear-gradient(135deg,rgba(var(--primary-rgb),0.04),rgba(var(--accent-rgb),0.06))'}}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{background:'linear-gradient(135deg,var(--info),var(--primary))'}}>
                    {i + 1}
                  </div>
                  <h2 className="font-bold text-xl" style={{fontFamily: 'var(--font-heading)',color:'var(--primary)'}}>{section.title}</h2>
                </div>
                <div className="p-6">
                  <p className="text-[var(--primary)]/80 leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-3xl text-center" style={{background:'linear-gradient(135deg,var(--info),var(--primary))'}}>
            <h3 className="text-white font-black text-xl mb-3" style={{fontFamily: 'var(--font-heading)'}}>هل لديك استفسار حول خصوصيتك؟</h3>
            <p className="text-white/70 mb-6" style={{fontFamily: 'var(--font-body)'}}>تواصل مع مسؤول حماية البيانات لدينا</p>
            <a href="mailto:privacy@waleed-foundation.org" className="btn-primary" style={{display:'inline-flex'}}>
              privacy@waleed-foundation.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

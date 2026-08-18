'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { faqs } from '@/data/content';
import { SEO } from '@/components/SEO';

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <SEO title="الأسئلة الشائعة" description="ابحث عن إجابات للأسئلة الأكثر شيوعاً حول مؤسسة الوليد للإنسانية وبرامجها وطرق التقديم." type="FAQPage" />
      <div className="page-header text-center">
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="breadcrumb-item hover:text-[var(--gold)] transition-colors" style={{fontFamily: 'var(--font-body)'}}>الرئيسية</Link>
            <span className="text-white/30">/</span>
            <span className="breadcrumb-item active" style={{fontFamily: 'var(--font-body)'}}>الأسئلة الشائعة</span>
          </div>
          <h1 className="text-white font-black mb-4" style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontFamily: 'var(--font-heading)'}}>الأسئلة الشائعة</h1>
          <div className="gold-line mx-auto" />
          <p className="text-white/70 mt-4 text-lg" style={{fontFamily: 'var(--font-body)'}}>إجابات على أكثر الأسئلة شيوعاً حول خدمات المؤسسة</p>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto w-fit"><span>❓</span> الأسئلة الشائعة</div>
            <h2 className="section-title mt-3">كيف يمكننا مساعدتك؟</h2>
            <div className="gold-divider"/>
          </div>

          <div className="space-y-4 mb-16">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="w-full flex items-center justify-between p-6 text-right"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-bold text-lg" style={{fontFamily: 'var(--font-body)',color:open===i?'var(--primary)':'var(--primary)'}}>{faq.question}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all"
                    style={{background:open===i?'linear-gradient(135deg,var(--gold),var(--gold))':'rgba(var(--primary-rgb), 0.05)'}}
                  >
                    <ChevronDown size={16} className="transition-transform duration-300" style={{color:open===i?'white':'rgba(var(--primary-rgb), 0.05)',transform:open===i?'rotate(180deg)':'rotate(0)'}}/>
                  </div>
                </button>
                {open === i && (
                  <div className="px-6 md:px-12 lg:px-20 pb-6">
                    <div className="h-px mb-4" style={{background:'rgba(var(--primary-rgb),0.06)'}}/>
                    <p className="text-[var(--primary)]/80 leading-relaxed" style={{fontFamily: 'var(--font-body)'}}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="rounded-3xl p-10 text-center" style={{background:'linear-gradient(135deg,rgba(var(--primary-rgb),0.04),rgba(var(--accent-rgb),0.08))',border:'1px solid rgba(var(--accent-rgb),0.2)'}}>
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-black text-2xl mb-3" style={{fontFamily: 'var(--font-heading)',color:'var(--primary)'}}>لم تجد إجابة على سؤالك؟</h3>
            <p className="text-[var(--primary)]/60 mb-6" style={{fontFamily: 'var(--font-body)'}}>فريقنا جاهز للإجابة على جميع استفساراتك</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary inline-block">تواصل معنا</Link>
              <Link href="/apply" className="btn-royal inline-block">تقديم طلب</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

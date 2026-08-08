'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { SEO } from '@/components/SEO';
import PhoneInput from '@/components/PhoneInput';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { 
      setLoading(false); 
      setSubmitted(true); 
      toast.success('تم إرسال رسالتك بنجاح!');
    }, 1500);
  };

  return (
    <div>
      <SEO title="اتصل بنا" description="تواصل مع مؤسسة الوليد للإنسانية للاستفسار عن برامجنا، أو تقديم الاقتراحات والملاحظات." type="ContactPage" />
      <div className="page-header text-center">
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/" className="breadcrumb-item hover:text-[#C9A84C] transition-colors" style={{fontFamily:'Cairo,sans-serif'}}>الرئيسية</Link>
            <span className="text-white/30">/</span>
            <span className="breadcrumb-item active" style={{fontFamily:'Cairo,sans-serif'}}>تواصل معنا</span>
          </div>
          <h1 className="text-white font-black mb-4" style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontFamily:'Cairo,sans-serif'}}>تواصل معنا</h1>
          <div className="gold-line mx-auto" />
          <p className="text-white/70 mt-4 text-lg" style={{fontFamily:'Cairo,sans-serif'}}>نحن هنا للإجابة على جميع استفساراتك</p>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="section-tag"><span>📞</span> معلومات التواصل</div>
                <h2 className="section-title mt-3 mb-2">كيف يمكنك<br/><span className="gold-text">التواصل معنا؟</span></h2>
                <div className="gold-divider-right"/>
                <p className="text-[#033500]/60 mt-4 leading-relaxed" style={{fontFamily:'Cairo,sans-serif'}}>
                  فريقنا متاح لمساعدتك والإجابة على جميع استفساراتك. لا تتردد في التواصل معنا بأي وسيلة تناسبك.
                </p>
              </div>

              {[
                { icon: Phone, title: 'اتصل بنا', info: '+966 11 234 5678', sub: 'الأحد - الخميس: 8:00 - 17:00' },
                { icon: Mail, title: 'راسلنا', info: 'info@waleed-foundation.org', sub: 'نرد خلال 24 ساعة' },
                { icon: MapPin, title: 'زورنا', info: 'الرياض، حي العليا، برج الوليد', sub: 'المملكة العربية السعودية' },
                { icon: Clock, title: 'ساعات العمل', info: 'الأحد - الخميس', sub: '8:00 صباحاً - 5:00 مساءً' },
              ].map(({ icon: Icon, title, info, sub }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-5 rounded-2xl card-hover"
                  style={{background:'white',border:'1px solid rgba(3, 53, 0,0.06)',boxShadow:'0 8px 30px rgba(3, 53, 0,0.06)'}}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,rgba(3, 53, 0,0.08),rgba(3, 53, 0,0.15))'}}>
                    <Icon size={20} style={{color:'#033500'}}/>
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>{title}</div>
                    <div className="font-semibold text-[#033500] text-sm" style={{fontFamily:'Cairo,sans-serif'}}>{info}</div>
                    <div className="text-[#033500]/50 text-xs mt-1" style={{fontFamily:'Cairo,sans-serif'}}>{sub}</div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="p-6 rounded-2xl" style={{background:'linear-gradient(135deg,#065500,#033500)'}}>
                <h3 className="font-bold text-white mb-4" style={{fontFamily:'Cairo,sans-serif'}}>تابعنا على السوشيال ميديا</h3>
                <div className="flex gap-3 flex-wrap">
                  {['f', 't', 'in', 'yt', 'ig'].map((s) => (
                    <button key={s} className="social-icon text-xs font-bold">{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl p-8 md:p-10 shadow-xl" style={{background:'white',border:'1px solid rgba(3, 53, 0,0.06)'}}>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-gold" style={{background:'linear-gradient(135deg,#C9A84C,#C9A84C)'}}>
                      <CheckCircle size={40} className="text-white"/>
                    </div>
                    <h3 className="font-black text-2xl mb-3" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>تم إرسال رسالتك! ✉️</h3>
                    <p className="text-[#033500]/60 mb-8" style={{fontFamily:'Cairo,sans-serif'}}>شكراً لتواصلك معنا. سيرد عليك فريقنا خلال 24 ساعة.</p>
                    <button className="btn-royal" onClick={() => setSubmitted(false)}>إرسال رسالة جديدة</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-black text-2xl mb-6" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>أرسل لنا رسالة</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="input-label">الاسم الكامل *</label>
                          <input className="input-field" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="اسمك الكامل" required/>
                        </div>
                        <div>
                          <label className="input-label">البريد الإلكتروني *</label>
                          <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} placeholder="email@example.com" required/>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="input-label">رقم الجوال</label>
                          <div className="input-field !p-0 h-[54px] relative">
                            <PhoneInput 
                              value={form.phone} 
                              onChange={(val) => setForm({...form, phone: val})} 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="input-label">موضوع الرسالة *</label>
                          <select className="input-field" value={form.subject} onChange={(e) => setForm({...form,subject:e.target.value})} required>
                            <option value="">اختر الموضوع</option>
                            <option>استفسار عام</option>
                            <option>طلب مساعدة</option>
                            <option>شراكة ومشاريع</option>
                            <option>تطوع</option>
                            <option>شكوى أو اقتراح</option>
                            <option>أخرى</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="input-label">رسالتك *</label>
                        <textarea
                          className="input-field"
                          rows={6}
                          value={form.message}
                          onChange={(e) => setForm({...form,message:e.target.value})}
                          placeholder="اكتب رسالتك هنا..."
                          style={{resize:'vertical'}}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full justify-center text-lg py-4" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            جارٍ الإرسال...
                          </div>
                        ) : 'إرسال الرسالة ✉️'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="map-container">
            <div
              className="rounded-2xl h-80 flex items-center justify-center"
              style={{background:'linear-gradient(135deg,rgba(3, 53, 0,0.08),rgba(201, 168, 76,0.08))',border:'2px solid rgba(3, 53, 0,0.08)'}}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="font-bold text-xl mb-2" style={{fontFamily:'Cairo,sans-serif',color:'#033500'}}>موقعنا على الخريطة</h3>
                <p className="text-[#033500]/60" style={{fontFamily:'Cairo,sans-serif'}}>الرياض، حي العليا، برج الوليد، المملكة العربية السعودية</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 btn-royal text-sm"
                  style={{textDecoration:'none'}}
                >
                  فتح في خرائط جوجل
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

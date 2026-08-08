'use client';

import { Heart, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

const pageToPath: Record<string, string> = {
  home: '/',
  about: '/about',
  vision: '/vision',
  goals: '/goals',
  programs: '/programs',
  projects: '/projects',
  news: '/news',
  faq: '/faq',
  apply: '/apply',
  track: '/track',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

export default function Footer({ setCurrentPage }: FooterProps) {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (page: string) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
    const path = pageToPath[page] || '/';
    router.push(path);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Newsletter Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #C9A84C, #C9A84C, #C9A84C)',
          padding: '60px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 pattern-overlay" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            اشترك في نشرتنا البريدية
          </h2>
          <p className="text-white/80 mb-8 text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
            كن أول من يعلم بأخبار مؤسستنا وبرامجنا ومشاريعنا الجديدة
          </p>
          {subscribed ? (
            <div
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', fontFamily: 'Cairo, sans-serif' }}
            >
              ✅ تم الاشتراك بنجاح! شكراً لك
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-6 py-4 rounded-full text-[#033500] font-medium outline-none text-right"
                style={{ fontFamily: 'Cairo, sans-serif', fontSize: '15px' }}
                required
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105"
                style={{
                  background: '#065500',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(6, 85, 0,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                اشترك الآن
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Main Footer */}
      <footer className="footer-bg text-white">
        <div className="max-w-[1750px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Column 1 - About */}
            <div>
              <div className="flex items-center gap-3 mb-6 inline-block">
                <div className="p-2 inline-block">
                  <img src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png" alt="مؤسسة الوليد للإنسانية" className="h-14 max-h-14 w-auto max-w-[240px] object-contain brightness-0 invert opacity-90 drop-shadow-md" />
                </div>
              </div>
              <p className="text-white/60 leading-relaxed mb-6 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                مؤسسة إنسانية عالمية تسعى إلى بناء عالم أكثر عدلاً وإنسانية من خلال برامج التعليم والصحة والتنمية المستدامة.
              </p>
              {/* Social Icons */}
              <div className="flex gap-2 flex-wrap">
                {['f', 'in', 't', 'yt', 'ig'].map((s) => (
                  <button key={s} className="social-icon" aria-label={s}>
                    <span className="text-xs font-bold">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'من نحن', page: 'about' },
                  { label: 'رؤيتنا ورسالتنا', page: 'vision' },
                  { label: 'برامجنا', page: 'programs' },
                  { label: 'مشاريعنا', page: 'projects' },
                  { label: 'أحدث الأخبار', page: 'news' },
                ].map((link) => (
                  <li key={link.page}>
                    <Link
                      href={pageToPath[link.page] || '/'}
                      className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm flex items-center gap-2 hover-underline"
                      onClick={() => {
                        if (setCurrentPage) setCurrentPage(link.page);
                      }}
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      <span className="text-[#C9A84C]/50">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Services */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                خدماتنا
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'تقديم طلب مساعدة', page: 'apply' },
                  { label: 'تتبع حالة الطلب', page: 'track' },
                  { label: 'الأسئلة الشائعة', page: 'faq' },
                  { label: 'تواصل معنا', page: 'contact' },
                  { label: 'سياسة الخصوصية', page: 'privacy' },
                  { label: 'الشروط والأحكام', page: 'terms' },
                ].map((link) => (
                  <li key={link.page}>
                    <Link
                      href={pageToPath[link.page] || '/'}
                      className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm flex items-center gap-2 hover-underline"
                      onClick={() => {
                        if (setCurrentPage) setCurrentPage(link.page);
                      }}
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      <span className="text-[#C9A84C]/50">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                معلومات التواصل
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={16} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <span style={{ fontFamily: 'Cairo, sans-serif' }}>
                    المملكة العربية السعودية، الرياض، حي العليا، برج الوليد
                  </span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <Phone size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <a href="tel:+966112345678" className="hover:text-[#C9A84C] transition-colors" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    +966 11 234 5678
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm">
                  <Mail size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <a href="mailto:info@waleed-foundation.org" className="hover:text-[#C9A84C] transition-colors" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    info@waleed-foundation.org
                  </a>
                </li>
              </ul>

              {/* Working Hours */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 className="font-semibold text-white text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>ساعات العمل</h4>
                <div className="text-white/50 text-xs space-y-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  <div>الأحد - الخميس: 8:00 - 17:00</div>
                  <div>الجمعة - السبت: مغلق</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              © {new Date().getFullYear()} مؤسسة الوليد للإنسانية. جميع الحقوق محفوظة.
            </p>
            <p className="text-white/30 text-xs flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              صُنع بـ <Heart size={12} className="text-[#C9A84C]" /> لخدمة الإنسانية
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="العودة للأعلى">
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}

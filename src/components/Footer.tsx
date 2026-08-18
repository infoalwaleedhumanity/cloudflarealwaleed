'use client';

import { Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabase } from '@/lib/supabase';

const LOGO_URL = 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png';

const CONTACT = {
  address: 'المملكة العربية السعودية، الرياض، حي العليا، برج الوليد',
  phone: '+966 11 234 5678',
  phoneHref: 'tel:+966112345678',
  email: 'info@waleed-foundation.org',
};

// Social Icons as SVG components
const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: 'فيسبوك', href: '#' },
  { icon: LinkedinIcon, label: 'لينكدإن', href: '#' },
  { icon: TwitterIcon, label: 'إكس (تويتر)', href: '#' },
  { icon: YoutubeIcon, label: 'يوتيوب', href: '#' },
  { icon: InstagramIcon, label: 'إنستغرام', href: '#' },
];

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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    setSubscribeError('');
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email: email.trim() }]);
      if (error && error.code !== '23505') {
        // 23505 = duplicate email (unique constraint) — نتعامل معه كنجاح صامت لتجربة مستخدم أفضل
        throw error;
      }
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      setSubscribeError('تعذر إتمام الاشتراك، حاول مرة أخرى لاحقًا.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      {/* Main Footer */}
      <footer className="footer-bg text-white">
        <div className="max-w-[1750px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 pt-16 pb-8">
          {/* Newsletter — minimalist, integrated directly into footer */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-12 mb-12 border-b border-white/15">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                اشترك في نشرتنا البريدية
              </h2>
              <p className="text-white/70 text-sm">كن أول من يعلم بأخبار مؤسستنا وبرامجنا ومشاريعنا الجديدة</p>
            </div>
            {subscribed ? (
              <div className="text-[var(--accent)] font-bold text-sm">✅ تم الاشتراك بنجاح! شكراً لك</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-3 w-full lg:w-auto max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 lg:w-64 bg-transparent border-b border-white/30 focus:border-[var(--accent)] text-white placeholder-white/50 text-sm outline-none py-2 transition-colors"
                  required
                  disabled={subscribing}
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="text-[var(--accent)] hover:text-white font-bold text-sm shrink-0 transition-colors disabled:opacity-60"
                >
                  {subscribing ? 'جارٍ الاشتراك...' : 'اشترك'}
                </button>
              </form>
            )}
          </div>
          {subscribeError && (
            <p className="text-white text-sm -mt-8 mb-8 font-medium">{subscribeError}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Column 1 - About */}
            <div>
              <div className="flex items-center gap-3 mb-6 inline-block">
                <div className="p-2 inline-block">
                  <Image
                    src={LOGO_URL}
                    alt="مؤسسة الوليد للإنسانية"
                    width={240}
                    height={56}
                    className="h-14 max-h-14 w-auto max-w-[240px] object-contain brightness-0 invert drop-shadow-md"
                  />
                </div>
              </div>
              <p className="text-white/95 leading-relaxed mb-6 text-sm md:text-base font-medium">
                مؤسسة إنسانية عالمية تسعى إلى بناء عالم أكثر عدلاً وإنسانية من خلال برامج التعليم والصحة والتنمية المستدامة.
              </p>
              {/* Social Icons */}
              <div className="flex gap-2.5 flex-wrap">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--gold)] text-white hover:text-[var(--primary)] border border-white/20 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-5 text-white flex items-center gap-2 border-b border-white/20 pb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--gold-light)]" />
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
                      className="text-white/90 hover:text-[var(--gold-light)] transition-all duration-200 text-sm md:text-base font-medium flex items-center gap-2 hover:translate-x-[-4px]"
                    >
                      <span className="text-[var(--gold-light)] font-bold">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Services */}
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-5 text-white flex items-center gap-2 border-b border-white/20 pb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--gold-light)]" />
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
                      className="text-white/90 hover:text-[var(--gold-light)] transition-all duration-200 text-sm md:text-base font-medium flex items-center gap-2 hover:translate-x-[-4px]"
                    >
                      <span className="text-[var(--gold-light)] font-bold">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-5 text-white flex items-center gap-2 border-b border-white/20 pb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--gold-light)]" />
                معلومات التواصل
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/95 text-sm md:text-base font-medium">
                  <MapPin size={18} className="text-[var(--gold-light)] mt-1 flex-shrink-0" />
                  <span>{CONTACT.address}</span>
                </li>
                <li className="flex items-center gap-3 text-white/95 text-sm md:text-base font-medium">
                  <Phone size={18} className="text-[var(--gold-light)] flex-shrink-0" />
                  <a href={CONTACT.phoneHref} className="hover:text-[var(--gold-light)] transition-colors">
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white/95 text-sm md:text-base font-medium">
                  <Mail size={18} className="text-[var(--gold-light)] flex-shrink-0" />
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-[var(--gold-light)] transition-colors">
                    {CONTACT.email}
                  </a>
                </li>
              </ul>

              {/* Certification Badges */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-6 mt-1">
                  <Image
                    src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1785604741/Al_Waleed_Philanthropies_SA_English_2026_Certification_Badge_dhx6py.png"
                    alt="Great Place To Work Certified 2026"
                    width={140}
                    height={112}
                    className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-lg"
                  />
                  <Image
                    src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1785604742/iso_bgxd39.png"
                    alt="Quality Management System ISO 9001:2015"
                    width={140}
                    height={112}
                    className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/85 text-sm font-medium">
              © {new Date().getFullYear()} مؤسسة الوليد للإنسانية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

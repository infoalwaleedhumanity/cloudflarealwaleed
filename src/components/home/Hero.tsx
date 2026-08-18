'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 flex items-center justify-start bg-black text-white overflow-hidden" dir="rtl">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/ap-video.mp4" type="video/mp4" />
          <source src="https://res.cloudinary.com/wlkrtcrr/video/upload/v1785606188/ap-video_hgd8vm.mp4" type="video/mp4" />
        </video>

        {/* Soft, subtle top overlay gradient on video for Header readability */}
        <div className="absolute top-0 left-0 right-0 h-48 sm:h-56 md:h-64 bg-gradient-to-b from-black/65 via-black/25 to-transparent pointer-events-none z-[1]" />

        {/* Subtle, soft text-readability shadow gradient under hero text */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Content Area - Aligned to Right as in reference design */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-36 sm:pt-40 md:pt-44 pb-28 flex flex-col justify-center items-start text-right">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-6"
        >
          {/* Main Headline */}
          <h1
            className="text-white drop-shadow-lg"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 4.5vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            نحن شركاء في سعي<br />
            الإنسانية لأجل عالم<br />
            متكافئ الفرص
          </h1>

          {/* Subtitle — storytelling cue، بخط الاقتباسات العربي التراثي حسب هوية العلامة */}
          <p
            className="text-white/95 drop-shadow-md pt-1"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 2vw, 2rem)',
              fontWeight: 700,
            }}
          >
            معًا من أجل الإنسان.
          </p>

          {/* Primary and Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Link
              href="/apply"
              className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-black text-sm md:text-base px-8 py-4 rounded-[var(--radius-default)] transition-all duration-300 flex items-center gap-2.5 font-cairo cursor-pointer"
            >
              <span>تقديم طلب مساعدة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/track"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm md:text-base px-8 py-4 rounded-[var(--radius-default)] transition-all duration-300 flex items-center gap-2.5 font-cairo cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[var(--primary-light)]" />
              <span>تتبع الطلب</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom-Center: Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
        }}
      >
        <span className="text-xs font-semibold text-white/90 drop-shadow-sm font-cairo">تصفح للأسفل</span>
        <div className="w-9 h-9 rounded-full bg-white text-[var(--primary)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </motion.div>

    </section>
  );
}

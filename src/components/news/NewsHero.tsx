'use client';

import Link from 'next/link';
import { ChevronLeft, Home, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsHeroProps {
  totalCount: number;
}

export function NewsHero({ totalCount }: NewsHeroProps) {
  return (
    <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 bg-[#00833d] text-white border-b border-[#007034] overflow-hidden">
      {/* Subtle institutional background vignette/glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-10 w-80 h-80 bg-black/15 rounded-full blur-2xl pointer-events-none translate-y-1/2" 
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Breadcrumbs */}
        <nav aria-label="مسار التنقل" className="flex items-center justify-start gap-2 text-xs md:text-sm font-medium text-white/80 mb-6">
          <Link 
            href="/" 
            className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <span className="text-white font-semibold">الأخبار</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Main Title & Editorial Description */}
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="max-w-3xl space-y-3.5 text-right"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25 text-white backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B242]" />
              <span>المركز الإعلامي والتوثيقي الرسمي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              الأخبار
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-normal text-white/90 leading-relaxed max-w-2xl">
              تغطية موثقة وشاملة لآخر المبادرات التنموية، البرامج الإنسانية، والبيانات الرسمية الصادرة عن مؤسسة الوليد للإنسانية حول العالم.
            </p>
          </motion.div>

          {/* Quick Institutional Meta Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] self-start md:self-auto shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-[#E5B242]" />
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-white/80">إجمالي المقالات المنشورة</div>
              <div className="text-lg sm:text-xl font-bold text-white">
                {totalCount} <span className="text-xs font-normal text-white/80">تقرير وخبر رسمي</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

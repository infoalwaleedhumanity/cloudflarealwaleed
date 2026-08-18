'use client';

import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { InstitutionalNewsItem } from '@/data/institutionalNews';

interface FeaturedNewsProps {
  article: InstitutionalNewsItem;
  onSelect: (article: InstitutionalNewsItem) => void;
}

export function FeaturedNews({ article, onSelect }: FeaturedNewsProps) {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00833d]" />
            <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#00833d]">
              التقرير المميز
            </h2>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">
            تغطية موسعة
          </span>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={() => onSelect(article)}
          className="group cursor-pointer rounded-2xl md:rounded-3xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-400 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Image Container (Desktop 7 cols, aspect ratio ~16:9) */}
          <div className="lg:col-span-7 relative h-[260px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-gray-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 lg:opacity-30 group-hover:opacity-40 transition-opacity" />

            {/* Category Badge over image on mobile */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#00833d] shadow-md backdrop-blur-md">
                {article.category}
              </span>
            </div>
          </div>

          {/* Text Content (Desktop 5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-right bg-white space-y-6">
            <div className="space-y-4">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-[#6B7280]">
                <span className="inline-flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1 rounded-lg border border-[#F3F4F6] text-[#374151]">
                  <Calendar className="w-4 h-4 text-[#00833d]" />
                  <span className="font-semibold">{article.date}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#6B7280]">
                  <Clock className="w-4 h-4 text-[#00833d]" />
                  <span>{article.readTime}</span>
                </span>
                <span>•</span>
                <span className="text-[#374151] font-medium">{article.author}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] leading-[1.3] group-hover:text-[#00833d] transition-colors">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm sm:text-base font-normal text-[#4B5563] leading-relaxed line-clamp-4 text-justify">
                {article.summary}
              </p>
            </div>

            {/* Editorial Footer / CTA */}
            <div className="pt-6 border-t border-[#F3F4F6] flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#00833d] group-hover:text-[#00622d] transition-colors">
                <span>اقرأ التقرير كاملاً</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </div>
              <span className="text-xs text-[#9CA3AF] font-medium">
                مبادرة مؤسسية
              </span>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

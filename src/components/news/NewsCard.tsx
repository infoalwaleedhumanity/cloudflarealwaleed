'use client';

import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { InstitutionalNewsItem } from '@/data/institutionalNews';

interface NewsCardProps {
  article: InstitutionalNewsItem;
  onSelect: (article: InstitutionalNewsItem) => void;
  index?: number;
  featured?: boolean;
}

export function NewsCard({ article, onSelect, index = 0, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
        onClick={() => onSelect(article)}
        className="group cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
      >
        <div>
          {/* Card Image */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-gray-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-600 ease-out"
            />
            <div className="absolute top-3.5 right-3.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#00833d] shadow-sm backdrop-blur-sm border border-black/5">
                {article.category}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 text-right space-y-3">
            {/* Meta tags: Date & Read Time */}
            <div className="flex items-center gap-3 text-xs font-medium text-[#6B7280]">
              <span className="inline-flex items-center gap-1.5 bg-[#F9FAFB] px-2.5 py-1 rounded-md border border-[#F3F4F6] text-[#374151]">
                <Calendar className="w-3.5 h-3.5 text-[#00833d]" />
                <span className="font-semibold">{article.date}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[#6B7280]">
                <Clock className="w-3.5 h-3.5 text-[#00833d]" />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug group-hover:text-[#00833d] transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm font-normal text-[#4B5563] leading-relaxed line-clamp-3 text-justify">
              {article.summary}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-6 pt-0 text-right">
          <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#00833d] group-hover:text-[#00622d] transition-colors">
              <span>قراءة التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
            </span>
            <span className="text-[11px] text-[#9CA3AF]">{article.author}</span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      onClick={() => onSelect(article)}
      className="group cursor-pointer rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Image */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-600 ease-out"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-[#00833d] shadow-sm backdrop-blur-sm border border-black/5">
              {article.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 text-right space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5 bg-[#F9FAFB] px-2 py-0.5 rounded-md border border-[#F3F4F6] text-[#374151]">
              <Calendar className="w-3.5 h-3.5 text-[#00833d]" />
              <span className="font-semibold">{article.date}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[#6B7280]">
              <Clock className="w-3 h-3 text-[#00833d]" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-[#111827] leading-snug group-hover:text-[#00833d] transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm font-normal text-[#4B5563] leading-relaxed line-clamp-2 text-justify">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 text-right">
        <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00833d] group-hover:text-[#00622d] transition-colors">
            <span>اقرأ المزيد</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
          </span>
          <span className="text-[11px] text-[#9CA3AF] truncate max-w-[140px]">{article.author}</span>
        </div>
      </div>
    </motion.article>
  );
}

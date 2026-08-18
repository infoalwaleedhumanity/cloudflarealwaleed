'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Quote, Heart, ArrowLeft, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { successStories } from '@/data/content';

export function ImpactStories() {
  if (!successStories || successStories.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-[#F5F4F0] border-y border-[#EAE8E0] relative overflow-hidden">
      {/* Background ambient elements */}
      <div 
        aria-hidden="true" 
        className="absolute top-10 right-10 w-96 h-96 bg-[#00833d]/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-right">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E5E7EB] text-[#00833d]">
              <Heart className="w-3.5 h-3.5 fill-[#00833d] text-[#00833d]" />
              <span>قصص الأثر والتحول الإنساني</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827]">
              أثر يمتد... وإنسان يتغير
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-xl font-normal">
              نماذج واقعية وقصص نجاح ملهمة لمستفيدين ومجتمعات أحدثت مبادرات المؤسسة فارقاً حقيقياً ومستداماً في حياتهم.
            </p>
          </div>

          <Link
            href="/about"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-xs sm:text-sm font-semibold text-[#111827] hover:text-[#00833d] transition-colors shadow-sm"
          >
            <span>استكشف برامج المؤسسة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {successStories.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between text-right relative group"
            >
              <div className="space-y-4">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-full bg-[#00833d]/10 flex items-center justify-center text-[#00833d]">
                  <Quote className="w-5 h-5" />
                </div>

                {/* Story Quote Body */}
                <blockquote className="text-sm sm:text-base font-normal text-[#1F2937] leading-relaxed italic text-justify">
                  «{item.story}»
                </blockquote>
              </div>

              {/* Author & Program details */}
              <div className="pt-5 mt-6 border-t border-[#F3F4F6] flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB] bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#111827]">{item.name}</div>
                  <div className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                    <span>{item.location}</span>
                    <span>•</span>
                    <span className="text-[#00833d] font-medium">{item.program}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

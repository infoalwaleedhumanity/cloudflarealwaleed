'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Share2,
  Copy,
  ChevronLeft,
  ArrowLeft,
  Maximize2,
  X,
  Send,
  Home,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InstitutionalNewsItem } from '@/data/institutionalNews';
import { SEO } from '@/components/SEO';

interface ArticleDetailProps {
  article: InstitutionalNewsItem;
  relatedArticles: InstitutionalNewsItem[];
  onBack: () => void;
  onSelectArticle: (article: InstitutionalNewsItem) => void;
}

export function ArticleDetail({
  article,
  relatedArticles,
  onBack,
  onSelectArticle
}: ArticleDetailProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  useEffect(() => {
    if (!zoomedImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomedImage]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/news?news=${article.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }).catch(() => {});
  };

  const CONTAINER = "max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-12";

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111827] pb-20">
      <SEO
        title={article.title}
        description={article.summary}
        type="article"
        image={article.image}
      />

      {/* Header Intro / Breadcrumb */}
      <section className="pt-28 md:pt-36 pb-8 bg-white border-b border-[#EAEAEA]">
        <div className={CONTAINER}>
          <div className="space-y-4 text-right">
            {/* Breadcrumb Navigation */}
            <nav aria-label="مسار التنقل" className="flex items-center justify-start gap-2 text-xs sm:text-sm font-medium text-[#6B7280]">
              <Link 
                href="/" 
                className="hover:text-[#00833d] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00833d] rounded"
              >
                <Home className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <button 
                onClick={onBack} 
                className="hover:text-[#00833d] transition-colors cursor-pointer"
              >
                الأخبار
              </button>
              <ChevronLeft className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <span className="text-[#00833d] font-semibold line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md">
                {article.title}
              </span>
            </nav>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-[#00833d] shadow-sm">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1F2937] bg-white px-3 py-1 rounded-lg border border-[#E5E7EB] shadow-xs">
                <Calendar className="w-4 h-4 text-[#00833d]" />
                <span>{article.date}</span>
              </span>
              <span className="text-[#D1D5DB]">•</span>
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#6B7280]">
                <Clock className="w-3.5 h-3.5 text-[#00833d]" />
                قراءة {article.readTime}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111827] leading-[1.25] tracking-normal max-w-5xl">
              {article.title}
            </h1>

            {/* Back action link */}
            <div className="pt-2">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00833d] hover:text-[#00622d] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>العودة إلى قائمة الأخبار والمقالات</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-10 md:py-14">
        <div className={CONTAINER}>
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Article Card Wrapper */}
            <article className="rounded-2xl md:rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] text-right space-y-8">
              
              {/* Main Hero Image */}
              <div className="space-y-2.5">
                <div
                  onClick={() => setZoomedImage(article.image)}
                  className="relative h-[280px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden group cursor-pointer border border-[#E5E7EB] bg-gray-100"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-xs font-bold text-[#111827] flex items-center gap-2 shadow-lg">
                      <Maximize2 className="w-4 h-4 text-[#00833d]" />
                      <span>تكبير الصورة</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs text-[#6B7280] px-1 font-medium">
                  <span>المصدر: {article.author}</span>
                  <span>الأرشيف المؤسسي الرسمي © {new Date().getFullYear()}</span>
                </div>
              </div>

              {/* Lead Summary Excerpt Box */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F9FAF8] border-r-4 border-[#00833d] text-base sm:text-lg font-medium text-[#374151] leading-relaxed">
                {article.summary}
              </div>

              {/* Article Content Paragraphs */}
              <div className="space-y-6 text-base sm:text-lg font-normal text-[#1F2937] leading-[1.8] whitespace-pre-line text-justify">
                {article.content}
              </div>

              {/* Additional Photo Gallery */}
              {article.additionalImages && article.additionalImages.length > 0 && (
                <div className="pt-8 border-t border-[#E5E7EB] space-y-5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#111827] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00833d]" />
                    <span>التوثيق المصور من موقع الحدث والمشاريع</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {article.additionalImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setZoomedImage(imgUrl)}
                        className="relative h-56 sm:h-64 rounded-xl overflow-hidden group cursor-pointer border border-[#E5E7EB] bg-gray-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`صورة توثيقية ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Official Archiving Bar */}
              <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#6B7280]">
                  تم نشر وتوثيق هذا المحتوى رسمياً عبر <span className="font-bold text-[#111827]">المركز الإعلامي لمؤسسة الوليد للإنسانية</span>.
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#374151] ml-1">مشاركة:</span>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] transition-colors cursor-pointer"
                    title="نسخ رابط الخبر"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#00833d]" />
                    <span>نسخ الرابط</span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] transition-colors cursor-pointer"
                    title="مشاركة عبر منصة X"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] transition-colors cursor-pointer"
                    title="مشاركة عبر واتساب"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section aria-label="أخبار ومقالات ذات صلة" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    أخبار ومقالات ذات صلة
                  </h2>
                  <button
                    onClick={onBack}
                    className="text-xs sm:text-sm font-semibold text-[#00833d] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض جميع الأخبار</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedArticles.map((relItem) => (
                    <div
                      key={relItem.id}
                      onClick={() => onSelectArticle(relItem)}
                      className="group cursor-pointer text-right rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="rounded-xl overflow-hidden mb-3 relative h-40 border border-[#E5E7EB] bg-gray-100">
                          <Image
                            src={relItem.image}
                            alt={relItem.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white bg-[#00833d] shadow-sm">
                            {relItem.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] mb-2">
                          <Calendar className="w-3 h-3 text-[#00833d]" />
                          <span>{relItem.date}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2 group-hover:text-[#00833d] transition-colors">
                          {relItem.title}
                        </h3>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs font-semibold text-[#00833d]">
                        <span>قراءة التفاصيل</span>
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Return Button */}
            <div className="text-center pt-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-semibold text-sm bg-[#00833d] hover:bg-[#00622d] transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة إلى أرشيف المركز الإعلامي والأخبار</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <div
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors z-10 cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={zoomedImage}
                alt="صورة مكبرة"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Toast */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111827] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم نسخ رابط الخبر بنجاح إلى الحافظة</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

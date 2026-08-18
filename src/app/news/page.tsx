'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { institutionalNewsData, type InstitutionalNewsItem } from '@/data/institutionalNews';
import { SEO } from '@/components/SEO';
import { NewsHero } from '@/components/news/NewsHero';
import { FeaturedNews } from '@/components/news/FeaturedNews';
import { NewsCategories, type CategoryType } from '@/components/news/NewsCategories';
import { NewsCard } from '@/components/news/NewsCard';
import { ImpactStories } from '@/components/news/ImpactStories';
import { ArticleDetail } from '@/components/news/ArticleDetail';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('جميع الأخبار');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;
  const gridSectionRef = useRef<HTMLDivElement>(null);

  const [selectedArticle, setSelectedArticle] = useState<InstitutionalNewsItem | null>(null);

  // Sync state from query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newsIdStr = params.get('news');
    if (newsIdStr) {
      const found = institutionalNewsData.find(item => item.id === Number(newsIdStr));
      if (found) setSelectedArticle(found);
    }
    const q = params.get('q');
    if (q) setSearchQuery(q);
    const cat = params.get('category');
    if (cat && ['المبادرات', 'الفعاليات', 'البرامج', 'البيانات الرسمية'].includes(cat)) {
      setActiveCategory(cat as CategoryType);
    }
  }, []);

  // Sync with browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newsIdStr = params.get('news');
      if (newsIdStr) {
        const found = institutionalNewsData.find(item => item.id === Number(newsIdStr));
        setSelectedArticle(found ?? null);
      } else {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectArticle = (article: InstitutionalNewsItem | null) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (article) {
      window.history.pushState({}, '', `?news=${article.id}`);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('news');
      window.history.pushState({}, '', url.pathname + url.search);
    }
  };

  // Filter articles based on active category & search query
  const filteredArticles = useMemo(() => {
    return institutionalNewsData.filter(item => {
      const matchesCategory = activeCategory === 'جميع الأخبار' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [activeCategory, searchQuery]);

  // Determine top featured article
  const isDefaultView = activeCategory === 'جميع الأخبار' && !searchQuery.trim();
  const featuredArticle = isDefaultView ? institutionalNewsData[0] : null;

  // Grid articles (excluding featured when displayed in the hero feature)
  const gridArticles = useMemo(() => {
    if (isDefaultView && featuredArticle) {
      return filteredArticles.filter(item => item.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, isDefaultView, featuredArticle]);

  const totalPages = Math.max(1, Math.ceil(gridArticles.length / itemsPerPage));
  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPageNum - 1) * itemsPerPage;
    return gridArticles.slice(startIdx, startIdx + itemsPerPage);
  }, [gridArticles, currentPageNum, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPageNum(page);
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    const sameCat = institutionalNewsData.filter(
      item => item.category === selectedArticle.category && item.id !== selectedArticle.id
    );
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    const others = institutionalNewsData.filter(
      item => item.category !== selectedArticle.category && item.id !== selectedArticle.id
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [selectedArticle]);

  // If viewing single article detail
  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        relatedArticles={relatedArticles}
        onBack={() => handleSelectArticle(null)}
        onSelectArticle={(art) => handleSelectArticle(art)}
      />
    );
  }

  const CONTAINER = "max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-12";

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111827] flex flex-col justify-between selection:bg-[#00833d]/20">
      <SEO
        title="الأخبار"
        description="المركز الإعلامي والتوثيقي لمؤسسة الوليد للإنسانية: تغطية شاملة للمبادرات التنموية، البرامج الإنسانية، والبيانات الرسمية حول العالم."
        type="website"
      />

      <div>
        {/* 1. News Hero Intro */}
        <NewsHero totalCount={institutionalNewsData.length} />

        {/* 2. Featured Editorial Spotlight (Only shown on initial unfiltered view) */}
        {featuredArticle && (
          <FeaturedNews
            article={featuredArticle}
            onSelect={(art) => handleSelectArticle(art)}
          />
        )}

        {/* 3. News Categories & Fast Filter Navigation */}
        <div ref={gridSectionRef}>
          <NewsCategories
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            articles={institutionalNewsData}
            filteredCount={filteredArticles.length}
          />
        </div>

        {/* 4. Editorial News Grid */}
        <main className="py-10 md:py-16">
          <div className={CONTAINER}>
            {gridArticles.length === 0 ? (
              <div className="py-16 text-center rounded-3xl p-8 space-y-4 max-w-xl mx-auto border border-[#E5E7EB] bg-white shadow-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-gray-50 text-[#6B7280]">
                  <Search className="w-7 h-7 text-[#00833d]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">لم يتم العثور على نتائج مطابقة</h3>
                <p className="text-sm text-[#6B7280]">
                  جرب البحث بكلمات مفتاحية أخرى أو اختر تصنيفاً مختلفاً لعرض الأخبار والتقارير المتاحة.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('جميع الأخبار');
                    setSearchQuery('');
                  }}
                  className="px-6 py-2.5 rounded-xl text-white text-xs font-semibold bg-[#00833d] hover:bg-[#00622d] transition-all cursor-pointer shadow-sm"
                >
                  عرض جميع الأخبار
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Section Subtitle */}
                <div className="flex items-center justify-between text-right">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                      {activeCategory === 'جميع الأخبار' ? 'أحدث التقارير والأخبار' : `أخبار ${activeCategory}`}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6B7280]">
                      عرض المقالات والبيانات المعتمدة للمؤسسة
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#6B7280]">
                    {gridArticles.length} محتوى
                  </span>
                </div>

                {/* Editorial Grid: First 2 large cards, then 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {paginatedArticles.map((article, idx) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onSelect={(art) => handleSelectArticle(art)}
                      index={idx}
                      featured={idx === 0 && currentPageNum === 1 && !isDefaultView}
                    />
                  ))}
                </div>

                {/* 5. Pagination / Load Controls */}
                {totalPages > 1 && (
                  <nav aria-label="ترقيم الصفحات" className="pt-8 border-t border-[#EAEAEA]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
                      <div className="text-xs text-[#6B7280]">
                        عرض الأخبار <span className="font-bold text-[#111827]">{(currentPageNum - 1) * itemsPerPage + 1}</span> إلى{' '}
                        <span className="font-bold text-[#111827]">{Math.min(currentPageNum * itemsPerPage, gridArticles.length)}</span>{' '}
                        من أصل <span className="font-bold text-[#111827]">{gridArticles.length}</span> خبراً
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePageChange(currentPageNum - 1)}
                          disabled={currentPageNum === 1}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#111827]"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>السابق</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            const isActive = pageNum === currentPageNum;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                                  isActive
                                    ? 'bg-[#00833d] text-white border-[#00833d] shadow-sm'
                                    : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPageNum + 1)}
                          disabled={currentPageNum === totalPages}
                          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#111827]"
                        >
                          <span>التالي</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </nav>
                )}
              </div>
            )}
          </div>
        </main>

        {/* 6. Humanitarian Impact Stories Section */}
        <ImpactStories />

        {/* 7. Institutional Press & Media Contact Banner */}
        <section className="py-14 md:py-18">
          <div className={CONTAINER}>
            <div className="rounded-3xl bg-white border border-[#E5E7EB] p-8 sm:p-10 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8 text-right">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1 rounded-full bg-[#00833d]/10 text-[#00833d]">
                  <Award className="w-3.5 h-3.5" />
                  <span>الاتصال المؤسسي والإعلامي</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-snug">
                  هل ترغب في الحصول على البيانات الصحفية أو التقارير السنوية الموثقة؟
                </h3>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                  فريق الاتصال والمركز الإعلامي في مؤسسة الوليد للإنسانية يرحب باستفسارات وسائل الإعلام والمؤسسات الشريكة والباحثين.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 shrink-0 self-start lg:self-center">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#00833d] hover:bg-[#00622d] transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  التواصل مع المركز الإعلامي
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm border border-[#E5E7EB] hover:bg-gray-50 text-[#111827] transition-colors cursor-pointer"
                >
                  عن المؤسسة ورؤيتها
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

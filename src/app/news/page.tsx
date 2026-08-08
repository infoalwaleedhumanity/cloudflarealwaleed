'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Share2,
  X,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Award,
  Send,
  Home
} from 'lucide-react';
import { institutionalNewsData, type InstitutionalNewsItem } from '@/data/institutionalNews';
import { SEO } from '@/components/SEO';

const CATEGORIES = ['جميع الأخبار', 'المبادرات', 'الفعاليات', 'البرامج', 'البيانات الرسمية'] as const;
type CategoryType = typeof CATEGORIES[number];

/* Shared brand tokens — matches HomePage / Hero / AboutPage */
const C = {
  green: '#00833D',
  greenDark: '#00612D',
  ink: '#111110',
  muted: '#5B5B56',
  bg: '#FFFFFF',
  bgSoft: '#F6F6F3',
  border: '#E7E5DF',
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('جميع الأخبار');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 4;

  const [selectedArticle, setSelectedArticle] = useState<InstitutionalNewsItem | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Sync from URL on first mount (direct links like /?news=3)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newsIdStr = params.get('news');
    if (newsIdStr) {
      const found = institutionalNewsData.find(item => item.id === Number(newsIdStr));
      if (found) setSelectedArticle(found);
    }
  }, []);

  // FIX: keep in sync with the browser's own Back/Forward buttons, not just
  // the initial page load — previously popstate was never listened for, so
  // pressing Back after opening an article changed the URL but left the
  // article view on screen.
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

  const filteredArticles = useMemo(() => {
    return institutionalNewsData.filter(item => {
      const matchesCategory = activeCategory === 'جميع الأخبار' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    setCurrentPageNum(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPageNum - 1) * itemsPerPage;
    return filteredArticles.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredArticles, currentPageNum]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPageNum(page);
    const section = document.getElementById('news-list-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleShareArticle = (article: InstitutionalNewsItem) => {
    const shareUrl = `${window.location.origin}/?news=${article.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }).catch(() => {});
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

  // FIX: the zoom lightbox had no keyboard escape route at all.
  useEffect(() => {
    if (!zoomedImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomedImage]);

  const WIDE = "max-w-[1320px] w-full mx-auto px-6 md:px-10 lg:px-14";

  // ==========================================
  // RENDER: ARTICLE DETAIL VIEW
  // ==========================================
  if (selectedArticle) {
    return (
      <div className="min-h-screen font-cairo selection:bg-[#00833D]/20" style={{ backgroundColor: C.bg, color: C.ink }}>
        <SEO
          title={selectedArticle.title}
          description={selectedArticle.summary}
          type="article"
          image={selectedArticle.image}
        />

        {/* Detail Hero & Breadcrumb */}
        <section className="pt-32 pb-14 border-b" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
          <div className={`${WIDE} space-y-6 text-right`}>
            <nav aria-label="Breadcrumb" className="flex items-center justify-end gap-2 text-xs md:text-sm" style={{ color: C.muted }}>
              <span className="font-semibold line-clamp-1 max-w-[200px] md:max-w-md" style={{ color: C.green }}>
                {selectedArticle.title}
              </span>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <button onClick={() => handleSelectArticle(null)} className="hover:underline cursor-pointer">
                المركز الإعلامي والأخبار
              </button>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <Link href="/" className="hover:underline flex items-center gap-1 cursor-pointer">
                <span>الرئيسية</span>
                <Home className="w-3.5 h-3.5" />
              </Link>
            </nav>

            <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
              <span className="text-xs font-black" style={{ color: C.green }}>{selectedArticle.category}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: C.muted }}>
                <Calendar className="w-3.5 h-3.5" style={{ color: C.green }} />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: C.muted }}>
                <Clock className="w-3.5 h-3.5" style={{ color: C.green }} />
                قراءة {selectedArticle.readTime}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight max-w-5xl" style={{ color: C.ink }}>
              {selectedArticle.title}
            </h1>

            <div className="pt-2">
              <button
                onClick={() => handleSelectArticle(null)}
                className="inline-flex items-center gap-2.5 text-sm font-bold pb-1 border-b-2 cursor-pointer"
                style={{ color: C.green, borderColor: C.green }}
              >
                <span>العودة إلى قائمة الأخبار</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <main className="py-16">
          <div className={WIDE}>
            <article className="text-right space-y-10 max-w-4xl mx-auto">

              <div className="space-y-3">
                <div
                  onClick={() => setZoomedImage(selectedArticle.image)}
                  className="relative h-[300px] md:h-[440px] rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-xs font-bold flex items-center gap-2" style={{ color: C.ink }}>
                      <Maximize2 className="w-4 h-4" style={{ color: C.green }} />
                      <span>تكبير الصورة</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-light px-1" style={{ color: C.muted }}>
                  <span>المصدر: {selectedArticle.author} — الأرشيف المؤسسي الرسمي</span>
                  <span>مؤسسة الوليد للإنسانية © {new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="p-6 md:p-8 rounded-lg border-r-4 font-medium text-lg md:text-xl leading-relaxed" style={{ backgroundColor: C.bgSoft, borderColor: C.green, color: C.ink }}>
                {selectedArticle.summary}
              </div>

              <div className="space-y-6 font-normal text-base md:text-lg leading-loose whitespace-pre-line" style={{ color: C.ink }}>
                {selectedArticle.content}
              </div>

              {selectedArticle.additionalImages && selectedArticle.additionalImages.length > 0 && (
                <div className="pt-8 border-t space-y-6" style={{ borderColor: C.border }}>
                  <h3 className="text-xl font-black flex items-center gap-2" style={{ color: C.ink }}>
                    <Sparkles className="w-5 h-5" style={{ color: C.green }} />
                    <span>التوثيق المصور من موقع الحدث والمشاريع</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedArticle.additionalImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setZoomedImage(imgUrl)}
                        className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`صورة توثيقية ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: C.border }}>
                <div className="text-xs" style={{ color: C.muted }}>
                  تم نشر هذا الخبر رسمياً عبر <span className="font-bold" style={{ color: C.ink }}>المركز الإعلامي لمؤسسة الوليد للإنسانية</span>.
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold ml-2" style={{ color: C.ink }}>مشاركة الخبر:</span>

                  <button
                    onClick={() => handleShareArticle(selectedArticle)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    style={{ backgroundColor: C.bgSoft, color: C.ink }}
                    title="نسخ رابط الخبر"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الرابط</span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: C.bgSoft, color: C.ink }}
                    title="مشاركة عبر منصة X"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedArticle.title + ' ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: C.bgSoft, color: C.ink }}
                    title="مشاركة عبر واتساب"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </article>

            {relatedArticles.length > 0 && (
              <section aria-label="الأخبار ذات الصلة" className="mt-16 space-y-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: C.border }}>
                  <h2 className="text-2xl font-black" style={{ color: C.ink }}>أخبار مؤسسية ذات صلة</h2>
                  <button
                    onClick={() => handleSelectArticle(null)}
                    className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    style={{ color: C.green }}
                  >
                    <span>عرض جميع الأخبار</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((relItem) => (
                    <div key={relItem.id} onClick={() => handleSelectArticle(relItem)} className="group cursor-pointer text-right">
                      <div className="rounded-lg overflow-hidden mb-4">
                        <img
                          src={relItem.image}
                          alt={relItem.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] mb-2" style={{ color: C.muted }}>
                        <Calendar className="w-3 h-3" style={{ color: C.green }} />
                        <span>{relItem.date}</span>
                      </div>
                      <h3 className="text-base font-black leading-snug line-clamp-2" style={{ color: C.ink }}>
                        {relItem.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-16 text-center">
              <button
                onClick={() => handleSelectArticle(null)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-md text-white font-bold text-sm transition-all cursor-pointer hover:brightness-110"
                style={{ backgroundColor: C.green }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة إلى أرشيف المركز الإعلامي والأخبار</span>
              </button>
            </div>
          </div>
        </main>

        {/* Lightbox */}
        <AnimatePresence>
          {zoomedImage && (
            <div
              onClick={() => setZoomedImage(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg"
              >
                <button
                  onClick={() => setZoomedImage(null)}
                  className="absolute top-4 left-4 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors z-10 cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>
                <img src={zoomedImage} alt="صورة مكبرة" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ShareToast show={copiedToast} />
      </div>
    );
  }

  // ==========================================
  // RENDER: NEWS LIST
  // ==========================================
  return (
    <div className="min-h-screen font-cairo selection:bg-[#00833D]/20" style={{ backgroundColor: C.bg, color: C.ink }}>
      <SEO
        title="المركز الإعلامي والأخبار"
        description="منصة إخبارية مؤسسية توثق المبادرات والبرامج الميدانية والبيانات الرسمية لمؤسسة الوليد للإنسانية حول العالم."
        type="website"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 border-b" style={{ borderColor: C.border, backgroundColor: C.bgSoft }}>
        <div className={WIDE}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-right max-w-3xl"
          >
            <nav aria-label="Breadcrumb" className="flex items-center justify-end gap-2 text-xs md:text-sm" style={{ color: C.muted }}>
              <span className="font-semibold" style={{ color: C.green }}>المركز الإعلامي والأخبار</span>
              <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
              <Link href="/" className="hover:underline flex items-center gap-1.5 cursor-pointer">
                <span>الرئيسية</span>
                <Home className="w-3.5 h-3.5" />
              </Link>
            </nav>

            <span className="block text-xs font-black tracking-[0.2em]" style={{ color: C.green }}>الإصدار الإخباري الرسمي</span>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ color: C.ink }}>
              المركز الإعلامي وأخبار المؤسسة
            </h1>

            <p className="font-light text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: C.muted }}>
              تغطية مؤسسية موثقة وشاملة لآخر المبادرات، الفعاليات الدولية، البرامج التنموية، والبيانات الرسمية لمؤسسة الوليد للإنسانية في أكثر من 35 دولة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section id="news-list-section" className="py-8 border-b sticky top-0 z-30" style={{ borderColor: C.border, backgroundColor: C.bg }}>
        <div className={WIDE}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">

            <div className="flex items-center justify-start overflow-x-auto pb-1 lg:pb-0 scrollbar-none gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                const count = cat === 'جميع الأخبار'
                  ? institutionalNewsData.length
                  : institutionalNewsData.filter(item => item.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative px-5 py-2.5 rounded-md text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                    style={isSelected
                      ? { backgroundColor: C.green, color: '#fff' }
                      : { backgroundColor: C.bgSoft, color: C.ink }}
                  >
                    <span>{cat}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px]"
                      style={isSelected ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' } : { backgroundColor: '#E7E5DF', color: C.muted }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-96">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute right-4 pointer-events-none" style={{ color: C.muted }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعنوان أو محتوى الخبر..."
                  aria-label="البحث في الأخبار"
                  className="w-full pr-11 pl-10 py-2.5 rounded-md border focus:outline-none text-xs md:text-sm transition-all"
                  style={{ backgroundColor: C.bgSoft, borderColor: C.border, color: C.ink }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 p-1 rounded-full transition-colors cursor-pointer"
                    style={{ backgroundColor: '#E7E5DF', color: C.muted }}
                    title="مسح البحث"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-medium" style={{ color: C.muted }}>
            <div>
              تم العثور على <span className="font-bold" style={{ color: C.ink }}>{filteredArticles.length}</span> خبراً
              {activeCategory !== 'جميع الأخبار' && <span> في تصنيف «{activeCategory}»</span>}
              {searchQuery && <span> لنتيجة البحث «{searchQuery}»</span>}
            </div>
            {filteredArticles.length > 0 && (
              <div className="hidden sm:block">
                الصفحة <span className="font-bold" style={{ color: C.ink }}>{currentPageNum}</span> من أصل <span className="font-bold">{totalPages}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Listing */}
      <section className="py-16">
        <div className={WIDE}>
          {filteredArticles.length === 0 ? (
            <div className="py-20 text-center rounded-lg p-8 space-y-4 max-w-xl mx-auto" style={{ backgroundColor: C.bgSoft }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: C.border, color: C.muted }}>
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black" style={{ color: C.ink }}>لم يتم العثور على أخبار مطابقة</h3>
              <p className="text-sm font-light" style={{ color: C.muted }}>
                جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً للوصول إلى المحتوى المطلوب.
              </p>
              <button
                onClick={() => { setActiveCategory('جميع الأخبار'); setSearchQuery(''); }}
                className="px-6 py-2.5 rounded-md text-white text-xs font-bold transition-colors cursor-pointer hover:brightness-110"
                style={{ backgroundColor: C.green }}
              >
                عرض جميع الأخبار
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.border }}>
              {paginatedArticles.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  onClick={() => handleSelectArticle(item)}
                  className="group cursor-pointer py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t first:border-t-0"
                  style={{ borderColor: C.border }}
                >
                  <div className="lg:col-span-5 relative h-56 lg:h-64 overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full text-white" style={{ backgroundColor: C.ink }}>
                      {item.category}
                    </span>
                  </div>

                  <div className="lg:col-span-7 space-y-4 text-right">
                    <div className="flex items-center gap-4 text-xs font-medium" style={{ color: C.muted }}>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: C.green }} />{item.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: C.green }} />قراءة {item.readTime}</span>
                      <span style={{ color: '#8A8570' }}>المصدر: {item.author}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black leading-snug transition-colors" style={{ color: C.ink }}>
                      {item.title}
                    </h2>

                    <p className="text-sm md:text-base font-light leading-relaxed line-clamp-3" style={{ color: C.muted }}>
                      {item.summary}
                    </p>

                    <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                      <span className="inline-flex items-center gap-2 text-sm font-black" style={{ color: C.green }}>
                        <span>قراءة المزيد وتفاصيل البيان</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </span>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleShareArticle(item); }}
                        className="p-2 rounded-md transition-colors cursor-pointer"
                        style={{ backgroundColor: C.bgSoft, color: C.muted }}
                        title="مشاركة الرابط"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section aria-label="ترقيم الصفحات" className="pb-20">
          <div className={`${WIDE} flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8`} style={{ borderColor: C.border }}>
            <div className="text-xs font-medium" style={{ color: C.muted }}>
              عرض الأخبار <span className="font-bold" style={{ color: C.ink }}>{(currentPageNum - 1) * itemsPerPage + 1}</span> إلى{' '}
              <span className="font-bold" style={{ color: C.ink }}>{Math.min(currentPageNum * itemsPerPage, filteredArticles.length)}</span>{' '}
              من أصل <span className="font-bold" style={{ color: C.ink }}>{filteredArticles.length}</span> خبراً
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPageNum - 1)}
                disabled={currentPageNum === 1}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                style={currentPageNum === 1
                  ? { backgroundColor: C.bgSoft, color: '#B3AFA0' }
                  : { backgroundColor: C.bg, color: C.ink, border: `1px solid ${C.border}` }}
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
                      className="w-10 h-10 rounded-md text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                      style={isActive
                        ? { backgroundColor: C.green, color: '#fff' }
                        : { backgroundColor: C.bg, color: C.ink, border: `1px solid ${C.border}` }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPageNum + 1)}
                disabled={currentPageNum === totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                style={currentPageNum === totalPages
                  ? { backgroundColor: C.bgSoft, color: '#B3AFA0' }
                  : { backgroundColor: C.bg, color: C.ink, border: `1px solid ${C.border}` }}
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Media Contact Banner */}
      <section className="py-16 border-t" style={{ borderColor: C.border }}>
        <div className={WIDE}>
          <div className="p-8 md:p-12 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8" style={{ backgroundColor: C.green }}>
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-white/80">
                <Award className="w-4 h-4" />
                <span>المركز الإعلامي والاتصال المؤسسي</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                هل لديك استفسار إعلامي أو ترغب في الحصول على التقارير السنوية الرسمية؟
              </h3>
              <p className="text-xs md:text-sm font-light text-white/85">
                فريق الإعلام والاتصال في مؤسسة الوليد للإنسانية متاح للرد على استفسارات الصحافة والهيئات الدولية.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-md font-bold text-xs md:text-sm transition-colors cursor-pointer hover:brightness-95 inline-block"
                style={{ backgroundColor: '#fff', color: C.green }}
              >
                التواصل مع إدارة الإعلام
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-md font-bold text-xs md:text-sm border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer inline-block"
              >
                نبذة عن المؤسسة
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ShareToast show={copiedToast} />
    </div>
  );
}

function ShareToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-sm font-bold"
          style={{ backgroundColor: C.ink }}
        >
          <CheckCircle2 className="w-4 h-4" style={{ color: '#3FB871' }} />
          <span>تم نسخ رابط الخبر بنجاح إلى الحافظة</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

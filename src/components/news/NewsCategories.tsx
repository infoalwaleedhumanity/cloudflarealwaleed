'use client';

import { Search, X } from 'lucide-react';
import type { InstitutionalNewsItem } from '@/data/institutionalNews';

export const CATEGORIES = ['جميع الأخبار', 'المبادرات', 'الفعاليات', 'البرامج', 'البيانات الرسمية'] as const;
export type CategoryType = typeof CATEGORIES[number];

interface NewsCategoriesProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  articles: InstitutionalNewsItem[];
  filteredCount: number;
}

export function NewsCategories({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  articles,
  filteredCount,
}: NewsCategoriesProps) {
  return (
    <section className="sticky top-0 z-30 bg-[#FAFAF8]/95 backdrop-blur-md py-4 border-y border-[#EAEAEA] transition-all">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Horizontal category navigation with smooth scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = cat === 'جميع الأخبار'
                ? articles.length
                : articles.filter(item => item.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#00833d] text-white border-[#00833d] shadow-[0_2px_8px_rgba(0,131,61,0.25)]'
                      : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Minimal Search Bar */}
          <div className="relative w-full lg:w-80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute right-3.5 text-[#9CA3AF] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث في الأخبار والتقارير..."
                aria-label="البحث في الأخبار"
                className="w-full pr-10 pl-9 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs sm:text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00833d]/20 focus:border-[#00833d] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 p-1 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100 transition-colors"
                  title="مسح البحث"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic filter feedback line if filtered */}
        {(activeCategory !== 'جميع الأخبار' || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-[#6B7280] font-medium pt-3 mt-3 border-t border-[#F0F0F0]">
            <div>
              تم العثور على <span className="font-bold text-[#111827]">{filteredCount}</span> نتيجة
              {activeCategory !== 'جميع الأخبار' && <span> في تصنيف «{activeCategory}»</span>}
              {searchQuery && <span> للبحث عن «{searchQuery}»</span>}
            </div>
            <button
              onClick={() => {
                onSelectCategory('جميع الأخبار');
                onSearchChange('');
              }}
              className="text-[#00833d] hover:underline font-semibold cursor-pointer"
            >
              إعادة ضبط التصفية
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

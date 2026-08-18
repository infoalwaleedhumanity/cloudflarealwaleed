'use client';

import { useState } from 'react';
import Image from 'next/image';
import { projects } from '@/data/content';
import { SEO } from '@/components/SEO';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filtered = projects;

  // ربط تصنيف كل مشروع بلون الهالة المناسب من الألوان الخمسة الدلالية
  const CATEGORY_HALO: Record<string, 'blue' | 'green' | 'purple' | 'yellow' | 'pink'> = {
    'إغاثة': 'blue',
    'تنمية': 'green',
    'تمكين': 'purple',
    'تعليم': 'yellow',
    'صحة': 'pink',
  };

  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--primary)] font-sans">
      <SEO title="مشاريعنا" description="مشاريعنا العالمية والمحلية التي تعكس رؤيتنا." type="WebPage" />

      {/* Header Section */}
      <div className="page-header text-center">
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 mb-4 block font-cairo">مشاريعنا الاستراتيجية</span>
          <h1
            className="mb-6 text-white tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', fontWeight: 700 }}
          >
            نحدث فرقاً حقيقياً
          </h1>
          <div className="gold-line mx-auto" />
        </div>
      </div>

      {/* Projects Grid Section */}
      <section className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj) => {
              const halo = CATEGORY_HALO[proj.category] || 'green';
              return (
              <div
                key={proj.id}
                className={`group cursor-pointer bg-[var(--surface)] rounded-[var(--radius-default)] overflow-hidden shadow-[0_4px_20px_-5px_rgba(var(--primary-rgb),0.08)] hover:shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 border border-[var(--border)] flex flex-col halo-card halo-${halo}`}
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative overflow-hidden aspect-[16/11]">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-[var(--radius-pill)] bg-white/90 backdrop-blur-sm text-[var(--primary)] font-cairo`}>
                    {proj.category}
                  </span>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-4 leading-snug text-[var(--primary)] group-hover:text-[var(--gold-dark)] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>{proj.title}</h3>
                  <p className="text-[var(--text)]/70 text-sm leading-relaxed font-cairo line-clamp-3 mb-6 flex-grow">{proj.description}</p>
                  <span className="text-[var(--primary)] font-bold font-cairo text-sm uppercase tracking-wider border-b border-[var(--primary)] inline-block self-start">
                    اقرأ المزيد
                  </span>
                </div>
              </div>
              );
            })}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--primary)]/50 backdrop-blur-md transition-opacity duration-500"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-[var(--radius-default)] overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80">
              <Image src={selectedProject.image} alt={selectedProject.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
              <button
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--primary)] hover:bg-white transition-all shadow-lg z-50"
                onClick={() => setSelectedProject(null)}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl mb-8 text-[var(--primary)] leading-tight" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{selectedProject.title}</h2>
              <div className="text-[var(--text)]/80 leading-relaxed font-cairo text-base md:text-lg space-y-6">
                <p className="whitespace-pre-line">{selectedProject.description}</p>
              </div>
              <div className="mt-12">
                <button
                  className="w-full py-4 bg-[var(--primary)] text-white rounded-[var(--radius-default)] font-cairo font-bold hover:bg-[var(--secondary)] transition-colors shadow-lg"
                  onClick={() => setSelectedProject(null)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { projects } from '@/data/content';
import { SEO } from '@/components/SEO';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filtered = projects;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <SEO title="مشاريعنا" description="مشاريعنا العالمية والمحلية التي تعكس رؤيتنا." type="WebPage" />
      
      {/* Header Section with Olive Green Background */}
      <section className="bg-emerald-900 pt-24 pb-20 px-6 md:px-12 lg:px-20 mb-16 shadow-lg">
        <div className="mb-0 text-center max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-100 mb-4 block font-cairo">مشاريعنا الاستراتيجية</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 font-cairo text-white tracking-tight">نحدث فرقاً حقيقياً</h1>
            <div className="h-1 w-20 bg-white mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="max-w-[1600px] w-full mx-auto px-5 md:px-10 lg:px-16 2xl:px-20 mb-16">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-200/60 flex flex-col"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative overflow-hidden aspect-[16/11]">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-4 leading-snug font-cairo text-slate-950 group-hover:text-slate-700 transition-colors">{proj.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-cairo line-clamp-3 mb-6 flex-grow">{proj.description}</p>
                  <span className="text-slate-950 font-bold font-cairo text-sm uppercase tracking-wider border-b border-slate-950 inline-block self-start">
                    اقرأ المزيد
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md transition-opacity duration-500"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-[2rem] overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-500 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover"/>
              <button
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-950 hover:bg-white transition-all shadow-lg z-50"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-cairo text-slate-950 leading-tight">{selectedProject.title}</h2>
              <div className="text-slate-700 leading-relaxed font-cairo text-base md:text-lg space-y-6">
                <p className="whitespace-pre-line">{selectedProject.description}</p>
              </div>
              <div className="mt-12">
                <button
                  className="w-full py-4 bg-slate-950 text-white rounded-2xl font-cairo font-bold hover:bg-slate-800 transition-colors shadow-lg"
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

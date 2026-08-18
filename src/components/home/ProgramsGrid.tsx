'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { C, SolidButton } from './ui';

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName?: string;
  category: string;
}

// ربط كل تصنيف بلون الهالة المناسب من الألوان الخمسة الدلالية لمجالات
// التركيز حسب هوية العلامة (مثال المؤسسة نفسها: الاستجابة للكوارث،
// تمكين المرأة، إلخ — كل مجال بلونه المميز)
const CATEGORY_HALO: Record<string, 'blue' | 'green' | 'purple' | 'yellow' | 'pink'> = {
  'إغاثة': 'blue',
  'تنمية': 'green',
  'تمكين': 'purple',
  'تعليم': 'yellow',
  'صحة': 'pink',
};

export default function ProgramsGrid({ programs }: { programs: Program[] }) {
  const [selected, setSelected] = useState<Program | null>(null);

  // Lock background scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  // Close on Escape
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {programs.map((prog) => {
          const halo = CATEGORY_HALO[prog.category] || 'green';
          return (
          <motion.div
            key={prog.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className={`group cursor-pointer halo-card halo-${halo} p-4 rounded-[var(--radius-default)]`}
            onClick={() => setSelected(prog)}
          >
            <div className="rounded-[var(--radius-default)] overflow-hidden mb-5 relative h-56">
              <Image
                src={prog.image}
                alt={prog.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: C.green }}>
              <span>{prog.category}</span>
            </div>
            <h3 className="text-xl font-black leading-snug mb-2" style={{ color: C.ink, fontFamily: 'var(--font-heading)' }}>
              {prog.title}
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
              {prog.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(prog);
              }}
              className="text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
              style={{ color: C.green }}
            >
              <span>تقديم طلب مساعدة</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(17,17,16,0.6)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg p-8 sm:p-10 max-w-2xl w-full relative overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
                style={{ color: C.ink, border: `1px solid ${C.border}` }}
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden relative h-48 sm:h-60">
                  <Image src={selected.image} alt={selected.title} fill sizes="(max-width: 640px) 100vw, 500px" className="object-cover" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black" style={{ color: C.green }}>
                    مستمر
                  </span>
                  <h3 className="text-2xl font-black" style={{ color: C.ink }}>
                    {selected.title}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.muted }}>
                    {selected.description}
                  </p>
                </div>

                <div className="py-4 space-y-2 text-sm border-y" style={{ borderColor: C.border, color: C.muted }}>
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: C.green }}>
                      تاريخ الانتهاء:
                    </span>
                    <span>2030/01/31</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: C.green }}>
                      جهة التنفيذ:
                    </span>
                    <span>مؤسسة الوليد للإنسانية</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <SolidButton className="flex-1" href="/programs" onClick={() => setSelected(null)}>
                    الانتقال لصفحة التقديم الرسمية
                  </SolidButton>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-6 py-4 text-sm font-bold cursor-pointer"
                    style={{ color: C.muted }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Globe, Award } from 'lucide-react';
import { C } from './ui';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  ShieldCheck,
  HeartHandshake,
  Globe,
  Award,
};

interface Pillar {
  iconName: string;
  title: string;
  description: string;
}

export default function Pillars({ items }: { items: Pillar[] }) {
  return (
    <div className="divide-y max-w-3xl mx-auto" style={{ borderColor: C.border }}>
      {items.map((item, idx) => {
        const IconComponent = iconMap[item.iconName] || ShieldCheck;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="py-7 flex items-start gap-6 border-t first:border-t-0"
            style={{ borderColor: C.border }}
          >
            <IconComponent className="w-6 h-6 shrink-0 mt-1" style={{ color: C.green }} />
            <div>
              <h3 className="text-lg font-black mb-1.5" style={{ color: C.ink }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


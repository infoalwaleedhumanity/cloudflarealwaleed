'use client';

import { useState } from 'react';
import { Eye, Target, Compass } from 'lucide-react';
import { C } from './ui';

const tabs = [
  {
    key: 'vision',
    label: 'رؤيتنا',
    icon: Eye,
    text: 'بناء عالم تسوده العدالة والمساواة والفرص المتكافئة، حيث يُمكن لكل إنسان تحقيق كامل إمكاناته والمساهمة في بناء مجتمع مزدهر.',
  },
  {
    key: 'mission',
    label: 'رسالتنا',
    icon: Target,
    text: 'دعم المجتمعات الأكثر احتياجاً من خلال مبادرات تنموية مستدامة، ومشاريع إنسانية عالية الكفاءة والحوكمة بالشراكة مع المنظمات الدولية.',
  },
  {
    key: 'values',
    label: 'قيمنا',
    icon: Compass,
    text: 'الشفافية المطلقة، النزاهة المؤسسية، الالتزام بالتميز، الشراكة الفاعلة، واحترام كرامة الإنسان في كل مكان.',
  },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function MissionTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('vision');
  const active = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-5 pt-2">
      <div className="flex gap-8 border-b" style={{ borderColor: C.border }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="pb-3 text-sm font-black transition-all cursor-pointer flex items-center gap-2 -mb-px border-b-2"
            style={{
              color: activeTab === key ? C.green : C.muted,
              borderColor: activeTab === key ? C.green : 'transparent',
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="min-h-[80px]">
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          {active.text}
        </p>
      </div>
    </div>
  );
}

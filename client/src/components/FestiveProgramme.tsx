import React, { useState } from 'react';
import { Music, Sparkles, Flame, Clock, MapPin } from 'lucide-react';
import { Lang } from '../i18n';

interface EventItem {
  id: string;
  slot: 'afternoon' | 'evening';
  time: string;
  titleEn: string;
  titleZh: string;
  zoneEn: string;
  zoneZh: string;
  descEn: string;
  descZh: string;
  tagEn: string;
  tagZh: string;
}

const PROGRAMME: EventItem[] = [
  {
    id: 'evt-1',
    slot: 'afternoon',
    time: '13:00 — 14:30',
    titleEn: 'Nuremberg Spice & Glühwein Masterclass',
    titleZh: '纽伦堡传统热红酒与香料品鉴工坊',
    zoneEn: 'Zone A · Abbey Gastronomy Row',
    zoneZh: 'A区 · 修道院美食长廊',
    descEn: 'Inspired by Christkindlesmarkt traditions, blending German cinnamon cloves with Scottish Highland brambles.',
    descZh: '源自德国圣诞集市经典工艺，将肉桂丁香与苏格兰高地黑莓融合调制。',
    tagEn: 'German Heritage',
    tagZh: '德式经典'
  },
  {
    id: 'evt-2',
    slot: 'afternoon',
    time: '15:00 — 16:30',
    titleEn: 'Paisley Loom Weaving Live Showcase',
    titleZh: '佩斯利非遗织布工艺现场展演',
    zoneEn: 'Zone B · Artisan Quarter',
    zoneZh: 'B区 · 匠人手作区',
    descEn: 'Local textile historians demonstrate 19th-century teardrop jacquard motifs on restored handlooms.',
    descZh: '本地织造匠人现场演示 19 世纪佩斯利经典涡旋提花织布技艺。',
    tagEn: 'Local Craft',
    tagZh: '在地非遗'
  },
  {
    id: 'evt-3',
    slot: 'evening',
    time: '17:30 — 19:00',
    titleEn: 'Paisley Abbey Candlelight Choir & Brass',
    titleZh: '佩斯利修道院烛光合唱与铜管乐夜',
    zoneEn: 'Central Circular Stage',
    zoneZh: '中央圆形演出舞台',
    descEn: 'Acoustic carols and Bavarian brass fanfares echoing against the illuminated 1163 sandstone arches.',
    descZh: '在 1163 年历史砂岩拱门映照下，奏响巴伐利亚铜管乐与冬夜颂歌。',
    tagEn: 'Live Music',
    tagZh: '冬夜演出'
  },
  {
    id: 'evt-4',
    slot: 'evening',
    time: '19:30 — 21:00',
    titleEn: 'County Square Lantern Procession',
    titleZh: '郡广场冬夜提灯巡游与灯光秀',
    zoneEn: 'Zone C · County Square Promenade',
    zoneZh: 'C区 · 郡广场主干道',
    descEn: 'Community-crafted paper lanterns and architectural projection mapping across the Abbey façade.',
    descZh: '手工冬日提灯巡游与修道院建筑立面光影艺术投影。',
    tagEn: 'Signature Night',
    tagZh: '压轴盛典'
  }
];

interface Props {
  lang: Lang;
}

export const FestiveProgramme: React.FC<Props> = ({ lang }) => {
  const [filter, setFilter] = useState<'all' | 'afternoon' | 'evening'>('all');
  const isZh = lang === 'zh';

  const items = filter === 'all' ? PROGRAMME : PROGRAMME.filter((e) => e.slot === filter);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400 font-semibold flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" />
            {isZh ? '03 · 德式传统与苏格兰冬夜盛典' : '03 · GERMAN-SCOTTISH HERITAGE PROGRAMME'}
          </p>
          <h2 className="font-serif text-4xl font-semibold mt-1">
            {isZh ? '每日舞台演出与文化日程' : 'Daily Stage & Cultural Timetable'}
          </h2>
        </div>

        <div className="inline-flex p-1 rounded-full glass-pill text-xs font-semibold">
          {[
            { id: 'all', en: 'Full Day', zh: '全天日程' },
            { id: 'afternoon', en: 'Afternoon', zh: '午后工坊' },
            { id: 'evening', en: 'Winter Evening', zh: '冬夜盛典' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full transition ${
                filter === tab.id
                  ? 'bg-gold-500 text-pine-950 shadow-sm'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              {isZh ? tab.zh : tab.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((evt) => (
          <div
            key={evt.id}
            className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-gold-500/60 transition"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-gold-600 dark:text-gold-400">
                  <Clock className="w-3.5 h-3.5" /> {evt.time}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-burgundy-800/15 dark:bg-burgundy-800/40 text-burgundy-800 dark:text-gold-400 border border-burgundy-800/25 font-semibold inline-flex items-center gap-1">
                  {evt.slot === 'evening' ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                  {isZh ? evt.tagZh : evt.tagEn}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold">
                {isZh ? evt.titleZh : evt.titleEn}
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {isZh ? evt.descZh : evt.descEn}
              </p>
            </div>
            <div className="pt-3 border-t border-stone-900/10 dark:border-gold-500/20 text-xs opacity-75 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>{isZh ? evt.zoneZh : evt.zoneEn}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

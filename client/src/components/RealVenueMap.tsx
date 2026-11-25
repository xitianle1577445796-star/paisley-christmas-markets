import React, { useEffect, useState } from 'react';
import { MapPin, Train, Navigation, ExternalLink, Compass, Eye } from 'lucide-react';
import { Lang } from '../i18n';

interface Landmark {
  id: string;
  nameEn: string;
  nameZh: string;
  walkEn: string;
  walkZh: string;
  lat: number;
  lon: number;
}

const VENUE_LANDMARKS: Record<string, Landmark[]> = {
  paisley_christmas: [
    {
      id: 'abbey',
      nameEn: 'Paisley Abbey (Main Market)',
      nameZh: '佩斯利修道院（集市主广场）',
      walkEn: '0 min · Event Centre',
      walkZh: '0 分钟 · 核心主会场',
      lat: 55.8450,
      lon: -4.4202
    },
    {
      id: 'station',
      nameEn: 'Paisley Gilmour St Station',
      nameZh: '佩斯利吉尔摩街火车站',
      walkEn: '4 min walk · 10 min to Glasgow',
      walkZh: '步行 4 分钟 · 10 分钟直达格拉斯哥',
      lat: 55.8473,
      lon: -4.4237
    },
    {
      id: 'county',
      nameEn: 'County Square Promenade',
      nameZh: '郡广场商业步行区',
      walkEn: '3 min walk · Zone C Entrance',
      walkZh: '步行 3 分钟 · C区入口',
      lat: 55.8464,
      lon: -4.4233
    },
    {
      id: 'uws',
      nameEn: 'UWS Paisley Campus',
      nameZh: '西苏格兰大学 (UWS) 佩斯利校区',
      walkEn: '8 min walk · Student Route',
      walkZh: '步行 8 分钟 · 校园直达路线',
      lat: 55.8438,
      lon: -4.4302
    }
  ],
  glasgow_autumn: [
    {
      id: 'kelvingrove',
      nameEn: 'Kelvingrove Bandstand',
      nameZh: '凯文格罗夫露天剧场',
      walkEn: '0 min · Main Fair',
      walkZh: '0 分钟 · 主会场',
      lat: 55.8698,
      lon: -4.2877
    },
    {
      id: 'kelvinhall',
      nameEn: 'Kelvinhall Subway Station',
      nameZh: 'Kelvinhall 地铁站',
      walkEn: '6 min walk · Subway Loop',
      walkZh: '步行 6 分钟 · 地铁环线',
      lat: 55.8712,
      lon: -4.2995
    }
  ],
  edinburgh_fringe: [
    {
      id: 'george',
      nameEn: 'George Square Gardens',
      nameZh: '乔治广场花园',
      walkEn: '0 min · Makers Market',
      walkZh: '0 分钟 · 市集主会场',
      lat: 55.9440,
      lon: -3.1892
    },
    {
      id: 'waverley',
      nameEn: 'Edinburgh Waverley Station',
      nameZh: '爱丁堡韦弗利火车站',
      walkEn: '12 min walk · National Rail',
      walkZh: '步行 12 分钟 · 国家铁路枢纽',
      lat: 55.9520,
      lon: -3.1883
    }
  ]
};

interface Props {
  presetKey: string;
  darkMode: boolean;
  lang: Lang;
}

export const RealVenueMap: React.FC<Props> = ({ presetKey, darkMode, lang }) => {
  const landmarks = VENUE_LANDMARKS[presetKey] || VENUE_LANDMARKS.paisley_christmas;
  const [active, setActive] = useState<Landmark>(landmarks[0]);
  const [nightMapTint, setNightMapTint] = useState<boolean>(true);

  useEffect(() => {
    setActive(landmarks[0]);
  }, [presetKey]);

  const delta = 0.0045;
  const bbox = `${active.lon - delta},${active.lat - delta},${active.lon + delta},${active.lat + delta}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${active.lat},${active.lon}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lon}`;

  const isZh = lang === 'zh';

  return (
    <div className="glass-card rounded-3xl p-5 md:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            {isZh ? '真实地理坐标与交通导览 (OpenStreetMap)' : 'Live Street Map & Transit Guide (OpenStreetMap)'}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold mt-0.5">
            {isZh ? '真实街景地图与周边地标' : 'Real-World Venue Map & Landmarks'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {darkMode && (
            <button
              onClick={() => setNightMapTint(!nightMapTint)}
              className="glass-pill px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:border-gold-500 transition"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              {nightMapTint
                ? isZh ? '还原地图原色' : 'Original Map Colors'
                : isZh ? '暗夜护眼地图' : 'Night Map Tint'}
            </button>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500 text-pine-950 hover:bg-gold-400 inline-flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            {isZh ? '在 Google Maps 导航' : 'Open in Google Maps'}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Interactive Landmark Selector */}
        <div className="lg:col-span-4 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2.5">
            {landmarks.map((lm) => {
              const isSelected = active.id === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => setActive(lm)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gold-500/15 border-gold-500 ring-1 ring-gold-500/40'
                      : 'bg-stone-900/[0.03] dark:bg-white/[0.03] border-stone-900/10 dark:border-white/10 hover:border-gold-500/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    {lm.id.includes('station') || lm.id.includes('waverley') || lm.id.includes('kelvinhall') ? (
                      <Train className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">
                      {isZh ? lm.nameZh : lm.nameEn}
                    </p>
                    <p className="text-xs opacity-70 mt-0.5">{isZh ? lm.walkZh : lm.walkEn}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-900/[0.04] dark:bg-white/[0.04] border border-stone-900/10 dark:border-gold-500/20 text-xs space-y-1">
            <p className="font-semibold text-gold-600 dark:text-gold-400">
              {isZh ? '当前定位坐标 (GPS)' : 'Active GPS Coordinates'}
            </p>
            <p className="font-mono opacity-80">
              {active.lat.toFixed(4)}° N, {Math.abs(active.lon).toFixed(4)}° W
            </p>
          </div>
        </div>

        {/* Real Embedded OpenStreetMap */}
        <div className="lg:col-span-8 min-h-[340px] rounded-2xl overflow-hidden border border-stone-900/15 dark:border-gold-500/30 relative">
          <iframe
            title="Real Paisley Venue Map"
            src={osmUrl}
            className="w-full h-full min-h-[340px] border-0 transition-all duration-300"
            style={
              darkMode && nightMapTint
                ? { filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }
                : undefined
            }
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

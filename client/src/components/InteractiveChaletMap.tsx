import React from 'react';
import { Chalet } from '../types';
import { Lang, TRANSLATIONS } from '../i18n';
import { MapPin, Zap, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  chalets: Chalet[];
  mode: 'visitor' | 'trader';
  selectedCode: string | null;
  onSelect: (chalet: Chalet) => void;
  accentColor: string;
  lang: Lang;
}

export const InteractiveChaletMap: React.FC<Props> = ({
  chalets,
  mode,
  selectedCode,
  onSelect,
  accentColor,
  lang
}) => {
  const t = TRANSLATIONS[lang].map;
  const selected = chalets.find((c) => c.code === selectedCode) || null;

  const getFill = (chalet: Chalet) => {
    if (chalet.code === selectedCode) return accentColor;
    if (chalet.status === 'available') return '#1B5E49';
    if (chalet.status === 'pending') return '#A16207';
    return '#6B1D2A';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Interactive SVG Map */}
      <div className="lg:col-span-8 glass-card rounded-3xl p-5 md:p-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
              {t.eyebrow}
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold mt-0.5">
              {t.title}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1B5E49] inline-block ring-2 ring-emerald-500/30" /> {t.available}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#A16207] inline-block ring-2 ring-amber-500/30" /> {t.pending}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#6B1D2A] inline-block ring-2 ring-rose-500/30" /> {t.booked}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 640 495"
            className="w-full h-auto min-w-[520px] rounded-2xl bg-parchment-200/70 dark:bg-pine-950/90 border border-stone-900/15 dark:border-gold-500/25"
            role="img"
            aria-label={t.title}
          >
            <defs>
              <pattern id="grid-v2" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>
              <radialGradient id="stage-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="640" height="495" fill="url(#grid-v2)" />

            {/* Circular Compass Rose (Top-Right) */}
            <g transform="translate(588, 225)" opacity="0.6">
              <circle r="22" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" />
              <circle r="14" fill="none" stroke={accentColor} strokeWidth="0.8" />
              <text y="-26" textAnchor="middle" fill={accentColor} fontSize="9" fontWeight="700">N</text>
              <path d="M0 -12 L3 0 L0 12 L-3 0 Z" fill={accentColor} />
            </g>

            {/* Paisley Abbey Landmark Footprint */}
            <g opacity="0.92">
              <rect x="40" y="18" width="560" height="58" rx="12" fill="none" stroke={accentColor} strokeWidth="1.2" strokeDasharray="6 4" />
              <text x="320" y="52" textAnchor="middle" fill={accentColor} fontSize="13" letterSpacing="3" fontWeight="700">
                {t.abbeyFacade}
              </text>
            </g>

            {/* Zone Labels */}
            <text x="45" y="106" fill="currentColor" opacity="0.65" fontSize="11" letterSpacing="1.5" fontWeight="600">
              {t.zoneA}
            </text>
            <text x="45" y="256" fill="currentColor" opacity="0.65" fontSize="11" letterSpacing="1.5" fontWeight="600">
              {t.zoneB}
            </text>
            <text x="45" y="390" fill="currentColor" opacity="0.65" fontSize="11" letterSpacing="1.5" fontWeight="600">
              {t.zoneC}
            </text>

            {/* Central Circular Festive Stage Plaza */}
            <circle cx="320" cy="208" r="42" fill="url(#stage-glow)" />
            <circle cx="320" cy="208" r="24" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="320" cy="208" r="18" fill={accentColor} fillOpacity="0.18" />
            <text x="320" y="212" textAnchor="middle" fill={accentColor} fontSize="9.5" fontWeight="700">
              {t.stage}
            </text>

            {/* Chalet Nodes */}
            {chalets.map((chalet) => {
              const isSelected = chalet.code === selectedCode;
              const isClickable = mode === 'visitor' ? true : chalet.status === 'available';
              return (
                <g
                  key={chalet.code}
                  transform={`translate(${chalet.x}, ${chalet.y})`}
                  onClick={() => isClickable && onSelect(chalet)}
                  className={isClickable ? 'cursor-pointer transition-opacity hover:opacity-90' : 'cursor-not-allowed opacity-65'}
                >
                  <rect
                    width="92"
                    height="56"
                    rx="12"
                    fill={getFill(chalet)}
                    stroke={isSelected ? '#FFFFFF' : accentColor}
                    strokeWidth={isSelected ? 2.5 : 1}
                    strokeOpacity={isSelected ? 1 : 0.5}
                  />
                  <text x="46" y="24" textAnchor="middle" fill="#FAF8F4" fontSize="14" fontWeight="700">
                    {chalet.code}
                  </text>
                  <text x="46" y="42" textAnchor="middle" fill="#FAF8F4" fillOpacity="0.9" fontSize="10">
                    {chalet.status === 'booked'
                      ? t.booked
                      : chalet.status === 'pending'
                        ? t.pending
                        : `£${chalet.fee}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Inspector Sidebar */}
      <div className="lg:col-span-4 glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-gold-600 dark:text-gold-400 font-semibold">
            {mode === 'trader' ? t.inspectorTrader : t.inspectorVisitor}
          </span>
          <MapPin className="w-4 h-4 text-gold-500" />
        </div>

        {!selected ? (
          <div className="py-10 text-center space-y-3 text-stone-600 dark:text-parchment-200/75">
            <div className="w-12 h-12 rounded-full mx-auto border border-gold-500/40 flex items-center justify-center bg-gold-500/10">
              <Sparkles className="w-5 h-5 text-gold-500" />
            </div>
            <p className="text-sm leading-relaxed">
              {mode === 'trader' ? t.emptyTrader : t.emptyVisitor}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-stone-900/15 dark:border-gold-500/20 pb-3">
              <div>
                <h4 className="font-serif text-3xl font-bold">
                  {lang === 'zh' ? `${selected.code} ${t.chaletLabel}` : `${t.chaletLabel} ${selected.code}`}
                </h4>
                <p className="text-xs text-stone-600 dark:text-parchment-200/75">{selected.zone}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  selected.status === 'available'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : selected.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'bg-burgundy-800/20 text-burgundy-800 dark:text-rose-300'
                }`}
              >
                {selected.status === 'available'
                  ? t.available
                  : selected.status === 'pending'
                    ? t.pending
                    : t.booked}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-2xl bg-stone-900/[0.04] dark:bg-white/[0.04] border border-stone-900/10 dark:border-white/10">
                <p className="text-xs opacity-65">{t.dimensions}</p>
                <p className="font-semibold mt-0.5">{selected.size}</p>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/[0.04] dark:bg-white/[0.04] border border-stone-900/10 dark:border-white/10">
                <p className="text-xs opacity-65">{t.fee}</p>
                <p className="font-semibold mt-0.5">£{selected.fee}</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider opacity-65 mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-gold-500" /> {t.utilities}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.utilities.map((u) => (
                  <span
                    key={u}
                    className="px-2.5 py-1 rounded-full text-xs bg-gold-500/15 text-stone-800 dark:text-gold-400 border border-gold-500/30"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {selected.trader ? (
              <div className="p-4 rounded-2xl bg-burgundy-800/10 dark:bg-burgundy-900/40 border border-burgundy-800/25 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-burgundy-800 dark:text-gold-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t.confirmedTrader}
                </p>
                <p className="font-serif text-xl font-bold">{selected.trader.businessName}</p>
                <p className="text-xs opacity-85 leading-relaxed">{selected.trader.description}</p>
                <p className="text-xs font-semibold pt-1 text-gold-600 dark:text-gold-400">
                  {t.signature}: {selected.trader.signatureItem}
                </p>
              </div>
            ) : selected.status === 'pending' ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{t.pendingNotice}</span>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                {t.availableNotice}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

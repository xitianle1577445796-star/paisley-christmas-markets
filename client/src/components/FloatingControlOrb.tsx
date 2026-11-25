import React, { useState } from 'react';
import { Sun, Moon, Languages, SlidersHorizontal, X, RotateCcw, Snowflake } from 'lucide-react';
import { Lang, TRANSLATIONS } from '../i18n';
import { SnowIntensity } from './AmbientWinterCanvas';

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  brightness: number;
  setBrightness: (b: number) => void;
  snowIntensity: SnowIntensity;
  setSnowIntensity: (s: SnowIntensity) => void;
  accentColor: string;
}

export const FloatingControlOrb: React.FC<Props> = ({
  lang,
  setLang,
  darkMode,
  setDarkMode,
  brightness,
  setBrightness,
  snowIntensity,
  setSnowIntensity,
  accentColor
}) => {
  const [open, setOpen] = useState(false);
  const t = TRANSLATIONS[lang].controls;
  const isZh = lang === 'zh';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 sm:w-80 glass-card rounded-3xl p-5 space-y-5 shadow-2xl border-gold-500/45">
          <div className="flex items-center justify-between border-b border-stone-900/10 dark:border-gold-500/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-400">
              {t.title}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-stone-900/10 dark:hover:bg-white/10 transition"
              aria-label="Close control panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Language Switcher */}
          <div className="space-y-2">
            <p className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-gold-500" /> {t.language}
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-stone-900/5 dark:bg-white/5 border border-stone-900/10 dark:border-gold-500/20">
              <button
                onClick={() => setLang('en')}
                className={`py-1.5 rounded-full text-xs font-semibold transition ${
                  lang === 'en' ? 'bg-gold-500 text-pine-950 shadow-sm' : 'hover:bg-stone-900/5 dark:hover:bg-white/10'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`py-1.5 rounded-full text-xs font-semibold transition ${
                  lang === 'zh' ? 'bg-gold-500 text-pine-950 shadow-sm' : 'hover:bg-stone-900/5 dark:hover:bg-white/10'
                }`}
              >
                简体中文
              </button>
            </div>
          </div>

          {/* 2. Day / Night Mode */}
          <div className="space-y-2">
            <p className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
              {darkMode ? <Moon className="w-3.5 h-3.5 text-gold-500" /> : <Sun className="w-3.5 h-3.5 text-gold-600" />}
              {t.theme}
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-stone-900/5 dark:bg-white/5 border border-stone-900/10 dark:border-gold-500/20">
              <button
                onClick={() => setDarkMode(false)}
                className={`py-1.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition ${
                  !darkMode ? 'bg-gold-500 text-pine-950 shadow-sm' : 'hover:bg-stone-900/5 dark:hover:bg-white/10'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> {t.day}
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`py-1.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition ${
                  darkMode ? 'bg-gold-500 text-pine-950 shadow-sm' : 'hover:bg-stone-900/5 dark:hover:bg-white/10'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> {t.night}
              </button>
            </div>
          </div>

          {/* 3. Snowfall Atmosphere Control */}
          <div className="space-y-2">
            <p className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-gold-500" />
              {isZh ? '冬夜雪景氛围' : 'Snowfall Atmosphere'}
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-full bg-stone-900/5 dark:bg-white/5 border border-stone-900/10 dark:border-gold-500/20">
              {[
                { id: 'gentle', en: 'Gentle', zh: '微雪' },
                { id: 'festive', en: 'Festive', zh: '纷飞' },
                { id: 'off', en: 'Off', zh: '关闭' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSnowIntensity(opt.id as SnowIntensity)}
                  className={`py-1.5 rounded-full text-xs font-semibold transition ${
                    snowIntensity === opt.id
                      ? 'bg-gold-500 text-pine-950 shadow-sm'
                      : 'hover:bg-stone-900/5 dark:hover:bg-white/10'
                  }`}
                >
                  {isZh ? opt.zh : opt.en}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Brightness Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold opacity-75">{t.brightness}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gold-600 dark:text-gold-400">
                  {Math.round(brightness * 100)}%
                </span>
                {brightness !== 1 && (
                  <button
                    onClick={() => setBrightness(1)}
                    className="text-[11px] opacity-70 hover:opacity-100 inline-flex items-center gap-0.5 underline"
                  >
                    <RotateCcw className="w-3 h-3" /> {t.reset}
                  </button>
                )}
              </div>
            </div>
            <input
              type="range"
              min={0.75}
              max={1.15}
              step={0.05}
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              className="w-full accent-[#C9A66B] cursor-pointer"
              aria-label="Adjust screen brightness"
            />
          </div>
        </div>
      )}

      {/* Signature Circular Floating Orb Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open visual controls"
        className="group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-105 focus:outline-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accentColor}, #6B1D2A)`
        }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-parchment-100/55 animate-slow-spin pointer-events-none" />
        <SlidersHorizontal className="w-5 h-5 text-parchment-100 relative z-10 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

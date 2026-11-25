import React, { useEffect, useState } from 'react';
import { api } from './api';
import { ActiveTab, Chalet, SiteConfig, Trader } from './types';
import { Lang, TRANSLATIONS } from './i18n';
import { AmbientWinterCanvas, SnowIntensity } from './components/AmbientWinterCanvas';
import { InteractiveChaletMap } from './components/InteractiveChaletMap';
import { RealVenueMap } from './components/RealVenueMap';
import { FestiveProgramme } from './components/FestiveProgramme';
import { ApplicationTrackerCard } from './components/ApplicationTrackerCard';
import { TraderApplicationForm } from './components/TraderApplicationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { GdprPortal } from './components/GdprPortal';
import { FloatingControlOrb } from './components/FloatingControlOrb';
import {
  Sun,
  Moon,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Store,
  ShieldCheck,
  Lock,
  Compass,
  Cookie,
  Languages,
  Heart,
  Map,
  Layers,
  CloudSnow,
  Users,
  X
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pcm_theme');
    return saved ? saved === 'dark' : true;
  });
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('pcm_lang');
    return saved === 'zh' ? 'zh' : 'en';
  });
  const [brightness, setBrightness] = useState<number>(() => {
    const saved = localStorage.getItem('pcm_brightness');
    return saved ? parseFloat(saved) : 1;
  });
  const [snowIntensity, setSnowIntensity] = useState<SnowIntensity>(() => {
    const saved = localStorage.getItem('pcm_snow') as SnowIntensity | null;
    return saved && ['gentle', 'festive', 'off'].includes(saved) ? saved : 'festive';
  });

  const [mapViewMode, setMapViewMode] = useState<'blueprint' | 'real'>('blueprint');

  const [savedTrailIds, setSavedTrailIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pcm_festive_trail');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [trailOpen, setTrailOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [presets, setPresets] = useState<SiteConfig[]>([]);
  const [dbMode, setDbMode] = useState<string>('');
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedChalet, setSelectedChalet] = useState<Chalet | null>(null);
  const [cookieAccepted, setCookieAccepted] = useState<boolean>(
    () => localStorage.getItem('pcm_cookie_consent') === 'true'
  );

  const t = TRANSLATIONS[lang];
  const isZh = lang === 'zh';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pcm_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pcm_lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.style.setProperty('--ui-brightness', String(brightness));
    localStorage.setItem('pcm_brightness', String(brightness));
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('pcm_snow', snowIntensity);
  }, [snowIntensity]);

  useEffect(() => {
    localStorage.setItem('pcm_festive_trail', JSON.stringify(savedTrailIds));
  }, [savedTrailIds]);

  const toggleTrailTrader = (id: string) => {
    setSavedTrailIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchAll = async () => {
    try {
      const [cfgRes, chaletList, traderList] = await Promise.all([
        api.getConfig(),
        api.getChalets(),
        api.getPublicTraders()
      ]);
      setConfig(cfgRes.config);
      setPresets(cfgRes.presets || []);
      setDbMode(cfgRes.database || 'Connected');
      setChalets(chaletList);
      setTraders(traderList);
    } catch (err) {
      console.error('API load error:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pine-950 text-parchment-100">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full border border-gold-500/40 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gold-500 animate-pulse" />
          </div>
          <p className="font-serif text-2xl tracking-wider">ABBEY NOËL · Paisley...</p>
        </div>
      </div>
    );
  }

  const isPaisleyDefault = config.presetKey === 'paisley_christmas';
  const displayBrand = isPaisleyDefault
    ? isZh
      ? 'ABBEY NOËL · 修道院冬夜'
      : 'ABBEY NOËL · PAISLEY'
    : config.brandName;

  const filteredTraders =
    categoryFilter === 'All' ? traders : traders.filter((tr) => tr.category === categoryFilter);
  const availableCount = chalets.filter((c) => c.status === 'available').length;
  const bookedCount = chalets.filter((c) => c.status === 'booked').length;
  const trailTraders = traders.filter((tr) => savedTrailIds.includes(tr.id));

  const categoryButtons = [
    { key: 'All', label: t.directory.all },
    { key: 'Food & Drink', label: t.directory.food },
    { key: 'Artisan & Crafts', label: t.directory.craft },
    { key: 'Gifts & Heritage', label: t.directory.gifts }
  ];

  return (
    <div className="brightness-stage min-h-screen paisley-watermark flex flex-col relative">
      {/* 3-Layer Cinematic Crystalline Snowfall & Golden Embers */}
      <AmbientWinterCanvas darkMode={darkMode} intensity={snowIntensity} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-parchment-100/80 dark:bg-pine-950/80 border-b border-stone-900/15 dark:border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-3 text-left group"
          >
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-lg text-pine-950 ring-2 ring-gold-500/50 group-hover:scale-105 transition shadow-md"
              style={{ backgroundColor: config.theme.accent }}
            >
              A
            </span>
            <div>
              <p className="font-serif text-xl font-bold leading-none tracking-wide">
                {config.eventTitle}
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold-600 dark:text-gold-400 font-semibold mt-0.5">
                {displayBrand}
              </p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {[
              { id: 'discover', label: t.nav.discover, icon: Compass },
              { id: 'apply', label: t.nav.apply, icon: Store },
              { id: 'admin', label: t.nav.admin, icon: Lock },
              { id: 'gdpr', label: t.nav.gdpr, icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full transition ${
                    isActive
                      ? 'bg-gold-500/20 text-stone-950 dark:text-gold-400 font-semibold border border-gold-500/35'
                      : 'opacity-75 hover:opacity-100 hover:bg-stone-900/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTrailOpen(true)}
              className="glass-pill px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:border-gold-500 transition relative"
              title={isZh ? '我的冬日打卡清单' : 'My Festive Trail'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  savedTrailIds.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-gold-600 dark:text-gold-400'
                }`}
              />
              <span className="hidden sm:inline">{isZh ? '打卡路线' : 'My Trail'}</span>
              {savedTrailIds.length > 0 && (
                <span className="px-1.5 rounded-full bg-gold-500 text-pine-950 text-[10px] font-bold">
                  {savedTrailIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="glass-pill px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:border-gold-500 transition"
              title="Switch Language / 切换中英文"
            >
              <Languages className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
              <span>{lang === 'en' ? '中文' : 'EN'}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle day and night theme"
              className="glass-pill w-9 h-9 rounded-full flex items-center justify-center hover:border-gold-500 transition"
              title={darkMode ? t.controls.day : t.controls.night}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-gold-400" />
              ) : (
                <Moon className="w-4 h-4 text-pine-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex lg:hidden border-t border-stone-900/10 dark:border-gold-500/15 px-2 py-1.5 justify-around text-xs font-medium">
          {[
            { id: 'discover', label: t.nav.discover },
            { id: 'apply', label: t.nav.apply },
            { id: 'admin', label: t.nav.admin },
            { id: 'gdpr', label: t.nav.gdpr }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-3 py-1.5 rounded-full ${
                activeTab === tab.id ? 'bg-gold-500/20 font-semibold' : 'opacity-70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-14">
        {activeTab === 'discover' && (
          <>
            {/* Live Market Telemetry Strip */}
            <div className="glass-pill rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isZh
                    ? 'ABBEY NOËL · 2026 佩斯利冬夜圣诞季 · 盛大启幕'
                    : 'ABBEY NOËL · Paisley Winter Season 2026 Live'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 opacity-85">
                <span className="inline-flex items-center gap-1.5">
                  <CloudSnow className="w-3.5 h-3.5 text-gold-500" />
                  {isZh ? '佩斯利 2°C · 瑞雪初降' : 'Paisley 2°C · Light Snowfall'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold-500" />
                  {isZh ? '广场人流：舒适 (58%)' : 'Square Crowd: Moderate (58%)'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-gold-600 dark:text-gold-400">
                  {bookedCount}/{chalets.length} {isZh ? '木屋已入驻' : 'Chalets Booked'}
                </span>
              </div>
            </div>

            {/* Masterpiece Editorial Hero with Paisley Abbey Twilight Panorama & Glowing Market Chalets */}
            <section
              className="relative rounded-[2.25rem] overflow-hidden p-8 md:p-16 pb-28 md:pb-36 border border-gold-500/45 text-parchment-100 shadow-2xl"
              style={{
                background: `radial-gradient(circle at 78% 22%, ${config.theme.accent}35 0%, transparent 45%), radial-gradient(circle at 18% 85%, rgba(107, 29, 42, 0.55) 0%, transparent 50%), linear-gradient(145deg, #07130F 0%, ${config.theme.surfaceDark} 48%, ${config.theme.secondary} 100%)`
              }}
            >
              {/* Fine Editorial Hairline Frame */}
              <div className="absolute inset-4 rounded-[1.75rem] border border-gold-500/20 pointer-events-none z-20" />

              {/* Warm Festive Fairy-Light Garland Arc at Top */}
              <svg
                viewBox="0 0 1200 70"
                preserveAspectRatio="none"
                className="absolute top-0 left-0 w-full h-16 pointer-events-none opacity-80 z-10"
              >
                <path
                  d="M0 10 Q 300 60 600 18 T 1200 14"
                  fill="none"
                  stroke="#C9A66B"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                />
                {[90, 210, 340, 480, 620, 760, 900, 1040, 1130].map((cx, i) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy={i % 2 === 0 ? 34 : 24}
                    r={i % 3 === 0 ? 3.5 : 2.5}
                    fill="#F5D999"
                    className="animate-twinkle"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  />
                ))}
              </svg>

              {/* Hero Content Grid */}
              <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.22em] text-pine-950 shadow-md"
                      style={{ backgroundColor: config.theme.accent }}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {displayBrand}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] border border-gold-500/35 bg-white/[0.06] text-gold-400">
                      {config.theme.badgeText}
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.06] tracking-tight text-gold-foil">
                    {config.heroHeadline}
                  </h1>

                  <p className="text-base md:text-lg text-parchment-100/85 leading-relaxed max-w-2xl">
                    {config.heroSubheadline}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-7 py-3.5 rounded-full font-semibold text-sm text-pine-950 transition hover:scale-[1.02] shadow-xl"
                      style={{ backgroundColor: config.theme.accent }}
                    >
                      {t.hero.ctaApply} ({availableCount} {t.hero.openSuffix})
                    </button>
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="px-7 py-3.5 rounded-full font-semibold text-sm border border-parchment-100/35 bg-white/[0.07] backdrop-blur-md hover:bg-white/15 transition"
                    >
                      {t.hero.ctaAdmin}
                    </button>
                  </div>
                </div>

                {/* Signature Circular Heritage Medallion */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    <svg viewBox="0 0 260 260" className="absolute inset-0 w-full h-full animate-slow-spin opacity-90">
                      <circle cx="130" cy="130" r="122" fill="none" stroke={config.theme.accent} strokeWidth="1.2" strokeDasharray="4 6" />
                      <circle cx="130" cy="130" r="106" fill="none" stroke={config.theme.accent} strokeWidth="0.9" strokeOpacity="0.65" />
                    </svg>
                    <svg viewBox="0 0 260 260" className="absolute inset-0 w-full h-full animate-reverse-spin opacity-65">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <g key={deg} transform={`rotate(${deg} 130 130)`}>
                          <path d="M130 30 C142 52 142 74 130 88 C118 74 118 52 130 30 Z" fill="none" stroke={config.theme.accent} strokeWidth="1" />
                        </g>
                      ))}
                    </svg>
                    <div className="relative z-10 w-40 h-40 rounded-full bg-pine-950/75 backdrop-blur-md border border-gold-500/55 flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                      <span className="text-[9px] uppercase tracking-[0.22em] text-gold-400">
                        {t.hero.medallionTop}
                      </span>
                      <span className="font-serif text-3xl font-bold tracking-widest mt-1 text-gold-foil">
                        {t.hero.medallionCenter}
                      </span>
                      <span className="w-8 h-[1px] bg-gold-500/75 my-1.5" />
                      <span className="text-[10px] uppercase tracking-[0.16em] opacity-90">
                        {t.hero.medallionSub}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenic Winter Architectural Panorama: Paisley Abbey + Glowing Gothic Windows + Timber Chalets */}
              <svg
                viewBox="0 0 1200 170"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 w-full h-28 md:h-36 pointer-events-none z-10"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="abbey-sil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#091712" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#040B08" stopOpacity="0.98" />
                  </linearGradient>
                  <linearGradient id="warm-window" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE8A3" />
                    <stop offset="100%" stopColor="#C98A3A" />
                  </linearGradient>
                </defs>

                {/* Snow-covered gentle hills */}
                <path d="M0 170 L0 132 Q 300 108 600 128 T 1200 122 L1200 170 Z" fill="#0B1D17" opacity="0.75" />

                {/* Paisley Abbey Architectural Silhouette (Center-Right) */}
                <g fill="url(#abbey-sil)">
                  <path d="M620 170 V92 L650 64 L680 92 V170 Z" />
                  <path d="M680 170 V52 L725 14 L770 52 V170 Z" />
                  <path d="M770 170 V78 L805 48 L840 78 V170 Z" />
                  <rect x="840" y="96" width="90" height="74" />
                  {/* Pine trees */}
                  <path d="M120 170 L142 108 L164 170 Z M155 170 L172 122 L189 170 Z M970 170 L995 104 L1020 170 Z M1010 170 L1030 120 L1050 170 Z" />
                </g>

                {/* Glowing Gothic Lancet Windows on Paisley Abbey */}
                <g fill="url(#warm-window)" opacity="0.9">
                  <rect x="719" y="54" width="12" height="34" rx="6" />
                  <rect x="698" y="68" width="9" height="24" rx="4.5" />
                  <rect x="743" y="68" width="9" height="24" rx="4.5" />
                  <rect x="799" y="82" width="10" height="26" rx="5" />
                  <rect x="645" y="98" width="9" height="22" rx="4.5" />
                </g>

                {/* Warm Festive Timber Market Chalets (Left & Foreground) */}
                <g>
                  {[230, 330, 440, 1080].map((x) => (
                    <g key={x} transform={`translate(${x}, 116)`}>
                      <polygon points="-6,16 32,-2 70,16" fill="#182C25" stroke="#C9A66B" strokeOpacity="0.45" strokeWidth="1" />
                      <rect x="2" y="16" width="60" height="38" fill="#0E1C17" />
                      <rect x="14" y="24" width="36" height="16" rx="2" fill="url(#warm-window)" opacity="0.88" />
                    </g>
                  ))}
                </g>
              </svg>
            </section>

            {/* Bento Grid Info Strip */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-card rounded-3xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-65 font-semibold">{t.info.dates}</p>
                  <p className="font-serif text-2xl font-semibold mt-0.5">{config.dates}</p>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-65 font-semibold">{t.info.venue}</p>
                  <p className="font-serif text-xl font-semibold mt-0.5">{config.location}</p>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-65 font-semibold">{t.info.hours}</p>
                  <p className="font-serif text-xl font-semibold mt-0.5">{config.openingHours}</p>
                </div>
              </div>
            </section>

            {/* 01 · Dual Map Hub */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400 font-semibold">
                  {isZh ? '01 · 空间布局与真实地理导览' : '01 · SPATIAL MASTERPLAN & REAL GPS MAP'}
                </p>
                <div className="inline-flex p-1 rounded-full glass-pill">
                  <button
                    onClick={() => setMapViewMode('blueprint')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                      mapViewMode === 'blueprint'
                        ? 'bg-gold-500 text-pine-950 shadow-sm'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    {isZh ? '木屋摊位交互平面图' : 'Interactive Chalet Blueprint'}
                  </button>
                  <button
                    onClick={() => setMapViewMode('real')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                      mapViewMode === 'real'
                        ? 'bg-gold-500 text-pine-950 shadow-sm'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    {isZh ? '真实街景地图 (OpenStreetMap)' : 'Real Street Map (GPS)'}
                  </button>
                </div>
              </div>

              {mapViewMode === 'blueprint' ? (
                <InteractiveChaletMap
                  chalets={chalets}
                  mode="visitor"
                  selectedCode={selectedChalet?.code || null}
                  onSelect={setSelectedChalet}
                  accentColor={config.theme.accent}
                  lang={lang}
                />
              ) : (
                <RealVenueMap presetKey={config.presetKey} darkMode={darkMode} lang={lang} />
              )}
            </section>

            {/* 02 · Curated Live Trader Directory */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400 font-semibold">
                    02 · {t.directory.eyebrow}
                  </p>
                  <h2 className="font-serif text-4xl font-semibold mt-1">{t.directory.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryButtons.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setCategoryFilter(cat.key)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                        categoryFilter === cat.key
                          ? 'bg-gold-500 text-pine-950 shadow-sm'
                          : 'glass-pill hover:border-gold-500'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTraders.map((trader) => {
                  const isSaved = savedTrailIds.includes(trader.id);
                  return (
                    <article
                      key={trader.id}
                      className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-gold-500/60 transition duration-300"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-3 py-0.5 rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400 font-semibold border border-gold-500/25">
                            {trader.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold opacity-80">
                              {t.directory.chaletPrefix} {trader.chaletCode}
                            </span>
                            <button
                              onClick={() => toggleTrailTrader(trader.id)}
                              aria-label="Save to My Festive Trail"
                              className="p-1.5 rounded-full hover:bg-stone-900/10 dark:hover:bg-white/10 transition"
                            >
                              <Heart
                                className={`w-4 h-4 transition ${
                                  isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'opacity-60 hover:opacity-100'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-serif text-2xl font-bold">{trader.businessName}</h3>
                        <p className="text-sm opacity-85 leading-relaxed">{trader.description}</p>
                      </div>
                      <div className="pt-3 border-t border-stone-900/10 dark:border-gold-500/20 text-xs flex items-center justify-between">
                        <span className="font-semibold text-gold-600 dark:text-gold-400">
                          ★ {trader.signatureItem}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* 03 · German-Scottish Festive Programme */}
            <FestiveProgramme lang={lang} />
          </>
        )}

        {activeTab === 'apply' && (
          <div className="space-y-8">
            <ApplicationTrackerCard lang={lang} />
            <InteractiveChaletMap
              chalets={chalets}
              mode="trader"
              selectedCode={selectedChalet?.code || null}
              onSelect={setSelectedChalet}
              accentColor={config.theme.accent}
              lang={lang}
            />
            <TraderApplicationForm
              chalets={chalets}
              selectedChalet={selectedChalet}
              onSelectChalet={setSelectedChalet}
              onSubmitted={() => {
                setSelectedChalet(null);
                fetchAll();
              }}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            config={config}
            presets={presets}
            chalets={chalets}
            dbMode={dbMode}
            onDataMutated={fetchAll}
            lang={lang}
          />
        )}

        {activeTab === 'gdpr' && <GdprPortal onErased={fetchAll} lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-900/15 dark:border-gold-500/20 py-8 text-xs opacity-75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 {displayBrand} · {t.footer.copy}</p>
          <p>{t.footer.stack} {dbMode}</p>
        </div>
      </footer>

      {/* My Festive Trail Slide-Over Drawer */}
      {trailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-parchment-100 dark:bg-pine-950 border-l border-gold-500/30 p-6 flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-900/15 dark:border-gold-500/20 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
                    {isZh ? '个性化游览路线' : 'Personal Visit Planner'}
                  </p>
                  <h3 className="font-serif text-2xl font-bold">
                    {isZh ? '我的冬日打卡清单' : 'My Festive Trail'}
                  </h3>
                </div>
                <button
                  onClick={() => setTrailOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-900/10 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {trailTraders.length === 0 ? (
                <div className="py-16 text-center space-y-2 opacity-70 text-sm">
                  <Heart className="w-8 h-8 mx-auto text-gold-500/60" />
                  <p>
                    {isZh
                      ? '点击任意摊位卡片右上角的爱心，即可将必逛摊位加入你的专属路线。'
                      : 'Tap the heart icon on any trader card to build your personal market visit route.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trailTraders.map((tr) => (
                    <div
                      key={tr.id}
                      className="p-4 rounded-2xl glass-card flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-gold-600 dark:text-gold-400">
                          {t.directory.chaletPrefix} {tr.chaletCode} · {tr.category}
                        </span>
                        <p className="font-serif text-lg font-bold">{tr.businessName}</p>
                        <p className="text-xs opacity-75 mt-0.5">★ {tr.signatureItem}</p>
                      </div>
                      <button
                        onClick={() => toggleTrailTrader(tr.id)}
                        className="text-xs text-rose-500 hover:underline shrink-0"
                      >
                        {isZh ? '移除' : 'Remove'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setTrailOpen(false)}
              className="w-full py-3 rounded-full bg-gold-500 text-pine-950 font-semibold text-sm hover:bg-gold-400 transition mt-4"
            >
              {isZh ? '继续探索集市' : 'Continue Exploring'}
            </button>
          </div>
        </div>
      )}

      {/* Circular Floating Visual Studio Orb (Language + Day/Night + Snowfall + Brightness) */}
      <FloatingControlOrb
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        brightness={brightness}
        setBrightness={setBrightness}
        snowIntensity={snowIntensity}
        setSnowIntensity={setSnowIntensity}
        accentColor={config.theme.accent}
      />

      {/* UK GDPR Cookie Consent Banner */}
      {!cookieAccepted && (
        <div className="fixed bottom-4 left-4 right-20 md:right-auto md:max-w-md z-40 glass-card rounded-3xl p-5 shadow-2xl border-gold-500/40">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-sm">{t.cookie.title}</p>
              <p className="opacity-85 leading-relaxed">{t.cookie.desc}</p>
              <button
                onClick={() => {
                  localStorage.setItem('pcm_cookie_consent', 'true');
                  setCookieAccepted(true);
                }}
                className="px-4 py-1.5 rounded-full bg-gold-500 text-pine-950 font-semibold hover:bg-gold-400 transition"
              >
                {t.cookie.btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

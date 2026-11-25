import React, { useState } from 'react';
import { api } from '../api';
import { Lang, TRANSLATIONS } from '../i18n';
import { ShieldCheck, Download, Trash2, AlertCircle } from 'lucide-react';

interface Props {
  onErased: () => void;
  lang: Lang;
}

export const GdprPortal: React.FC<Props> = ({ onErased, lang }) => {
  const t = TRANSLATIONS[lang].gdpr;
  const [email, setEmail] = useState('lukas@stollensourdough.co.uk');
  const [referenceCode, setReferenceCode] = useState('PCM-9001');
  const [exportedData, setExportedData] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await api.gdprExport(email, referenceCode);
      setExportedData(res);
    } catch (err: any) {
      setExportedData(null);
      setError(err.message);
    }
  };

  const handleErase = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await api.gdprErase(email, referenceCode);
      setExportedData(null);
      setMessage(res.message);
      onErased();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/35 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
            {t.eyebrow}
          </p>
          <h3 className="font-serif text-3xl font-semibold">{t.title}</h3>
          <p className="text-sm opacity-75 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">{t.refCode}</label>
          <input
            type="text"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 text-pine-950 font-semibold text-sm hover:bg-gold-400 transition"
        >
          <Download className="w-4 h-4" /> {t.exportBtn}
        </button>
        <button
          onClick={handleErase}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-800 text-white font-semibold text-sm hover:bg-burgundy-700 transition"
        >
          <Trash2 className="w-4 h-4" /> {t.eraseBtn}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-sm">
          {message}
        </div>
      )}

      {exportedData && (
        <pre className="p-4 rounded-2xl bg-stone-950 text-parchment-100 text-xs overflow-x-auto max-h-72 border border-gold-500/30">
          {JSON.stringify(exportedData, null, 2)}
        </pre>
      )}
    </div>
  );
};

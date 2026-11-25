import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { Lang } from '../i18n';

interface Props {
  lang: Lang;
}

export const ApplicationTrackerCard: React.FC<Props> = ({ lang }) => {
  const isZh = lang === 'zh';
  const [email, setEmail] = useState('lukas@stollensourdough.co.uk');
  const [refCode, setRefCode] = useState('PCM-9001');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.gdprExport(email, refCode);
      setResult(res.personalData);
    } catch (err: any) {
      setResult(null);
      setError(err.message || 'Record not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
          {isZh ? '实时进度追踪' : 'Live Application Tracker'}
        </p>
        <h3 className="font-serif text-2xl font-semibold mt-0.5">
          {isZh ? '查询您的摊位审批状态' : 'Check Your Chalet Approval Status'}
        </h3>
      </div>

      <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="trader@example.co.uk"
          className="md:col-span-5 rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm"
        />
        <input
          type="text"
          required
          value={refCode}
          onChange={(e) => setRefCode(e.target.value)}
          placeholder="PCM-9001"
          className="md:col-span-4 rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-3 rounded-xl bg-gold-500 text-pine-950 font-semibold text-sm hover:bg-gold-400 transition inline-flex items-center justify-center gap-1.5 py-2.5"
        >
          <Search className="w-4 h-4" />
          {isZh ? '查询进度' : 'Track Status'}
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-4 rounded-2xl bg-stone-900/[0.04] dark:bg-white/[0.04] border border-gold-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl font-bold">{result.businessName}</p>
            <p className="text-xs opacity-75">
              Chalet <strong className="font-mono">{result.chaletCode}</strong> · {result.category} · Ref:{' '}
              <span className="font-mono">{result.referenceCode}</span>
            </p>
          </div>
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1.5 ${
              result.status === 'approved'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : result.status === 'pending'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            }`}
          >
            {result.status === 'approved' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : result.status === 'pending' ? (
              <Clock className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {result.status}
          </span>
        </div>
      )}
    </div>
  );
};

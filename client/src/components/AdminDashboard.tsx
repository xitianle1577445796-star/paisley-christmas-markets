import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Chalet, SiteConfig, Trader } from '../types';
import { Lang, TRANSLATIONS } from '../i18n';
import {
  Lock,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  LogOut,
  Layers,
  Database,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface Props {
  config: SiteConfig;
  presets: SiteConfig[];
  chalets: Chalet[];
  dbMode: string;
  onDataMutated: () => void;
  lang: Lang;
}

export const AdminDashboard: React.FC<Props> = ({
  config,
  presets,
  chalets,
  dbMode,
  onDataMutated,
  lang
}) => {
  const t = TRANSLATIONS[lang].admin;
  const isZh = lang === 'zh';
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('pcm_admin_token'));
  const [email, setEmail] = useState('admin@paisleymarkets.co.uk');
  const [password, setPassword] = useState('Paisley2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadTraders = async (authToken: string) => {
    try {
      const list = await api.getAdminTraders(authToken);
      setTraders(list);
    } catch {
      sessionStorage.removeItem('pcm_admin_token');
      setToken(null);
    }
  };

  useEffect(() => {
    if (token) loadTraders(token);
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.adminLogin(email, password);
      sessionStorage.setItem('pcm_admin_token', res.token);
      setToken(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    if (!token) return;
    await api.updateTraderStatus(token, id, status);
    setStatusMessage(
      isZh
        ? `申请 ${id} 已更新为 ${status.toUpperCase()}，前端目录与地图已实时同步。`
        : `Application ${id} updated to ${status.toUpperCase()} — live site synced.`
    );
    await loadTraders(token);
    onDataMutated();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await api.deleteTrader(token, id);
    setStatusMessage(
      isZh
        ? `记录 ${id} 已永久删除，对应木屋已释放为空闲状态。`
        : `Record ${id} deleted and chalet released.`
    );
    await loadTraders(token);
    onDataMutated();
  };

  const handlePresetSwitch = async (presetKey: string) => {
    if (!token) return;
    await api.updateSiteConfig(token, { presetKey });
    setStatusMessage(
      isZh
        ? `白标活动模板已成功切换为「${presetKey}」。`
        : `White-Label Event Template switched cleanly to "${presetKey}".`
    );
    onDataMutated();
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto glass-card rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-500">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-3xl font-semibold">{t.loginTitle}</h3>
          <p className="text-xs text-stone-600 dark:text-parchment-200/75">{t.loginSub}</p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300 text-xs">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gold-500 text-pine-950 font-semibold text-sm hover:bg-gold-400 transition shadow-md"
          >
            {t.signIn}
          </button>
        </form>
        <p className="text-[11px] text-center opacity-70">{t.demoHint}</p>
      </div>
    );
  }

  const pendingCount = traders.filter((item) => item.status === 'pending').length;
  const approvedCount = traders.filter((item) => item.status === 'approved').length;
  const bookedChalets = chalets.filter((c) => c.status === 'booked');
  const confirmedRevenue = bookedChalets.reduce((sum, c) => sum + c.fee, 0);
  const potentialRevenue = chalets.reduce((sum, c) => sum + c.fee, 0);
  const occupancyPct = chalets.length > 0 ? Math.round((bookedChalets.length / chalets.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
            {t.sessionPrefix} · {dbMode}
          </p>
          <h3 className="font-serif text-3xl font-semibold">{t.consoleTitle}</h3>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem('pcm_admin_token');
            setToken(null);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold glass-pill hover:border-gold-500"
        >
          <LogOut className="w-3.5 h-3.5" /> {t.signOut}
        </button>
      </div>

      {/* Commercial Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 space-y-1">
          <p className="text-xs uppercase tracking-wider opacity-65 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-gold-500" />
            {isZh ? '已确认摊位营收' : 'Confirmed Stall Revenue'}
          </p>
          <p className="font-serif text-3xl font-bold text-gold-600 dark:text-gold-400">
            £{confirmedRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] opacity-65">
            {isZh ? `满租潜能 £${potentialRevenue.toLocaleString()}` : `of £${potentialRevenue.toLocaleString()} capacity`}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-2">
          <p className="text-xs uppercase tracking-wider opacity-65 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-gold-500" />
            {isZh ? '木屋出租率' : 'Pitch Occupancy Rate'}
          </p>
          <p className="font-serif text-3xl font-bold">{occupancyPct}%</p>
          <div className="w-full h-1.5 rounded-full bg-stone-900/10 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full transition-all duration-500" style={{ width: `${occupancyPct}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-1">
          <p className="text-xs uppercase tracking-wider opacity-65">
            {isZh ? '待审批队列' : 'Pending Review Queue'}
          </p>
          <p className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </p>
          <p className="text-[11px] opacity-65">
            {isZh ? '等待管理员核准上架' : 'Awaiting director sign-off'}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-1">
          <p className="text-xs uppercase tracking-wider opacity-65">
            {isZh ? '当前激活租户' : 'Active White-Label Tenant'}
          </p>
          <p className="font-serif text-xl font-bold truncate">{config.eventTitle}</p>
          <p className="text-[11px] opacity-65">{config.theme.badgeText}</p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* White-Label Multi-Tenant Switcher */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400">
          <Layers className="w-5 h-5" />
          <h4 className="font-serif text-2xl font-semibold">{t.whiteLabelTitle}</h4>
        </div>
        <p className="text-sm opacity-75">{t.whiteLabelDesc}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => {
            const active = config.presetKey === preset.presetKey;
            return (
              <button
                key={preset.presetKey}
                onClick={() => handlePresetSwitch(preset.presetKey)}
                className={`text-left p-5 rounded-2xl border transition ${
                  active
                    ? 'border-gold-500 bg-gold-500/15 ring-1 ring-gold-500'
                    : 'border-stone-900/15 dark:border-white/15 hover:border-gold-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {preset.theme.badgeText}
                  </span>
                  <span
                    className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: preset.theme.accent }}
                  />
                </div>
                <p className="font-serif text-xl font-bold">{preset.eventTitle}</p>
                <p className="text-xs opacity-70 mt-1">{preset.dates}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trader Applications Pipeline */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gold-500" />
            <h4 className="font-serif text-2xl font-semibold">{t.pipelineTitle}</h4>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
              {pendingCount} {t.pendingBadge}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              {approvedCount} {t.approvedBadge}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-900/15 dark:border-gold-500/20 text-xs uppercase tracking-wider opacity-70">
                <th className="py-3 pr-4">{t.colPitch}</th>
                <th className="py-3 pr-4">{t.colBusiness}</th>
                <th className="py-3 pr-4">{t.colCategory}</th>
                <th className="py-3 pr-4">{t.colStatus}</th>
                <th className="py-3 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-900/10 dark:divide-white/10">
              {traders.map((item) => (
                <tr key={item.id} className="hover:bg-stone-900/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4 font-mono font-bold text-gold-600 dark:text-gold-400">
                    {item.chaletCode}
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold">{item.businessName}</p>
                    <p className="text-xs opacity-70">
                      {item.contactName} · {item.email} · Ref: {item.referenceCode}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 text-xs">{item.category}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2 whitespace-nowrap">
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.approve}
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500"
                      >
                        <XCircle className="w-3.5 h-3.5" /> {t.reject}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete record permanently"
                      className="inline-flex items-center p-1.5 rounded-full text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

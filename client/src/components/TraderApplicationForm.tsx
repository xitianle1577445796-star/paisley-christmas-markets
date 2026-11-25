import React, { useState } from 'react';
import { Chalet } from '../types';
import { Lang, TRANSLATIONS } from '../i18n';
import { api } from '../api';
import { CheckCircle2, ShieldCheck, AlertCircle, Send } from 'lucide-react';

interface Props {
  chalets: Chalet[];
  selectedChalet: Chalet | null;
  onSelectChalet: (chalet: Chalet) => void;
  onSubmitted: () => void;
  lang: Lang;
}

export const TraderApplicationForm: React.FC<Props> = ({
  chalets,
  selectedChalet,
  onSelectChalet,
  onSubmitted,
  lang
}) => {
  const t = TRANSLATIONS[lang].apply;
  const availableChalets = chalets.filter((c) => c.status === 'available');

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: 'Food & Drink',
    description: '',
    signatureItem: '',
    hygieneCertified: false,
    publicLiabilityInsurance: false,
    gdprConsent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedChalet) {
      setError(
        lang === 'zh'
          ? '请先在上方地图或下拉框中选择一个空闲木屋摊位。'
          : 'Please select an available chalet from the interactive map or dropdown first.'
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitApplication({
        ...form,
        chaletCode: selectedChalet.code
      });
      setSuccessRef(res.referenceCode);
      setForm({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        category: 'Food & Drink',
        description: '',
        signatureItem: '',
        hygieneCertified: false,
        publicLiabilityInsurance: false,
        gdprConsent: false
      });
      onSubmitted();
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 font-semibold">
          {t.eyebrow}
        </p>
        <h3 className="font-serif text-3xl font-semibold mt-1">{t.title}</h3>
        <p className="text-sm text-stone-600 dark:text-parchment-200/75 mt-1">{t.subtitle}</p>
      </div>

      {successRef && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.successTitle}</span>
          </div>
          <p className="text-sm">
            {t.successRefLabel}{' '}
            <strong className="font-mono px-2.5 py-0.5 rounded-full bg-stone-900/10 dark:bg-white/10">
              {successRef}
            </strong>
          </p>
          <p className="text-xs opacity-80">{t.successHint}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.chaletLabel}
            </label>
            <select
              value={selectedChalet?.code || ''}
              onChange={(e) => {
                const found = availableChalets.find((c) => c.code === e.target.value);
                if (found) onSelectChalet(found);
              }}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              required
            >
              <option value="">{t.chaletPlaceholder}</option>
              {availableChalets.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.zone} (£{c.fee})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.categoryLabel}
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="Food & Drink">Food &amp; Drink</option>
              <option value="Artisan & Crafts">Artisan &amp; Crafts</option>
              <option value="Gifts & Heritage">Gifts &amp; Heritage</option>
              <option value="Seasonal & Floristry">Seasonal &amp; Floristry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.businessLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.businessPlaceholder}
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.contactLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.contactPlaceholder}
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              placeholder="trader@example.co.uk"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
              {t.signatureLabel}
            </label>
            <input
              type="text"
              placeholder={t.signaturePlaceholder}
              value={form.signatureItem}
              onChange={(e) => setForm({ ...form, signatureItem: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
            {t.descLabel}
          </label>
          <textarea
            rows={3}
            required
            placeholder={t.descPlaceholder}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl px-4 py-2.5 bg-white/75 dark:bg-pine-950/75 border border-stone-900/15 dark:border-gold-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {/* Compliance & GDPR Checkboxes */}
        <div className="p-5 rounded-2xl bg-stone-900/[0.03] dark:bg-white/[0.03] border border-stone-900/15 dark:border-gold-500/20 space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> {t.complianceTitle}
          </p>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.publicLiabilityInsurance}
              onChange={(e) => setForm({ ...form, publicLiabilityInsurance: e.target.checked })}
              className="mt-1 accent-[#C9A66B]"
            />
            <span>{t.insuranceText}</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hygieneCertified}
              onChange={(e) => setForm({ ...form, hygieneCertified: e.target.checked })}
              className="mt-1 accent-[#C9A66B]"
            />
            <span>{t.hygieneText}</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.gdprConsent}
              onChange={(e) => setForm({ ...form, gdprConsent: e.target.checked })}
              className="mt-1 accent-[#C9A66B]"
            />
            <span>{t.gdprText}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm bg-gold-500 text-pine-950 hover:bg-gold-400 transition shadow-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
};

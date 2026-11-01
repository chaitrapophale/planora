import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const Settings = () => {
  const { settings, updateSettings, resetToDemoData } = useEvents();
  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    resetToDemoData();
    setShowResetConfirm(false);
    setFormData({ ...settings });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
          <span>SYSTEM PREFERENCES</span>
          <span>•</span>
          <span className="text-primary-container font-bold">Director Console</span>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
          Workspace Settings &amp; Preferences
        </h1>
        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
          Configure regional accounting parameters, agency credentials, and operational alerts.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-primary-fixed border border-primary-container text-on-primary-fixed rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Workspace preferences committed and synced to local cache!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: ORGANIZER PROFILE */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3">
            <span className="material-symbols-outlined text-primary-container">badge</span>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Event Director Credentials</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Director Full Name</label>
              <input 
                type="text"
                value={formData.organizerName || ''}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Production Agency / Studio</label>
              <input 
                type="text"
                value={formData.agencyName || ''}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Official Email Address</label>
              <input 
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Emergency Dispatch Contact</label>
              <input 
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: REGIONAL & CURRENCY */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3">
            <span className="material-symbols-outlined text-primary-container">currency_rupee</span>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Fiscal &amp; Regional Formatting</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Reporting Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const sym = curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€';
                  setFormData({ ...formData, currency: curr, currencySymbol: sym });
                }}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              >
                <option value="INR">Indian Rupee (INR ₹)</option>
                <option value="USD">US Dollar (USD $)</option>
                <option value="EUR">Euro (EUR €)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Date Representation</label>
              <select
                value={formData.dateFormat}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (Standard)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Timezone Anchor</label>
              <select
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST +5:30)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (GST +4:00)</option>
                <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT +8:00)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 2.5: GENAI ASSISTANT & LLM STATUS */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">auto_awesome</span>
              <h2 className="font-headline-sm text-base font-bold text-tertiary">GenAI Assistant &amp; LLM Provider</h2>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Google Gemini
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container-highest space-y-1">
              <span className="text-[10px] uppercase font-bold text-secondary block">Provider &amp; Model</span>
              <p className="font-bold text-tertiary">Google Gemini (gemini-2.5-flash)</p>
              <p className="text-[11px] text-on-surface-variant">Low latency, structured JSON schemas, multimodal planning reasoning.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container-highest space-y-1">
              <span className="text-[10px] uppercase font-bold text-secondary block">Backend Security Architecture</span>
              <p className="font-bold text-primary">Secure Express Backend Proxy (:3001)</p>
              <p className="text-[11px] text-on-surface-variant">API keys remain secured in server environment variables and are never exposed to browser.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-container border border-surface-container-highest space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-tertiary">Environment Configuration:</span>
              <span className="text-[11px] font-mono text-outline">.env</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded font-mono text-[11px] text-tertiary space-y-1 border border-surface-container-highest/60">
              <p className="text-secondary font-semibold"># Configure in your project root .env:</p>
              <p>GEMINI_API_KEY=your_gemini_api_key_here</p>
              <p>AI_MODEL=gemini-2.5-flash</p>
              <p>PORT=3001</p>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              When no API key is specified, Planora automatically runs in intelligent local preview mode so all screens and proposal approval workflows remain functional.
            </p>
          </div>
        </section>

        {/* SECTION 3: OPERATIONAL NOTIFICATION TOGGLES */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container-highest pb-3">
            <span className="material-symbols-outlined text-primary-container">notifications_active</span>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Operational Notifications &amp; Alerts</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="font-title-sm text-xs font-bold text-tertiary block">
                  Email Alerts for Budget Overruns
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Notify agency director when committed vendor payments exceed 90% of category target
                </span>
              </div>
              <input 
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="font-title-sm text-xs font-bold text-tertiary block">
                  Live SMS Dispatch for Critical Delays
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Send high-priority SMS alert to shift leads when schedule drift exceeds 15 minutes
                </span>
              </div>
              <input 
                type="checkbox"
                checked={formData.liveSmsAlerts}
                onChange={(e) => setFormData({ ...formData, liveSmsAlerts: e.target.checked })}
                className="w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <div>
                <span className="font-title-sm text-xs font-bold text-tertiary block">
                  Auto-Save Production Drafts
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Automatically sync event creation and live timeline alterations to persistent storage
                </span>
              </div>
              <input 
                type="checkbox"
                checked={formData.autoSaveDrafts}
                onChange={(e) => setFormData({ ...formData, autoSaveDrafts: e.target.checked })}
                className="w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
              />
            </label>
          </div>
        </section>

        {/* SECTION 4: DATA RESET */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-tertiary">Restore Demonstration Data</h3>
              <p className="text-xs text-on-surface-variant">
                Reset local storage back to official baseline Stitch events, tasks, and budgets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-1.5 rounded-lg border border-error text-error hover:bg-error-container/30 text-xs font-bold transition-colors"
            >
              Reset to Demo Data
            </button>
          </div>
        </section>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="submit"
            className="bg-primary-container hover:bg-primary text-surface-container-lowest px-6 py-2.5 rounded-lg font-label-md text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border-2 border-error rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-2xl">warning</span>
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Confirm Demo Data Reset</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This will overwrite your current changes and re-populate the official Stitch sample events (TechSpark 2025, Aarav &amp; Meera Wedding, Oakridge Annual Day, FinTech Summit).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 rounded-lg bg-error text-surface-container-lowest text-xs font-bold"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

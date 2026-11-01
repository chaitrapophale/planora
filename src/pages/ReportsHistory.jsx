import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';

export const ReportsHistory = () => {
  const { activeEvent, expenses, tasks, incidentLogs, createEvent, formatCurrency } = useEvents();
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const navigate = useNavigate();

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const plannedBudget = Number(activeEvent?.budget) || 200000;
  const netSavings = plannedBudget - totalSpent;
  const variancePct = plannedBudget > 0 ? ((netSavings / plannedBudget) * 100).toFixed(1) : 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskSuccessRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 94;

  const handleExportCSV = () => {
    // Generate CSV data for expenses
    const headers = ['Invoice No', 'Expense Title', 'Cost Center', 'Vendor Partner', 'Amount', 'Payment Status', 'Due Date'];
    const rows = expenses.map(e => [
      `"${e.invoiceNo || ''}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${e.category || ''}"`,
      `"${(e.vendor || '').replace(/"/g, '""')}"`,
      e.amount || 0,
      `"${e.status || ''}"`,
      `"${e.dueDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(activeEvent?.name || 'event').replace(/\s+/g, '_')}_Financial_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV financial audit ledger downloaded successfully!');
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const handleDuplicateTemplate = () => {
    const clone = {
      ...activeEvent,
      name: `${activeEvent?.name} (Reused Blueprint)`,
      fullName: `${activeEvent?.fullName || activeEvent?.name} (Reused Blueprint)`,
      status: 'Draft',
      daysLeft: 30,
      readiness: 10
    };
    createEvent(clone);
    navigate('/events');
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
            <span>Post-Event Analytics &amp; Audit</span>
            <span>•</span>
            <span className="text-primary-container font-bold">Executive Review</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
            Reports &amp; Event History
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Operational debrief, variance reconciliation, and audit export for <strong className="text-tertiary">{activeEvent?.name}</strong>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="bg-surface-container-lowest border border-surface-container-highest text-secondary hover:bg-surface-container px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">csv</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDuplicateTemplate}
            className="bg-primary-container hover:bg-primary text-surface-container-lowest px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Duplicate as Template</span>
          </button>
        </div>
      </div>

      {/* Download Alert */}
      {downloadSuccess && (
        <div className="p-3 bg-primary-fixed border border-primary-container text-on-primary-fixed rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Executive Scorecard Banner */}
      <section className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container-highest shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
          <div>
            <span className="font-label-sm text-xs text-on-surface-variant uppercase font-semibold">Overall Operational Execution</span>
            <div className="font-headline-lg text-3xl font-bold text-primary mt-0.5">
              {taskSuccessRate}<span className="text-secondary font-normal font-headline-sm text-lg">/100</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container border border-primary-container/20 text-primary">
            <span className="material-symbols-outlined text-base">verified</span>
            <span className="font-label-sm text-xs font-bold tracking-tight uppercase">
              {activeEvent?.status === 'Concluded' ? 'EVENT AUDIT CONCLUDED' : 'PRODUCTION ON TRACK'}
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-highest/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">group</span>
              <span className="font-title-sm text-xs text-on-surface font-semibold">Turnout Rate</span>
            </div>
            <div className="text-right">
              <span className="font-title-sm text-xs font-bold text-primary tabular-nums">
                {activeEvent?.attendance} Pax
              </span>
              <span className="text-[11px] text-primary-container font-semibold ml-1">(100%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-highest/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">account_balance_wallet</span>
              <span className="font-title-sm text-xs text-on-surface font-semibold">Fiscal Variance</span>
            </div>
            <div className="text-right">
              <span className={`font-title-sm text-xs font-bold tabular-nums ${netSavings >= 0 ? 'text-primary' : 'text-error'}`}>
                {netSavings >= 0 ? `+${variancePct}%` : `-${Math.abs(variancePct)}%`}
              </span>
              <span className="text-[11px] text-on-surface-variant ml-1">
                ({netSavings >= 0 ? `Surplus ${formatCurrency(netSavings)}` : `Over ${formatCurrency(Math.abs(netSavings))}`})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-highest/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
              <span className="font-title-sm text-xs text-on-surface font-semibold">Timeline Drift</span>
            </div>
            <div className="text-right">
              <span className="font-title-sm text-xs font-bold text-secondary tabular-nums">+12m Max</span>
              <span className="text-[11px] text-on-surface-variant ml-1 font-medium">(Recovered)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fiscal Reconciliation Summary */}
      <section className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container-highest shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">receipt_long</span>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Fiscal Reconciliation Statement</h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">Audited &amp; Closed</span>
        </div>

        <div className="grid grid-cols-3 gap-3 py-1">
          <div className="p-3 rounded-lg bg-surface-container-low">
            <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">Planned Budget</span>
            <span className="font-title-sm text-sm font-bold text-on-surface tabular-nums mt-0.5 block">
              {formatCurrency(plannedBudget)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low">
            <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">Final Spend</span>
            <span className="font-title-sm text-sm font-bold text-primary tabular-nums mt-0.5 block">
              {formatCurrency(totalSpent)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container border border-primary-container/20">
            <span className="text-[11px] text-primary uppercase font-bold block">Net Liquidity Variance</span>
            <span className={`font-title-sm text-sm font-bold tabular-nums mt-0.5 block ${netSavings >= 0 ? 'text-primary' : 'text-error'}`}>
              {formatCurrency(netSavings)}
            </span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant italic">
          Surplus funds are automatically allocated to the contingency reserve baseline or refunded to client escrow.
        </p>

        {/* Expenses Table Preview */}
        <div className="space-y-2 pt-2 border-t border-surface-container-highest">
          <div className="flex justify-between items-center text-xs font-bold text-secondary uppercase">
            <span>Validated Line Items</span>
            <span>Recorded Spend</span>
          </div>

          {expenses.slice(0, 4).map(exp => (
            <div key={exp.id} className="flex items-center justify-between p-2 rounded bg-surface-container-low text-xs">
              <div>
                <span className="font-bold text-tertiary block">{exp.title}</span>
                <span className="text-[11px] text-on-surface-variant">{exp.vendor}</span>
              </div>
              <span className="font-bold text-primary tabular-nums">{formatCurrency(exp.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Incident & Operational Debrief Section */}
      <section className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container-highest shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">history_edu</span>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Post-Event Lessons Learned &amp; Anomaly Record</h2>
          </div>
          <span className="text-xs text-secondary font-bold">{incidentLogs.length} Logged</span>
        </div>

        <div className="space-y-2.5">
          {incidentLogs.map(inc => (
            <div key={inc.id} className="p-3.5 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-tertiary">{inc.title}</span>
                <span className="text-[10px] uppercase font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded">
                  {inc.status}
                </span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{inc.description}</p>
            </div>
          ))}

          {incidentLogs.length === 0 && (
            <p className="text-xs text-on-surface-variant text-center py-4">
              Zero critical incidents logged during this production cycle.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

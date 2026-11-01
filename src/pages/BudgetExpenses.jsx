import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const BudgetExpenses = () => {
  const { activeEvent, expenses, createExpense, updateExpense, deleteExpense, formatCurrency } = useEvents();
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'Staging & Rigging',
    vendor: '',
    amount: '',
    status: 'Pending Approval',
    dueDate: activeEvent?.date || '2025-10-24',
    invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentMode: 'NEFT Bank Transfer'
  });

  const plannedBudget = Number(activeEvent?.budget) || 200000;
  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingBudget = plannedBudget - totalSpent;
  const spentPercent = plannedBudget > 0 ? Math.round((totalSpent / plannedBudget) * 100) : 0;

  // Category aggregations
  const categoryBudgets = {
    'Staging & Rigging': { planned: Math.round(plannedBudget * 0.30), spent: 0 },
    'Audio Visual': { planned: Math.round(plannedBudget * 0.25), spent: 0 },
    'Catering & Hospitality': { planned: Math.round(plannedBudget * 0.25), spent: 0 },
    'Licensing & Safety': { planned: Math.round(plannedBudget * 0.10), spent: 0 },
    'Decor & Signage': { planned: Math.round(plannedBudget * 0.10), spent: 0 }
  };

  expenses.forEach(e => {
    const cat = e.category || 'Decor & Signage';
    if (!categoryBudgets[cat]) {
      categoryBudgets[cat] = { planned: 20000, spent: 0 };
    }
    categoryBudgets[cat].spent += Number(e.amount) || 0;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newExpense.title.trim() || !newExpense.amount) return;
    createExpense(newExpense);
    setNewExpense({
      title: '',
      category: 'Staging & Rigging',
      vendor: '',
      amount: '',
      status: 'Pending Approval',
      dueDate: activeEvent?.date || '2025-10-24',
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMode: 'NEFT Bank Transfer'
    });
    setIsModalOpen(false);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesCat = filterCategory === 'ALL' || e.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesCat && matchesStatus;
  });

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
            <span>Financial Operations</span>
            <span>•</span>
            <span className="text-primary-container font-bold">Ledger Mode</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
            Budget &amp; Expenditure Ledger
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Fiscal oversight and vendor payments for <strong className="text-tertiary">{activeEvent?.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container hover:bg-primary text-surface-container-lowest px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Record Expense</span>
        </button>
      </div>

      {/* Fiscal Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm">
          <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider block">
            Approved Budget
          </span>
          <p className="font-headline-sm text-2xl font-bold text-tertiary mt-1 tabular-nums">
            {formatCurrency(plannedBudget)}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Allocated reserve baseline
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">
              Committed Spend
            </span>
            <span className="text-xs font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded">
              {spentPercent}% Committed
            </span>
          </div>
          <p className="font-headline-sm text-2xl font-bold text-primary mt-1 tabular-nums">
            {formatCurrency(totalSpent)}
          </p>
          {/* Progress bar */}
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                spentPercent > 100 ? 'bg-error' : 'bg-primary-container'
              }`}
              style={{ width: `${Math.min(100, spentPercent)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm">
          <span className="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider block">
            Remaining Liquidity
          </span>
          <p className={`font-headline-sm text-2xl font-bold mt-1 tabular-nums ${
            remainingBudget < 0 ? 'text-error' : 'text-tertiary'
          }`}>
            {formatCurrency(remainingBudget)}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            {remainingBudget >= 0 ? 'Operational surplus within targets' : '⚠️ Over budget threshold alert'}
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <section className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
          <h2 className="font-headline-sm text-base font-bold text-tertiary">
            Departmental Cost Center Allocations
          </h2>
          <span className="text-xs font-bold text-secondary">
            {Object.keys(categoryBudgets).length} Centers Active
          </span>
        </div>

        <div className="space-y-3.5">
          {Object.entries(categoryBudgets).map(([catName, data]) => {
            const pct = data.planned > 0 ? Math.round((data.spent / data.planned) * 100) : 0;
            const isOver = data.spent > data.planned;
            return (
              <div key={catName} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-title-sm font-bold text-tertiary flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isOver ? 'bg-error' : 'bg-primary-container'}`}></span>
                    <span>{catName}</span>
                  </span>
                  <div className="text-right tabular-nums">
                    <span className={`font-bold ${isOver ? 'text-error' : 'text-primary'}`}>
                      {formatCurrency(data.spent)}
                    </span>
                    <span className="text-on-surface-variant ml-1">/ {formatCurrency(data.planned)}</span>
                    <span className={`ml-2 font-bold text-[11px] ${isOver ? 'text-error' : 'text-secondary'}`}>
                      ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden border border-surface-container-highest/60">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-error' : 'bg-primary-container'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Itemized Ledger Table */}
      <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-sm overflow-hidden">
        <div className="p-4 border-b border-surface-container-highest flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
          <div>
            <h2 className="font-headline-sm text-base font-bold text-tertiary">Itemized Disbursement Ledger</h2>
            <p className="text-xs text-on-surface-variant">Validated vendor transactions &amp; payables</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary font-semibold"
            >
              <option value="ALL">All Categories</option>
              {Object.keys(categoryBudgets).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Due on Delivery">Due on Delivery</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-[11px] text-secondary uppercase tracking-wider">
                <th className="py-3 px-4">Line Item &amp; Invoice</th>
                <th className="py-3 px-4">Cost Center</th>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/60">
              {filteredExpenses.map((exp, idx) => (
                <tr 
                  key={exp.id}
                  className={`hover:bg-surface-container/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-tertiary block">{exp.title}</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">{exp.invoiceNo}</span>
                  </td>
                  <td className="py-3 px-4 text-tertiary font-medium">
                    {exp.category}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {exp.vendor}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-primary tabular-nums text-sm">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        const nextStatus = exp.status === 'Paid' ? 'Pending Approval' : 'Paid';
                        updateExpense(exp.id, { status: nextStatus });
                      }}
                      title="Click to toggle status"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold cursor-pointer transition-transform active:scale-95 ${
                        exp.status === 'Paid' 
                          ? 'bg-primary-fixed text-on-primary-fixed' 
                          : exp.status === 'Due on Delivery'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-high text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {exp.status === 'Paid' ? 'verified' : 'pending'}
                      </span>
                      <span>{exp.status}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      title="Delete record"
                      className="p-1 rounded text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                    No expense records found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RECORD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleCreate}
            className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">receipt_long</span>
                <h3 className="font-headline-sm text-base font-bold text-tertiary">Record Ledger Expense</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:bg-surface-container p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Expense Title *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Line Array Truss Rental"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Cost Center</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Staging & Rigging">Staging &amp; Rigging</option>
                  <option value="Audio Visual">Audio Visual</option>
                  <option value="Catering & Hospitality">Catering &amp; Hospitality</option>
                  <option value="Licensing & Safety">Licensing &amp; Safety</option>
                  <option value="Decor & Signage">Decor &amp; Signage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Amount (₹ INR) *</label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="25000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-bold tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Vendor Partner Name</label>
              <input 
                type="text"
                placeholder="e.g. SonicPro Acoustics Mumbai"
                value={newExpense.vendor}
                onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Payment Status</label>
                <select
                  value={newExpense.status}
                  onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Due on Delivery">Due on Delivery</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Due Date</label>
                <input 
                  type="date"
                  value={newExpense.dueDate}
                  onChange={(e) => setNewExpense({ ...newExpense, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Commit Record
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

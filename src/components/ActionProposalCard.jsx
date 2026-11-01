import React, { useState } from 'react';

export const ActionProposalCard = ({
  action,
  onApprove,
  onReject,
  status = 'pending', // 'pending' | 'approved' | 'rejected'
  formatCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(() => ({ ...(action?.data || {}) }));

  if (!action || !action.type) return null;

  const { type, summary } = action;

  const handleSaveEditAndApprove = () => {
    onApprove({
      ...action,
      data: editedData
    });
    setIsEditing(false);
  };

  const getTypeMetadata = () => {
    switch (type) {
      case 'create_task':
        return {
          label: 'Task Proposal',
          icon: 'assignment_add',
          color: 'bg-primary-container text-surface-container-lowest',
          badge: 'New Task'
        };
      case 'update_task':
        return {
          label: 'Task Update',
          icon: 'edit_calendar',
          color: 'bg-secondary text-surface-container-lowest',
          badge: 'Task Modification'
        };
      case 'create_expense':
        return {
          label: 'Fiscal Ledger Entry',
          icon: 'add_card',
          color: 'bg-tertiary-container text-surface-bright',
          badge: 'Budget Expense'
        };
      case 'create_supply':
        return {
          label: 'Supply Procurement',
          icon: 'inventory_2',
          color: 'bg-secondary-container text-on-secondary-container',
          badge: 'Equipment Order'
        };
      case 'create_food_item':
        return {
          label: 'Catering Record',
          icon: 'restaurant_menu',
          color: 'bg-primary text-surface-container-lowest',
          badge: 'Food & Meals'
        };
      case 'update_schedule_activity':
        return {
          label: 'Run-of-Show Shift',
          icon: 'schedule',
          color: 'bg-error text-surface-container-lowest',
          badge: 'Schedule Shift'
        };
      default:
        return {
          label: 'Proposed Modification',
          icon: 'tune',
          color: 'bg-primary-container text-surface-container-lowest',
          badge: 'Event Action'
        };
    }
  };

  const meta = getTypeMetadata();

  return (
    <div className={`mt-3 rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${
      status === 'approved' 
        ? 'bg-primary-fixed/20 border-primary-container/40' 
        : status === 'rejected'
        ? 'bg-surface-container-high/40 border-outline-variant/60 opacity-60'
        : 'bg-surface-container-lowest border-primary-container/30 ring-1 ring-primary-container/10'
    }`}>
      {/* Proposal Card Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low border-b border-surface-container-highest">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
            <span className="material-symbols-outlined text-[15px]">{meta.icon}</span>
          </span>
          <div>
            <span className="font-label-sm text-[10px] uppercase font-bold text-secondary tracking-wider block">
              {meta.label}
            </span>
            <span className="font-title-sm text-xs font-bold text-tertiary truncate block">
              {summary || 'Review Proposed Action'}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div>
          {status === 'approved' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-container text-surface-container-lowest shadow-xs">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              Approved &amp; Executed
            </span>
          ) : status === 'rejected' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
              <span className="material-symbols-outlined text-[13px]">cancel</span>
              Dismissed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Requires Approval
            </span>
          )}
        </div>
      </div>

      {/* Proposal Details Body */}
      <div className="p-3.5 space-y-2.5 text-xs text-tertiary font-body-sm">
        {/* VIEW MODE */}
        {!isEditing ? (
          <div className="space-y-2">
            {type === 'create_task' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-surface-container-highest/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Task Title</span>
                  <span className="font-semibold text-tertiary">{editedData.title}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Assigned Lead</span>
                  <span className="font-semibold text-secondary">{editedData.assignedTo || 'Avantika Sharma'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Deadline</span>
                  <span className="font-semibold text-primary">{editedData.dueDate || 'Event Date'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Priority / Category</span>
                  <span className="inline-flex items-center gap-1 capitalize">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                      editedData.priority === 'critical' 
                        ? 'bg-error text-surface-container-lowest' 
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {editedData.priority || 'medium'}
                    </span>
                    <span className="text-on-surface-variant font-medium">• {editedData.category || 'Operations'}</span>
                  </span>
                </div>
              </div>
            )}

            {type === 'create_expense' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-surface-container-highest/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Expense Name</span>
                  <span className="font-semibold text-tertiary">{editedData.title}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Amount</span>
                  <span className="font-bold text-primary text-sm">{formatCurrency(editedData.amount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Category</span>
                  <span className="font-medium text-secondary">{editedData.category || 'General'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Vendor / Payee</span>
                  <span className="font-medium text-tertiary">{editedData.vendor || 'Proposed Vendor'}</span>
                </div>
              </div>
            )}

            {type === 'create_supply' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-surface-container-highest/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Equipment / Supply</span>
                  <span className="font-semibold text-tertiary">{editedData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Required Quantity</span>
                  <span className="font-bold text-primary">{editedData.requiredQty} {editedData.unit || 'units'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Est. Cost</span>
                  <span className="font-semibold text-secondary">{formatCurrency(editedData.estimatedCost || 0)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Responsible Lead</span>
                  <span className="font-medium text-tertiary">{editedData.responsible || 'Operations Lead'}</span>
                </div>
              </div>
            )}

            {type === 'create_food_item' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-surface-container-highest/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Meal Type</span>
                  <span className="font-semibold text-tertiary">{editedData.mealType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Pax &amp; Timing</span>
                  <span className="font-semibold text-primary">{editedData.paxCount} Pax • {editedData.scheduleTime || '13:00'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-outline block">Menu Highlights</span>
                  <span className="font-medium text-tertiary">
                    {Array.isArray(editedData.menuItems) ? editedData.menuItems.join(', ') : editedData.menuItems}
                  </span>
                </div>
              </div>
            )}

            {type === 'update_schedule_activity' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-surface-container-highest/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Schedule Adjustment</span>
                  <span className="font-semibold text-tertiary">Apply +{editedData.delayMin || 15} min timeline shift</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Revised Marker</span>
                  <span className="font-bold text-error">{editedData.actualTime || 'Adjusted Live Time'}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EDIT MODE FORM */
          <div className="space-y-2 bg-surface-container-low p-3 rounded-lg border border-primary-container/20">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-surface-container-highest">
              <span className="font-bold text-primary-container text-xs">Edit Action Parameters</span>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-secondary text-[11px] hover:underline"
              >
                Cancel Edit
              </button>
            </div>

            {type === 'create_task' && (
              <>
                <div>
                  <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Task Title</label>
                  <input
                    type="text"
                    value={editedData.title || ''}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                    className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Assigned To</label>
                    <input
                      type="text"
                      value={editedData.assignedTo || ''}
                      onChange={(e) => setEditedData({ ...editedData, assignedTo: e.target.value })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Deadline</label>
                    <input
                      type="date"
                      value={editedData.dueDate || ''}
                      onChange={(e) => setEditedData({ ...editedData, dueDate: e.target.value })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                </div>
              </>
            )}

            {type === 'create_expense' && (
              <>
                <div>
                  <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Title</label>
                  <input
                    type="text"
                    value={editedData.title || ''}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                    className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Amount (₹)</label>
                    <input
                      type="number"
                      value={editedData.amount || ''}
                      onChange={(e) => setEditedData({ ...editedData, amount: Number(e.target.value) })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Vendor</label>
                    <input
                      type="text"
                      value={editedData.vendor || ''}
                      onChange={(e) => setEditedData({ ...editedData, vendor: e.target.value })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                </div>
              </>
            )}

            {type === 'create_supply' && (
              <>
                <div>
                  <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Item Name</label>
                  <input
                    type="text"
                    value={editedData.name || ''}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Required Quantity</label>
                    <input
                      type="number"
                      value={editedData.requiredQty || ''}
                      onChange={(e) => setEditedData({ ...editedData, requiredQty: Number(e.target.value) })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline block mb-0.5">Unit Cost (₹)</label>
                    <input
                      type="number"
                      value={editedData.estimatedCost || ''}
                      onChange={(e) => setEditedData({ ...editedData, estimatedCost: Number(e.target.value) })}
                      className="w-full text-xs p-1.5 rounded border border-surface-container-highest bg-surface-container-lowest"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Controls */}
        {status === 'pending' && (
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-container-highest/60">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={onReject}
                  className="px-3 py-1.5 rounded-lg border border-surface-container-highest text-secondary hover:bg-surface-container text-xs font-semibold transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-container/30 text-primary hover:bg-primary-fixed/20 text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(action)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[15px]">check</span>
                  <span>Approve &amp; Apply</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveEditAndApprove}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>Save &amp; Approve</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

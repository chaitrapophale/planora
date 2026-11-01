import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const FoodSupplies = () => {
  const { activeEvent, foodItems, createFoodItem, deleteFoodItem, supplies, createSupply, updateSupply, deleteSupply, formatCurrency, teamMembers } = useEvents();
  const [activeTab, setActiveTab] = useState('catering'); // 'catering' | 'supplies'
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);

  // New Food Item state
  const [newFood, setNewFood] = useState({
    mealType: '',
    scheduleTime: '13:00 - 14:30',
    paxCount: activeEvent?.attendance || 500,
    menuItems: 'Veg Biryani, Raita, Gulab Jamun, Mineral Water',
    dietaryNotes: 'Strict Jain preparation in separate container. No nuts.',
    costPerPax: 95,
    vendor: 'Royal Flavors Catering'
  });

  // New Supply Item state
  const [newSupply, setNewSupply] = useState({
    name: '',
    category: 'Audio Equipment',
    requiredQty: 4,
    availableQty: 2,
    unit: 'sets',
    responsible: teamMembers[0]?.name || 'Rohit Kulkarni',
    estimatedCost: 8000
  });

  const handleCreateFood = (e) => {
    e.preventDefault();
    if (!newFood.mealType.trim()) return;
    createFoodItem({
      ...newFood,
      menuItems: newFood.menuItems.split(',').map(m => m.trim())
    });
    setNewFood({
      mealType: '',
      scheduleTime: '13:00 - 14:30',
      paxCount: activeEvent?.attendance || 500,
      menuItems: 'Veg Biryani, Raita, Gulab Jamun, Mineral Water',
      dietaryNotes: 'Strict Jain preparation in separate container. No nuts.',
      costPerPax: 95,
      vendor: 'Royal Flavors Catering'
    });
    setIsFoodModalOpen(false);
  };

  const handleCreateSupply = (e) => {
    e.preventDefault();
    if (!newSupply.name.trim()) return;
    createSupply(newSupply);
    setNewSupply({
      name: '',
      category: 'Audio Equipment',
      requiredQty: 4,
      availableQty: 2,
      unit: 'sets',
      responsible: teamMembers[0]?.name || 'Rohit Kulkarni',
      estimatedCost: 8000
    });
    setIsSupplyModalOpen(false);
  };

  const missingSuppliesCount = supplies.filter(s => Number(s.availableQty) < Number(s.requiredQty)).length;

  return (
    <main className="w-full max-w-6xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
            <span>RESOURCE LOGISTICS &amp; CATERING</span>
            <span>•</span>
            <span className="text-primary-container font-bold">{activeEvent?.venue?.split(',')[0]}</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
            Food &amp; Supplies Management
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Internal coordination for dietary segregation, catering windows, and gear readiness for <strong className="text-tertiary">{activeEvent?.name}</strong>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'catering' ? (
            <button
              onClick={() => setIsFoodModalOpen(true)}
              className="bg-primary-container hover:bg-primary text-surface-container-lowest px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              <span>Add Meal Schedule</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSupplyModalOpen(true)}
              className="bg-primary-container hover:bg-primary text-surface-container-lowest px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_box</span>
              <span>Add Supply Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container p-1 rounded-xl border border-secondary/15 max-w-md">
        <button
          onClick={() => setActiveTab('catering')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-title-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'catering' 
              ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
              : 'text-tertiary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">restaurant_menu</span>
          <span>Catering &amp; Dietary ({foodItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-title-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'supplies' 
              ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
              : 'text-tertiary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">inventory_2</span>
          <span>Supplies &amp; Hardware ({supplies.length})</span>
        </button>
      </div>

      {/* Missing Gear Alert */}
      {missingSuppliesCount > 0 && activeTab === 'supplies' && (
        <div className="bg-secondary-container/30 border-l-4 border-error p-3.5 rounded-r-xl border border-surface-container-highest flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">warning</span>
          <div className="text-xs">
            <span className="font-bold text-error uppercase block">Preparation Readiness Warning</span>
            <p className="text-tertiary mt-0.5">
              {missingSuppliesCount} critical hardware items have outstanding quantities before scheduled tech rehearsal. Review missing items below.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 1: CATERING & DIETARY ================= */}
      {activeTab === 'catering' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodItems.map(item => (
              <div 
                key={item.id}
                className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm flex flex-col justify-between space-y-4 hover:border-secondary transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-surface-container-highest pb-3">
                    <div>
                      <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                        {item.scheduleTime}
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-tertiary mt-1">
                        {item.mealType}
                      </h3>
                      <p className="text-xs text-on-surface-variant">Vendor: {item.vendor}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-primary text-sm tabular-nums block">
                        {item.paxCount} Pax
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {formatCurrency(item.totalCost)}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="mt-3 space-y-1.5">
                    <span className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider block">
                      Approved Menu Items:
                    </span>
                    <ul className="text-xs text-tertiary space-y-1 pl-4 list-disc">
                      {item.menuItems.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dietary & Allergy Safeguards */}
                  {item.dietaryNotes && (
                    <div className="mt-3 p-3 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-xs text-tertiary space-y-1">
                      <span className="font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary-container">shield</span>
                        <span>Dietary &amp; Allergy Precautions:</span>
                      </span>
                      <p className="text-on-surface-variant pl-4 leading-relaxed italic">
                        "{item.dietaryNotes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest text-xs">
                  <span className="font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>{item.status}</span>
                  </span>

                  <button
                    onClick={() => deleteFoodItem(item.id)}
                    className="text-outline hover:text-error text-xs flex items-center gap-1 p-1 rounded"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {foodItems.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-1 text-outline">restaurant</span>
              <p className="font-semibold text-sm">No meal schedules recorded yet</p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SUPPLIES & HARDWARE ================= */}
      {activeTab === 'supplies' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-[11px] text-secondary uppercase tracking-wider">
                    <th className="py-3 px-4">Equipment Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Required</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4">Readiness Status</th>
                    <th className="py-3 px-4">Custodian Lead</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest/60">
                  {supplies.map((sup, idx) => {
                    const isMissing = Number(sup.availableQty) < Number(sup.requiredQty);
                    return (
                      <tr key={sup.id} className={idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'}>
                        <td className="py-3 px-4">
                          <span className="font-bold text-tertiary block">{sup.name}</span>
                          <span className="text-[11px] text-on-surface-variant">Est: {formatCurrency(sup.estimatedCost)}</span>
                        </td>
                        <td className="py-3 px-4 text-tertiary font-medium">
                          {sup.category}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-tertiary tabular-nums">
                          {sup.requiredQty} {sup.unit}
                        </td>
                        <td className="py-3 px-4 text-center tabular-nums">
                          <input 
                            type="number"
                            min="0"
                            value={sup.availableQty}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateSupply(sup.id, { 
                                availableQty: val,
                                status: val >= Number(sup.requiredQty) ? 'Ready on Site' : `Missing ${Number(sup.requiredQty) - val}`
                              });
                            }}
                            className={`w-16 px-1.5 py-0.5 text-center font-bold rounded border ${
                              isMissing ? 'border-error text-error bg-error-container/20' : 'border-primary-container text-primary'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            isMissing 
                              ? 'bg-tertiary text-surface-container-lowest' 
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}>
                            <span className="material-symbols-outlined text-xs">
                              {isMissing ? 'warning' : 'check_circle'}
                            </span>
                            <span>{sup.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-on-surface-variant font-medium">
                          {sup.responsible}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteSupply(sup.id)}
                            className="p-1 rounded text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEAL MODAL */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleCreateFood}
            className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Add Catering Schedule</h3>
              <button 
                type="button" 
                onClick={() => setIsFoodModalOpen(false)}
                className="text-secondary p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Meal Title *</label>
              <input 
                type="text"
                required
                placeholder="e.g. High-Tea Box &amp; Refreshments"
                value={newFood.mealType}
                onChange={(e) => setNewFood({ ...newFood, mealType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Time Window</label>
                <input 
                  type="text"
                  placeholder="14:00 - 15:30"
                  value={newFood.scheduleTime}
                  onChange={(e) => setNewFood({ ...newFood, scheduleTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Pax Count</label>
                <input 
                  type="number"
                  min="1"
                  value={newFood.paxCount}
                  onChange={(e) => setNewFood({ ...newFood, paxCount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary tabular-nums font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Menu Items (comma-separated)</label>
              <textarea 
                rows="2"
                value={newFood.menuItems}
                onChange={(e) => setNewFood({ ...newFood, menuItems: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Dietary &amp; Allergy Precautions</label>
              <input 
                type="text"
                placeholder="e.g. 50 Jain meals, separate nut-free packaging"
                value={newFood.dietaryNotes}
                onChange={(e) => setNewFood({ ...newFood, dietaryNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                type="button"
                onClick={() => setIsFoodModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Save Meal Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD SUPPLY MODAL */}
      {isSupplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleCreateSupply}
            className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Log Supply / Hardware Item</h3>
              <button 
                type="button" 
                onClick={() => setIsSupplyModalOpen(false)}
                className="text-secondary p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Item Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. 100kVA Cummins Diesel Generator"
                value={newSupply.name}
                onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Category</label>
                <select
                  value={newSupply.category}
                  onChange={(e) => setNewSupply({ ...newSupply, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Audio Equipment">Audio Equipment</option>
                  <option value="Staging">Staging</option>
                  <option value="Electrical Power">Electrical Power</option>
                  <option value="Crowd Control">Crowd Control</option>
                  <option value="Emergency First Aid">Emergency First Aid</option>
                  <option value="IT & Telephony">IT &amp; Telephony</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Unit</label>
                <input 
                  type="text"
                  placeholder="units / sets / panels"
                  value={newSupply.unit}
                  onChange={(e) => setNewSupply({ ...newSupply, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Required Qty</label>
                <input 
                  type="number"
                  min="1"
                  value={newSupply.requiredQty}
                  onChange={(e) => setNewSupply({ ...newSupply, requiredQty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary tabular-nums font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Available Qty</label>
                <input 
                  type="number"
                  min="0"
                  value={newSupply.availableQty}
                  onChange={(e) => setNewSupply({ ...newSupply, availableQty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary tabular-nums font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Responsible Lead</label>
              <select
                value={newSupply.responsible}
                onChange={(e) => setNewSupply({ ...newSupply, responsible: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={`${m.name} (${m.role})`}>
                    {m.name} — {m.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                type="button"
                onClick={() => setIsSupplyModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Log Supply Item
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

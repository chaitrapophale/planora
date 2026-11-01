import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export const MyEvents = () => {
  const { events, activeEventId, setActiveEventId, createEvent, deleteEvent, formatCurrency } = useEvents();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  const filteredEvents = events.filter(ev => {
    const matchesFilter = filterStatus === 'ALL' || ev.status.toUpperCase() === filterStatus;
    const matchesSearch = 
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPax = events.reduce((sum, e) => sum + (Number(e.attendance) || 0), 0);
  const totalBudget = events.reduce((sum, e) => sum + (Number(e.budget) || 0), 0);
  const inProdCount = events.filter(e => e.status === 'In Production').length;

  const handleDuplicate = (eventToClone) => {
    const clone = {
      ...eventToClone,
      name: `${eventToClone.name} (Copy)`,
      fullName: `${eventToClone.fullName || eventToClone.name} (Copy)`,
      status: 'Draft',
      daysLeft: 30,
      readiness: 10
    };
    createEvent(clone);
  };

  const handleDelete = (id) => {
    deleteEvent(id);
    setDeleteConfirmId(null);
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-wider">
            <span>Portfolio Master</span>
            <span>•</span>
            <span className="text-primary-container">Executive Ledger</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary font-bold tracking-tight mt-1">
            Event Management Portfolio
          </h1>
          <p className="font-body-sm text-sm text-on-surface-variant mt-0.5">
            Active and archived production manifests for internal coordinating teams.
          </p>
        </div>

        <button
          onClick={() => navigate('/events/new')}
          className="bg-primary-container hover:bg-primary text-surface-container-lowest px-4 py-2.5 rounded-lg font-label-md text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create New Event</span>
        </button>
      </div>

      {/* Portfolio Quick Stats Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <p className="font-label-sm text-[11px] text-secondary font-semibold uppercase">Total Portfolio</p>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{events.length} Events</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <p className="font-label-sm text-[11px] text-secondary font-semibold uppercase">In Production</p>
          <p className="font-headline-sm text-xl font-bold text-primary-container mt-1">{inProdCount} Active</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <p className="font-label-sm text-[11px] text-secondary font-semibold uppercase">Total Attendance</p>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{totalPax.toLocaleString()} Pax</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <p className="font-label-sm text-[11px] text-secondary font-semibold uppercase">Portfolio Capital</p>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{formatCurrency(totalBudget)}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-highest shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['ALL', 'IN PRODUCTION', 'PLANNING', 'DRAFT', 'CONCLUDED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-label-md font-semibold shrink-0 transition-colors ${
                filterStatus === status 
                  ? 'bg-primary-container text-surface-container-lowest' 
                  : 'bg-surface-container text-tertiary hover:bg-surface-container-high'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">search</span>
          <input 
            type="text"
            placeholder="Search events, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map(ev => {
          const isActive = ev.id === activeEventId;
          return (
            <div 
              key={ev.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                isActive 
                  ? 'bg-surface-container-lowest border-primary-container ring-2 ring-primary-container/20' 
                  : 'bg-surface-container-lowest border-surface-container-highest hover:border-secondary'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary-container animate-pulse' : 'bg-outline'}`}></span>
                      <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                        {ev.category}
                      </span>
                      <span className={`font-label-sm text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        ev.status === 'In Production' 
                          ? 'bg-secondary-container text-on-secondary-container' 
                          : ev.status === 'Concluded'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container-high text-tertiary'
                      }`}>
                        {ev.status}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-base font-bold text-tertiary mt-1">
                      {ev.fullName || ev.name}
                    </h3>
                  </div>

                  <span className="font-title-sm text-xs font-bold text-tertiary bg-surface-container-low px-2.5 py-1 rounded border border-surface-container-highest shrink-0">
                    {formatCurrency(ev.budget)}
                  </span>
                </div>

                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-2">
                  {ev.description || 'No detailed brief recorded.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-container-highest/60 text-xs">
                  <div>
                    <span className="text-secondary text-[11px] block">Event Date</span>
                    <span className="font-bold text-tertiary">{ev.date}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[11px] block">Scale</span>
                    <span className="font-bold text-primary-container">{ev.attendance} Pax</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[11px] block">Location</span>
                    <span className="font-medium text-tertiary truncate block">{ev.venue.split(',')[0]}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-secondary font-semibold">
                    <span>Preparation Readiness</span>
                    <span>{ev.readiness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-container h-full rounded-full transition-all duration-300"
                      style={{ width: `${ev.readiness}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setActiveEventId(ev.id);
                      navigate('/');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label-md font-bold transition-transform active:scale-95 flex items-center gap-1 ${
                      isActive 
                        ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                        : 'bg-surface-container text-primary-container hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isActive ? 'check' : 'login'}
                    </span>
                    <span>{isActive ? 'Active Workspace' : 'Open Workspace'}</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(ev)}
                    title="Duplicate as new draft template"
                    className="p-1.5 rounded-lg border border-surface-container-highest text-secondary hover:bg-surface-container text-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">content_copy</span>
                  </button>
                </div>

                {events.length > 1 && (
                  <div>
                    {deleteConfirmId === ev.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="px-2 py-1 rounded bg-error text-surface-container-lowest text-xs font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-surface-container text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(ev.id)}
                        title="Delete event"
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="p-8 rounded-xl bg-surface-container text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
          <p className="font-headline-sm text-base font-bold text-tertiary">No events found matching your query</p>
          <button
            onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
            className="text-xs text-primary-container font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
};

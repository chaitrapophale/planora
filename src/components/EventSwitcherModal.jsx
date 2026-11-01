import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';

export const EventSwitcherModal = ({ isOpen, onClose }) => {
  const { events, activeEventId, setActiveEventId } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-surface px-5 py-4 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-tertiary font-bold">Switch Event Workspace</h2>
              <p className="font-body-sm text-xs text-on-surface-variant">Select an active production plan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container text-secondary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container-highest flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-secondary">search</span>
            <input 
              type="text" 
              placeholder="Search by name, venue or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-surface-container-highest rounded-lg text-sm font-body-md text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              autoFocus
            />
          </div>
          <button
            onClick={() => {
              onClose();
              navigate('/events/new');
            }}
            className="bg-primary-container hover:bg-primary text-surface-container-lowest px-3 py-2 rounded-lg font-label-md text-xs flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Event</span>
          </button>
        </div>

        {/* Events List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-surface-container-highest/40">
          {filteredEvents.map(ev => {
            const isActive = ev.id === activeEventId;
            return (
              <div
                key={ev.id}
                onClick={() => {
                  setActiveEventId(ev.id);
                  onClose();
                }}
                className={`pt-2.5 first:pt-0 p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isActive 
                    ? 'bg-secondary-container/20 border-primary-container ring-1 ring-primary-container' 
                    : 'bg-surface-container-lowest border-surface-container-highest hover:bg-surface-container hover:border-secondary'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary-container animate-pulse' : 'bg-outline'}`}></span>
                    <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container text-secondary">
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
                  <h3 className="font-title-sm text-sm font-bold text-tertiary truncate">
                    {ev.fullName || ev.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant font-body-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">calendar_today</span>
                      {ev.date}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                      {ev.venue}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-tertiary">
                      <span className="material-symbols-outlined text-[14px] text-secondary">group</span>
                      {ev.attendance} Pax
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                  <span className="font-title-sm text-xs font-bold text-primary-container">
                    {ev.readiness}% Ready
                  </span>
                  {isActive && (
                    <span className="font-label-sm text-[10px] font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
              <p className="font-title-sm text-sm">No events match "{searchTerm}"</p>
              <p className="text-xs mt-1">Try another search or create a new event plan.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface px-5 py-3 border-t border-surface-container-highest flex items-center justify-between text-xs text-on-surface-variant">
          <span>{events.length} Total Events Loaded</span>
          <button 
            onClick={() => {
              onClose();
              navigate('/events');
            }}
            className="text-primary-container hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Events Matrix</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

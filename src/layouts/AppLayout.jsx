import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { EventSwitcherModal } from '../components/EventSwitcherModal';
import { AIAssistantWidget } from '../components/AIAssistantWidget';

export const AppLayout = () => {
  const { activeEvent, recentActivities, settings } = useEvents();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard', badge: null },
    { path: '/events', label: 'My Events', icon: 'calendar_month', badge: null },
    { path: '/ai-planner', label: 'AI Planner', icon: 'auto_awesome', badge: 'GenAI' },
    { path: '/tasks', label: 'Tasks & Timeline', icon: 'format_list_bulleted', badge: null },
    { path: '/budget', label: 'Budget & Expenses', icon: 'payments', badge: null },
    { path: '/supplies', label: 'Food & Supplies', icon: 'restaurant', badge: null },
    { path: '/venue', label: 'Venue & Seating', icon: 'architecture', badge: null },
    { path: '/team', label: 'Team & Operations', icon: 'badge', badge: null },
    { path: '/live', label: 'Live Event Mode', icon: 'sensors', badge: 'LIVE', isLive: true },
    { path: '/reports', label: 'Reports & History', icon: 'history_edu', badge: null },
    { path: '/settings', label: 'Settings', icon: 'settings', badge: null },
  ];

  // Mobile bottom bar primary 5 tabs
  const bottomTabs = [
    { path: '/', label: 'Overview', icon: 'dashboard' },
    { path: '/ai-planner', label: 'AI Planner', icon: 'auto_awesome' },
    { path: '/tasks', label: 'Schedule', icon: 'event_note' },
    { path: '/budget', label: 'Budget', icon: 'payments' },
    { path: '/live', label: 'Live Mode', icon: 'sensors', isLive: true },
  ];

  const isLivePage = location.pathname === '/live';

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex flex-col md:flex-row antialiased">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-surface-container-highest shrink-0 h-screen sticky top-0 shadow-sm z-30">
        {/* Brand & Logo */}
        <div className="h-16 px-5 border-b border-surface-container-highest flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div>
              <span className="font-headline-sm text-lg font-bold tracking-tight text-primary flex items-center gap-1.5 leading-none">
                Planora
              </span>
              <p className="font-label-sm text-[10px] text-secondary tracking-widest uppercase mt-0.5 font-semibold">
                Director Studio
              </p>
            </div>
          </div>
        </div>

        {/* Active Event Context Capsule in Sidebar */}
        <div className="p-3 border-b border-surface-container-highest/60 bg-surface-container/40">
          <div 
            onClick={() => setIsSwitcherOpen(true)}
            className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest hover:border-primary-container cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="font-label-sm text-[10px] uppercase font-bold text-secondary tracking-wider">
                  Active Workspace
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-sm group-hover:translate-x-0.5 transition-transform">
                unfold_more
              </span>
            </div>
            <p className="font-title-sm text-xs font-bold text-tertiary truncate">
              {activeEvent?.name || 'Select Event'}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] text-on-surface-variant font-body-sm">
              <span className="truncate max-w-[130px]">{activeEvent?.venue?.split(',')[0]}</span>
              <span className="font-semibold text-primary-container">{activeEvent?.attendance} Pax</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scroll">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2 rounded-lg font-title-sm text-xs transition-all duration-150 group
                ${isActive 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm font-semibold' 
                  : 'text-tertiary hover:bg-surface-container-high hover:text-primary font-medium'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`material-symbols-outlined text-[19px] ${
                      isActive ? 'text-surface-container-lowest' : 'text-secondary group-hover:text-primary'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`font-label-sm text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-surface-container-lowest text-primary-container' 
                        : item.isLive 
                        ? 'bg-secondary text-surface-bright animate-pulse' 
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Action Button & Director Profile Footer */}
        <div className="p-3 border-t border-surface-container-highest bg-surface space-y-2.5">
          <button
            onClick={() => navigate('/events/new')}
            className="w-full bg-primary-container hover:bg-primary text-surface-container-lowest py-2 px-3 rounded-lg font-label-md text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Create New Event</span>
          </button>

          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
          >
            <img 
              src={activeEvent?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuC6QACscJaMN82cnjf3bXLZkPCG877azkpDLwCUThmgtealxXh2NCou9A3Kwg8mm8rNtZifHOhOdsKjbu5Gko2BtqsQBWEJLSZY1YiZ4_xSzKJX4UaIKUxWmvca2iBvDm8p-nADmaBmDaOGNbH3yGdMx2Ym_0nS36IQoOMdT4sJoNqBe3xMmPgECHAmvgpgH0b2GFolGKHk7WQjftqkliZtnqNNLjAHcfgFn_Iu8kkE2M5duvscz9Y"} 
              alt="Director Profile"
              className="w-8 h-8 rounded-full object-cover border border-primary-container"
            />
            <div className="min-w-0 flex-1">
              <p className="font-title-sm text-xs font-bold text-tertiary truncate">
                {settings.organizerName || 'Avantika Sharma'}
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">
                {settings.agencyName || 'Executive Director'}
              </p>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">settings</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <header className={`w-full px-margin-mobile md:px-margin flex items-center justify-between h-16 sticky top-0 z-40 transition-colors ${
          isLivePage 
            ? 'bg-primary-container text-surface-bright shadow-sm border-b border-[#274e3c]' 
            : 'bg-surface/95 backdrop-blur-md border-b border-surface-container-highest shadow-[0_1px_3px_rgba(94,49,34,0.05)]'
        }`}>
          {/* Left Brand Anchor (Mobile & Tablet) */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <span className={`material-symbols-outlined text-2xl ${isLivePage ? 'text-surface-bright' : 'text-primary'}`}>menu</span>
            </button>

            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isLivePage ? 'bg-[#153426] text-primary-fixed' : 'bg-primary-container text-surface-container-lowest'
              }`}>
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </div>
              <span className={`font-headline-sm text-headline-sm font-semibold tracking-tight ${
                isLivePage ? 'text-surface-bright' : 'text-primary'
              }`}>
                Planora
              </span>
            </div>

            {/* Desktop Event Switcher Pill */}
            <div 
              onClick={() => setIsSwitcherOpen(true)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                isLivePage 
                  ? 'bg-[#153426] border-[#274e3c] text-surface-bright hover:bg-[#1a4030]' 
                  : 'bg-surface-container-lowest border-surface-container-highest hover:bg-surface-container text-tertiary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="font-title-sm text-xs font-semibold truncate max-w-[200px]">
                {activeEvent?.name || 'TechSpark 2025'}
              </span>
              <span className="font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-bold">
                {activeEvent?.date ? activeEvent.date.split('-').slice(1).join('/') : 'OCT 24'}
              </span>
              <span className="material-symbols-outlined text-sm text-secondary">expand_more</span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Quick Create Event Button */}
            <button
              onClick={() => navigate('/events/new')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-xs font-semibold transition-all active:scale-95 shadow-sm ${
                isLivePage 
                  ? 'bg-secondary text-surface-bright hover:bg-secondary/90' 
                  : 'bg-primary-container hover:bg-primary text-surface-container-lowest'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Event</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Notifications" 
                className={`relative p-2 rounded-lg transition-colors duration-150 active:scale-95 ${
                  isLivePage 
                    ? 'hover:bg-[#153426] text-surface-bright' 
                    : 'text-secondary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error border-2 border-surface"></span>
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-xl z-50 p-3 space-y-2 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-surface-container-highest pb-2">
                    <span className="font-headline-sm text-xs font-bold text-tertiary">Operational Notifications</span>
                    <button 
                      onClick={() => setIsNotifOpen(false)}
                      className="text-secondary text-xs hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                    {recentActivities.slice(0, 5).map(act => (
                      <div key={act.id} className="p-2 rounded bg-surface-container-low text-xs border border-surface-container-highest/60">
                        <p className="font-medium text-tertiary">{act.text}</p>
                        <span className="text-[10px] text-on-surface-variant mt-0.5 block">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Director Avatar */}
            <div 
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-full overflow-hidden border border-surface-container-highest ring-1 ring-primary-container/20 cursor-pointer"
              title="Avantika Sharma - Event Director"
            >
              <img 
                src={activeEvent?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuC6QACscJaMN82cnjf3bXLZkPCG877azkpDLwCUThmgtealxXh2NCou9A3Kwg8mm8rNtZifHOhOdsKjbu5Gko2BtqsQBWEJLSZY1YiZ4_xSzKJX4UaIKUxWmvca2iBvDm8p-nADmaBmDaOGNbH3yGdMx2Ym_0nS36IQoOMdT4sJoNqBe3xMmPgECHAmvgpgH0b2GFolGKHk7WQjftqkliZtnqNNLjAHcfgFn_Iu8kkE2M5duvscz9Y"}
                alt="Event Director"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Mobile Sub-Header: Active Event Pill Switcher */}
        <div className="md:hidden bg-surface-container px-margin-mobile py-2 flex items-center justify-between border-b border-surface-container-highest">
          <div 
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-2 cursor-pointer flex-1 mr-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
            <span className="font-title-sm text-xs font-bold text-tertiary truncate">
              {activeEvent?.name || 'TechSpark 2025'}
            </span>
          </div>
          <button 
            onClick={() => setIsSwitcherOpen(true)}
            className="font-label-sm text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-secondary font-bold flex items-center gap-1 shrink-0"
          >
            <span>SWITCH</span>
            <span className="material-symbols-outlined text-[12px]">expand_more</span>
          </button>
        </div>

        {/* ================= PAGE OUTLET ================= */}
        <div className="flex-1 pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-space-xs bg-surface border-t border-surface-container-highest shadow-lg">
          {bottomTabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-transform active:scale-95 duration-150
                ${isActive 
                  ? 'text-primary font-semibold bg-surface-container' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
                }
              `}
            >
              <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
              <span className="font-label-sm text-[11px] mt-0.5">{tab.label}</span>
            </NavLink>
          ))}
          {/* Mobile More Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[22px]">more_horiz</span>
            <span className="font-label-sm text-[11px] mt-0.5">More</span>
          </button>
        </nav>
      </div>

      {/* ================= MOBILE / TABLET FULL DRAWER ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-72 max-w-[85%] bg-surface h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                </div>
                <span className="font-headline-sm text-base font-bold text-primary">Planora</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container text-secondary flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-surface-container border-b border-surface-container-highest">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSwitcherOpen(true);
                }}
                className="w-full text-left p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between"
              >
                <div className="truncate">
                  <span className="text-[10px] text-secondary font-bold uppercase block">Active Event</span>
                  <span className="text-xs font-bold text-tertiary truncate block">{activeEvent?.name}</span>
                </div>
                <span className="material-symbols-outlined text-sm text-secondary">unfold_more</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scroll">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-2.5 rounded-lg font-title-sm text-xs transition-colors
                    ${isActive 
                      ? 'bg-primary-container text-surface-container-lowest font-semibold' 
                      : 'text-tertiary hover:bg-surface-container'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-surface-container-highest bg-surface-container-low">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/events/new');
                }}
                className="w-full bg-primary-container text-surface-container-lowest py-2.5 rounded-lg font-label-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Create New Event</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Event Switcher Modal */}
      <EventSwitcherModal 
        isOpen={isSwitcherOpen} 
        onClose={() => setIsSwitcherOpen(false)} 
      />

      {/* Global Floating AI Assistant (shown on all pages except full AI Planner workspace) */}
      {location.pathname !== '/ai-planner' && <AIAssistantWidget />}
    </div>
  );
};

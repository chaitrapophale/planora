import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export const LiveEventMode = () => {
  const { activeEvent, liveSchedule, updateLiveScheduleActivity, incidentLogs, addIncident, updateIncident } = useEvents();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('run-of-show'); // 'run-of-show' | 'incidents' | 'contacts'
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [delayInput, setDelayInput] = useState(15);
  const [aiProposalAccepted, setAiProposalAccepted] = useState(false);

  const [newIncident, setNewIncident] = useState({
    title: '',
    category: 'Technical',
    severity: 'Medium',
    description: '',
    reportedBy: 'Avantika Sharma'
  });

  const currentActivity = liveSchedule.find(a => a.status === 'current') || liveSchedule[3];
  const nextActivity = liveSchedule.find(a => a.status === 'upcoming') || liveSchedule[4];

  const handleReportIncident = (e) => {
    e.preventDefault();
    if (!newIncident.title.trim()) return;
    addIncident(newIncident);
    setNewIncident({
      title: '',
      category: 'Technical',
      severity: 'Medium',
      description: '',
      reportedBy: 'Avantika Sharma'
    });
    setIsIncidentModalOpen(false);
  };

  const handleApplyDelay = (e) => {
    e.preventDefault();
    if (!selectedActivity) return;
    updateLiveScheduleActivity(selectedActivity.id, {
      delayMin: Number(delayInput),
      actualTime: `${selectedActivity.scheduledTime} (+${delayInput}m)`
    });
    setIsDelayModalOpen(false);
  };

  const emergencyContacts = [
    { title: 'Local Police Bandobast Desk', phone: '+91 22 2262 0111', type: 'Law & Order' },
    { title: 'Fort Fire Station Standby Tender', phone: '+91 22 2261 4444', type: 'Fire Safety' },
    { title: 'Campus Medical Doctor (Dr. Ananya)', phone: '+91 98201 99887', type: 'Medical First Aid' },
    { title: 'Chief Venue Electrician (Dinesh)', phone: '+91 98203 44556', type: 'Generator & Grid' },
    { title: 'Lead Security Officer (Capt. Deshmukh)', phone: '+91 98206 11223', type: 'Crowd Control' }
  ];

  return (
    <main className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin pt-3 pb-24 space-y-4">
      {/* Live Operations Ticker Strip */}
      <div className="bg-[#153426] text-surface-bright p-3.5 rounded-xl border border-[#274e3c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-fixed"></span>
          </span>
          <div>
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary-fixed font-bold block">
              LIVE CONTROL ROOM • {activeEvent?.name}
            </span>
            <p className="text-xs text-surface-container-highest mt-0.5">
              Current Focus: <strong className="text-surface-bright">{currentActivity?.activity}</strong> ({currentActivity?.zone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="bg-error text-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Report Incident</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-[#274e3c] text-surface-bright hover:bg-[#32614b] px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            Exit Live
          </button>
        </div>
      </div>

      {/* Hero Now & Next Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CURRENT RUNNING ACTIVITY */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border-2 border-primary-container shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-primary-container text-surface-container-lowest px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
              <span>NOW HAPPENING</span>
            </div>
            <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
              {currentActivity?.scheduledTime}
            </span>
          </div>

          <div>
            <h2 className="font-headline-sm text-lg font-bold text-tertiary">
              {currentActivity?.activity}
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">location_on</span>
                <span>{currentActivity?.zone}</span>
              </span>
              <span className="text-outline">•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">person</span>
                <span>Lead: {currentActivity?.lead}</span>
              </span>
            </div>
          </div>

          {/* Delay Status & Action */}
          <div className="p-3 bg-secondary-container/30 rounded-lg border border-secondary-container/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-secondary block">
                {currentActivity?.delayMin ? `Current Drift: +${currentActivity.delayMin} mins` : 'Timeline On Track (0m drift)'}
              </span>
              <span className="text-[11px] text-on-surface-variant">Scheduled runtime: 45 mins</span>
            </div>
            <button
              onClick={() => {
                setSelectedActivity(currentActivity);
                setIsDelayModalOpen(true);
              }}
              className="px-2.5 py-1 rounded bg-surface-container-lowest border border-secondary text-secondary font-bold text-[11px] hover:bg-surface-container transition-colors"
            >
              Log Delay
            </button>
          </div>
        </div>

        {/* NEXT UP ACTIVITY */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                NEXT UP ON STAGE
              </span>
              <span className="font-mono text-xs font-bold text-secondary">
                {nextActivity?.scheduledTime}
              </span>
            </div>

            <h3 className="font-headline-sm text-base font-bold text-tertiary mt-2">
              {nextActivity?.activity}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Sector: {nextActivity?.zone} • Supervisor: {nextActivity?.lead}
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-highest/60 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Readiness Check:</span>
            <span className="font-bold text-primary-container bg-primary-fixed px-2 py-0.5 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Catering Crew Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Real-time Schedule Drift Assistant */}
      {currentActivity?.delayMin > 0 && !aiProposalAccepted && (
        <div className="bg-secondary-container/30 border-l-4 border-primary-container p-4 rounded-r-xl border border-surface-container-highest space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">auto_awesome</span>
            <span className="font-headline-sm text-xs font-bold text-tertiary">
              Planora Real-Time Re-Routing Proposal
            </span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Due to the <strong>+{currentActivity.delayMin} min acoustic delay</strong>, the subsequent lunch transition will bottleneck at Gate 2. AI suggests trimming the valedictory break by 10 mins and opening Quad Buffet Lines 3 &amp; 4 simultaneously.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setAiProposalAccepted(true)}
              className="bg-primary-container text-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
            >
              Confirm Suggested Schedule Shift
            </button>
            <button
              onClick={() => setAiProposalAccepted(true)}
              className="text-secondary text-xs hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Live Mode Tabs */}
      <div className="flex bg-surface-container p-1 rounded-xl border border-secondary/15 max-w-md">
        <button
          onClick={() => setActiveTab('run-of-show')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-title-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'run-of-show' 
              ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
              : 'text-tertiary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">format_list_numbered</span>
          <span>Full Run-of-Show</span>
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-title-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'incidents' 
              ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
              : 'text-tertiary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">report_problem</span>
          <span>Incidents ({incidentLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-title-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'contacts' 
              ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
              : 'text-tertiary hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">phone_in_talk</span>
          <span>Emergency Desk</span>
        </button>
      </div>

      {/* TAB 1: FULL RUN OF SHOW */}
      {activeTab === 'run-of-show' && (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-4 shadow-sm space-y-2.5">
          {liveSchedule.map((act) => (
            <div 
              key={act.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                act.status === 'current'
                  ? 'bg-secondary-container/20 border-primary-container ring-1 ring-primary-container'
                  : act.status === 'completed'
                  ? 'bg-surface-container-low/50 border-surface-container-highest/60 opacity-80'
                  : 'bg-surface-container-lowest border-surface-container-highest'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-secondary shrink-0 w-16">
                  {act.scheduledTime}
                </span>

                <div className="min-w-0">
                  <h4 className={`font-title-sm text-xs font-bold truncate ${
                    act.status === 'completed' ? 'line-through text-outline' : 'text-tertiary'
                  }`}>
                    {act.activity}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
                    <span>{act.zone}</span>
                    <span>•</span>
                    <span>Lead: {act.lead}</span>
                    {act.delayMin > 0 && (
                      <span className="text-error font-bold font-mono">+{act.delayMin}m delay</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const nextStatus = act.status === 'completed' ? 'upcoming' : 'completed';
                    updateLiveScheduleActivity(act.id, { status: nextStatus });
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-transform active:scale-95 ${
                    act.status === 'completed'
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : act.status === 'current'
                      ? 'bg-primary-container text-surface-container-lowest animate-pulse'
                      : 'bg-surface-container text-secondary'
                  }`}
                >
                  {act.status}
                </button>

                <button
                  onClick={() => {
                    setSelectedActivity(act);
                    setIsDelayModalOpen(true);
                  }}
                  title="Adjust delay"
                  className="p-1 rounded text-secondary hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-base">more_time</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: INCIDENT LOG */}
      {activeTab === 'incidents' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-headline-sm text-xs font-bold text-tertiary">Incident &amp; Anomaly Tracker</span>
            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="bg-primary-container text-surface-container-lowest px-3 py-1 rounded-lg text-xs font-bold"
            >
              + Log New Incident
            </button>
          </div>

          <div className="space-y-2.5">
            {incidentLogs.map(inc => (
              <div 
                key={inc.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        inc.severity === 'High' ? 'bg-error text-surface-container-lowest' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="text-[11px] font-mono text-secondary font-bold">{inc.timestamp}</span>
                      <span className="text-[11px] text-outline">•</span>
                      <span className="text-[11px] text-tertiary font-medium">{inc.category}</span>
                    </div>
                    <h4 className="font-title-sm text-xs font-bold text-tertiary">{inc.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{inc.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      const next = inc.status === 'Resolved' ? 'Investigating' : 'Resolved';
                      updateIncident(inc.id, { status: next });
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold shrink-0 ${
                      inc.status === 'Resolved' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-tertiary'
                    }`}
                  >
                    {inc.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-3">
          <div className="border-b border-surface-container-highest pb-2.5">
            <h3 className="font-headline-sm text-base font-bold text-tertiary">Mission-Critical Emergency Wire</h3>
            <p className="text-xs text-on-surface-variant">Direct operational contacts for on-site authorities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-surface-container-low border border-surface-container-highest/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-secondary">{contact.type}</span>
                  <h4 className="font-title-sm text-xs font-bold text-tertiary mt-0.5">{contact.title}</h4>
                  <a href={`tel:${contact.phone}`} className="text-xs font-bold text-primary font-mono mt-1 block hover:underline">
                    {contact.phone}
                  </a>
                </div>
                <a 
                  href={`tel:${contact.phone}`}
                  className="w-8 h-8 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center shrink-0 shadow-xs hover:bg-primary"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INCIDENT REPORT MODAL */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleReportIncident}
            className="bg-surface-container-lowest border-2 border-error rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined">report</span>
                <h3 className="font-headline-sm text-base font-bold text-tertiary">Log Operational Incident</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsIncidentModalOpen(false)}
                className="text-secondary p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Incident Headline *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Channel 3 Wireless Mic RF Drop"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Severity</label>
                <select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="High">High (Immediate Action)</option>
                  <option value="Medium">Medium (Attention Required)</option>
                  <option value="Low">Low (Informational)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Classification</label>
                <select
                  value={newIncident.category}
                  onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Technical">Technical / AV</option>
                  <option value="Crowd Flow">Crowd Flow / Security</option>
                  <option value="Catering">Catering / Food</option>
                  <option value="Medical">Medical / First Aid</option>
                  <option value="Weather">Weather / Staging</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Observation &amp; Action Taken</label>
              <textarea 
                rows="2"
                placeholder="Describe exact symptoms, root cause, and initial containment step taken."
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                type="button"
                onClick={() => setIsIncidentModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-error text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Commit Incident
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELAY LOGGING MODAL */}
      {isDelayModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleApplyDelay}
            className="bg-surface-container-lowest border-2 border-secondary rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Log Runtime Delay</h3>
              <button 
                type="button" 
                onClick={() => setIsDelayModalOpen(false)}
                className="text-secondary p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] text-on-surface-variant block">Activity</span>
              <p className="font-bold text-xs text-tertiary mt-0.5">{selectedActivity.activity}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Delay Duration (Minutes)</label>
              <input 
                type="number"
                min="1"
                max="120"
                value={delayInput}
                onChange={(e) => setDelayInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-bold tabular-nums"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                type="button"
                onClick={() => setIsDelayModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-secondary text-surface-bright text-xs font-bold"
              >
                Apply Delay
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

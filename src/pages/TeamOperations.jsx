import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const TeamOperations = () => {
  const { teamMembers, createTeamMember, updateTeamMember, deleteTeamMember, activeEvent } = useEvents();
  const [filterDept, setFilterDept] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Stage Coordinator',
    department: 'Technical Production',
    shift: 'Shift 01 (07:00 - 16:00)',
    status: 'On Duty',
    phone: '+91 98200 00000',
    email: ''
  });

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Sound Check Shift Synchronization',
      time: '09:15 AM',
      author: 'Avantika Sharma',
      priority: 'High',
      content: 'All audio and electrical leads must report to St. Xavier Quad console by 14:00 sharp for line array alignment.'
    },
    {
      id: 'ann-2',
      title: 'Meal Box Counter Stationing',
      time: '11:30 AM',
      author: 'Meera Sen',
      priority: 'Normal',
      content: 'Jain food boxes have dedicated QR scanner verification at Station 4. Please ensure volunteers are briefed.'
    }
  ]);

  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    createTeamMember(newMember);
    setNewMember({
      name: '',
      role: 'Stage Coordinator',
      department: 'Technical Production',
      shift: 'Shift 01 (07:00 - 16:00)',
      status: 'On Duty',
      phone: '+91 98200 00000',
      email: ''
    });
    setIsModalOpen(false);
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    setAnnouncements(prev => [
      {
        id: `ann-${Date.now()}`,
        title: 'Operations Broadcast',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: 'Avantika Sharma (Director)',
        priority: 'Normal',
        content: newAnnouncementText
      },
      ...prev
    ]);
    setNewAnnouncementText('');
  };

  const filteredMembers = teamMembers.filter(m => {
    return filterDept === 'ALL' || m.department === filterDept;
  });

  const onDutyCount = teamMembers.filter(m => m.status === 'On Duty' || m.status === 'On Ground').length;

  return (
    <main className="w-full max-w-6xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>INTERNAL CREW &amp; ROLE DISPATCH</span>
            <span>•</span>
            <span className="text-primary-container font-bold">{activeEvent?.attendance} Pax • Mumbai</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
            Team &amp; Operations Command
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Internal organizer coordination, roster shifts, and mission assignments for <strong className="text-tertiary">{activeEvent?.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container hover:bg-primary text-surface-container-lowest px-4 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Roster Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Total Crew Roster</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1 tabular-nums">{teamMembers.length} Members</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Currently On Duty</span>
          <p className="font-headline-sm text-xl font-bold text-primary-container mt-1 tabular-nums">{onDutyCount} On Ground</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Active Shift</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">Shift 02 / 03</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Incident Escalation</span>
          <p className="font-headline-sm text-xl font-bold text-primary-fixed-variant mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span>Channel 1 Active</span>
          </p>
        </div>
      </div>

      {/* Internal Operations Broadcast Feed */}
      <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-xl">campaign</span>
            <h3 className="font-headline-sm text-sm font-bold text-tertiary">Internal Operations Broadcast Dispatch</h3>
          </div>
          <span className="text-[10px] font-bold text-secondary uppercase bg-surface-container px-2 py-0.5 rounded">
            Internal Staff Only
          </span>
        </div>

        {/* Post Form */}
        <form onSubmit={handlePostAnnouncement} className="flex gap-2">
          <input 
            type="text"
            placeholder="Broadcast urgent shift update or technical notice to all on-ground crew..."
            value={newAnnouncementText}
            onChange={(e) => setNewAnnouncementText(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary focus:outline-none focus:ring-1 focus:ring-primary-container"
          />
          <button
            type="submit"
            disabled={!newAnnouncementText.trim()}
            className="bg-primary-container hover:bg-primary disabled:opacity-50 text-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            Dispatch
          </button>
        </form>

        <div className="space-y-2 pt-1">
          {announcements.map(ann => (
            <div key={ann.id} className="p-3 rounded-lg bg-surface-container-low border border-surface-container-highest/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-tertiary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>{ann.title}</span>
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">{ann.time} • {ann.author}</span>
              </div>
              <p className="text-on-surface-variant pl-3 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Roster Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-base font-bold text-tertiary">Crew Deployment Roster</h2>
          <div className="flex items-center gap-1.5 text-xs">
            {['ALL', 'Technical Production', 'Compliance & Safety', 'Hospitality & Food'].map(d => (
              <button
                key={d}
                onClick={() => setFilterDept(d)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filterDept === d 
                    ? 'bg-primary-container text-surface-container-lowest' 
                    : 'bg-surface-container text-tertiary hover:bg-surface-container-high'
                }`}
              >
                {d === 'ALL' ? 'All Roles' : d.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(mem => (
            <div 
              key={mem.id}
              className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm flex flex-col justify-between space-y-3 hover:border-secondary transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={mem.avatar} 
                      alt={mem.name} 
                      className="w-10 h-10 rounded-full object-cover border border-primary-container/40"
                    />
                    <div>
                      <h4 className="font-title-sm text-sm font-bold text-tertiary leading-tight">{mem.name}</h4>
                      <p className="text-xs text-primary font-medium">{mem.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = mem.status === 'On Duty' ? 'Standby' : mem.status === 'Standby' ? 'Off Shift' : 'On Duty';
                      updateTeamMember(mem.id, { status: next });
                    }}
                    title="Toggle duty status"
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer transition-transform active:scale-95 ${
                      mem.status === 'On Duty' || mem.status === 'On Ground'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : mem.status === 'Standby'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {mem.status}
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-surface-container-highest/60 text-xs space-y-1 text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-semibold">Department:</span>
                    <span className="text-tertiary font-medium">{mem.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-semibold">Shift:</span>
                    <span className="text-tertiary font-medium">{mem.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-semibold">Contact:</span>
                    <span className="text-tertiary font-mono">{mem.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-container-highest text-xs">
                <span className="text-[11px] font-bold text-secondary">
                  {mem.tasksCount || 0} Tasks Assigned
                </span>

                {teamMembers.length > 1 && (
                  <button
                    onClick={() => deleteTeamMember(mem.id)}
                    className="text-outline hover:text-error text-xs p-1"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADD MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleCreateMember}
            className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Enroll Team Coordinator</h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-secondary p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Full Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Internal Role</label>
                <input 
                  type="text"
                  placeholder="e.g. Stage Master"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Department</label>
                <select
                  value={newMember.department}
                  onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Technical Production">Technical Production</option>
                  <option value="Compliance & Safety">Compliance &amp; Safety</option>
                  <option value="Hospitality & Food">Hospitality &amp; Food</option>
                  <option value="Security & Evacuation">Security &amp; Evacuation</option>
                  <option value="Executive Command">Executive Command</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Shift Roster</label>
                <select
                  value={newMember.shift}
                  onChange={(e) => setNewMember({ ...newMember, shift: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Shift 01 (07:00 - 16:00)">Shift 01 (07:00 - 16:00)</option>
                  <option value="Shift 02 (13:00 - 22:30)">Shift 02 (13:00 - 22:30)</option>
                  <option value="All Day (08:00 - 22:00)">All Day (08:00 - 22:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Initial Status</label>
                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Standby">Standby</option>
                  <option value="Off Shift">Off Shift</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Phone / Walkie Call-Sign</label>
              <input 
                type="text"
                placeholder="+91 98200 12345"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
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
                Enroll Crew Member
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

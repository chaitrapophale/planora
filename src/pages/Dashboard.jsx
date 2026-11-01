import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export const Dashboard = () => {
  const { 
    events, 
    activeEvent, 
    setActiveEventId, 
    tasks, 
    toggleTaskComplete, 
    expenses, 
    teamMembers,
    recentActivities,
    formatCurrency 
  } = useEvents();
  const navigate = useNavigate();

  // Metrics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const readyPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : activeEvent?.readiness || 78;

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const plannedBudget = Number(activeEvent?.budget) || 200000;

  const urgentTasks = tasks.filter(t => t.status !== 'completed' && (t.priority === 'critical' || t.priority === 'high' || t.overdue));
  const activeTeamCount = teamMembers.filter(m => m.status === 'On Duty' || m.status === 'On Ground').length;

  const otherEvents = events.filter(e => e.id !== activeEvent?.id);

  return (
    <main className="w-full max-w-6xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 space-y-6">
      {/* ================= HERO EVENT OVERVIEW CARD ================= */}
      <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-0.5 rounded-full mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm uppercase font-bold">{activeEvent?.status || 'In Production'}</span>
            </div>
            <h1 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-tertiary font-bold tracking-tight">
              {activeEvent?.fullName || activeEvent?.name}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {activeEvent?.category} • {activeEvent?.attendance} Guests Expected
            </p>
          </div>
          <div className="sm:text-right shrink-0">
            <span className="inline-block bg-surface-container text-tertiary font-label-sm text-label-sm px-2.5 py-1 rounded border border-surface-container-highest font-bold">
              {activeEvent?.daysLeft !== undefined ? `${activeEvent.daysLeft} Days Left` : 'Upcoming'}
            </span>
            <p className="font-label-sm text-label-sm text-secondary mt-1 font-semibold">{activeEvent?.date}</p>
          </div>
        </div>

        {/* Venue & Location Anchor */}
        <div className="flex items-center justify-between gap-2 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-3.5 py-2.5 rounded-lg border border-surface-container-highest/60">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">location_on</span>
            <span className="truncate text-tertiary font-medium">{activeEvent?.venue}</span>
          </div>
          <button 
            onClick={() => navigate('/venue')}
            className="text-xs font-semibold text-primary-container hover:underline shrink-0"
          >
            Floorplan
          </button>
        </div>

        {/* Preparation Progress Section */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-body-sm font-body-sm">
            <span className="text-secondary font-semibold">Preparation Progress</span>
            <span className="text-primary-container font-bold font-title-sm">{readyPercent}% Complete</span>
          </div>
          {/* Dual-tone custom progress bar */}
          <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex">
            <div 
              className="bg-primary-container h-full rounded-l-full transition-all duration-500" 
              style={{ width: `${readyPercent}%` }}
            ></div>
            <div 
              className="bg-secondary-container h-full transition-all duration-500" 
              style={{ width: `${Math.min(15, 100 - readyPercent)}%` }}
            ></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant text-right">
            Production readiness checkpoint active
          </p>
        </div>

        {/* 3 Key Operational Metrics Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-surface-container-highest/60">
          {/* Metric 1: Budget */}
          <div 
            onClick={() => navigate('/budget')}
            className="bg-surface-container-low/70 p-3 rounded-lg border border-surface-container-highest/50 hover:border-primary-container cursor-pointer transition-colors"
          >
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Budget Spent</p>
            <p className="font-title-md text-title-md text-tertiary font-bold mt-1 tabular-nums">
              {formatCurrency(totalSpent)}
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              of {formatCurrency(plannedBudget)}
            </p>
          </div>

          {/* Metric 2: Tasks */}
          <div 
            onClick={() => navigate('/tasks')}
            className="bg-surface-container-low/70 p-3 rounded-lg border border-surface-container-highest/50 hover:border-primary-container cursor-pointer transition-colors"
          >
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Tasks Ready</p>
            <p className="font-title-md text-title-md text-primary-container font-bold mt-1 tabular-nums">
              {completedTasks} / {totalTasks}
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              {totalTasks - completedTasks} Pending
            </p>
          </div>

          {/* Metric 3: Team */}
          <div 
            onClick={() => navigate('/team')}
            className="bg-surface-container-low/70 p-3 rounded-lg border border-surface-container-highest/50 hover:border-primary-container cursor-pointer transition-colors"
          >
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Team Ready</p>
            <p className="font-title-md text-title-md text-tertiary font-bold mt-1 tabular-nums">
              {activeTeamCount} Active
            </p>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              On Ground Crew
            </p>
          </div>
        </div>
      </section>

      {/* ================= AI ASSISTANT QUICK ASSIST WIDGET ================= */}
      <section className="bg-secondary-container/30 border-l-4 border-primary-container border-t border-r border-b border-surface-container-highest rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary-container uppercase font-bold tracking-wider">
                Planora AI Dispatch
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded text-secondary font-semibold border border-surface-container-highest">
                Deterministic Engine Active
              </span>
            </div>
            <p className="font-title-sm text-title-sm text-tertiary font-semibold mt-1">
              2 critical recommendations ready for technical &amp; schedule rehearsal.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Forecast warns of weather shifts; audio gear calibration buffer and emergency ramp checks recommended.
            </p>
          </div>
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-2">
          <button 
            onClick={() => navigate('/ai-planner?prompt=Review%20Rain%20Contingency%20Plan')}
            className="bg-surface-container-lowest hover:bg-surface-container text-tertiary px-3 py-1.5 rounded-lg border border-surface-container-highest font-label-md text-xs flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">thunderstorm</span>
            <span>Review Rain Contingency</span>
          </button>
          <button 
            onClick={() => navigate('/ai-planner?prompt=Reallocate%20Sound%20Budget')}
            className="bg-surface-container-lowest hover:bg-surface-container text-tertiary px-3 py-1.5 rounded-lg border border-surface-container-highest font-label-md text-xs flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">swap_horiz</span>
            <span>Reallocate ₹15k Sound Budget</span>
          </button>
          <button 
            onClick={() => navigate('/ai-planner?prompt=Draft%20MC%20Run-Sheet')}
            className="bg-surface-container-lowest hover:bg-surface-container text-tertiary px-3 py-1.5 rounded-lg border border-surface-container-highest font-label-md text-xs flex items-center gap-1.5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">description</span>
            <span>Draft MC Run-Sheet</span>
          </button>
        </div>
      </section>

      {/* ================= HIGH PRIORITY TASKS SECTION ================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm text-tertiary font-bold">High Priority Actions</h2>
            <span className="bg-error text-surface-container-lowest font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
              {urgentTasks.length}
            </span>
          </div>
          <button 
            onClick={() => navigate('/tasks')}
            className="font-label-md text-label-md text-primary-container font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All Tasks</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {urgentTasks.slice(0, 4).map(task => {
            const isDone = task.status === 'completed';
            return (
              <div 
                key={task.id}
                className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-container-highest shadow-sm flex items-start justify-between gap-3 transition-colors hover:border-secondary"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <div 
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded border-2 border-primary-container flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      isDone ? 'bg-primary-container text-surface-container-lowest' : 'hover:bg-surface-container'
                    }`}
                    title={isDone ? "Mark incomplete" : "Mark completed"}
                  >
                    {isDone && <span className="material-symbols-outlined text-base">check</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-[10px] uppercase font-bold ${
                        task.overdue || task.delayStatus === 'Critical Delay'
                          ? 'bg-tertiary text-surface-container-lowest'
                          : task.status === 'in-progress'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container text-secondary border border-surface-container-highest'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {task.overdue ? 'error' : 'schedule'}
                        </span>
                        {task.delayStatus || task.status}
                      </span>
                      <span className="font-label-sm text-[11px] text-secondary font-bold">
                        {task.dueDate} {task.dueTime}
                      </span>
                    </div>

                    <h3 className={`font-title-sm text-sm font-bold text-tertiary mt-1 truncate ${
                      isDone ? 'line-through text-outline' : ''
                    }`}>
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1 text-on-surface-variant font-body-sm text-xs truncate">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-secondary">person</span>
                        {task.assignedTo}
                      </span>
                      <span className="text-outline">•</span>
                      <span>{task.category}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/tasks')}
                  aria-label="Task options" 
                  className="text-secondary p-1 rounded hover:bg-surface-container shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
            );
          })}

          {urgentTasks.length === 0 && (
            <div className="p-4 rounded-xl bg-surface-container text-center text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl text-primary-container mb-1">task_alt</span>
              <p className="font-semibold text-tertiary">All high priority tasks completed!</p>
              <p className="text-xs mt-0.5">Keep track of standard timeline tasks in the Tasks tab.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= UPCOMING EVENTS SWITCHER ================= */}
      <section className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-tertiary font-bold">Other Scheduled Events</h2>
          <button 
            onClick={() => navigate('/events')}
            className="font-label-sm text-label-sm text-primary-container font-semibold hover:underline"
          >
            View All ({events.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherEvents.slice(0, 2).map(ev => (
            <div 
              key={ev.id}
              onClick={() => setActiveEventId(ev.id)}
              className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm flex flex-col justify-between space-y-3 hover:border-primary-container transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
                    {ev.date}
                  </span>
                  <h3 className="font-title-md text-title-md text-tertiary font-bold mt-0.5 group-hover:text-primary transition-colors">
                    {ev.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-xs">
                    {ev.venue}
                  </p>
                </div>
                <span className="bg-surface-container-high text-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                  {formatCurrency(ev.budget)}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-secondary">Progress</span>
                  <span className="text-primary-container font-bold">{ev.readiness}% prepped</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-container h-full rounded-full" 
                    style={{ width: `${ev.readiness}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RECENT ACTIVITY SECTION ================= */}
      <section className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-4 shadow-sm space-y-3 pb-6">
        <div className="flex items-center justify-between border-b border-surface-container-highest pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
            <h3 className="font-headline-sm text-sm font-bold text-tertiary">Live Operational Audit Feed</h3>
          </div>
          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
            Real-time updates
          </span>
        </div>

        <div className="space-y-2">
          {recentActivities.slice(0, 4).map(act => (
            <div key={act.id} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span className="text-tertiary font-medium">{act.text}</span>
              </div>
              <span className="text-on-surface-variant text-[11px] shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

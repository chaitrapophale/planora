import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const TasksTimeline = () => {
  const { activeEvent, tasks, createTask, toggleTaskComplete, deleteTask, updateTask, teamMembers } = useEvents();
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'timeline' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'high',
    category: 'Audio / Tech',
    assignedTo: teamMembers[0]?.name || 'Avantika Sharma',
    dueDate: activeEvent?.date || '2025-10-24',
    dueTime: '15:00',
    status: 'todo'
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    createTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'high',
      category: 'Audio / Tech',
      assignedTo: teamMembers[0]?.name || 'Avantika Sharma',
      dueDate: activeEvent?.date || '2025-10-24',
      dueTime: '15:00',
      status: 'todo'
    });
    setIsCreateModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status.toUpperCase() === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority.toUpperCase() === priorityFilter;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = totalTasks - completedCount;
  const overdueCount = tasks.filter(t => t.overdue || (t.status !== 'completed' && t.delayStatus === 'Critical Delay')).length;

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold">
              Operations &amp; Run-Sheet
            </span>
            <span className="text-xs text-outline-variant">•</span>
            <span className="font-label-sm text-xs text-primary font-bold">Live Execution Mode</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold">
            Tasks &amp; Production Timeline
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Active for <strong className="text-tertiary">{activeEvent?.name}</strong> • {activeEvent?.venue}
          </p>
        </div>

        {/* View Switcher Tabs & Add Task */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-surface-container p-1 rounded-lg border border-secondary/15">
            <button
              onClick={() => setCurrentView('list')}
              className={`px-3 py-1.5 rounded text-xs font-title-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'list' 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                  : 'text-tertiary hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              <span>List View</span>
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`px-3 py-1.5 rounded text-xs font-title-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'timeline' 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                  : 'text-tertiary hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_timeline</span>
              <span>Schedule / Run-Sheet</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-3 py-1.5 rounded text-xs font-title-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'calendar' 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                  : 'text-tertiary hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary-container hover:bg-primary text-surface-container-lowest px-3 py-2 rounded-lg font-label-md text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Total Scope</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{totalTasks} Tasks</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Completed</span>
          <p className="font-headline-sm text-xl font-bold text-primary-container mt-1">{completedCount} Done</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Pending</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{pendingCount} Active</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Critical &amp; Delay</span>
          <p className="font-headline-sm text-xl font-bold text-error mt-1">{overdueCount} Urgent</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-highest shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {['ALL', 'TODO', 'IN-PROGRESS', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                statusFilter === status 
                  ? 'bg-primary-container text-surface-container-lowest' 
                  : 'bg-surface-container text-tertiary hover:bg-surface-container-high'
              }`}
            >
              {status === 'TODO' ? 'To Do' : status === 'IN-PROGRESS' ? 'In Progress' : status === 'COMPLETED' ? 'Completed' : 'All Status'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary font-semibold"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-secondary text-base">search</span>
            <input 
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-surface-container-highest bg-surface-container-low text-tertiary focus:outline-none focus:ring-1 focus:ring-primary-container w-44"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {currentView === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isDone = task.status === 'completed';
            return (
              <div 
                key={task.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest shadow-sm flex items-start justify-between gap-3 hover:border-secondary transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <div 
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded border-2 border-primary-container flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      isDone ? 'bg-primary-container text-surface-container-lowest' : 'hover:bg-surface-container'
                    }`}
                    title={isDone ? "Mark as To Do" : "Mark as Completed"}
                  >
                    {isDone && <span className="material-symbols-outlined text-base">check</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        task.overdue || task.delayStatus === 'Critical Delay'
                          ? 'bg-tertiary text-surface-container-lowest'
                          : task.status === 'in-progress'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : isDone
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {isDone ? 'check_circle' : task.overdue ? 'error' : 'schedule'}
                        </span>
                        {task.delayStatus || task.status}
                      </span>

                      <span className="text-xs font-bold text-secondary">
                        Due: {task.dueDate} • {task.dueTime}
                      </span>

                      <span className="text-outline text-xs">•</span>
                      <span className="text-xs font-semibold text-tertiary bg-surface-container px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                    </div>

                    <h3 className={`font-title-sm text-sm font-bold text-tertiary ${isDone ? 'line-through text-outline' : ''}`}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-secondary">person</span>
                        <span>Assigned: {task.assignedTo}</span>
                      </span>
                      <span className="text-outline">•</span>
                      <span className="uppercase text-[10px] font-bold text-secondary">
                        Priority: {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                    className="p-1.5 rounded hover:bg-error-container/30 text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-1 text-outline">checklist</span>
              <p className="font-semibold text-sm">No tasks match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SCHEDULE / RUN-SHEET VIEW */}
      {currentView === 'timeline' && (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Chronological Production Run-Sheet</h3>
              <p className="text-xs text-on-surface-variant">Ordered timeline of stage checkpoints &amp; gate operations</p>
            </div>
            <span className="text-xs font-bold text-secondary bg-surface-container px-2.5 py-1 rounded">
              {activeEvent?.date}
            </span>
          </div>

          <div className="relative border-l-2 border-primary-container/30 ml-4 space-y-5 py-2">
            {tasks.map((task, idx) => (
              <div key={task.id} className="relative pl-6">
                {/* Timeline node */}
                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${
                  task.status === 'completed' 
                    ? 'bg-primary-container' 
                    : task.priority === 'critical'
                    ? 'bg-error animate-pulse'
                    : 'bg-secondary'
                }`}></span>

                <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-highest/60 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-secondary">{task.dueTime}</span>
                      <span className="text-outline text-xs">•</span>
                      <span className="text-[10px] uppercase font-bold text-primary-container bg-surface-container px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                    </div>
                    <h4 className="font-title-sm text-xs font-bold text-tertiary">{task.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{task.assignedTo}</p>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                    task.status === 'completed' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CALENDAR VIEW */}
      {currentView === 'calendar' && (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
            <h3 className="font-headline-sm text-base font-bold text-tertiary">Production Preparation Calendar</h3>
            <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded">
              October 2025
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-[11px] font-bold text-secondary uppercase pb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isEventDay = day === 24;
              const dayTasks = tasks.filter(t => t.dueDate.endsWith(`-${day < 10 ? '0' + day : day}`));
              return (
                <div 
                  key={day}
                  className={`min-h-[70px] p-1.5 rounded-lg border text-left flex flex-col justify-between ${
                    isEventDay 
                      ? 'bg-secondary-container/30 border-primary-container ring-1 ring-primary-container' 
                      : 'bg-surface-container-low border-surface-container-highest/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isEventDay ? 'text-primary-container' : 'text-tertiary'}`}>
                      {day}
                    </span>
                    {isEventDay && (
                      <span className="text-[9px] font-bold text-primary-container bg-primary-fixed px-1 rounded">
                        EVENT
                      </span>
                    )}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="space-y-0.5 mt-1">
                      {dayTasks.slice(0, 2).map(dt => (
                        <p key={dt.id} className="text-[10px] truncate bg-surface-container-lowest px-1 py-0.5 rounded border border-surface-container-highest/60 text-tertiary font-medium">
                          {dt.title}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <form 
            onSubmit={handleCreateTask}
            className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">add_task</span>
                <h3 className="font-headline-sm text-base font-bold text-tertiary">Dispatch New Operation Task</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-secondary hover:bg-surface-container p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Task Title *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Acoustic Monitor Calibration"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Operational Brief / SLA</label>
              <textarea 
                rows="2"
                placeholder="Specific instructions, check frequencies, and equipment references"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Category</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                >
                  <option value="Audio / Tech">Audio / Tech</option>
                  <option value="Licensing / Govt">Licensing / Govt</option>
                  <option value="Catering">Catering</option>
                  <option value="Staging">Staging</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Safety">Safety</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Due Date</label>
                <input 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-tertiary uppercase mb-1">Due Time</label>
                <input 
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-tertiary uppercase mb-1">Assign Internal Team Lead</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
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
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

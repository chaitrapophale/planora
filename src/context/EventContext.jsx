import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EVENTS,
  INITIAL_TASKS,
  INITIAL_EXPENSES,
  INITIAL_FOOD_ITEMS,
  INITIAL_SUPPLIES,
  INITIAL_VENUE_ZONES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_LIVE_SCHEDULE,
  INITIAL_INCIDENTS,
  INITIAL_SETTINGS
} from './initialData';

const EventContext = createContext();

const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage`, err);
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => loadFromStorage('planora_events', INITIAL_EVENTS));
  const [activeEventId, setActiveEventIdState] = useState(() => {
    const stored = localStorage.getItem('planora_active_event_id');
    return stored || 'ev-1';
  });
  const [tasks, setTasks] = useState(() => loadFromStorage('planora_tasks', INITIAL_TASKS));
  const [expenses, setExpenses] = useState(() => loadFromStorage('planora_expenses', INITIAL_EXPENSES));
  const [foodItems, setFoodItems] = useState(() => loadFromStorage('planora_food', INITIAL_FOOD_ITEMS));
  const [supplies, setSupplies] = useState(() => loadFromStorage('planora_supplies', INITIAL_SUPPLIES));
  const [venueZones, setVenueZones] = useState(() => loadFromStorage('planora_venue_zones', INITIAL_VENUE_ZONES));
  const [teamMembers, setTeamMembers] = useState(() => loadFromStorage('planora_team', INITIAL_TEAM_MEMBERS));
  const [liveSchedule, setLiveSchedule] = useState(() => loadFromStorage('planora_live_schedule', INITIAL_LIVE_SCHEDULE));
  const [incidentLogs, setIncidentLogs] = useState(() => loadFromStorage('planora_incidents', INITIAL_INCIDENTS));
  const [settings, setSettings] = useState(() => loadFromStorage('planora_settings', INITIAL_SETTINGS));
  const [recentActivities, setRecentActivities] = useState(() => loadFromStorage('planora_activity', [
    { id: 'act-1', text: 'Stage Rigging safety inspection signed off', time: '10 mins ago', type: 'task' },
    { id: 'act-2', text: 'Payment cleared: Staging & German Hanger (₹52,000)', time: '45 mins ago', type: 'budget' },
    { id: 'act-3', text: 'Incident cleared: RF interference resolved on Ch 3', time: '1 hour ago', type: 'incident' },
    { id: 'act-4', text: 'Royal Flavors catering delivery window re-confirmed', time: '2 hours ago', type: 'food' }
  ]));

  // Auto-sync to storage
  useEffect(() => saveToStorage('planora_events', events), [events]);
  useEffect(() => localStorage.setItem('planora_active_event_id', activeEventId), [activeEventId]);
  useEffect(() => saveToStorage('planora_tasks', tasks), [tasks]);
  useEffect(() => saveToStorage('planora_expenses', expenses), [expenses]);
  useEffect(() => saveToStorage('planora_food', foodItems), [foodItems]);
  useEffect(() => saveToStorage('planora_supplies', supplies), [supplies]);
  useEffect(() => saveToStorage('planora_venue_zones', venueZones), [venueZones]);
  useEffect(() => saveToStorage('planora_team', teamMembers), [teamMembers]);
  useEffect(() => saveToStorage('planora_live_schedule', liveSchedule), [liveSchedule]);
  useEffect(() => saveToStorage('planora_incidents', incidentLogs), [incidentLogs]);
  useEffect(() => saveToStorage('planora_settings', settings), [settings]);
  useEffect(() => saveToStorage('planora_activity', recentActivities), [recentActivities]);

  // Current active event
  const activeEvent = events.find(e => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  const setActiveEventId = (id) => {
    setActiveEventIdState(id);
    addActivity(`Switched active event to: ${events.find(e => e.id === id)?.name || id}`, 'event');
  };

  const addActivity = (text, type = 'general') => {
    const newAct = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setRecentActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Event CRUD
  const createEvent = (eventData) => {
    const newId = `ev-${Date.now()}`;
    const newEvent = {
      id: newId,
      name: eventData.name,
      fullName: eventData.fullName || eventData.name,
      category: eventData.category || 'General Event',
      date: eventData.date || new Date().toISOString().split('T')[0],
      endDate: eventData.endDate || eventData.date,
      startTime: eventData.startTime || '09:00',
      endTime: eventData.endTime || '18:00',
      venue: eventData.venue || 'Main Venue',
      venueAddress: eventData.venueAddress || '',
      attendance: Number(eventData.attendance) || 100,
      budget: Number(eventData.budget) || 100000,
      currency: eventData.currency || settings.currency || 'INR',
      status: 'In Production',
      daysLeft: 14,
      readiness: 25,
      description: eventData.description || '',
      director: settings.organizerName || 'Avantika Sharma',
      avatar: activeEvent?.avatar || INITIAL_EVENTS[0].avatar
    };

    setEvents(prev => [newEvent, ...prev]);
    setActiveEventIdState(newId);
    addActivity(`Created new event: "${newEvent.name}"`, 'event');
    return newEvent;
  };

  const updateEvent = (id, fields) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const updated = { ...ev, ...fields };
        addActivity(`Updated event details: "${updated.name}"`, 'event');
        return updated;
      }
      return ev;
    }));
  };

  const deleteEvent = (id) => {
    const target = events.find(e => e.id === id);
    if (!target) return;
    setEvents(prev => prev.filter(e => e.id !== id));
    addActivity(`Deleted event: "${target.name}"`, 'event');
    if (activeEventId === id) {
      const remaining = events.filter(e => e.id !== id);
      if (remaining.length > 0) {
        setActiveEventIdState(remaining[0].id);
      }
    }
  };

  // Task CRUD
  const createTask = (taskData) => {
    const newTask = {
      id: `tsk-${Date.now()}`,
      eventId: taskData.eventId || activeEventId,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      category: taskData.category || 'General',
      assignedTo: taskData.assignedTo || 'Unassigned',
      assignedId: taskData.assignedId || '',
      dueDate: taskData.dueDate || activeEvent.date,
      dueTime: taskData.dueTime || '12:00',
      delayStatus: taskData.status === 'completed' ? 'Verified' : 'In-Progress',
      overdue: false
    };

    setTasks(prev => [newTask, ...prev]);
    addActivity(`Created task: "${newTask.title}"`, 'task');
    return newTask;
  };

  const updateTask = (id, fields) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...fields };
        if (fields.status === 'completed' && t.status !== 'completed') {
          addActivity(`Completed task: "${t.title}"`, 'task');
        }
        return updated;
      }
      return t;
    }));
  };

  const toggleTaskComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isDone = t.status === 'completed';
        const nextStatus = isDone ? 'todo' : 'completed';
        addActivity(`${isDone ? 'Reopened' : 'Marked completed'}: "${t.title}"`, 'task');
        return {
          ...t,
          status: nextStatus,
          delayStatus: nextStatus === 'completed' ? 'Verified' : 'In-Progress',
          overdue: false
        };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (target) addActivity(`Deleted task: "${target.title}"`, 'task');
  };

  // Expense CRUD
  const createExpense = (expData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      eventId: expData.eventId || activeEventId,
      title: expData.title,
      category: expData.category || 'General',
      vendor: expData.vendor || 'Vendor',
      amount: Number(expData.amount) || 0,
      status: expData.status || 'Pending Approval',
      dueDate: expData.dueDate || activeEvent.date,
      invoiceNo: expData.invoiceNo || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMode: expData.paymentMode || 'NEFT'
    };
    setExpenses(prev => [newExp, ...prev]);
    addActivity(`Logged expense: ${formatCurrency(newExp.amount)} for "${newExp.title}"`, 'budget');
    return newExp;
  };

  const updateExpense = (id, fields) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...fields } : e)));
    addActivity(`Updated expense record`, 'budget');
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addActivity(`Removed expense record`, 'budget');
  };

  // Food items CRUD
  const createFoodItem = (item) => {
    const newItem = {
      id: `food-${Date.now()}`,
      eventId: item.eventId || activeEventId,
      mealType: item.mealType || 'Meal',
      scheduleTime: item.scheduleTime || '12:00',
      paxCount: Number(item.paxCount) || activeEvent.attendance,
      menuItems: Array.isArray(item.menuItems) ? item.menuItems : (item.menuItems ? [item.menuItems] : []),
      dietaryNotes: item.dietaryNotes || '',
      costPerPax: Number(item.costPerPax) || 50,
      totalCost: (Number(item.costPerPax) || 50) * (Number(item.paxCount) || activeEvent.attendance),
      vendor: item.vendor || 'Catering Partner',
      status: item.status || 'Confirmed'
    };
    setFoodItems(prev => [newItem, ...prev]);
    addActivity(`Added meal schedule: "${newItem.mealType}"`, 'food');
    return newItem;
  };

  const updateFoodItem = (id, fields) => {
    setFoodItems(prev => prev.map(f => (f.id === id ? { ...f, ...fields } : f)));
  };

  const deleteFoodItem = (id) => {
    setFoodItems(prev => prev.filter(f => f.id !== id));
  };

  // Supplies CRUD
  const createSupply = (item) => {
    const newSupply = {
      id: `sup-${Date.now()}`,
      eventId: item.eventId || activeEventId,
      name: item.name,
      category: item.category || 'General Equipment',
      requiredQty: Number(item.requiredQty) || 1,
      availableQty: Number(item.availableQty) || 0,
      unit: item.unit || 'units',
      status: item.status || (Number(item.availableQty) >= Number(item.requiredQty) ? 'Ready on Site' : 'Pending Procurement'),
      responsible: item.responsible || 'Operations Team',
      estimatedCost: Number(item.estimatedCost) || 0
    };
    setSupplies(prev => [newSupply, ...prev]);
    addActivity(`Added supply item: "${newSupply.name}"`, 'supplies');
    return newSupply;
  };

  const updateSupply = (id, fields) => {
    setSupplies(prev => prev.map(s => (s.id === id ? { ...s, ...fields } : s)));
  };

  const deleteSupply = (id) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
  };

  // Venue Zones
  const updateVenueZone = (id, fields) => {
    setVenueZones(prev => prev.map(z => (z.id === id ? { ...z, ...fields } : z)));
    addActivity(`Updated zone configuration`, 'venue');
  };

  // Team CRUD
  const createTeamMember = (mem) => {
    const newMem = {
      id: `tm-${Date.now()}`,
      name: mem.name,
      role: mem.role || 'Coordinator',
      department: mem.department || 'Operations',
      shift: mem.shift || 'Shift 01 (08:00 - 17:00)',
      status: mem.status || 'On Duty',
      phone: mem.phone || '',
      email: mem.email || '',
      tasksCount: 0,
      avatar: mem.avatar || INITIAL_TEAM_MEMBERS[0].avatar
    };
    setTeamMembers(prev => [...prev, newMem]);
    addActivity(`Added team member: ${newMem.name} (${newMem.role})`, 'team');
    return newMem;
  };

  const updateTeamMember = (id, fields) => {
    setTeamMembers(prev => prev.map(m => (m.id === id ? { ...m, ...fields } : m)));
  };

  const deleteTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // Live schedule & incidents
  const updateLiveScheduleActivity = (id, fields) => {
    setLiveSchedule(prev => prev.map(a => (a.id === id ? { ...a, ...fields } : a)));
  };

  const addIncident = (incident) => {
    const newInc = {
      id: `inc-${Date.now()}`,
      eventId: incident.eventId || activeEventId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: incident.severity || 'Medium',
      category: incident.category || 'Operations',
      title: incident.title,
      description: incident.description,
      reportedBy: incident.reportedBy || settings.organizerName || 'Avantika Sharma',
      status: 'Investigating'
    };
    setIncidentLogs(prev => [newInc, ...prev]);
    addActivity(`Reported incident: "${newInc.title}" [${newInc.severity}]`, 'incident');
    return newInc;
  };

  const updateIncident = (id, fields) => {
    setIncidentLogs(prev => prev.map(i => (i.id === id ? { ...i, ...fields } : i)));
    addActivity(`Updated incident resolution status`, 'incident');
  };

  // Settings
  const updateSettings = (fields) => {
    setSettings(prev => ({ ...prev, ...fields }));
    addActivity(`Updated system preferences`, 'settings');
  };

  // Reset demo data
  const resetToDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setActiveEventIdState('ev-1');
    setTasks(INITIAL_TASKS);
    setExpenses(INITIAL_EXPENSES);
    setFoodItems(INITIAL_FOOD_ITEMS);
    setSupplies(INITIAL_SUPPLIES);
    setVenueZones(INITIAL_VENUE_ZONES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setLiveSchedule(INITIAL_LIVE_SCHEDULE);
    setIncidentLogs(INITIAL_INCIDENTS);
    setSettings(INITIAL_SETTINGS);
    addActivity('System state reset to baseline demo data', 'system');
  };

  // Currency formatting helper
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    const symbol = settings.currencySymbol || '₹';
    if (settings.currency === 'INR') {
      if (Math.abs(num) >= 100000) {
        return `${symbol}${(num / 100000).toFixed(2)}L`;
      }
      return `${symbol}${num.toLocaleString('en-IN')}`;
    }
    return `${symbol}${num.toLocaleString()}`;
  };

  return (
    <EventContext.Provider value={{
      events,
      activeEventId,
      activeEvent,
      setActiveEventId,
      createEvent,
      updateEvent,
      deleteEvent,
      tasks: tasks.filter(t => t.eventId === activeEventId),
      allTasks: tasks,
      createTask,
      updateTask,
      toggleTaskComplete,
      deleteTask,
      expenses: expenses.filter(e => e.eventId === activeEventId),
      allExpenses: expenses,
      createExpense,
      updateExpense,
      deleteExpense,
      foodItems: foodItems.filter(f => f.eventId === activeEventId),
      createFoodItem,
      updateFoodItem,
      deleteFoodItem,
      supplies: supplies.filter(s => s.eventId === activeEventId),
      createSupply,
      updateSupply,
      deleteSupply,
      venueZones,
      updateVenueZone,
      teamMembers,
      createTeamMember,
      updateTeamMember,
      deleteTeamMember,
      liveSchedule,
      updateLiveScheduleActivity,
      incidentLogs: incidentLogs.filter(i => i.eventId === activeEventId),
      addIncident,
      updateIncident,
      settings,
      updateSettings,
      recentActivities,
      addActivity,
      resetToDemoData,
      formatCurrency
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

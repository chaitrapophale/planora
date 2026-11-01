/**
 * Planora AI Event Planning Engine & API Service
 * 
 * Securely communicates with the Planora Express backend (/api/ai/*),
 * which is integrated with Google Gemini LLM API (gemini-2.5-flash / gemini-1.5-flash).
 * Includes robust action execution mapping, offline resilience, and health checking.
 */

export const AI_STATUS = {
  CONNECTING: 'CONNECTING',
  READY: 'READY',
  LOCAL_DEMO: 'LOCAL_DEMO',
  ERROR: 'ERROR'
};

const API_BASE = ''; // Uses Vite proxy config to route /api to backend (port 3001)

/**
 * Check backend and Gemini API connection health
 */
export async function checkAiHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Health check returned ${res.status}`);
    const data = await res.json();
    return {
      connected: true,
      hasApiKey: Boolean(data.hasApiKey),
      provider: data.provider || 'Google Gemini',
      model: data.model || 'gemini-2.5-flash'
    };
  } catch (err) {
    console.warn('[Planora AI Client] Backend health check failed:', err.message);
    return {
      connected: false,
      hasApiKey: false,
      provider: 'Local Assistant Engine',
      model: 'deterministic-fallback',
      error: err.message
    };
  }
}

/**
 * Send natural language message to Planora AI Assistant
 */
export async function sendChatMessage({
  message,
  history = [],
  eventContext = {},
  currentScreen = 'dashboard'
}) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message,
        history,
        eventContext,
        currentScreen
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status} from AI service`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[Planora AI Client] Chat request error:', err);
    throw err;
  }
}

/**
 * Generate a complete 12-section event blueprint from prompt and context
 */
export async function generatePlanFromPrompt(prompt, eventContext = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        eventContext
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.plan) {
        return {
          ...data.plan,
          isLiveLLM: data.isLiveLLM,
          provider: data.provider,
          model: data.model
        };
      }
    }
  } catch (err) {
    console.warn('[Planora AI Client] Plan endpoint unavailable, falling back to local synthesis engine:', err.message);
  }

  // Graceful client fallback synthesis if backend is unreachable
  return generateClientDeterministicPlan(prompt, eventContext);
}

/**
 * Safely executes an AI-proposed and user-approved action into Planora application state
 */
export function executeProposedAction(action, contextMethods) {
  if (!action || !action.type || !action.data) {
    return { success: false, message: 'Invalid action payload' };
  }

  const { type, data } = action;
  const {
    activeEvent,
    createTask,
    updateTask,
    createExpense,
    updateExpense,
    createSupply,
    updateSupply,
    createFoodItem,
    updateLiveScheduleActivity,
    updateEvent,
    addActivity
  } = contextMethods;

  try {
    switch (type) {
      case 'create_task': {
        const created = createTask({
          title: data.title,
          description: data.description || '',
          priority: data.priority || 'high',
          category: data.category || 'Operations',
          assignedTo: data.assignedTo || 'Avantika Sharma',
          dueDate: data.dueDate || activeEvent?.date,
          dueTime: data.dueTime || '14:00',
          status: 'todo'
        });
        addActivity(`AI Action Executed: Created task "${created.title}"`, 'task');
        return { success: true, message: `Created task "${created.title}" assigned to ${created.assignedTo}` };
      }

      case 'update_task': {
        updateTask(data.taskId, {
          ...(data.status && { status: data.status }),
          ...(data.dueDate && { dueDate: data.dueDate }),
          ...(data.assignedTo && { assignedTo: data.assignedTo }),
          ...(data.priority && { priority: data.priority }),
          ...(data.title && { title: data.title })
        });
        addActivity(`AI Action Executed: Updated task record`, 'task');
        return { success: true, message: 'Task updated successfully' };
      }

      case 'create_expense': {
        const created = createExpense({
          title: data.title,
          category: data.category || 'General',
          vendor: data.vendor || 'Proposed Vendor',
          amount: Number(data.amount) || 10000,
          status: data.status || 'Pending Approval',
          dueDate: data.dueDate || activeEvent?.date,
          paymentMode: data.paymentMode || 'NEFT Bank Transfer'
        });
        addActivity(`AI Action Executed: Logged expense ₹${created.amount} for "${created.title}"`, 'budget');
        return { success: true, message: `Logged expense entry of ₹${created.amount.toLocaleString('en-IN')} for "${created.title}"` };
      }

      case 'update_expense': {
        updateExpense(data.expenseId, {
          ...(data.amount && { amount: Number(data.amount) }),
          ...(data.status && { status: data.status })
        });
        addActivity(`AI Action Executed: Updated expense entry`, 'budget');
        return { success: true, message: 'Expense record updated' };
      }

      case 'create_supply': {
        const created = createSupply({
          name: data.name,
          category: data.category || 'General Equipment',
          requiredQty: Number(data.requiredQty) || 1,
          availableQty: Number(data.availableQty) || 0,
          unit: data.unit || 'units',
          estimatedCost: Number(data.estimatedCost) || 0,
          responsible: data.responsible || 'Operations Lead'
        });
        addActivity(`AI Action Executed: Added supply item "${created.name}"`, 'supplies');
        return { success: true, message: `Added ${created.requiredQty} ${created.unit} of "${created.name}" to inventory` };
      }

      case 'update_supply': {
        updateSupply(data.supplyId, {
          ...(data.availableQty !== undefined && { availableQty: Number(data.availableQty) }),
          ...(data.status && { status: data.status }),
          ...(data.requiredQty !== undefined && { requiredQty: Number(data.requiredQty) })
        });
        addActivity(`AI Action Executed: Updated supply inventory counts`, 'supplies');
        return { success: true, message: 'Supply item counts updated' };
      }

      case 'create_food_item': {
        const created = createFoodItem({
          mealType: data.mealType,
          scheduleTime: data.scheduleTime || '13:00 - 14:30',
          paxCount: Number(data.paxCount) || activeEvent?.attendance || 500,
          menuItems: Array.isArray(data.menuItems) ? data.menuItems : [data.menuItems || 'Standard Menu'],
          dietaryNotes: data.dietaryNotes || '',
          costPerPax: Number(data.costPerPax) || 65,
          vendor: data.vendor || 'Catering Partner'
        });
        addActivity(`AI Action Executed: Created catering schedule "${created.mealType}"`, 'food');
        return { success: true, message: `Added meal schedule "${created.mealType}" for ${created.paxCount} pax` };
      }

      case 'update_schedule_activity': {
        updateLiveScheduleActivity(data.activityId, {
          ...(data.delayMin && { delayMin: Number(data.delayMin) }),
          ...(data.actualTime && { actualTime: data.actualTime }),
          ...(data.status && { status: data.status }),
          ...(data.scheduledTime && { scheduledTime: data.scheduledTime })
        });
        addActivity(`AI Action Executed: Adjusted live run-of-show schedule`, 'live');
        return { success: true, message: 'Live event schedule updated' };
      }

      case 'update_event': {
        if (activeEvent?.id) {
          updateEvent(activeEvent.id, data);
          addActivity(`AI Action Executed: Updated event settings for "${activeEvent.name}"`, 'event');
          return { success: true, message: `Event properties updated for "${activeEvent.name}"` };
        }
        return { success: false, message: 'No active event to update' };
      }

      default:
        return { success: false, message: `Unknown action type "${type}"` };
    }
  } catch (err) {
    console.error('[Planora AI Action Execution Error]', err);
    return { success: false, message: `Failed to execute action: ${err.message}` };
  }
}

/**
 * Client-side deterministic blueprint synthesizer
 */
function generateClientDeterministicPlan(prompt, eventContext) {
  const attendance = eventContext.attendance || 500;
  const budget = eventContext.budget || 200000;
  
  return {
    isGeneratedByLocalDemo: true,
    theme: `${eventContext.name || 'College Cultural Festival'} — Operational Blueprint`,
    summary: `Structured execution plan for ${attendance} attendees with a target budget of ₹${budget.toLocaleString('en-IN')}. Prioritizes acoustic safety compliance, line-array audio, and rapid meal distribution.`,
    metrics: {
      attendance,
      budget,
      taskCount: 6,
      suppliesCount: 5
    },
    budgetAllocations: [
      { category: 'Audio Visual & Staging', share: 0.35, amount: Math.round(budget * 0.35), note: 'Main PA, line array speakers, cordless mics & LED backdrop' },
      { category: 'Food & Catering Services', share: 0.30, amount: Math.round(budget * 0.30), note: `Snack boxes & refreshments for ${attendance} pax with dietary tagging` },
      { category: 'Decor, Signage & Zone Setup', share: 0.15, amount: Math.round(budget * 0.15), note: 'Directional standees, entry gate arch, barricading & VIP lounge' },
      { category: 'Licenses, Safety & Police NOC', share: 0.10, amount: Math.round(budget * 0.10), note: 'Fire department NOC, local precinct permit, first aid staff' },
      { category: 'Internal Operations & Contingency', share: 0.10, amount: Math.round(budget * 0.10), note: 'Buffer for overtime logistics, backup generator fuel & misc' }
    ],
    tasks: [
      { title: 'Procure Police & Fire Safety NOC Clearances', category: 'Licensing & Safety', priority: 'critical', assignedRole: 'Govt Liaison', dueDaysOffset: -5, description: 'Submit venue blueprint and crowd control plan to local municipal authorities.' },
      { title: `Sound System Calibration & Acoustic Test (${attendance} Pax)`, category: 'Audio & Tech', priority: 'high', assignedRole: 'Audio Lead', dueDaysOffset: -2, description: 'Align line array speakers, test monitor feeds, and verify backup microphone frequencies.' },
      { title: `Catering Sign-off & Dietary Segregation (${attendance} Pax)`, category: 'Food & Hospitality', priority: 'high', assignedRole: 'Hospitality Lead', dueDaysOffset: -3, description: 'Confirm meal schedule, separate Jain/nut-free counters, and arrange drinking water stations.' },
      { title: 'Entrance Security Badging & Barricade Setup', category: 'Venue Operations', priority: 'medium', assignedRole: 'Operations Lead', dueDaysOffset: -1, description: 'Erect metal detectors, ticket scanner desks, and emergency clear zones.' },
      { title: 'Stage Run-Sheet & Master of Ceremonies Briefing', category: 'Stage & Program', priority: 'medium', assignedRole: 'Stage Manager', dueDaysOffset: -1, description: 'Rehearse speech transitions, award presentations, and musical cues.' },
      { title: 'Accessibility Ramp & Reserved Seating Inspection', category: 'Accessibility', priority: 'high', assignedRole: 'Floor Lead', dueDaysOffset: -1, description: 'Inspect step-free access from entrance to main auditorium and accessible restrooms.' }
    ],
    supplies: [
      { name: 'Dual-Channel Cordless UHF Handheld Mics', category: 'Audio Equipment', requiredQty: 6, unit: 'sets', estimatedCost: 12000 },
      { name: '100kVA Diesel Silent Generator with Fuel', category: 'Electrical', requiredQty: 1, unit: 'unit', estimatedCost: 22000 },
      { name: 'Heavy Duty Crowd Control Barricades', category: 'Security & Staging', requiredQty: 25, unit: 'panels', estimatedCost: 8500 },
      { name: 'Branded Thermal Wristbands & ID Lanyards', category: 'Badging', requiredQty: attendance + 50, unit: 'pcs', estimatedCost: 6500 },
      { name: 'Commercial First-Aid Kit & Wheelchair', category: 'Medical Safety', requiredQty: 2, unit: 'kits', estimatedCost: 4500 }
    ],
    schedule: [
      { time: '08:00 AM', activity: 'Venue Access & Technical Load-in', stage: 'Production Loading Bay', duration: '60 min' },
      { time: '09:00 AM', activity: 'Sound Check, Lighting Truss & Generator Startup', stage: 'Main Stage', duration: '90 min' },
      { time: '10:30 AM', activity: 'Gates Open & Crew Stationing', stage: 'Main Gate & Desks', duration: '30 min' },
      { time: '11:00 AM', activity: 'Inauguration Ceremony & Keynote Address', stage: 'Auditorium Hall', duration: '45 min' },
      { time: '01:30 PM', activity: 'Organized Lunch / Refreshment Distribution', stage: 'Food Court & Quad', duration: '60 min' },
      { time: '03:30 PM', activity: 'Cultural Performances & Talent Showcase', stage: 'Main Stage', duration: '150 min' },
      { time: '06:00 PM', activity: 'Felicitation, Awards & Closing Remarks', stage: 'Main Stage', duration: '60 min' },
      { time: '07:30 PM', activity: 'Controlled Egress & Technical Teardown', stage: 'All Zones', duration: '90 min' }
    ],
    contingencies: [
      { risk: 'Rain / High Humidity Shift', recommendation: 'Stage waterproof tarps on standby; keep sensitive audio mixing consoles under covered canopy.' },
      { risk: 'Power Grid Fluctuation', recommendation: 'Dual auto-sync diesel generator configured to take full venue load within 4 seconds of mains drop.' },
      { risk: 'Surge in Registration / Crowd Bottleneck', recommendation: 'Deploy 2 auxiliary QR-scan lanes at Gate B with roving student volunteers.' }
    ]
  };
}

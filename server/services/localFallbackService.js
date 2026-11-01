/**
 * Planora Smart Local Fallback Service
 * Provides realistic semantic reasoning when no live Gemini API key is configured,
 * ensuring zero broken workflows, testing readiness, and structured action proposals.
 */

export function generateFallbackResponse({ message, eventContext = {}, currentScreen = 'dashboard', history = [] }) {
  const lower = (message || '').toLowerCase().trim();
  const activeEvent = eventContext.activeEvent || { name: 'TechSpark 2025', attendance: 500, budget: 200000, date: '2025-10-24' };
  const attendance = Number(activeEvent.attendance) || 500;
  const budget = Number(activeEvent.budget) || 200000;
  const teamMembers = eventContext.teamMembers || [];

  // Match: Create/Add Task
  if (lower.includes('add a task') || lower.includes('create a task') || lower.includes('add task') || lower.includes('create task') || lower.includes('new task')) {
    // Extract title
    let title = 'Finalize decorations & signage';
    const matchQuotes = message.match(/["']([^"']+)["']/);
    if (matchQuotes) {
      title = matchQuotes[1];
    } else {
      const matchAfter = message.match(/(?:task\s+to\s+|task\s+:?\s*)([^,.;]+?)(?:\s+by|\s+assigned|\s+due|$)/i);
      if (matchAfter) title = matchAfter[1].trim();
    }

    // Extract assignee
    let assignedTo = teamMembers[0]?.name || 'Avantika Sharma';
    const matchAssignee = message.match(/(?:assign\s+(?:it\s+)?to\s+|assigned\s+to\s+)([A-Za-z\s]+?)(?:[.,;]|$)/i);
    if (matchAssignee) {
      assignedTo = matchAssignee[1].trim();
    }

    // Extract due date
    let dueDate = activeEvent.date || '2025-12-10';
    const matchDate = message.match(/(?:by|on|due)\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|\d{4}-\d{2}-\d{2})/i);
    if (matchDate) {
      dueDate = matchDate[1];
    }

    return {
      reply: `I have prepared a new operational task for **${activeEvent.name}**:\n\n- **Task Title**: ${title}\n- **Assigned To**: ${assignedTo}\n- **Deadline**: ${dueDate}\n- **Priority**: High\n\nPlease review the proposal preview below. Once approved, it will be added to the Tasks & Timeline workspace immediately.`,
      action: {
        type: 'create_task',
        summary: `Create task: "${title}" assigned to ${assignedTo}`,
        data: {
          title,
          description: `Execution item generated via Planora Assistant for ${activeEvent.name}.`,
          priority: 'high',
          category: lower.includes('decor') ? 'Decor & Signage' : lower.includes('sound') || lower.includes('audio') ? 'Audio / Tech' : 'Operations',
          assignedTo,
          dueDate,
          dueTime: '14:00'
        }
      },
      plan: null,
      suggestedPrompts: [
        'What critical tasks are currently overdue?',
        'Who on the team has the most pending tasks?',
        'Add a task to inspect fire extinguishers'
      ],
      isEstimateNotice: 'Task deadlines should align with vendor delivery timelines.'
    };
  }

  // Match: Create Budget Expense
  if (lower.includes('add expense') || lower.includes('add a budget') || lower.includes('log expense') || lower.includes('create expense')) {
    let amount = 15000;
    const matchAmt = message.match(/[₹rs.]*\s*([\d,]+(?:\.\d+)?)/i);
    if (matchAmt) amount = parseFloat(matchAmt[1].replace(/,/g, '')) || 15000;

    let title = 'Audio-Visual Extra Consumables';
    const matchTitle = message.match(/(?:for|expense\s+for)\s+([^,.;0-9]+)/i);
    if (matchTitle) title = matchTitle[1].trim();

    return {
      reply: `I have structured an expense entry for **₹${amount.toLocaleString('en-IN')}** under **${activeEvent.name}**.\n\nReview the proposed ledger record below to confirm payment terms and vendor details.`,
      action: {
        type: 'create_expense',
        summary: `Log expense: ₹${amount.toLocaleString('en-IN')} for ${title}`,
        data: {
          title,
          category: 'Audio Visual',
          vendor: 'SoundPro Solutions',
          amount,
          status: 'Pending Approval',
          dueDate: activeEvent.date || '2025-10-24',
          paymentMode: 'NEFT Bank Transfer'
        }
      },
      plan: null,
      suggestedPrompts: [
        'How much budget remains unspent?',
        'Suggest 3 areas to trim event costs',
        'Compare planned vs actual spending'
      ],
      isEstimateNotice: 'All newly logged expenses require organizer authorization.'
    };
  }

  // Match: Add Supply
  if (lower.includes('add supply') || lower.includes('add equipment') || lower.includes('need more') || lower.includes('order supplies')) {
    let name = 'High-Intensity LED Stage Floodlights';
    let qty = 4;
    const matchQty = message.match(/(\d+)\s*(mics?|lights?|panels?|speakers?|stands?|chairs?|cables?|units?)/i);
    if (matchQty) {
      qty = parseInt(matchQty[1], 10);
      name = `${qty}x Cordless Handheld Vocal Microphones`;
    }

    return {
      reply: `I have prepared a procurement request for **${name}** (Quantity: ${qty}) to keep equipment counts aligned with venue requirements.`,
      action: {
        type: 'create_supply',
        summary: `Procure supply: ${qty} units of ${name}`,
        data: {
          name,
          category: 'Audio Equipment',
          requiredQty: qty,
          availableQty: 0,
          unit: 'units',
          estimatedCost: qty * 2500,
          responsible: teamMembers[0]?.name || 'Operations Lead'
        }
      },
      plan: null,
      suggestedPrompts: [
        'Check for missing items in supplies list',
        'What equipment is needed for an outdoor event?',
        'Estimate cost of generator backup'
      ],
      isEstimateNotice: 'Rental costs reflect current metropolitan commercial rates.'
    };
  }

  // Match: Full Event Plan Generation
  if (lower.includes('plan a') || lower.includes('plan an event') || lower.includes('generate plan') || lower.includes('complete event plan')) {
    let planAttendance = attendance;
    const matchAtt = message.match(/(\d+)\s*(people|guests|attendees|pax)/i);
    if (matchAtt) planAttendance = parseInt(matchAtt[1], 10);

    let planBudget = budget;
    const matchBud = message.match(/[₹rs.]*\s*([\d,]+(?:\.\d+)?)\s*(lakh|l|k|thousand)?/i);
    if (matchBud) {
      const raw = parseFloat(matchBud[1].replace(/,/g, ''));
      const unit = (matchBud[2] || '').toLowerCase();
      if (unit === 'lakh' || unit === 'l') planBudget = raw * 100000;
      else if (unit === 'k' || unit === 'thousand') planBudget = raw * 1000;
      else if (raw > 0) planBudget = raw;
    }

    const tasksList = [
      { title: 'Municipal & Police Clearances for Venue Access', category: 'Licensing & Safety', priority: 'critical', assignedRole: 'Govt Liaison', dueDaysOffset: -7, description: 'Submit floor plans and crowd safety blueprints.' },
      { title: `Main Stage Line-Array Acoustic Test (${planAttendance} Pax)`, category: 'Audio / Tech', priority: 'high', assignedRole: 'Audio Engineer', dueDaysOffset: -3, description: 'Test RF wireless spectrum and line-array balance.' },
      { title: `Snack Box & Beverage Segregation (${planAttendance} Pax)`, category: 'Catering', priority: 'high', assignedRole: 'Hospitality Lead', dueDaysOffset: -2, description: 'Verify dietary codes (Jain, vegetarian, nut-free).' },
      { title: 'Erect Crowd Control Barricades & Rapid Scanning Lanes', category: 'Operations', priority: 'medium', assignedRole: 'Security Lead', dueDaysOffset: -1, description: 'Position metal detectors and VIP express lane.' },
      { title: 'Rehearse Master of Ceremonies & Run-Sheet Sync', category: 'Stage Program', priority: 'medium', assignedRole: 'Stage Director', dueDaysOffset: -1, description: 'Align audio cues, video playback, and felicitations.' }
    ];

    const budgetAllocations = [
      { category: 'Audio Visual & Staging', share: 0.35, amount: Math.round(planBudget * 0.35), note: `Line array sound, LED backdrop & intelligent lighting for ${planAttendance} pax.` },
      { category: 'Food & Beverage Service', share: 0.30, amount: Math.round(planBudget * 0.30), note: `Hygienic packed snack boxes and continuous water dispensaries.` },
      { category: 'Decor, Signage & Gate Arch', share: 0.15, amount: Math.round(planBudget * 0.15), note: 'Entryway experiential arch, directional wayfinding & stage backdrop.' },
      { category: 'Permits, Police & Emergency Aid', share: 0.10, amount: Math.round(planBudget * 0.10), note: 'Municipal licensing, fire tender standby & certified paramedics.' },
      { category: 'Buffer & Unforeseen Logistics', share: 0.10, amount: Math.round(planBudget * 0.10), note: 'Contingency for overtime staffing, cables & fuel refills.' }
    ];

    const suppliesList = [
      { name: 'Dual-Channel Wireless UHF Handheld Microphones', category: 'Audio Equipment', requiredQty: 6, unit: 'sets', estimatedCost: 12000 },
      { name: '125kVA Cummins Silent Diesel Generator Set', category: 'Power & Grid', requiredQty: 1, unit: 'unit', estimatedCost: 22000 },
      { name: 'High-Density Crowd Control Barricades (2.5m)', category: 'Security & Staging', requiredQty: 25, unit: 'panels', estimatedCost: 8500 },
      { name: 'Branded Thermal QR Badges & Breakaway Lanyards', category: 'Registration', requiredQty: planAttendance + 50, unit: 'pcs', estimatedCost: 6000 }
    ];

    const scheduleTimeline = [
      { time: '08:00 AM', activity: 'Production Load-in & Power Sync', stage: 'Production Dock', duration: '60 min' },
      { time: '09:30 AM', activity: 'Acoustic Sound Check & LED Calibrations', stage: 'Main Stage', duration: '60 min' },
      { time: '10:30 AM', activity: 'Gates Open & QR Registration', stage: 'Gate A & B', duration: '30 min' },
      { time: '11:00 AM', activity: 'Inaugural Keynote & Lighting of Lamp', stage: 'Main Stage', duration: '45 min' },
      { time: '01:30 PM', activity: 'Organized Lunch / Refreshment Distribution', stage: 'Food Court Quad', duration: '60 min' },
      { time: '03:30 PM', activity: 'Cultural Competitions & Headliner Set', stage: 'Main Stage', duration: '150 min' },
      { time: '06:30 PM', activity: 'Awards Felicitation & Vote of Thanks', stage: 'Main Stage', duration: '45 min' },
      { time: '07:30 PM', activity: 'Controlled Audience Egress & Teardown', stage: 'All Zones', duration: '90 min' }
    ];

    const contingencies = [
      { risk: 'Sudden Rain / Outdoor Dampness', recommendation: 'Stage heavy waterproof tarpaulins on rigging towers; keep power boards elevated on rubber pallets.' },
      { risk: 'Power Grid Dropout', recommendation: 'Dual auto-sync diesel generator configured to take full venue load within 4 seconds.' },
      { risk: 'Catering Queue Bottleneck', recommendation: 'Implement 4 parallel lanes with separate self-service beverage counters.' }
    ];

    return {
      reply: `I have synthesized an end-to-end tactical blueprint for **${activeEvent.name}** tailored for **${planAttendance} attendees** within a target fiscal envelope of **₹${planBudget.toLocaleString('en-IN')}**.\n\nThe complete 12-section blueprint includes a balanced budget model, critical-path milestones, supply checklists, run-of-show schedule, and risk mitigation protocols. You can review the details below and apply them directly to your active event workspace.`,
      action: null,
      plan: {
        theme: `${activeEvent.name} — Operational Blueprint`,
        summary: `Strategic execution architecture engineered for ${planAttendance} attendees and ₹${planBudget.toLocaleString('en-IN')} budget. Prioritizes crowd safety compliance, line-array acoustics, and seamless guest transitions.`,
        metrics: {
          attendance: planAttendance,
          budget: planBudget,
          taskCount: tasksList.length,
          suppliesCount: suppliesList.length
        },
        budgetAllocations,
        tasks: tasksList,
        supplies: suppliesList,
        schedule: scheduleTimeline,
        contingencies,
        safetyChecklist: [
          'Verify stamped police clearance & fire brigade standby NOC',
          'Deploy commercial AED first-aid station with 2 emergency paramedics',
          'Ensure 2.5m minimum clearance along medical evacuation corridors',
          'Inspect step-free access ramps at Main Entrance and VIP enclosures'
        ],
        foodAndHospitality: [
          { meal: 'Mid-Day Refreshment Box', menu: ['Paneer Tikka Roll', 'Roasted Makhana', 'Kaju Katli', 'Fruit Juice'], pax: planAttendance, dietaryNotes: 'Jain and nut-free boxes segregated with colored barcode tags.' }
        ],
        venueAndSeating: {
          seatingType: 'Tiered Auditorium & Covered VIP Pagoda',
          zones: ['Main Stage (60 cap)', 'VIP Guest Enclosure (80 cap)', 'General Audience Quad (350 cap)', 'Food Court (120 cap)'],
          accessibility: 'Step-free ramp at Gate 3 with direct clear ambulance egress.'
        }
      },
      suggestedPrompts: [
        'How can we reduce the audio-visual budget by 10%?',
        'Add a task to finalize the headliner artist hospitality rider',
        'What emergency contact numbers should be on speed dial?'
      ],
      isEstimateNotice: 'All estimates are calculated against metropolitan operational averages.'
    };
  }

  // Budget advice
  if (lower.includes('budget') || lower.includes('cost') || lower.includes('spend') || lower.includes('money')) {
    const totalSpent = (eventContext.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const rem = budget - totalSpent;
    return {
      reply: `### Fiscal Assessment for ${activeEvent.name}\n\n- **Target Budget**: ₹${budget.toLocaleString('en-IN')}\n- **Total Committed Expenses**: ₹${totalSpent.toLocaleString('en-IN')}\n- **Available Liquidity**: ₹${rem.toLocaleString('en-IN')} (${Math.round((rem / budget) * 100)}% unallocated)\n\n**Actionable Recommendations:**\n1. **Audio Visual & Staging** currently commands the largest capital share. Consolidate lighting truss and sound vendor packages to negotiate a 5–8% bundled rate.\n2. Maintain a **10% contingency reserve (₹${Math.round(budget * 0.1).toLocaleString('en-IN')})** strictly locked for emergency generator fuel and overtime logistics.\n3. Before signing any contract exceeding ₹25,000, verify if GST is inclusive to prevent surprise overruns.`,
      action: null,
      plan: null,
      suggestedPrompts: [
        'Suggest ways to reduce the decoration cost',
        'Divide ₹1,50,000 across core event requirements',
        'Add an expense record for stage floral decor'
      ],
      isEstimateNotice: 'Tax rates and vendor delivery surcharges may vary by jurisdiction.'
    };
  }

  // Food / Catering advice
  if (lower.includes('food') || lower.includes('catering') || lower.includes('meal') || lower.includes('guests') || lower.includes('snack')) {
    return {
      reply: `### Catering & Hospitality Strategy for ${attendance} Guests\n\n- **Recommended Format**: Pre-packed hygienic snack boxes with barcode dietary tags to avoid queue bottlenecks.\n- **Dietary Breakdown Projection**:\n  - Vegetarian Standard: ~75% (${Math.round(attendance * 0.75)} pax)\n  - Strict Jain (No root veg): ~15% (${Math.round(attendance * 0.15)} pax, marked with green dot)\n  - Special / Nut-Free / Vegan: ~10% (${Math.round(attendance * 0.10)} pax, marked with red label)\n- **Hydration Target**: Minimum 750ml potable drinking water per guest (total ~${Math.round(attendance * 0.75)} liters) distributed across 4 quad dispensing stations.\n- **Estimated Catering Budget**: ₹${(attendance * 65).toLocaleString('en-IN')} (at benchmark ₹65/box).`,
      action: null,
      plan: null,
      suggestedPrompts: [
        `Create a food catering schedule for ${attendance} guests`,
        'What supplies are needed for the food court?',
        'Add a task to sign off on catering menu'
      ],
      isEstimateNotice: 'Quantities are based on standard 4-hour event consumption benchmarks.'
    };
  }

  // Live / Delay / Incident advice
  if (lower.includes('delay') || lower.includes('behind schedule') || lower.includes('live') || lower.includes('sound system not working') || lower.includes('incident')) {
    return {
      reply: `### Live Control Room Tactical Action\n\n1. **Immediate Stabilization**: Announce a 10-minute networking/musical interlude via Stage PA to maintain crowd composure.\n2. **Run-Sheet Compression**: Shorten the upcoming interactive awards segment by 15 minutes and buffer the panel transition by 5 minutes.\n3. **Sound / Hardware Contingency**: Immediately switch audio routing from primary digital snake to backup analog multi-core on Channel B. Audio Lead Rohit Kulkarni should verify wireless receiver RF squelch.\n\n*Would you like me to update the live schedule with an approved delay adjustment?*`,
      action: null,
      plan: null,
      suggestedPrompts: [
        'Adjust the remaining schedule for a 20-minute delay',
        'Log a technical incident for microphone RF interference',
        'Who is on duty right now?'
      ],
      isEstimateNotice: 'Operational adjustments should be confirmed with the Stage Manager.'
    };
  }

  // Default intelligent response
  return {
    reply: `Hello Avantika! I am monitoring **${activeEvent.name}** as your AI Event Co-Organizer.\n\nWe are currently on the **${currentScreen.toUpperCase()}** screen for an event with **${attendance} expected attendees** and a target budget of **₹${budget.toLocaleString('en-IN')}**.\n\nHere are three priority items I recommend reviewing right now:\n1. **Critical Tasks**: Check milestone deadlines to ensure vendor delivery agreements are locked.\n2. **Supplies Inventory**: Verify cordless mics and backup generator readiness before setup day.\n3. **Safety Clearances**: Confirm police and fire safety stamped NOC certifications.\n\nHow would you like to proceed? You can ask me to draft a task, generate a plan, analyze your budget, or handle live schedule adjustments.`,
    action: null,
    plan: null,
    suggestedPrompts: [
      'What should I prepare first?',
      `Create a checklist for ${activeEvent.name}`,
      'How much food should I arrange for 250 guests?',
      'Add a task to finalize decorations by 10 December and assign it to Priya'
    ],
    isEstimateNotice: 'AI recommendations adapt dynamically to your active event data.'
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { 
  sendChatMessage, 
  generatePlanFromPrompt, 
  executeProposedAction, 
  checkAiHealth 
} from '../services/aiPlannerService';
import { ActionProposalCard } from '../components/ActionProposalCard';
import { EventSwitcherModal } from '../components/EventSwitcherModal';

export const AIPlanner = () => {
  const {
    activeEvent,
    tasks,
    expenses,
    supplies,
    foodItems,
    venueZones,
    teamMembers,
    liveSchedule,
    incidentLogs,
    createTask,
    updateTask,
    createExpense,
    updateExpense,
    createSupply,
    updateSupply,
    createFoodItem,
    updateLiveScheduleActivity,
    updateEvent,
    formatCurrency,
    addActivity
  } = useEvents();

  const [searchParams] = useSearchParams();

  // Active workspace tab: 'blueprint' | 'chat'
  const [activeTab, setActiveTab] = useState('blueprint');

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Welcome to the **Planora GenAI Planning Partner**.\n\nI am connected to your active event: **${activeEvent?.name}** (${activeEvent?.attendance || 500} pax, ${formatCurrency(activeEvent?.budget || 200000)} budget).\n\nYou can ask me to generate a full production blueprint, analyze expenses, manage logistics, or propose immediate tasks and supplies.`,
      suggestedPrompts: [
        `Plan a college cultural festival for ${activeEvent?.attendance || 500} people`,
        'What critical tasks should we execute first?',
        'Add a task to finalize decorations by 10 December and assign it to Priya',
        'Analyze our budget and suggest 3 ways to reduce costs'
      ]
    }
  ]);

  const [promptInput, setPromptInput] = useState(
    searchParams.get('prompt') || 
    `Plan a college cultural festival for ${activeEvent?.attendance || 500} people in Mumbai with a budget of ${formatCurrency(activeEvent?.budget || 200000)}, taking place in three weeks.`
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [appliedNotification, setAppliedNotification] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [executedActions, setExecutedActions] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [aiHealth, setAiHealth] = useState({ connected: true, hasApiKey: false, model: 'gemini-2.5-flash' });

  const chatBottomRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    checkAiHealth().then(setAiHealth);
  }, []);

  // Initial synthesis on load
  useEffect(() => {
    handleSynthesize(promptInput);
  }, [activeEvent?.id]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isGenerating]);

  // Handle Full Event Plan Generation
  const handleSynthesize = async (promptText) => {
    if (!promptText || !promptText.trim()) return;
    setIsGenerating(true);
    setAppliedNotification('');
    setErrorMessage('');

    try {
      const result = await generatePlanFromPrompt(promptText, {
        name: activeEvent?.name,
        attendance: activeEvent?.attendance,
        budget: activeEvent?.budget,
        date: activeEvent?.date,
        venue: activeEvent?.venue
      });
      setPlanResult(result);
    } catch (err) {
      console.error('[Planora AI] Synthesis error:', err);
      setErrorMessage(err.message || 'Failed to synthesize event plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Conversational Chat & Action Proposals
  const handleSendChatMessage = async (customText) => {
    const text = (customText || promptInput).trim();
    if (!text || isGenerating) return;

    setActiveTab('chat');
    setErrorMessage('');
    const userMsg = { id: `usr-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setPromptInput('');
    setIsGenerating(true);

    const eventContext = {
      activeEvent,
      tasks,
      expenses,
      supplies,
      foodItems,
      venueZones,
      teamMembers,
      liveSchedule,
      incidentLogs
    };

    const historyPayload = messages
      .filter(m => m.id !== 'init-1')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await sendChatMessage({
        message: text,
        history: historyPayload,
        eventContext,
        currentScreen: 'ai-planner'
      });

      const assistantMsg = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        action: response.action,
        plan: response.plan,
        suggestedPrompts: response.suggestedPrompts || [],
        isEstimateNotice: response.isEstimateNotice,
        isLiveLLM: response.isLiveLLM,
        model: response.model
      };

      // If the response contains a full plan, update plan canvas as well
      if (response.plan) {
        setPlanResult(response.plan);
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('[Planora AI] Chat error:', err);
      setErrorMessage(err.message || 'Error communicating with AI service');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Service Alert**: ${err.message || 'Failed to connect to Planora AI service'}. Please verify backend server status on port 3001.`,
          isError: true,
          suggestedPrompts: ['Retry request', 'Check AI health status']
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Execute Proposed Action
  const handleApproveAction = (msgId, action) => {
    const contextMethods = {
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
    };

    const result = executeProposedAction(action, contextMethods);
    if (result.success) {
      setExecutedActions(prev => ({ ...prev, [msgId]: 'approved' }));
      setAppliedNotification(`Action applied: ${result.message}`);
      setMessages(prev => [
        ...prev,
        {
          id: `conf-${Date.now()}`,
          role: 'assistant',
          content: `✅ **Action Executed**: ${result.message}.\n\nState is updated immediately across Planora.`
        }
      ]);
    }
  };

  const handleRejectAction = (msgId) => {
    setExecutedActions(prev => ({ ...prev, [msgId]: 'rejected' }));
  };

  // Apply complete synthesized plan to active event
  const handleApplyFullPlan = () => {
    if (!planResult) return;

    let taskCount = 0;
    if (Array.isArray(planResult.tasks)) {
      planResult.tasks.forEach(t => {
        createTask({
          title: t.title,
          description: t.description || '',
          priority: t.priority || 'medium',
          category: t.category || 'Operations',
          assignedTo: t.assignedRole || 'Avantika Sharma',
          dueDate: activeEvent?.date,
          dueTime: '14:00',
          status: 'todo'
        });
        taskCount++;
      });
    }

    let expCount = 0;
    if (Array.isArray(planResult.budgetAllocations)) {
      planResult.budgetAllocations.forEach(b => {
        createExpense({
          title: `${b.category} Allocation`,
          category: b.category,
          vendor: 'Proposed Vendor',
          amount: b.amount,
          status: 'Pending Approval',
          dueDate: activeEvent?.date
        });
        expCount++;
      });
    }

    let supCount = 0;
    if (Array.isArray(planResult.supplies)) {
      planResult.supplies.forEach(s => {
        createSupply({
          name: s.name,
          category: s.category || 'General Equipment',
          requiredQty: s.requiredQty || 1,
          availableQty: 0,
          unit: s.unit || 'units',
          estimatedCost: s.estimatedCost || 0
        });
        supCount++;
      });
    }

    setShowConfirmModal(false);
    setAppliedNotification(
      `Successfully applied blueprint: ${taskCount} tasks, ${expCount} budget allocations, and ${supCount} equipment items committed to "${activeEvent?.name}"!`
    );
    addActivity(`Applied AI Blueprint to active event: ${activeEvent?.name}`, 'ai');
  };

  return (
    <div className="min-h-full flex flex-col justify-between max-w-5xl mx-auto px-margin-mobile md:px-margin pt-4 pb-48">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container-highest">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight font-bold">
              AI Planning Partner
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shrink-0"></span>
            
            {/* Live LLM Connection Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              aiHealth.hasApiKey
                ? 'bg-primary-fixed text-on-primary-fixed border border-primary-container/20'
                : 'bg-secondary-container text-on-secondary-container'
            }`}>
              {aiHealth.hasApiKey ? 'Gemini 2.5 Flash' : 'Smart Preview Engine'}
            </span>
          </div>

          {/* Active Context Capsule */}
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body-sm text-xs text-on-surface-variant">
              Active Workspace: <strong className="text-tertiary">{activeEvent?.name}</strong>
              <span className="mx-1.5">•</span>
              <span>{formatCurrency(activeEvent?.budget)} Budget</span>
              <span className="mx-1.5">•</span>
              <span>{activeEvent?.attendance} Pax</span>
            </p>
            <button
              onClick={() => setShowSwitcherModal(true)}
              className="text-[10px] uppercase font-bold text-secondary hover:underline px-1.5 py-0.5 rounded bg-surface-container border border-surface-container-highest"
            >
              Switch Event
            </button>
          </div>
        </div>

        {/* View Switcher Tabs & Apply Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex p-1 bg-surface-container rounded-xl border border-surface-container-highest">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'blueprint'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_quilt</span>
              <span>Blueprint Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Chat &amp; Actions ({messages.length})</span>
            </button>
          </div>

          {planResult && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-1.5 bg-primary-container text-surface-container-lowest px-3.5 py-2 rounded-xl font-label-md text-xs font-bold hover:bg-primary transition-all duration-150 active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Apply to Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Applied Feedback Notification */}
      {appliedNotification && (
        <div className="mt-3 p-3 rounded-xl bg-primary-fixed border border-primary-container text-on-primary-fixed text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{appliedNotification}</span>
          </div>
          <button 
            onClick={() => setAppliedNotification('')}
            className="text-on-primary-fixed hover:opacity-75"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-error-container/40 border border-error/30 text-on-surface text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => handleSynthesize(promptInput)}
            className="text-xs font-bold underline text-error hover:opacity-80"
          >
            Retry
          </button>
        </div>
      )}

      {/* ================= LOADING INDICATOR ================= */}
      {isGenerating && (
        <div className="my-4 flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-surface-container-highest animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base animate-spin">sync</span>
          </div>
          <div>
            <p className="font-title-sm text-xs font-bold text-tertiary">
              Planora GenAI Reasoning &amp; Synthesizing...
            </p>
            <p className="text-[11px] text-on-surface-variant">
              Evaluating metropolitan vendor benchmarks, line-array acoustics, guest flows, and contingency protocols
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 1: BLUEPRINT CANVAS VIEW ================= */}
      {activeTab === 'blueprint' && (
        <div className="mt-4 space-y-5">
          {planResult && (
            <div className="flex flex-col items-start w-full space-y-4">
              {/* Identity & Status */}
              <div className="flex items-center justify-between w-full pl-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </div>
                  <span className="font-label-md text-xs text-primary font-bold tracking-tight">
                    Planora Intelligence
                  </span>
                  <span className="bg-secondary-container/60 text-tertiary px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {planResult.isLiveLLM ? 'Live Gemini Model' : 'Operational Blueprint'}
                  </span>
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="text-xs font-bold text-primary-container hover:underline flex items-center gap-1"
                >
                  <span>Apply Blueprint</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Estimate Notice */}
              <div className="w-full bg-secondary-container/20 border-l-4 border-primary-container p-3 rounded-r-lg border border-surface-container-highest/60 text-tertiary">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[18px] shrink-0 mt-0.5">info</span>
                  <p className="font-body-sm text-xs text-on-surface leading-tight">
                    <strong className="font-bold text-primary-container">Estimate Notice:</strong> Cost values and preparation timeline are algorithmic operational suggestions. Review and confirm with suppliers before contractual lock.
                  </p>
                </div>
              </div>

              {/* SECTION 1: Concept & Core Identity */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">palette</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 01 • CONCEPT &amp; THEME
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">verified</span>
                </div>
                <div className="pt-3">
                  <h2 className="font-headline-sm text-base md:text-lg text-tertiary font-bold tracking-tight">
                    {planResult.theme}
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    {planResult.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 bg-surface-container text-primary-container px-2.5 py-1 rounded-lg text-xs font-semibold border border-surface-container-highest">
                      <span className="material-symbols-outlined text-[13px]">groups</span> {planResult.metrics?.attendance || activeEvent?.attendance} Capacity
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container text-primary-container px-2.5 py-1 rounded-lg text-xs font-semibold border border-surface-container-highest">
                      <span className="material-symbols-outlined text-[13px]">payments</span> {formatCurrency(planResult.metrics?.budget || activeEvent?.budget)} Target
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container text-primary-container px-2.5 py-1 rounded-lg text-xs font-semibold border border-surface-container-highest">
                      <span className="material-symbols-outlined text-[13px]">checklist</span> {planResult.tasks?.length || 0} Key Tasks
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container text-primary-container px-2.5 py-1 rounded-lg text-xs font-semibold border border-surface-container-highest">
                      <span className="material-symbols-outlined text-[13px]">inventory_2</span> {planResult.supplies?.length || 0} Equipment Items
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Fiscal Model & Budget Breakdown */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">payments</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 02 • FISCAL MODEL &amp; BUDGET
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-surface-container text-primary-container font-bold border border-primary-container/20">
                    {formatCurrency(planResult.metrics?.budget || activeEvent?.budget)} Total Envelope
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="pt-3 pb-2">
                  <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden flex mb-3">
                    <div className="bg-primary-container h-full" style={{ width: '35%' }} title="Audio Visual (35%)"></div>
                    <div className="bg-secondary h-full" style={{ width: '30%' }} title="Catering (30%)"></div>
                    <div className="bg-secondary-container h-full" style={{ width: '15%' }} title="Decor & Signage (15%)"></div>
                    <div className="bg-surface-tint h-full" style={{ width: '10%' }} title="Safety & NOC (10%)"></div>
                    <div className="bg-tertiary-fixed-dim h-full" style={{ width: '10%' }} title="Contingency (10%)"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {planResult.budgetAllocations?.map((alloc, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container/40 border border-surface-container-highest/50">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-container shrink-0"></span>
                          <span className="font-title-sm text-xs font-bold text-tertiary truncate">{alloc.category}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant pl-4 mt-0.5">{alloc.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="font-title-sm text-xs font-bold text-primary">{formatCurrency(alloc.amount)}</span>
                        <span className="text-[10px] text-outline ml-1 font-semibold">({Math.round(alloc.share * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 3: Critical Path Tasks & Assignments */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">assignment_turned_in</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 03 • CRITICAL PATH MILESTONES
                    </span>
                  </div>
                  <span className="font-label-sm text-xs text-secondary font-bold">
                    {planResult.tasks?.length || 0} Action Items
                  </span>
                </div>
                <div className="pt-3 space-y-2">
                  {planResult.tasks?.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container/30 border border-surface-container-highest/40">
                      <div className="w-5 h-5 rounded border border-primary-container bg-surface-container-lowest flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-xs text-primary-container">arrow_forward</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-title-sm text-xs font-bold text-tertiary truncate">{task.title}</h4>
                          <span className={`font-label-sm text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            task.priority === 'critical' 
                              ? 'bg-error text-surface-container-lowest' 
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">{task.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary">
                          <span>Role: {task.assignedRole}</span>
                          <span>•</span>
                          <span>{task.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 4: Run-of-Show Schedule */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">schedule</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 04 • EVENT RUN-OF-SHOW
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {planResult.schedule?.length || 0} Milestones
                  </span>
                </div>
                <div className="pt-3 space-y-2">
                  {planResult.schedule?.map((sc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-surface-container-highest/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-bold text-secondary font-mono shrink-0">{sc.time}</span>
                        <span className="font-medium text-tertiary truncate">{sc.activity}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant shrink-0 ml-2">{sc.stage} ({sc.duration})</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 5: Equipment & Supplies Checklist */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">inventory_2</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 05 • EQUIPMENT &amp; SUPPLIES PROCUREMENT
                    </span>
                  </div>
                  <span className="font-label-sm text-xs text-secondary font-bold">
                    {planResult.supplies?.length || 0} Items
                  </span>
                </div>
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planResult.supplies?.map((sup, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-surface-container/30 border border-surface-container-highest/40 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-tertiary text-xs truncate">{sup.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{sup.category} • {sup.requiredQty} {sup.unit}</p>
                      </div>
                      <span className="font-bold text-primary text-xs ml-2">
                        {formatCurrency(sup.estimatedCost)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 6: Risk Mitigation & Contingency Protocols */}
              <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">alt_route</span>
                    <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                      SECTION 06 • RISK MITIGATION &amp; CONTINGENCIES
                    </span>
                  </div>
                  <span className="text-xs font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded">
                    Active SLA Protocols
                  </span>
                </div>
                <div className="pt-3 space-y-2.5">
                  {planResult.contingencies?.map((c, idx) => (
                    <div key={idx} className="p-3 bg-surface-container-high/60 rounded-lg border border-surface-container-highest">
                      <h5 className="font-title-sm text-xs font-bold text-tertiary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-primary-container">shield</span>
                        <span>Risk Scenario: {c.risk}</span>
                      </h5>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {c.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 7: Safety & Accessibility Checklist */}
              {planResult.safetyChecklist && (
                <section className="w-full bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/70">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-[20px]">health_and_safety</span>
                      <span className="font-label-sm text-xs text-secondary font-bold uppercase">
                        SECTION 07 • SAFETY &amp; ACCESSIBILITY CHECKLIST
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 space-y-1.5">
                    {planResult.safetyChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-tertiary">
                        <span className="material-symbols-outlined text-sm text-primary-container">check_box</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: CHAT & ACTIONS STREAM ================= */}
      {activeTab === 'chat' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-xs font-bold text-secondary uppercase tracking-wider">
              Conversational Event Planning Stream
            </span>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `rst-${Date.now()}`,
                    role: 'assistant',
                    content: `Session restarted. How can I help you coordinate **${activeEvent?.name}**?`,
                    suggestedPrompts: [
                      'What should I prepare first?',
                      'Divide budget across event requirements',
                      'Add a task to inspect fire extinguishers'
                    ]
                  }
                ]);
              }}
              className="text-xs text-secondary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
              <span>Clear Chat</span>
            </button>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    {msg.role === 'user' ? 'Avantika (Event Director)' : 'Planora AI Co-Organizer'}
                  </span>
                  {msg.isLiveLLM && (
                    <span className="text-[9px] bg-primary-fixed px-1.5 py-0.2 rounded text-on-primary-fixed font-bold">
                      Gemini Live
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-surface-container-lowest text-tertiary border border-surface-container-highest rounded-tr-none'
                      : msg.isError
                      ? 'bg-error-container/30 text-error border border-error/20 rounded-tl-none'
                      : 'bg-surface-container-lowest text-tertiary border border-surface-container-highest rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>

                  {/* Proposed Action Card with inline preview & approve */}
                  {msg.action && (
                    <ActionProposalCard
                      action={msg.action}
                      status={executedActions[msg.id] || 'pending'}
                      onApprove={(approvedAction) => handleApproveAction(msg.id, approvedAction)}
                      onReject={() => handleRejectAction(msg.id)}
                      formatCurrency={formatCurrency}
                    />
                  )}

                  {/* Generated Blueprint Snippet */}
                  {msg.plan && (
                    <div className="mt-3 p-3 rounded-xl bg-surface-container-low border border-primary-container/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-container text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                          <span>Complete Blueprint Ready</span>
                        </span>
                        <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded font-bold text-on-secondary-container">
                          12 Sections
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {msg.plan.summary}
                      </p>
                      <button
                        onClick={() => setActiveTab('blueprint')}
                        className="w-full mt-1 bg-primary-container hover:bg-primary text-surface-container-lowest py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>View Full 12-Section Canvas</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {msg.isEstimateNotice && (
                    <p className="text-[10px] text-outline mt-2 pt-1.5 border-t border-surface-container-highest/60 italic">
                      * {msg.isEstimateNotice}
                    </p>
                  )}
                </div>

                {/* Suggested Follow-ups */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-1 max-w-[90%]">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChatMessage(p)}
                        className="text-xs px-3 py-1 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
                      >
                        ⚡ {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        </div>
      )}

      {/* ================= FLOATING COMMAND BAR AT BOTTOM ================= */}
      <div className="fixed bottom-16 md:bottom-0 left-0 lg:left-64 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-surface-container-highest py-3 px-margin-mobile md:px-margin shadow-lg">
        <div className="max-w-5xl mx-auto space-y-2">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => {
                const text = `Plan a college cultural fest for ${activeEvent?.attendance || 500} people with ₹${activeEvent?.budget?.toLocaleString()} budget and stage setup.`;
                setPromptInput(text);
                handleSynthesize(text);
              }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
            >
              ⚡ College Cultural Fest ({activeEvent?.attendance || 500} Pax)
            </button>
            <button 
              onClick={() => {
                const text = `Plan a luxury wedding reception for 400 guests with ₹8,50,000 budget, acoustic quartet and multi-cuisine catering.`;
                setPromptInput(text);
                handleSynthesize(text);
              }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
            >
              💍 Luxury Wedding Reception
            </button>
            <button 
              onClick={() => {
                const text = `Add a task to finalize decorations by 10 December and assign it to Priya`;
                handleSendChatMessage(text);
              }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
            >
              📝 Add Task: Finalize Decorations
            </button>
            <button 
              onClick={() => {
                const text = `Analyze our budget and suggest ways to reduce cost by ₹15,000`;
                handleSendChatMessage(text);
              }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
            >
              💰 Optimize Budget
            </button>
            <button 
              onClick={() => {
                const text = `Synthesize emergency rain and humidity contingency for open-air stage sound gear.`;
                setPromptInput(text);
                handleSynthesize(text);
              }}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors"
            >
              🌧️ Rain Contingency
            </button>
          </div>

          {/* Unified Input Box */}
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary-container">
            <span className="material-symbols-outlined text-secondary text-lg ml-2">auto_awesome</span>
            <input 
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (activeTab === 'chat') {
                    handleSendChatMessage();
                  } else {
                    handleSynthesize(promptInput);
                  }
                }
              }}
              placeholder={`Ask Planora AI to plan an event, adjust budget, create tasks, or handle contingencies...`}
              className="flex-1 bg-transparent px-2 py-1.5 text-xs md:text-sm text-tertiary focus:outline-none"
            />
            <button
              onClick={() => {
                if (activeTab === 'chat') {
                  handleSendChatMessage();
                } else {
                  handleSynthesize(promptInput);
                }
              }}
              disabled={isGenerating || !promptInput.trim()}
              className="bg-primary-container hover:bg-primary disabled:opacity-50 text-surface-container-lowest px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-sm"
            >
              <span>{activeTab === 'blueprint' ? 'Synthesize Plan' : 'Send Message'}</span>
              <span className="material-symbols-outlined text-[15px]">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Applying Full Blueprint */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-primary-container">
              <span className="material-symbols-outlined text-2xl">published_with_changes</span>
              <h3 className="font-headline-sm text-base font-bold text-tertiary">Apply Blueprint to Event?</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This will add <strong className="text-tertiary">{planResult?.tasks?.length || 0} actionable tasks</strong>, <strong className="text-tertiary">{planResult?.budgetAllocations?.length || 0} budget ledger entries</strong>, and <strong className="text-tertiary">{planResult?.supplies?.length || 0} equipment items</strong> directly into <strong className="text-primary font-semibold">{activeEvent?.name}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-highest">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest text-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyFullPlan}
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest text-xs font-bold shadow-sm"
              >
                Confirm &amp; Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Switcher Modal */}
      <EventSwitcherModal
        isOpen={showSwitcherModal}
        onClose={() => setShowSwitcherModal(false)}
      />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { sendChatMessage, executeProposedAction, checkAiHealth } from '../services/aiPlannerService';
import { ActionProposalCard } from './ActionProposalCard';

export const AIAssistantWidget = () => {
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
    addActivity,
    formatCurrency
  } = useEvents();

  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello Avantika! I am your AI Event Co-Organizer for **${activeEvent?.name || 'your event'}**.\n\nAsk me any question, request tactical adjustments, or tell me to create tasks, log expenses, and coordinate supplies.`,
      action: null,
      suggestedPrompts: [
        'What critical tasks are currently overdue?',
        'Analyze our budget allocations',
        'Add a task to finalize decorations by 10 December and assign it to Priya'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiHealth, setAiHealth] = useState({ connected: false, hasApiKey: false, model: 'gemini-2.5-flash' });
  const [executedActions, setExecutedActions] = useState({});

  const chatBottomRef = useRef(null);

  // Derive current screen slug
  const currentScreen = location.pathname === '/' 
    ? 'dashboard' 
    : location.pathname.replace(/^\//, '').split('/')[0];

  // Screen human-readable titles
  const screenTitles = {
    dashboard: 'Main Dashboard',
    events: 'Events Overview',
    'ai-planner': 'AI Planner Workspace',
    tasks: 'Tasks & Timeline',
    budget: 'Budget & Expenses',
    supplies: 'Food & Supplies',
    venue: 'Venue & Seating',
    team: 'Team Operations',
    live: 'Live Control Room',
    reports: 'Reports & History',
    settings: 'Settings'
  };

  // Check health on mount
  useEffect(() => {
    checkAiHealth().then(setAiHealth);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isGenerating]);

  // Screen-specific quick prompt pills
  const getScreenPrompts = () => {
    switch (currentScreen) {
      case 'budget':
        return [
          'Analyze our budget allocations vs spending',
          'Where can we trim ₹10,000 without hurting quality?',
          'Add an expense record for sound gear'
        ];
      case 'tasks':
        return [
          'What critical tasks are overdue?',
          'Help me distribute pending tasks to available team',
          'Add a task to inspect fire extinguishers'
        ];
      case 'supplies':
        return [
          'Identify missing equipment in our inventory',
          `Estimate snack box quantities for ${activeEvent?.attendance || 500} guests`,
          'Add supply: 2 cordless handheld mics'
        ];
      case 'venue':
        return [
          `Check seating capacity vs ${activeEvent?.attendance || 500} expected guests`,
          'Suggest stage placement and acoustic layout',
          'Generate venue accessibility checklist'
        ];
      case 'live':
        return [
          'Opening is delayed by 20 minutes, adjust schedule',
          'Sound system is having RF interference, what should team do?',
          'Which remaining activities can be shortened?'
        ];
      default:
        return [
          'What should I prepare first?',
          'Add a task to finalize decorations by 10 December and assign it to Priya',
          'Create a contingency plan in case of rain'
        ];
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    setErrorMessage('');
    const userMsgId = `usr-${Date.now()}`;
    const userMsg = { id: userMsgId, role: 'user', content: text };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    // Build event context payload
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

    // Format conversational history
    const historyPayload = messages
      .filter(m => m.id !== 'msg-welcome')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await sendChatMessage({
        message: text,
        history: historyPayload,
        eventContext,
        currentScreen
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

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('[Planora AI] Chat error:', err);
      setErrorMessage(err.message || 'Unable to connect to Planora AI service.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Service Alert**: ${err.message || 'Unable to reach AI assistant service'}. Please check if the backend server is running on port 3001.`,
          isError: true,
          suggestedPrompts: ['Retry last message', 'Check backend health']
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

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
      // Append confirmation response
      setMessages(prev => [
        ...prev,
        {
          id: `conf-${Date.now()}`,
          role: 'assistant',
          content: `✅ **Action Confirmed & Executed**:\n${result.message}.\n\nThe changes are now active across your **${activeEvent?.name}** workspace.`,
          suggestedPrompts: getScreenPrompts()
        }
      ]);
    }
  };

  const handleRejectAction = (msgId) => {
    setExecutedActions(prev => ({ ...prev, [msgId]: 'rejected' }));
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'assistant',
        content: `Chat session reset for **${activeEvent?.name}**. How can I help you coordinate this event?`,
        suggestedPrompts: getScreenPrompts()
      }
    ]);
    setExecutedActions({});
    setErrorMessage('');
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER BUTTON ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-primary-container hover:bg-primary text-surface-container-lowest py-2.5 px-4 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-200 active:scale-95 group border border-primary-fixed/30 hover:shadow-2xl"
          aria-label="Open Planora GenAI Event Assistant"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">
              auto_awesome
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary-fixed animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary-fixed"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-label-md text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Ask Planora AI</span>
              <span className="bg-primary-fixed/20 text-primary-fixed px-1.5 py-0.2 rounded text-[10px] font-semibold">
                Gemini
              </span>
            </span>
            <span className="text-[10px] text-surface-container-lowest/80 leading-none truncate max-w-[120px]">
              {activeEvent?.name || 'Active Event'}
            </span>
          </div>
        </button>
      )}

      {/* ================= ASSISTANT DRAWER PANEL ================= */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-surface-container-lowest shadow-2xl border-l border-surface-container-highest flex flex-col animate-slideIn">
          {/* Header */}
          <div className="p-3.5 bg-surface-container-low border-b border-surface-container-highest flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-sm font-bold text-tertiary truncate">
                    Planora AI Co-Organizer
                  </h3>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    aiHealth.hasApiKey 
                      ? 'bg-primary-fixed text-on-primary-fixed' 
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {aiHealth.hasApiKey ? 'Gemini 2.5' : 'Preview'}
                  </span>
                </div>
                <p className="text-[11px] text-secondary truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  <span className="font-semibold text-tertiary">{activeEvent?.name}</span>
                  <span>•</span>
                  <span>{screenTitles[currentScreen] || currentScreen}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleClearChat}
                title="Clear conversation history"
                className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-colors text-xs flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              </button>
              <button
                onClick={() => navigate('/ai-planner')}
                title="Expand to Full AI Planner Workspace"
                className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-colors text-xs flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-secondary hover:bg-surface-container transition-colors text-xs flex items-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Active Workspace Capsule */}
          <div className="px-3 py-1.5 bg-surface-container border-b border-surface-container-highest flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-sm text-primary-container">event</span>
              <span className="truncate">{activeEvent?.fullName || activeEvent?.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-tertiary">{formatCurrency(activeEvent?.budget)}</span>
              <span>•</span>
              <span className="font-semibold text-secondary">{activeEvent?.attendance} Pax</span>
            </div>
          </div>

          {/* API Key Status Notice Banner (if not yet configured) */}
          {!aiHealth.hasApiKey && (
            <div className="px-3 py-1.5 bg-secondary-container/30 border-b border-secondary-container/60 text-[11px] text-on-secondary-container flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                <span>Using Smart Local Engine. Add <strong>GEMINI_API_KEY</strong> in <code>.env</code> for live GenAI.</span>
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scroll">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    {msg.role === 'user' ? 'Avantika (You)' : 'Planora AI'}
                  </span>
                  {msg.isLiveLLM && (
                    <span className="text-[9px] bg-primary-fixed px-1 rounded text-on-primary-fixed font-bold">
                      Live LLM
                    </span>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-surface-container-lowest rounded-tr-none font-medium'
                      : msg.isError
                      ? 'bg-error-container/30 text-error border border-error/20 rounded-tl-none'
                      : 'bg-surface-container-low text-tertiary border border-surface-container-highest rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-1.5">
                    {msg.content}
                  </div>

                  {/* Proposed Action Card */}
                  {msg.action && (
                    <ActionProposalCard
                      action={msg.action}
                      status={executedActions[msg.id] || 'pending'}
                      onApprove={(approvedAction) => handleApproveAction(msg.id, approvedAction)}
                      onReject={() => handleRejectAction(msg.id)}
                      formatCurrency={formatCurrency}
                    />
                  )}

                  {/* Full Plan Preview Card if generated */}
                  {msg.plan && (
                    <div className="mt-3 p-3 rounded-xl bg-surface-container-lowest border border-primary-container/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-container text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                          <span>Complete Blueprint Generated</span>
                        </span>
                        <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded font-bold text-on-secondary-container">
                          12 Sections
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {msg.plan.summary}
                      </p>
                      <button
                        onClick={() => navigate('/ai-planner')}
                        className="w-full mt-1 bg-primary-container hover:bg-primary text-surface-container-lowest py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span>Open &amp; Apply in Full Workspace</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {/* Estimate Notice */}
                  {msg.isEstimateNotice && (
                    <p className="text-[10px] text-outline mt-2 pt-1.5 border-t border-surface-container-highest/60 italic">
                      * {msg.isEstimateNotice}
                    </p>
                  )}
                </div>

                {/* Quick Prompts under Assistant message */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-1 max-w-[95%]">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 hover:border-primary-container/30 transition-all text-left"
                      >
                        ⚡ {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isGenerating && (
              <div className="flex items-start gap-2 animate-fadeIn">
                <div className="w-6 h-6 rounded-md bg-primary-container text-surface-container-lowest flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                </div>
                <div className="bg-surface-container-low border border-surface-container-highest rounded-2xl rounded-tl-none p-3 max-w-[85%] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
                    <span className="font-bold text-xs text-primary-container">Planora AI Reasoning...</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Evaluating {activeEvent?.name} context, budget bounds, and operational milestones
                  </p>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Context Quick Chips Carousel at bottom */}
          <div className="px-3 py-2 bg-surface-container-low border-t border-surface-container-highest shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] uppercase font-bold text-secondary shrink-0">
                Suggested:
              </span>
              {getScreenPrompts().map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-surface-container-lowest text-tertiary border border-surface-container-highest hover:bg-secondary-container/40 transition-colors truncate max-w-[240px]"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5 mt-1.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask Planora AI about ${activeEvent?.name || 'this event'}...`}
                className="flex-1 bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-2 text-xs text-tertiary focus:outline-none focus:ring-1 focus:ring-primary-container"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={isGenerating || !inputValue.trim()}
                className="bg-primary-container hover:bg-primary disabled:opacity-40 text-surface-container-lowest p-2 rounded-xl transition-transform active:scale-95 shadow-sm shrink-0 flex items-center justify-center"
                aria-label="Send message to Planora AI"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

# Planora — Intelligent Event Management Platform with Google Gemini GenAI

Planora is an enterprise-grade event management platform designed to plan every detail and run every event seamlessly. Integrated with Google Gemini generative AI, Planora acts as an active AI Co-Organizer capable of drafting production blueprints, generating realistic budgets, recommending safety protocols, and proposing actionable task updates with one-click organizer approval.

---

## ✨ Features

- **🎯 Smart Event Workspace & Switcher**: Easily switch between events (e.g., *TechSpark 2025*, *Global AI Summit*, *Annual Gala*) with unified live metrics, countdown timers, and operational health scores.
- **🤖 Google Gemini AI Co-Organizer**:
  - Live conversational planning drawer with deep event context awareness.
  - Multi-candidate failover model architecture (`gemini-3-flash-preview`, `gemini-3.5-flash`, `gemini-3.8-flash`).
  - Strict structured action proposals: AI proposes tasks, expenses, supplies, or catering items with preview cards that require organizer approval before touching state.
  - Automatic local fallback engine if no API key is provided.
- **📋 Tasks & Timeline**: Kanban-style milestone scheduling, category tags, priority indicators, and automated timeline views.
- **💰 Budget & Expense Allocation**: Real-time budget tracking, categorical breakdowns, variance calculation, and payment status tracking.
- **🍲 Food & Supplies Logistics**: Pax-based catering estimator, menu curation, and inventory stock tracking with deficit alerts.
- **🏛️ Venue & Seating Planner**: Stage layout maps, seat allocations, VIP zones, and egress planning.
- **👥 Team Operations & Delegation**: Role-based team assignment, contact sheets, and real-time task load distribution.
- **🚨 Live Event Mode (Control Room)**: Real-time run-of-show timeline, emergency broadcast banners, quick delay announcements, and live run status toggles.
- **📊 Reports & Post-Event History**: Comprehensive analytics, attendee turnout stats, and budget vs actual spend retrospectives.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/chaitrapophale/planora.git
cd planora
npm install
```

### 3. Configure Google Gemini API Key

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Add your Google Gemini API key in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-3-flash-preview
PORT=3001
```

*(You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)).*

### 4. Run Locally

Run both the frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173) (or [http://localhost:4000](http://localhost:4000))
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🛠️ Project Structure

```
planora/
├── index.html                   # Single-page HTML entry point
├── package.json                 # Scripts and dependencies
├── vite.config.js               # Vite bundler configuration & proxy
├── tailwind.config.js           # Design system tokens and palette
├── server/                      # Express Backend & GenAI Services
│   ├── config.js                # Environment config loader
│   ├── index.js                 # API endpoints (/api/health, /api/ai/chat, /api/ai/plan)
│   └── services/
│       ├── geminiService.js     # Live Google Generative Language API integration
│       ├── planoraPrompt.js     # System instructions and contextual prompt builder
│       ├── actionValidator.js   # Action proposal schema & bounds validation
│       └── localFallbackService.js # Intelligent deterministic fallback engine
└── src/                         # React 18 Frontend
    ├── main.jsx                 # React root DOM mount
    ├── App.jsx                  # React Router routes
    ├── index.css                # Global styles & Tailwind utilities
    ├── layouts/
    │   └── AppLayout.jsx        # Navigation sidebar, topbar, and drawer wrappers
    ├── components/
    │   ├── AIAssistantWidget.jsx # Floating AI Assistant drawer & chat interface
    │   ├── ActionProposalCard.jsx # Organizer approval card for AI actions
    │   └── EventSwitcherModal.jsx # Multi-event switcher modal
    ├── context/
    │   ├── EventContext.jsx     # Global event state management & reducers
    │   └── initialData.js       # Production seed datasets
    ├── pages/
    │   ├── Dashboard.jsx        # Main executive dashboard
    │   ├── AIPlanner.jsx        # Dedicated GenAI blueprint synthesis canvas
    │   ├── TasksTimeline.jsx    # Operational tasks & milestones
    │   ├── BudgetExpenses.jsx   # Financial tracking & expense vouchers
    │   ├── FoodSupplies.jsx     # Food catering & supplies inventory
    │   ├── VenueSeating.jsx     # Venue layouts & seating charts
    │   ├── TeamOperations.jsx   # Crew management & task loads
    │   ├── LiveEventMode.jsx    # Live day-of-event control room
    │   ├── ReportsHistory.jsx   # Analytical post-event reports
    │   ├── MyEvents.jsx         # Event portfolio overview
    │   ├── EventCreationWizard.jsx # Multi-step event creation wizard
    │   └── Settings.jsx         # Application & AI preferences
    └── services/
        └── aiPlannerService.js  # Frontend client for backend AI endpoints
```

---

## 🛡️ License

MIT License. Designed and developed for modern event producers and organizers.

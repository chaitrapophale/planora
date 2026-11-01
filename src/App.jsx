import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AppLayout } from './layouts/AppLayout';

// Screen pages
import { Dashboard } from './pages/Dashboard';
import { MyEvents } from './pages/MyEvents';
import { EventCreationWizard } from './pages/EventCreationWizard';
import { AIPlanner } from './pages/AIPlanner';
import { TasksTimeline } from './pages/TasksTimeline';
import { BudgetExpenses } from './pages/BudgetExpenses';
import { FoodSupplies } from './pages/FoodSupplies';
import { VenueSeating } from './pages/VenueSeating';
import { TeamOperations } from './pages/TeamOperations';
import { LiveEventMode } from './pages/LiveEventMode';
import { ReportsHistory } from './pages/ReportsHistory';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="events/new" element={<EventCreationWizard />} />
            <Route path="ai-planner" element={<AIPlanner />} />
            <Route path="tasks" element={<TasksTimeline />} />
            <Route path="budget" element={<BudgetExpenses />} />
            <Route path="supplies" element={<FoodSupplies />} />
            <Route path="venue" element={<VenueSeating />} />
            <Route path="team" element={<TeamOperations />} />
            <Route path="live" element={<LiveEventMode />} />
            <Route path="reports" element={<ReportsHistory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;

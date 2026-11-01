import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export const EventCreationWizard = () => {
  const { createEvent, formatCurrency } = useEvents();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: '',
    category: 'College / Cultural Festival',
    date: '2025-11-20',
    endDate: '2025-11-20',
    startTime: '09:00',
    endTime: '21:00',
    venue: '',
    venueAddress: '',
    attendance: 300,
    budget: 150000,
    currency: 'INR',
    description: '',
    foodNeeds: 'Boxed vegetarian & Jain meals with mineral water stations',
    equipmentNeeds: 'Line array audio, 4 cordless microphones, 40ft stage with truss',
    accessibilityNeeds: 'Wheelchair access ramp at Gate 1, reserved front-row seating',
    safetyRequirements: 'Fire extinguisher verification, police bandobast NOC clearance',
    leadCoordinator: 'Avantika Sharma'
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.name.trim()) errs.name = 'Event name is required';
      if (!formData.venue.trim()) errs.venue = 'Venue name is required';
      if (!formData.date) errs.date = 'Date is required';
    } else if (step === 2) {
      if (!formData.attendance || Number(formData.attendance) <= 0) {
        errs.attendance = 'Attendance must be greater than 0';
      }
      if (!formData.budget || Number(formData.budget) <= 0) {
        errs.budget = 'Budget must be greater than 0';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = () => {
    const created = createEvent(formData);
    navigate('/');
  };

  const handleSaveDraft = () => {
    if (!formData.name.trim()) {
      formData.name = 'Untitled Event Draft';
    }
    createEvent({ ...formData, status: 'Draft' });
    navigate('/events');
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const stepTitles = [
    'Core Info',
    'Scale & Logistics',
    'Requirements',
    'Team & Safety Review'
  ];

  return (
    <div className="min-h-full flex flex-col pb-24">
      {/* Top Wizard Sub-Header Stepper */}
      <div className="bg-surface-bright border-b border-surface-container-highest px-margin-mobile md:px-margin py-3.5 sticky top-16 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-title-sm text-sm text-tertiary font-bold">
                {stepTitles[currentStep - 1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm text-xs font-bold text-primary-container">
                {progressPercent}% Completed
              </span>
              <button 
                onClick={handleSaveDraft}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded border border-secondary text-secondary text-xs hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">bookmark</span>
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {[1, 2, 3, 4].map(st => (
              <div 
                key={st}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  st < currentStep 
                    ? 'bg-primary-container' 
                    : st === currentStep 
                    ? 'bg-secondary-container relative overflow-hidden' 
                    : 'bg-surface-container-high'
                }`}
              >
                {st === currentStep && (
                  <div className="absolute inset-y-0 left-0 bg-primary-container w-3/4 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Ribbon */}
          <div className="hidden sm:flex justify-between items-center mt-2 px-0.5 text-label-sm text-xs text-on-surface-variant font-medium">
            <span className={currentStep >= 1 ? 'text-primary font-bold' : ''}>1. Core Info</span>
            <span className={currentStep >= 2 ? 'text-primary font-bold' : ''}>2. Scale &amp; Logistics</span>
            <span className={currentStep >= 3 ? 'text-primary font-bold' : ''}>3. Requirements</span>
            <span className={currentStep >= 4 ? 'text-primary font-bold' : ''}>4. Team &amp; Safety</span>
          </div>
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-margin-mobile md:px-margin py-6 space-y-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary font-bold tracking-tight">
            {currentStep === 1 && 'Define New Event Blueprint'}
            {currentStep === 2 && 'Attendance & Financial Scope'}
            {currentStep === 3 && 'Operational Requirements'}
            {currentStep === 4 && 'Director Review & Dispatch'}
          </h1>
          <p className="font-body-sm text-sm text-on-surface-variant mt-1">
            {currentStep === 1 && 'Establish the baseline event identity, classification, and venue coordinates.'}
            {currentStep === 2 && 'Set guest parameters, fiscal constraints, and resource targets.'}
            {currentStep === 3 && 'Document stage specs, catering needs, safety compliance, and accessibility.'}
            {currentStep === 4 && 'Verify all operational coordinates before activating the live production workspace.'}
          </p>
        </div>

        {/* STEP 1: Core Info */}
        {currentStep === 1 && (
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Event Name *
              </label>
              <input 
                type="text"
                placeholder="e.g. Symphony 2025: Annual College Cultural Fest"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-bright text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary-container ${
                  errors.name ? 'border-error' : 'border-surface-container-highest'
                }`}
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  Event Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
                >
                  <option value="College / Cultural Festival">College / Cultural Festival</option>
                  <option value="Wedding / Reception">Wedding / Reception</option>
                  <option value="Corporate / Summit">Corporate / Summit</option>
                  <option value="School / Centenary">School / Centenary</option>
                  <option value="Birthday / Milestone">Birthday / Milestone</option>
                  <option value="Exhibition / Expo">Exhibition / Expo</option>
                  <option value="Community / Charity">Community / Charity</option>
                  <option value="Custom Event">Custom Event</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  Event Date *
                </label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, endDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  Start Time
                </label>
                <input 
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
                />
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  End Time
                </label>
                <input 
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Venue Name *
              </label>
              <input 
                type="text"
                placeholder="e.g. St. Xavier's Grand Quad, Mumbai"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-bright text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary-container ${
                  errors.venue ? 'border-error' : 'border-surface-container-highest'
                }`}
              />
              {errors.venue && <p className="text-error text-xs mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Venue Address &amp; Access Notes
              </label>
              <textarea 
                rows="2"
                placeholder="Exact street address, nearest landmark, and loading bay entrance"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Scale & Logistics */}
        {currentStep === 2 && (
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  Expected Attendance (Pax) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-lg">group</span>
                  <input 
                    type="number"
                    min="1"
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-surface-bright text-tertiary text-sm font-semibold tabular-nums ${
                      errors.attendance ? 'border-error' : 'border-surface-container-highest'
                    }`}
                  />
                </div>
                {errors.attendance && <p className="text-error text-xs mt-1">{errors.attendance}</p>}
              </div>

              <div>
                <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                  Allocated Budget (₹ INR) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-lg">payments</span>
                  <input 
                    type="number"
                    min="0"
                    step="5000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-surface-bright text-tertiary text-sm font-semibold tabular-nums ${
                      errors.budget ? 'border-error' : 'border-surface-container-highest'
                    }`}
                  />
                </div>
                {errors.budget && <p className="text-error text-xs mt-1">{errors.budget}</p>}
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Formatted: {formatCurrency(formData.budget)}
                </p>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Executive Purpose &amp; Scope
              </label>
              <textarea 
                rows="3"
                placeholder="Describe key highlights, VIPs attending, primary deliverables, and milestones."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Requirements */}
        {currentStep === 3 && (
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Catering &amp; Dietary Requirements
              </label>
              <textarea 
                rows="2"
                value={formData.foodNeeds}
                onChange={(e) => setFormData({ ...formData, foodNeeds: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Audio, Staging &amp; Technical Specs
              </label>
              <textarea 
                rows="2"
                value={formData.equipmentNeeds}
                onChange={(e) => setFormData({ ...formData, equipmentNeeds: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Accessibility &amp; Reserved Seating
              </label>
              <input 
                type="text"
                value={formData.accessibilityNeeds}
                onChange={(e) => setFormData({ ...formData, accessibilityNeeds: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-tertiary uppercase tracking-wider mb-1.5">
                Safety, Medical &amp; Police NOC Requirements
              </label>
              <input 
                type="text"
                value={formData.safetyRequirements}
                onChange={(e) => setFormData({ ...formData, safetyRequirements: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-tertiary text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirm */}
        {currentStep === 4 && (
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-highest shadow-sm space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-3">
              <div className="flex items-start justify-between border-b border-surface-container-highest pb-3">
                <div>
                  <span className="font-label-sm text-[10px] uppercase font-bold text-secondary">
                    {formData.category}
                  </span>
                  <h3 className="font-headline-sm text-lg font-bold text-tertiary">
                    {formData.name || 'Untitled Event'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{formData.venue}</p>
                </div>
                <span className="bg-primary-container text-surface-container-lowest font-bold text-xs px-2.5 py-1 rounded">
                  {formatCurrency(formData.budget)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Date</span>
                  <span className="font-bold text-tertiary">{formData.date}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Timings</span>
                  <span className="font-bold text-tertiary">{formData.startTime} - {formData.endTime}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Expected Pax</span>
                  <span className="font-bold text-primary-container">{formData.attendance} Guests</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Lead Director</span>
                  <span className="font-bold text-tertiary">{formData.leadCoordinator}</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-surface-container-highest/60">
                <p><strong>Catering:</strong> {formData.foodNeeds}</p>
                <p><strong>Equipment:</strong> {formData.equipmentNeeds}</p>
                <p><strong>Accessibility:</strong> {formData.accessibilityNeeds}</p>
                <p><strong>Safety &amp; Compliance:</strong> {formData.safetyRequirements}</p>
              </div>
            </div>

            <div className="p-3 bg-secondary-container/30 border border-secondary/20 rounded-lg text-xs text-on-secondary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">verified</span>
              <span>
                Submitting will initialize baseline checklist tasks, budget ledger categories, and venue readiness cards.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-lg border border-surface-container-highest text-secondary hover:bg-surface-container font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="bg-primary-container hover:bg-primary text-surface-container-lowest px-5 py-2.5 rounded-lg font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>{currentStep === totalSteps ? 'Activate Event Plan' : 'Continue'}</span>
            <span className="material-symbols-outlined text-base">
              {currentStep === totalSteps ? 'check_circle' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

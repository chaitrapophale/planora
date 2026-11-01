import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

export const VenueSeating = () => {
  const { activeEvent, venueZones, updateVenueZone } = useEvents();
  const [selectedZoneId, setSelectedZoneId] = useState(venueZones[0]?.id || 'zn-1');
  const [viewMode, setViewMode] = useState('spatial'); // 'spatial' | 'inventory'

  const selectedZone = venueZones.find(z => z.id === selectedZoneId) || venueZones[0];

  const totalCapacity = venueZones.reduce((acc, z) => acc + (Number(z.capacity) || 0), 0);
  const totalOccupied = venueZones.reduce((acc, z) => acc + (Number(z.occupied) || 0), 0);

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-4 md:pt-6 pb-24 md:pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm text-xs font-bold text-secondary uppercase tracking-widest">
            <span>SPATIAL OPERATIONS &amp; SEATING</span>
            <span>•</span>
            <span className="text-primary-container font-bold">Blueprint Mode</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-tertiary tracking-tight font-bold mt-1">
            Venue &amp; Seating Architecture
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Spatial capacity and accessibility map for <strong className="text-tertiary">{activeEvent?.name}</strong> at <span className="text-primary font-medium">{activeEvent?.venue}</span>
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container p-1 rounded-lg border border-secondary/15">
            <button
              onClick={() => setViewMode('spatial')}
              className={`px-3 py-1.5 rounded text-xs font-title-sm font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'spatial' 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                  : 'text-tertiary hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">architecture</span>
              <span>Spatial Map</span>
            </button>
            <button
              onClick={() => setViewMode('inventory')}
              className={`px-3 py-1.5 rounded text-xs font-title-sm font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'inventory' 
                  ? 'bg-primary-container text-surface-container-lowest shadow-sm' 
                  : 'text-tertiary hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">table_rows</span>
              <span>Zone Inventory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Venue Overview Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Total Venue Capacity</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1 tabular-nums">{totalCapacity} Seats</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Allocated / Seated</span>
          <p className="font-headline-sm text-xl font-bold text-primary-container mt-1 tabular-nums">{totalOccupied} Pax</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Zones Defined</span>
          <p className="font-headline-sm text-xl font-bold text-tertiary mt-1">{venueZones.length} Sectors</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xs">
          <span className="font-label-sm text-[11px] text-secondary font-bold uppercase">Accessibility Status</span>
          <p className="font-headline-sm text-xl font-bold text-primary-fixed-variant mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">accessible</span>
            <span>Step-Free Gate 3</span>
          </p>
        </div>
      </div>

      {/* SPATIAL MAP VIEW */}
      {viewMode === 'spatial' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Blueprint Floorplan Canvas */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-highest pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-xl">map</span>
                <h3 className="font-headline-sm text-base font-bold text-tertiary">Interactive Spatial Layout</h3>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Click any zone to configure seats</span>
            </div>

            {/* Blueprint Grid Container */}
            <div className="blueprint-grid min-h-[420px] rounded-xl border-2 border-dashed border-secondary/25 p-4 relative flex flex-col justify-between space-y-4 bg-surface-container-low/40">
              {/* Stage Zone at Top */}
              <div 
                onClick={() => setSelectedZoneId('zn-1')}
                className={`w-full p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                  selectedZoneId === 'zn-1'
                    ? 'border-primary-container bg-primary-container text-surface-container-lowest shadow-md scale-[1.01]'
                    : 'border-primary-container/40 bg-surface-container-lowest hover:border-primary-container text-tertiary'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-lg">podium</span>
                  <span className="font-headline-sm text-sm font-bold tracking-tight">Main Stage &amp; Green Rooms</span>
                </div>
                <p className="text-[11px] opacity-90">
                  Capacity: {venueZones.find(z => z.id === 'zn-1')?.capacity} • Seated: {venueZones.find(z => z.id === 'zn-1')?.occupied}
                </p>
              </div>

              {/* Middle Section: VIP & Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {/* VIP Enclosure */}
                <div 
                  onClick={() => setSelectedZoneId('zn-2')}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedZoneId === 'zn-2'
                      ? 'border-secondary bg-secondary-container/50 shadow-md ring-2 ring-secondary'
                      : 'border-secondary/30 bg-surface-container-lowest hover:border-secondary'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                        VIP Reserved
                      </span>
                      <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                    </div>
                    <h4 className="font-title-sm text-xs font-bold text-tertiary">VIP &amp; Faculty Lounge</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">Cushioned armchairs with direct line of sight</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container-highest/60 flex justify-between text-xs font-bold text-secondary">
                    <span>Capacity: {venueZones.find(z => z.id === 'zn-2')?.capacity}</span>
                    <span>Seated: {venueZones.find(z => z.id === 'zn-2')?.occupied}</span>
                  </div>
                </div>

                {/* General Audience */}
                <div 
                  onClick={() => setSelectedZoneId('zn-3')}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                    selectedZoneId === 'zn-3'
                      ? 'border-tertiary bg-surface-container shadow-md ring-2 ring-tertiary'
                      : 'border-tertiary/20 bg-surface-container-lowest hover:border-tertiary'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-tertiary bg-surface-container-high px-2 py-0.5 rounded">
                        Audience Quad
                      </span>
                      <span className="material-symbols-outlined text-tertiary text-sm">groups</span>
                    </div>
                    <h4 className="font-title-sm text-xs font-bold text-tertiary">General Student &amp; Guest Quad</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">Tiered seating rows with 8-ft access aisles</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container-highest/60 flex justify-between text-xs font-bold text-tertiary">
                    <span>Capacity: {venueZones.find(z => z.id === 'zn-3')?.capacity}</span>
                    <span>Seated: {venueZones.find(z => z.id === 'zn-3')?.occupied}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Food Court & Medical Corridor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Court */}
                <div 
                  onClick={() => setSelectedZoneId('zn-4')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedZoneId === 'zn-4'
                      ? 'border-primary-container bg-primary-fixed/40 shadow-sm'
                      : 'border-surface-container-highest bg-surface-container-lowest hover:border-primary-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-lg">restaurant</span>
                    <div>
                      <h4 className="font-title-sm text-xs font-bold text-tertiary">Food Court &amp; Water Hub</h4>
                      <p className="text-[10px] text-on-surface-variant">4 Distribution Lines</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-container">
                    {venueZones.find(z => z.id === 'zn-4')?.capacity} Pax Cap
                  </span>
                </div>

                {/* Medical Aid Corridor */}
                <div 
                  onClick={() => setSelectedZoneId('zn-5')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedZoneId === 'zn-5'
                      ? 'border-error bg-error-container/30 shadow-sm'
                      : 'border-surface-container-highest bg-surface-container-lowest hover:border-error'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-lg">medical_services</span>
                    <div>
                      <h4 className="font-title-sm text-xs font-bold text-tertiary">Medical &amp; Evacuation Route</h4>
                      <p className="text-[10px] text-on-surface-variant">Gate 3 Step-Free Ramp</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-error">Clear Path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zone Detail & Seat Editor Panel */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-5 shadow-sm space-y-4">
            <div className="border-b border-surface-container-highest pb-3">
              <span className="text-[10px] uppercase font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                Zone Configuration
              </span>
              <h3 className="font-headline-sm text-lg font-bold text-tertiary mt-1.5">
                {selectedZone?.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{selectedZone?.type}</p>
            </div>

            {/* Editable Counters */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  Target Seating Capacity
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="0"
                    value={selectedZone?.capacity || 0}
                    onChange={(e) => updateVenueZone(selectedZone.id, { capacity: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-sm font-bold text-tertiary tabular-nums"
                  />
                  <span className="text-xs text-on-surface-variant">Seats</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  Currently Seated / Occupied
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min="0"
                    value={selectedZone?.occupied || 0}
                    onChange={(e) => updateVenueZone(selectedZone.id, { occupied: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-sm font-bold text-primary-container tabular-nums"
                  />
                  <span className="text-xs text-on-surface-variant">Pax</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  Readiness Status
                </label>
                <select
                  value={selectedZone?.status || 'Setup Complete'}
                  onChange={(e) => updateVenueZone(selectedZone.id, { status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-surface-container-highest bg-surface-bright text-xs text-tertiary font-semibold"
                >
                  <option value="Setup Complete">Setup Complete</option>
                  <option value="Arranging Chairs">Arranging Chairs</option>
                  <option value="Clear">Clear</option>
                  <option value="Stands Erected">Stands Erected</option>
                  <option value="Sterile Clearance">Sterile Clearance</option>
                </select>
              </div>
            </div>

            {/* Zone Features Checklist */}
            <div className="space-y-2 pt-2 border-t border-surface-container-highest">
              <span className="text-xs font-bold text-secondary block">Assigned Physical Features:</span>
              <ul className="text-xs text-tertiary space-y-1.5 pl-2">
                {selectedZone?.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-sm">check</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-secondary-container/20 rounded-lg border border-secondary-container/50 text-xs text-on-secondary-container">
              <span className="font-bold block">Safety Compliance</span>
              <p className="mt-0.5 text-[11px]">
                Maintains a minimum 6-foot clearance for fire exit routes per Municipal Corporation norms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ZONE INVENTORY TABLE VIEW */}
      {viewMode === 'inventory' && (
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-[11px] text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Zone Sector</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-center">Capacity</th>
                  <th className="py-3 px-4 text-center">Seated</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Physical Attributes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/60">
                {venueZones.map(zone => (
                  <tr key={zone.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4 font-bold text-tertiary">
                      {zone.name}
                    </td>
                    <td className="py-3 px-4 text-secondary font-medium">
                      {zone.type}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-tertiary tabular-nums">
                      {zone.capacity}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-primary-container tabular-nums">
                      {zone.occupied}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold text-secondary uppercase">
                        {zone.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[11px]">
                      {zone.features?.join(' • ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
};

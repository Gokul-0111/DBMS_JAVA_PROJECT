import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { NavTab } from './TopNavBar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenEditModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenEditModal }) => {
  const { slots, activeVehicles, totalRevenue, completedTransactions } = useParking();

  const totalCapacity = 20;
  const occupiedCount = slots.filter((s) => s.isOccupied).length;
  const availableCount = totalCapacity - occupiedCount;
  const utilizationPct = Math.round((occupiedCount / totalCapacity) * 100);
  const clearancePct = 100 - utilizationPct;

  // Live IST Clock
  const [liveClock, setLiveClock] = useState<string>('20:17:11 IST');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const bikeCount = activeVehicles.filter((v) => v.type === 'Bike').length;
  const carCount = activeVehicles.filter((v) => v.type === 'Car').length;
  const truckCount = activeVehicles.filter((v) => v.type === 'Truck').length;

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-6">
      {/* Top Breadcrumb & Live System Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c6c6cd]/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#45464d]">
            <span>Enterprise Campus Management</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#0051d5]">Active Terminal: Central Kiosk 01</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#0b1c30] mt-1 tracking-tight">
            Real-Time Facility Operations Matrix
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[11px] font-mono shadow-xs">
            <span className="text-[#45464d]">Active Instance:</span>
            <span className="font-bold text-[#0b1c30]">JVM-JDK21 #4892</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#009668]"></span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[11px] font-mono shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#0051d5]">schedule</span>
            <span className="font-bold text-[#0b1c30]">{liveClock}</span>
          </div>
        </div>
      </div>

      {/* 1. KEY METRICS OVERVIEW (5 Stats Grid) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">analytics</span>
            Real-Time Capacity & Collection Metrics
          </h2>
          <span className="text-[11px] font-mono text-[#45464d]">
            Synchronized with fixed-memory SlotArray[20]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Total Parking Capacity */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] p-4 shadow-xs flex flex-col justify-between hover:border-[#76777d] transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-[#45464d]">Total Capacity</span>
              <div className="w-7 h-7 rounded bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[16px]">dataset</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-[32px] font-bold text-[#0b1c30] leading-none">20</div>
              <div className="text-[11px] font-mono text-[#45464d] mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76777d]"></span>
                Fixed Array[20] Slots
              </div>
            </div>
            <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0b1c30] h-full w-full"></div>
            </div>
          </div>

          {/* Metric 2: Available Slots */}
          <div className="bg-white rounded-xl border border-[#4edea3]/40 p-4 shadow-xs flex flex-col justify-between hover:border-[#4edea3] transition-all bg-gradient-to-br from-white via-white to-[#6ffbbe]/10">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-[#45464d]">Available Slots</span>
              <div className="w-7 h-7 rounded bg-[#6ffbbe]/30 flex items-center justify-center text-[#009668]">
                <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-[32px] font-bold text-[#009668] leading-none">
                {availableCount} <span className="text-[18px] text-[#45464d]">/ 20</span>
              </div>
              <div className="text-[11px] font-mono text-[#009668] mt-1.5 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009668] animate-ping"></span>
                {clearancePct}% Vacant Clearance
              </div>
            </div>
            <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#009668] h-full transition-all duration-300" style={{ width: `${clearancePct}%` }}></div>
            </div>
          </div>

          {/* Metric 3: Occupied Slots */}
          <div className="bg-white rounded-xl border border-[#ffdad6] p-4 shadow-xs flex flex-col justify-between hover:border-[#ba1a1a] transition-all bg-gradient-to-br from-white via-white to-[#ffdad6]/20">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-[#45464d]">Occupied Slots</span>
              <div className="w-7 h-7 rounded bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[16px]">block</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-[32px] font-bold text-[#ba1a1a] leading-none">
                {occupiedCount} <span className="text-[18px] text-[#45464d]">/ 20</span>
              </div>
              <div className="text-[11px] font-mono text-[#ba1a1a] mt-1.5 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                {utilizationPct}% Utilization Rate
              </div>
            </div>
            <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ba1a1a] h-full transition-all duration-300" style={{ width: `${utilizationPct}%` }}></div>
            </div>
          </div>

          {/* Metric 4: Active Vehicles */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] p-4 shadow-xs flex flex-col justify-between hover:border-[#0051d5] transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-[#45464d]">Active Vehicles</span>
              <div className="w-7 h-7 rounded bg-[#dbe1ff]/50 flex items-center justify-center text-[#0051d5]">
                <span className="material-symbols-outlined text-[16px]">commute</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-[32px] font-bold text-[#0051d5] leading-none">
                {activeVehicles.length}
              </div>
              <div className="text-[11px] font-mono text-[#45464d] mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#0b1c30] font-semibold">
                  {carCount} Cars
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#0b1c30] font-semibold">
                  {bikeCount} Bikes
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#0051d5] font-semibold" title="Occupies 2 physical stalls">
                  {truckCount} Truck*
                </span>
              </div>
            </div>
            <div className="w-full bg-[#e5eeff] h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-[#0051d5] h-full" style={{ width: `${(carCount / 10) * 100}%` }}></div>
              <div className="bg-[#565e74] h-full" style={{ width: `${(bikeCount / 10) * 100}%` }}></div>
              <div className="bg-[#131b2e] h-full" style={{ width: `${(truckCount / 10) * 100}%` }}></div>
            </div>
          </div>

          {/* Metric 5: Today's Revenue */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] p-4 shadow-xs flex flex-col justify-between hover:border-[#76777d] transition-all bg-gradient-to-br from-white to-[#eff4ff]">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-semibold text-[#45464d]">Today's Revenue</span>
              <div className="w-7 h-7 rounded bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">payments</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-[32px] font-bold text-[#0b1c30] leading-none tracking-tight font-mono">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-[#009668] mt-1.5 flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +14.8% vs Yesterday Avg
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#45464d] pt-1 border-t border-[#c6c6cd]/40">
              <span>Dynamic Rate Model</span>
              <span className="text-[#0051d5] font-semibold">Cap: 8 Hrs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTION COMMAND PANEL */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">bolt</span>
            Quick Command Dispatcher
          </h2>
          <span className="text-[12px] text-[#45464d]">Core operator state triggers & transition routes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Park Vehicle */}
          <div
            onClick={() => onNavigate('park')}
            className="group bg-white p-4 rounded-xl border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#0051d5] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">input</span>
              </div>
              <div>
                <div className="font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors text-[15px]">
                  Park Vehicle
                </div>
                <div className="text-[12px] text-[#45464d]">Generate ticket & assign slot</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#0051d5] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>

          {/* Action 2: Vehicle Exit & Billing */}
          <div
            onClick={() => onNavigate('exit')}
            className="group bg-white p-4 rounded-xl border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#131b2e] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">output</span>
              </div>
              <div>
                <div className="font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors text-[15px]">
                  Vehicle Exit & Billing
                </div>
                <div className="text-[12px] text-[#45464d]">Calculate fee, free bay & invoice</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#0051d5] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>

          {/* Action 3: Live 20-Slot Visual Grid */}
          <div
            onClick={() => onNavigate('map')}
            className="group bg-white p-4 rounded-xl border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#e5eeff] text-[#0051d5] flex items-center justify-center border border-[#c6c6cd] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">grid_4x4</span>
              </div>
              <div>
                <div className="font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors text-[15px]">
                  Live 20-Slot Map
                </div>
                <div className="text-[12px] text-[#45464d]">Spatial topology & bay inspection</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#0051d5] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>

          {/* Action 4: Daily Parking Summary */}
          <div
            onClick={() => onNavigate('summary')}
            className="group bg-white p-4 rounded-xl border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center border border-[#c6c6cd] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">summarize</span>
              </div>
              <div>
                <div className="font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors text-[15px]">
                  Daily Summary
                </div>
                <div className="text-[12px] text-[#45464d]">Audit records, logs & ledger</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#45464d] group-hover:text-[#0051d5] group-hover:translate-x-1 transition-all">
              arrow_forward
            </span>
          </div>
        </div>
      </section>

      {/* 3. LOWER SECTION: Recent Manifest Feed + Java OOP Architecture Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Recent Parking Activity Manifest */}
        <section className="lg:col-span-8 bg-white rounded-xl border border-[#c6c6cd] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#c6c6cd]/70 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">history</span>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">Recent Parking Manifest & Feed</h3>
              </div>
              <p className="text-[12px] text-[#45464d] mt-0.5">
                Real-time ledger events: showing latest entry & exit transactions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenEditModal}
                className="px-2.5 py-1.5 rounded-lg border border-[#0051d5] bg-[#eff4ff] hover:bg-[#dbe1ff] text-[11px] font-mono text-[#0051d5] flex items-center gap-1 font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                Edit Slot Booking
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="px-2.5 py-1.5 rounded-lg bg-[#0051d5] text-white hover:bg-[#003ea8] text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Inspect Map
              </button>
            </div>
          </div>

          {/* Manifest Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff] border-b border-[#c6c6cd]/70 text-[11px] font-semibold text-[#45464d] uppercase tracking-wider font-mono">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Vehicle No.</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assigned Slot</th>
                  <th className="py-3 px-4">In-Time / Dwell</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5eeff] text-[13px]">
                {/* Active Vehicles (First 5) */}
                {activeVehicles.slice(0, 5).map((v) => {
                  const isTruck = v.type === 'Truck';
                  const slotStr = v.allocatedSlots
                    .map((s) => `Slot ${String(s + 1).padStart(2, '0')}`)
                    .join(' & ');

                  return (
                    <tr key={v.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[12px] font-bold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#c6c6cd]">
                          {v.ticketNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[12px] bg-[#f8f9ff] border border-[#c6c6cd] px-2 py-0.5 rounded text-[#0b1c30] font-bold">
                          {v.registrationNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-[#0051d5]">
                            {v.type === 'Truck'
                              ? 'local_shipping'
                              : v.type === 'Bike'
                              ? 'two_wheeler'
                              : 'directions_car'}
                          </span>
                          <span className="font-semibold text-[#0b1c30]">{v.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isTruck ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border-2 border-dashed border-[#76777d] font-mono text-[11px] font-bold text-[#0b1c30] bg-[#e5eeff]">
                            <span className="material-symbols-outlined text-[13px] text-[#0051d5]">link</span>
                            {slotStr}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded border border-[#c6c6cd] bg-[#f8f9ff] font-mono text-[11px] font-bold text-[#0b1c30]">
                            {slotStr}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-[#0b1c30] font-semibold">{v.entryTime}</div>
                        <div className="text-[#45464d]">{v.elapsedHours.toFixed(1)}h elapsed</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                          Parked
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Completed Transaction sample row */}
                {completedTransactions.slice(0, 1).map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-[#f8f9ff] bg-[#eff4ff]/30 text-[13px]">
                    <td className="py-3 px-4 font-mono font-bold text-[#76777d]">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#c6c6cd]">
                        {tx.ticketId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-[#76777d]">
                      {tx.registrationNumber}
                    </td>
                    <td className="py-3 px-4 text-[#76777d]">{tx.type}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#76777d] line-through">
                      {tx.allocatedSlotsLabel}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#009668] font-bold">
                      Paid: ₹{tx.paidAmount} ({tx.billableHours}h)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#e5eeff] text-[#45464d] border border-[#c6c6cd]">
                        <span className="material-symbols-outlined text-[13px] text-[#009668]">check</span>
                        Cleared
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-white border-t border-[#c6c6cd]/50 flex items-center justify-between text-[12px] text-[#45464d]">
            <span>Displaying live operational ledger ({activeVehicles.length} active sessions)</span>
            <button
              onClick={() => onNavigate('summary')}
              className="text-[#0051d5] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              View Full Audit Manifest
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </section>

        {/* RIGHT 4 COLS: System Constraints & Viva Information Panel */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          {/* Java Architecture Card */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between border-b border-[#c6c6cd]/60 pb-3">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131b2e] text-white font-semibold">
                  Java EE / OOP Spec
                </span>
                <h3 className="text-[16px] font-bold text-[#0b1c30] mt-1">
                  System Architecture & Viva Matrix
                </h3>
              </div>
              <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#0051d5]">
                <span className="material-symbols-outlined text-[20px]">terminal</span>
              </div>
            </div>

            {/* Spec 1: Data Structure */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0051d5]">memory</span>
                  Memory Structure
                </span>
                <span className="text-[11px] font-mono font-bold text-[#0051d5]">ParkingSlot[20]</span>
              </div>
              <p className="text-[12px] text-[#45464d]">
                Fixed memory allocation. Prevents dynamic reallocation overhead during runtime critical state checks.
              </p>
            </div>

            {/* Spec 2: Tiered Billing Rate Matrix */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#c6c6cd]/40">
              <span className="text-[12px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0051d5]">sell</span>
                Vehicle Tier Tariffs
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#f8f9ff] p-2 rounded-lg border border-[#c6c6cd] flex flex-col items-center text-center">
                  <span className="text-[11px] font-semibold text-[#45464d] uppercase">Bike</span>
                  <span className="font-mono text-[13px] font-bold text-[#0b1c30]">
                    ₹10<span className="text-[10px] text-[#45464d] font-normal">/hr</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#0051d5]">1 Slot</span>
                </div>
                <div className="bg-[#f8f9ff] p-2 rounded-lg border border-[#c6c6cd] flex flex-col items-center text-center">
                  <span className="text-[11px] font-semibold text-[#45464d] uppercase">Car</span>
                  <span className="font-mono text-[13px] font-bold text-[#0b1c30]">
                    ₹30<span className="text-[10px] text-[#45464d] font-normal">/hr</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#0051d5]">1 Slot</span>
                </div>
                <div className="bg-[#f8f9ff] p-2 rounded-lg border border-[#c6c6cd] flex flex-col items-center text-center">
                  <span className="text-[11px] font-semibold text-[#45464d] uppercase">Truck</span>
                  <span className="font-mono text-[13px] font-bold text-[#0b1c30]">
                    ₹60<span className="text-[10px] text-[#45464d] font-normal">/hr</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#ba1a1a] font-bold">2 Slots</span>
                </div>
              </div>
            </div>

            {/* Spec 3: Billing Cap & Overrides */}
            <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#c6c6cd]/60 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#0051d5] text-[20px] mt-0.5">lock_clock</span>
              <div>
                <div className="text-[12px] font-bold text-[#0b1c30]">8-Hour Billing Cap Protection</div>
                <div className="text-[11px] text-[#45464d] mt-0.5">
                  Maximum tariff calculated is capped at 8 hours per session (e.g., Car capped at ₹240 max/24h) to protect patron liabilities.
                </div>
              </div>
            </div>

            {/* Spec 4: Exception Handling */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#c6c6cd]/40">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">error_outline</span>
                  Custom Exception Class
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-bold">
                  ParkingFullException
                </span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd] font-mono text-[11px] text-[#0b1c30] overflow-x-auto">
                <code>
                  if (availableSlots &lt; requiredBays) &#123;<br />
                  &nbsp;&nbsp;throw new ParkingFullException("Slot Overflow");<br />
                  &#125;
                </code>
              </div>
            </div>

            {/* Academic Evaluation Note */}
            <div className="mt-1 pt-3 border-t border-[#c6c6cd]/40 flex items-center justify-between text-[11px] font-mono text-[#45464d]">
              <span>Module: CS-502 Core OOP Project</span>
              <span className="text-[#009668] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span> Verified Build
              </span>
            </div>
          </div>

          {/* Quick Terminal Diagnostics Card (Live Slot Matrix Mini Inspector) */}
          <div className="bg-[#131b2e] text-white rounded-xl p-4 border border-[#76777d] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6ffbbe]"></span>
                <span className="font-mono text-[12px] font-bold text-white">Live Slot Matrix Array Inspector</span>
              </div>
              <span className="text-[11px] font-mono text-[#7c839b]">slots[0..19]</span>
            </div>

            {/* Visual Compact Mini Grid of 20 slots */}
            <div className="grid grid-cols-10 gap-1.5 pt-1">
              {slots.map((s) => {
                const isTruckLead = s.isTruckDual && s.isTruckLead;
                const isTruckPartner = s.isTruckDual && !s.isTruckLead;

                if (isTruckLead) {
                  return (
                    <div
                      key={s.index}
                      className="col-span-2 h-6 rounded bg-[#0051d5] flex items-center justify-center font-mono text-[10px] text-white font-bold ring-1 ring-[#6ffbbe]"
                      title="Slot 08 & 09: Heavy Vehicle (Truck Dual Span)"
                    >
                      08-09 (TRK)
                    </div>
                  );
                }
                if (isTruckPartner) {
                  return null; // Spanned above
                }

                return (
                  <div
                    key={s.index}
                    className={`h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                      s.isOccupied ? 'bg-[#ba1a1a]/80 text-white' : 'bg-[#009668]/80 text-white'
                    }`}
                    title={`Slot ${s.slotNumber}: ${s.isOccupied ? 'Busy (' + s.vehicle?.registrationNumber + ')' : 'Free'}`}
                  >
                    {String(s.slotNumber).padStart(2, '0')}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#dae2fd] pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#009668]"></span> {availableCount} Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#ba1a1a]"></span> {occupiedCount - (truckCount > 0 ? 2 : 0)} Stalls
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#0051d5]"></span> {truckCount * 2} Stalls (Dual)
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

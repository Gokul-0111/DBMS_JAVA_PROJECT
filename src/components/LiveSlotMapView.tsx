import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { SlotState, VehicleCategory } from '../types/parking';
import { NavTab } from './TopNavBar';

interface LiveSlotMapViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenEditModalWithSlot?: (slot: SlotState) => void;
}

export const LiveSlotMapView: React.FC<LiveSlotMapViewProps> = ({
  onNavigate,
  onOpenEditModalWithSlot,
}) => {
  const { slots, parkVehicle, exitVehicle } = useParking();

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(7); // Default to Truck Slot 08 & 09
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [walkinPlate, setWalkinPlate] = useState<string>('TN-37-CR-8899');
  const [walkinType, setWalkinType] = useState<VehicleCategory>('Car');

  const occupiedCount = slots.filter((s) => s.isOccupied).length;
  const availableCount = 20 - occupiedCount;
  const occupancyPct = ((occupiedCount / 20) * 100).toFixed(1);

  const selectedSlot = slots[selectedSlotIndex] || slots[0];

  const handleSlotClick = (index: number) => {
    setSelectedSlotIndex(index);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleWalkinIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const res = parkVehicle(walkinPlate, walkinType);
    if (res.success) {
      alert(`Entry Pass Generated: Ticket ${res.ticket?.ticketNumber} allocated to ${res.ticket?.allocatedSlots.map((s) => `Slot ${s + 1}`).join(' & ')}!`);
      setWalkinPlate(`TN-37-CR-${Math.floor(1000 + Math.random() * 9000)}`);
    } else {
      alert(`Check-in Error: ${res.error}`);
    }
  };

  const bayASlots = slots.slice(0, 10);
  const bayBSlots = slots.slice(10, 20);

  return (
    <div className="flex-1 w-full max-w-[1780px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-5">
      {/* Controls & Spatial Intelligence Header Bar */}
      <section className="bg-white border border-[#c6c6cd] rounded-xl p-4 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Metrics Pill */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-[#c6c6cd]">
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0051d5] border border-[#c6c6cd]">
              <span className="material-symbols-outlined text-[24px]">sensors</span>
            </div>
            <div>
              <div className="text-[12px] text-[#45464d] flex items-center gap-1">
                <span>Facility Capacity</span>
                <span className="text-[11px] font-mono font-bold text-[#0051d5]">[Fixed Array 20]</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[20px] font-bold text-[#0b1c30]">
                  {occupiedCount} <span className="text-[12px] font-normal text-[#45464d]">Occupied</span>
                </span>
                <span className="text-[#c6c6cd]">/</span>
                <span className="text-[20px] font-bold text-[#009668]">
                  {String(availableCount).padStart(2, '0')}{' '}
                  <span className="text-[12px] font-normal text-[#45464d]">Available</span>
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Bar Meter */}
          <div className="w-48 xl:w-60 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-[#45464d]">
              <span>BAY OCCUPANCY</span>
              <span className="font-bold text-[#0051d5]">{occupancyPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden flex">
              <div className="bg-[#0051d5] h-full" style={{ width: `${(6 / 20) * 100}%` }}></div>
              <div className="bg-[#0284c7] h-full" style={{ width: `${(3 / 20) * 100}%` }}></div>
              <div className="bg-[#d97706] h-full" style={{ width: `${(2 / 20) * 100}%` }}></div>
              <div className="bg-[#009668]/30 h-full flex-1"></div>
            </div>
            <div className="text-[10px] font-mono text-[#76777d] flex justify-between">
              <span>{occupiedCount} BAYS ALLOCATED</span>
              <span>{availableCount} OPEN</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 xl:gap-3 px-3 py-2 bg-[#f8f9ff] rounded-lg border border-[#c6c6cd]/60">
          <span className="text-[11px] font-mono uppercase text-[#45464d] tracking-wider font-semibold mr-1">
            Legend:
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#6EE7B7] text-[#047857] text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#dbe1ff]/50 border border-[#0051d5] text-[#0051d5] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">directions_car</span>
            <span>Car (1 Bay)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e0f2fe] border border-[#0284c7] text-[#0369a1] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
            <span>Bike</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF3C7] border border-[#F59E0B] text-[#B45309] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span>Truck (2 Slots Span)</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end xl:self-auto">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-[#f8f9ff] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-[#0051d5] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span>Refresh Live Status</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="px-3 py-2 rounded-lg border border-[#c6c6cd] bg-white hover:bg-[#f8f9ff] text-[#0b1c30] text-[12px] font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#76777d]">filter_alt</span>
              <span>Filter: {filterType}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#c6c6cd] rounded-lg shadow-lg z-30 py-1 text-[12px]">
                {['ALL', 'Car', 'Bike', 'Truck', 'Available'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilterType(f);
                      setFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#eff4ff] flex items-center justify-between ${
                      filterType === f ? 'text-[#0051d5] font-bold bg-[#eff4ff]' : 'text-[#0b1c30]'
                    }`}
                  >
                    <span>{f === 'ALL' ? 'All Slots' : f}</span>
                    {filterType === f && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Spatial Arena */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Interactive 20-Slot Grid Structure (9 cols) */}
        <section className="xl:col-span-9 bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5eeff]">
            <div>
              <span className="text-[17px] font-bold text-[#0b1c30]">
                Main Parking Yard - Sensor Grid Array
              </span>
              <p className="text-[12px] text-[#45464d]">
                Real-time ultrasonic & camera dual-telemetry detection for exactly 20 managed bays.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eff4ff] text-[11px] font-mono text-[#0051d5] font-bold">
                <span className="material-symbols-outlined text-[14px]">speed</span>
                LATENCY: 12ms
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* ================= BAY A (SLOTS 01 to 10) ================= */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-white font-mono text-[11px] font-bold tracking-wider">
                    BAY A
                  </span>
                  <span className="text-[11px] font-mono text-[#76777d]">
                    SLOTS 01 - 10 • NORTH TERMINAL FACING
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#45464d] font-medium">
                  Clearance: 4.2m Max
                </span>
              </div>

              {/* 10 columns for desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {bayASlots.map((s) => {
                  const isSelected =
                    selectedSlotIndex === s.index ||
                    (s.isTruckDual && selectedSlotIndex === s.partnerSlotIndex);

                  // Handle Truck dual slot rendering: Slot 08 & 09
                  if (s.isTruckDual && s.isTruckLead) {
                    return (
                      <div
                        key={s.index}
                        onClick={() => handleSlotClick(s.index)}
                        className={`sm:col-span-2 lg:col-span-2 relative bg-[#FFFBEB] border-2 border-dashed border-[#F59E0B] rounded-lg p-2 flex flex-col justify-between h-[155px] cursor-pointer hover:shadow-md transition-all duration-150 ${
                          isSelected ? 'ring-3 ring-[#F59E0B] shadow-md' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[12px] text-[#B45309] font-bold">P-08</span>
                            <span className="text-[#76777d] text-xs">↔</span>
                            <span className="font-mono text-[12px] text-[#B45309] font-bold">P-09</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]">
                            TRUCK ALLOCATED (2 SLOTS)
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 my-auto py-1">
                          <div className="w-10 h-10 rounded-lg bg-[#FDE68A] flex items-center justify-center text-[#B45309] shadow-inner">
                            <span className="material-symbols-outlined text-[26px]">local_shipping</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-mono text-[12px] font-bold bg-white px-2 py-0.5 rounded border border-[#FCD34D] text-[#0F172A] shadow-2xs">
                              {s.vehicle?.registrationNumber || 'HR-26-EE-9011'}
                            </span>
                            <span className="text-[10px] text-[#B45309] font-medium mt-0.5">
                              Heavy Logistics (18m)
                            </span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-[#FCD34D] flex items-center justify-between text-[10px] font-mono text-[#92400E]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            In: {s.vehicle?.entryTime || '11:15 AM'}
                          </span>
                          <span className="font-bold">Ticket: {s.vehicle?.ticketNumber || 'TKT-2024'}</span>
                        </div>
                      </div>
                    );
                  }

                  if (s.isTruckDual && !s.isTruckLead) {
                    return null; // Rendered as dual above
                  }

                  if (s.isOccupied) {
                    return (
                      <div
                        key={s.index}
                        onClick={() => handleSlotClick(s.index)}
                        className={`relative bg-white border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md rounded-lg p-2 flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-150 ${
                          isSelected ? 'ring-2 ring-[#0051d5] border-[#0051d5]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[12px] font-bold text-[#0b1c30]">
                            P-{String(s.slotNumber).padStart(2, '0')}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" title="Occupied"></span>
                        </div>
                        <div className="flex flex-col items-center justify-center my-auto">
                          <div className="w-9 h-9 rounded-full bg-[#dbe1ff]/40 flex items-center justify-center text-[#0051d5] mb-1">
                            <span className="material-symbols-outlined text-[20px]">
                              {s.vehicle?.type === 'Bike' ? 'two_wheeler' : 'directions_car'}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-[#eff4ff] px-1 py-0.5 rounded border border-[#c6c6cd] font-semibold text-[#0b1c30] tracking-tighter truncate max-w-full">
                            {s.vehicle?.registrationNumber}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-[#e5eeff] flex items-center justify-between text-[10px] font-mono text-[#45464d]">
                          <span>{s.vehicle?.entryTime.slice(0, 5)}</span>
                          <span className="font-bold text-[#0051d5]">{s.vehicle?.ticketNumber.slice(-5)}</span>
                        </div>
                      </div>
                    );
                  }

                  // Available Slot
                  return (
                    <div
                      key={s.index}
                      onClick={() => handleSlotClick(s.index)}
                      className={`relative bg-[#ECFDF5]/50 border-2 border-dashed border-[#6EE7B7] hover:border-[#047857] hover:bg-[#ECFDF5] hover:shadow-md rounded-lg p-2 flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-150 ${
                        isSelected ? 'ring-2 ring-[#047857] bg-[#ECFDF5]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[12px] text-[#047857] font-bold">
                          P-{String(s.slotNumber).padStart(2, '0')}
                        </span>
                        <span className="px-1 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]">
                          FREE
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center my-auto">
                        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#6EE7B7] flex items-center justify-center text-[#047857] mb-1">
                          <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#047857]">Click to Park</span>
                      </div>
                      <div className="pt-1 border-t border-[#6EE7B7]/40 text-center">
                        <span className="text-[9px] font-mono text-[#047857] font-medium tracking-tight">
                          {s.note || 'Standard Bay'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= CENTRAL CONCOURSE DRIVEWAY ================= */}
            <div className="my-1 py-3 px-6 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/80 flex items-center justify-between relative overflow-hidden select-none">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0051d5] text-[22px]">arrow_forward</span>
                <span className="font-mono text-[11px] uppercase text-[#0051d5] font-bold tracking-widest">
                  CENTRAL CONCOURSE DRIVEWAY • SPEED LIMIT 10 KM/H
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-1 mx-8 justify-center opacity-60">
                <div className="w-12 h-1 bg-[#c6c6cd] rounded"></div>
                <div className="w-12 h-1 bg-[#c6c6cd] rounded"></div>
                <div className="w-12 h-1 bg-[#c6c6cd] rounded"></div>
                <div className="w-12 h-1 bg-[#c6c6cd] rounded"></div>
                <div className="w-12 h-1 bg-[#c6c6cd] rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#45464d]">TWO-WAY ACCESS [LANE 01]</span>
                <span className="material-symbols-outlined text-[#0051d5] text-[22px]">arrow_back</span>
              </div>
            </div>

            {/* ================= BAY B (SLOTS 11 to 20) ================= */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#131b2e] text-white font-mono text-[11px] font-bold tracking-wider">
                    BAY B
                  </span>
                  <span className="text-[11px] font-mono text-[#76777d]">
                    SLOTS 11 - 20 • SOUTH GATE ENTRY FACING
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#45464d] font-medium">
                  Clearance: 3.8m Standard
                </span>
              </div>

              {/* 10 columns for desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {bayBSlots.map((s) => {
                  const isSelected = selectedSlotIndex === s.index;

                  if (s.isOccupied) {
                    return (
                      <div
                        key={s.index}
                        onClick={() => handleSlotClick(s.index)}
                        className={`relative bg-white border border-[#c6c6cd] hover:border-[#0051d5] hover:shadow-md rounded-lg p-2 flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-150 ${
                          isSelected ? 'ring-2 ring-[#0051d5] border-[#0051d5]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[12px] font-bold text-[#0b1c30]">
                            P-{String(s.slotNumber).padStart(2, '0')}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" title="Occupied"></span>
                        </div>
                        <div className="flex flex-col items-center justify-center my-auto">
                          <div className="w-9 h-9 rounded-full bg-[#dbe1ff]/40 flex items-center justify-center text-[#0051d5] mb-1">
                            <span className="material-symbols-outlined text-[20px]">
                              {s.vehicle?.type === 'Bike' ? 'two_wheeler' : 'directions_car'}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] bg-[#eff4ff] px-1 py-0.5 rounded border border-[#c6c6cd] font-semibold text-[#0b1c30] tracking-tighter truncate max-w-full">
                            {s.vehicle?.registrationNumber}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-[#e5eeff] flex items-center justify-between text-[10px] font-mono text-[#45464d]">
                          <span>{s.vehicle?.entryTime.slice(0, 5)}</span>
                          <span className="font-bold text-[#0051d5]">{s.vehicle?.ticketNumber.slice(-5)}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={s.index}
                      onClick={() => handleSlotClick(s.index)}
                      className={`relative bg-[#ECFDF5]/50 border-2 border-dashed border-[#6EE7B7] hover:border-[#047857] hover:bg-[#ECFDF5] hover:shadow-md rounded-lg p-2 flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-150 ${
                        isSelected ? 'ring-2 ring-[#047857] bg-[#ECFDF5]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[12px] text-[#047857] font-bold">
                          P-{String(s.slotNumber).padStart(2, '0')}
                        </span>
                        <span className="px-1 py-0.5 rounded text-[9px] font-mono font-bold bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]">
                          FREE
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center my-auto">
                        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#6EE7B7] flex items-center justify-center text-[#047857] mb-1">
                          <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#047857]">Click to Park</span>
                      </div>
                      <div className="pt-1 border-t border-[#6EE7B7]/40 text-center">
                        <span className="text-[9px] font-mono text-[#047857] font-medium tracking-tight">
                          {s.note || 'Standard Bay'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Academic Viva Helper Note */}
          <div className="mt-4 pt-3 border-t border-[#c6c6cd] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#76777d]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px] text-[#0051d5]">info</span>
              <span>Array Index: Slot[0] to Slot[19] mapped directly to Hardware Pins / Ultrasonic Transducers.</span>
            </div>
            <span className="text-[#0b1c30]">Click any slot to inspect telemetry or reassign booking</span>
          </div>
        </section>

        {/* Slot Details Inspection Drawer (3 cols) */}
        <aside className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0051d5]"></span>
                <span className="text-[15px] font-bold text-[#0b1c30]">Slot Telemetry</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedSlot.isOccupied
                    ? 'bg-[#0051d5] text-white'
                    : 'bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]'
                }`}
              >
                {selectedSlot.isOccupied ? 'LIVE DWELL' : 'VACANT'}
              </span>
            </div>

            {/* Dynamic Content */}
            <div className="py-3 space-y-3">
              <div className="flex items-baseline justify-between bg-[#eff4ff] p-3 rounded-lg border border-[#c6c6cd]">
                <div>
                  <span className="text-[10px] font-mono text-[#45464d] block uppercase">
                    Designated Bay
                  </span>
                  <span className="text-[24px] font-bold text-[#0b1c30] tracking-tight">
                    {selectedSlot.isTruckDual ? 'Slot 08 - 09' : selectedSlot.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#45464d] block uppercase">
                    Classification
                  </span>
                  <span className="text-[13px] text-[#0051d5] font-bold">
                    {selectedSlot.vehicle?.type || 'Standard Bay'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#76777d] block mb-1 uppercase font-semibold">
                  Vehicle License Plate
                </label>
                <div className="flex items-center justify-between bg-white border border-[#c6c6cd] px-3 py-2 rounded-lg shadow-2xs">
                  <span className="text-[16px] font-mono text-[#0b1c30] font-bold tracking-wider">
                    {selectedSlot.vehicle?.registrationNumber || 'OPEN BAY'}
                  </span>
                  <span className="material-symbols-outlined text-[#76777d]">badge</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]">
                  <span className="text-[10px] font-mono text-[#45464d] block">Entry Timestamp</span>
                  <span className="font-mono font-bold text-[#0b1c30]">
                    {selectedSlot.vehicle?.entryTime || 'Unallocated'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]">
                  <span className="text-[10px] font-mono text-[#45464d] block">Active Duration</span>
                  <span className="font-mono font-bold text-[#0051d5]">
                    {selectedSlot.vehicle ? `${selectedSlot.vehicle.elapsedHours.toFixed(1)}h` : '0h 00m'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]">
                  <span className="text-[10px] font-mono text-[#45464d] block">Active Ticket</span>
                  <span className="font-mono font-bold text-[#0b1c30]">
                    {selectedSlot.vehicle?.ticketNumber || 'N/A'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#6EE7B7]">
                  <span className="text-[10px] font-mono text-[#047857] block">Est. Accrued Fee</span>
                  <span className="font-mono font-bold text-[#047857]">
                    ₹{selectedSlot.vehicle ? Math.min(8, Math.ceil(selectedSlot.vehicle.elapsedHours)) * selectedSlot.vehicle.hourlyRate : 0}
                  </span>
                </div>
              </div>

              {/* Sensor Health Checks */}
              <div className="space-y-1 pt-1 text-[11px] font-mono text-[#45464d]">
                <div className="flex justify-between">
                  <span>Ultrasonic Sonar Distance</span>
                  <span className="font-bold text-[#0b1c30]">0.42 m</span>
                </div>
                <div className="flex justify-between">
                  <span>ANPR Camera Confidence</span>
                  <span className="font-bold text-[#009668]">99.4% Validated</span>
                </div>
                <div className="flex justify-between">
                  <span>Slot State Integrity</span>
                  <span className="font-bold text-[#0051d5]">
                    {selectedSlot.isOccupied ? 'BAY LOCKED' : 'CLEAR PASS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-3 border-t border-[#e5eeff] flex flex-col gap-2">
              {selectedSlot.isOccupied ? (
                <>
                  <button
                    onClick={() => onNavigate('exit')}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#0051d5] text-white text-[13px] font-semibold hover:bg-[#003ea8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    <span>Checkout & Generate Bill</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenEditModalWithSlot && onOpenEditModalWithSlot(selectedSlot)}
                      className="py-2 px-2.5 rounded-lg border border-[#0051d5] bg-[#eff4ff] text-[#0051d5] hover:bg-[#dbe1ff] text-[11px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit_calendar</span>
                      <span>Edit Booking</span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSlot.vehicle) {
                          exitVehicle(selectedSlot.vehicle.ticketNumber, selectedSlot.vehicle.elapsedHours);
                          alert(`Bay ${selectedSlot.label} released!`);
                        }
                      }}
                      className="py-2 px-2.5 rounded-lg border border-[#ba1a1a]/40 bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">lock_reset</span>
                      <span>Release Bay</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => onNavigate('park')}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#009668] text-white text-[13px] font-semibold hover:bg-[#007a54] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Allocate Vehicle to This Bay</span>
                </button>
              )}
            </div>
          </div>

          {/* Instant Allocation Kiosk */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-4 shadow-xs">
            <span className="text-[14px] font-bold text-[#0b1c30] block mb-1">
              Instant Allocation Kiosk
            </span>
            <p className="text-[11px] text-[#45464d] mb-3">
              Direct check-in for arriving walk-in vehicles at Toll Booth 01.
            </p>
            <form onSubmit={handleWalkinIssue} className="space-y-2.5">
              <div>
                <label className="text-[10px] font-mono text-[#76777d] block mb-1 uppercase font-semibold">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={walkinPlate}
                  onChange={(e) => setWalkinPlate(e.target.value.toUpperCase())}
                  className="w-full h-8 px-2.5 rounded-lg border border-[#c6c6cd] font-mono text-[12px] bg-white text-[#0b1c30]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#76777d] block mb-1 uppercase font-semibold">
                  Vehicle Type
                </label>
                <select
                  value={walkinType}
                  onChange={(e) => setWalkinType(e.target.value as VehicleCategory)}
                  className="w-full h-8 px-2 rounded-lg border border-[#c6c6cd] text-[12px] bg-white text-[#0b1c30]"
                >
                  <option value="Bike">Bike (1 Slot • ₹10/hr)</option>
                  <option value="Car">Car (1 Slot • ₹30/hr)</option>
                  <option value="Truck">Truck (2 Slots • ₹60/hr)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#131b2e] text-white text-[12px] font-semibold hover:bg-[#213145] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">local_parking</span>
                <span>Issue Entry Pass</span>
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

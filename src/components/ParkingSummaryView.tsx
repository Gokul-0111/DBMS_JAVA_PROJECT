import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';

export const ParkingSummaryView: React.FC = () => {
  const { slots, activeVehicles, totalRevenue } = useParking();

  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>('');

  const totalCapacity = 20;
  const occupiedSlots = slots.filter((s) => s.isOccupied).length;
  const availableSlots = totalCapacity - occupiedSlots;

  const bikes = activeVehicles.filter((v) => v.type === 'Bike');
  const cars = activeVehicles.filter((v) => v.type === 'Car');
  const trucks = activeVehicles.filter((v) => v.type === 'Truck');

  const bikeSlotsOccupied = bikes.length * 1;
  const carSlotsOccupied = cars.length * 1;
  const truckSlotsOccupied = trucks.length * 2;

  // Active Dwell Accrual
  const currentAccrual = activeVehicles.reduce((sum, v) => {
    const billable = Math.max(1, Math.min(8, Math.ceil(v.elapsedHours)));
    return sum + billable * v.hourlyRate;
  }, 0);

  const priorExits = Math.max(0, totalRevenue - currentAccrual);

  // Copy Viva Notes handler
  const handleCopyVivaNotes = () => {
    const notes = `ParkEase System Viva Notes:
1. Slot Matrix Traversal: Contiguous Slot[20] memory array; handles O(1) single bays and O(N) dual-slot contiguous search for heavy trucks.
2. VehicleType Enum: Encapsulates hourly rates (Bike ₹10, Car ₹30, Truck ₹60) and required slot bounds (1 slot, 1 slot, 2 slots).
3. Ticket Management: Encapsulated ParkingTicket entity maintains entry timestamp, token ID, and slot pointer.
4. Chargeable Interface: Polymorphic calculateFee() with ceiling hour rounding and an 8-hour maximum cap: Math.min(ceilHours * rate, 8 * rate).
5. Truck Concurrency Rule: Trucks require two contiguous indices i and i+1; if separated or boundary exceeded, ParkingFullException is thrown.`;

    navigator.clipboard.writeText(notes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  // CSV export handler
  const handleExportCSV = () => {
    let csv = 'Ticket ID,Registration,Type,Assigned Slot,Entry Time,Elapsed Hours,Hourly Tariff,Estimated Fee\n';
    activeVehicles.forEach((v) => {
      const billable = Math.max(1, Math.min(8, Math.ceil(v.elapsedHours)));
      const fee = billable * v.hourlyRate;
      csv += `${v.ticketNumber},${v.registrationNumber},${v.type},"${v.allocatedSlots.map((s) => `Slot ${s + 1}`).join(' & ')}",${v.entryTime},${v.elapsedHours.toFixed(1)}h,₹${v.hourlyRate}/hr,₹${fee}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ParkEase_Manifest_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredVehicles = activeVehicles.filter(
    (v) =>
      v.registrationNumber.toLowerCase().includes(filterSearch.toLowerCase()) ||
      v.ticketNumber.toLowerCase().includes(filterSearch.toLowerCase()) ||
      v.type.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-6">
      {/* Screen Title & Report Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#c6c6cd]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#45464d] uppercase tracking-wider">
            <span>CONSOLE // REALTIME AUDIT REPORT</span>
            <span className="text-[#c6c6cd]">/</span>
            <span className="text-[#0051d5] font-semibold">FACILITY 01</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#0b1c30] tracking-tight mt-0.5">
            Parking Facility Operational Summary
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-[#76777d]">REPORT GENERATED</div>
            <div className="text-[12px] font-mono font-bold text-[#0b1c30]">
              24-OCT-2026 20:17:50 IST
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-lg bg-white border border-[#c6c6cd] text-[#0b1c30] hover:bg-[#eff4ff] text-[12px] font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Summary</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-lg bg-[#0051d5] hover:bg-[#003ea8] text-white text-[12px] font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Manifest (.CSV)</span>
          </button>
        </div>
      </div>

      {/* 1. TOP SUMMARY KPI ROW (5 Stat Cards) */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* KPI 1: Total Capacity */}
        <div className="bg-white p-4 rounded-xl border border-[#c6c6cd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#45464d]">
            <span className="text-[12px] font-bold uppercase tracking-wider">Total Capacity</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#0051d5]">
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#0b1c30] tracking-tight">
              20 <span className="text-[14px] font-normal text-[#45464d]">Slots</span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1 flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[14px] text-[#009668]">verified</span>
              Fixed contiguous memory array
            </p>
          </div>
        </div>

        {/* KPI 2: Vehicles Parked */}
        <div className="bg-white p-4 rounded-xl border border-[#c6c6cd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#45464d]">
            <span className="text-[12px] font-bold uppercase tracking-wider">Vehicles Parked</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#0051d5]">
              <span className="material-symbols-outlined text-[18px]">traffic</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#0051d5] tracking-tight">
              {activeVehicles.length} <span className="text-[14px] font-normal text-[#45464d]">Active</span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1">
              Across 3 active vehicle classes
            </p>
          </div>
        </div>

        {/* KPI 3: Occupied Slots */}
        <div className="bg-white p-4 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#ba1a1a]">
            <span className="text-[12px] font-bold uppercase tracking-wider">Occupied Slots</span>
            <span className="p-1.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">block</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#ba1a1a] tracking-tight">
              {occupiedSlots} <span className="text-[14px] font-normal text-[#45464d]">/ 20</span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1 flex items-center gap-1 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              {Math.round((occupiedSlots / 20) * 100)}% gross stall utilization
            </p>
          </div>
        </div>

        {/* KPI 4: Available Slots */}
        <div className="bg-white p-4 rounded-xl border border-[#4edea3]/40 bg-[#ECFDF5]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#009668]">
            <span className="text-[12px] font-bold uppercase tracking-wider">Available Slots</span>
            <span className="p-1.5 rounded-lg bg-[#ECFDF5] border border-[#6EE7B7] text-[#047857]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#009668] tracking-tight">
              {availableSlots} <span className="text-[14px] font-normal text-[#45464d]">Free</span>
            </div>
            <p className="text-[11px] text-[#45464d] mt-1 flex items-center gap-1 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-[#009668]"></span>
              Ready for instant allocation
            </p>
          </div>
        </div>

        {/* KPI 5: Cumulative Revenue Today */}
        <div className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-1 bg-white p-4 rounded-xl border border-[#0051d5]/40 bg-[#eff4ff]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#0051d5]">
            <span className="text-[12px] font-bold uppercase tracking-wider">Revenue Today</span>
            <span className="p-1.5 rounded-lg bg-white text-[#0051d5] shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[32px] font-bold text-[#0b1c30] font-mono tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#45464d] mt-1 flex items-center gap-1 font-mono">
              <span className="text-[#0051d5] font-semibold">Real-time billed + accrued</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. OCCUPANCY RATIO METER (Stacked Bar) */}
      <section className="bg-white p-5 rounded-xl border border-[#c6c6cd] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5] text-[20px]">pie_chart</span>
            <h2 className="text-[16px] font-bold text-[#0b1c30]">Slot Allocation Distribution Ratio</h2>
          </div>
          <div className="text-[11px] font-mono text-[#45464d]">
            20 Slot Matrix Capacity Allocation
          </div>
        </div>

        {/* Proportional Progress Bar */}
        <div className="w-full h-7 rounded-lg overflow-hidden flex bg-[#eff4ff] border border-[#c6c6cd] p-0.5 gap-0.5">
          <div
            className="bg-amber-500 text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-l"
            style={{ width: `${(bikeSlotsOccupied / totalCapacity) * 100}%` }}
          >
            <span>{Math.round((bikeSlotsOccupied / totalCapacity) * 100)}%</span>
          </div>
          <div
            className="bg-[#0051d5] text-white flex items-center justify-center text-[10px] font-mono font-bold"
            style={{ width: `${(carSlotsOccupied / totalCapacity) * 100}%` }}
          >
            <span>{Math.round((carSlotsOccupied / totalCapacity) * 100)}% CAR</span>
          </div>
          <div
            className="bg-indigo-700 text-white flex items-center justify-center text-[10px] font-mono font-bold"
            style={{ width: `${(truckSlotsOccupied / totalCapacity) * 100}%` }}
          >
            <span>{Math.round((truckSlotsOccupied / totalCapacity) * 100)}%</span>
          </div>
          <div
            className="bg-[#009668] text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-r"
            style={{ width: `${(availableSlots / totalCapacity) * 100}%` }}
          >
            <span>{Math.round((availableSlots / totalCapacity) * 100)}% FREE ({availableSlots} SLOTS)</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2 p-2 rounded bg-[#f8f9ff] border border-[#c6c6cd]/60">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0"></span>
            <div>
              <div className="text-[12px] font-bold text-[#0b1c30]">Motorcycles</div>
              <div className="text-[11px] font-mono text-[#45464d]">
                {bikeSlotsOccupied} slots ({Math.round((bikeSlotsOccupied / 20) * 100)}%)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-[#f8f9ff] border border-[#c6c6cd]/60">
            <span className="w-3.5 h-3.5 rounded bg-[#0051d5] shrink-0"></span>
            <div>
              <div className="text-[12px] font-bold text-[#0b1c30]">Sedans / SUVs</div>
              <div className="text-[11px] font-mono text-[#45464d]">
                {carSlotsOccupied} slots ({Math.round((carSlotsOccupied / 20) * 100)}%)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-[#f8f9ff] border border-[#c6c6cd]/60">
            <span className="w-3.5 h-3.5 rounded bg-indigo-700 shrink-0"></span>
            <div>
              <div className="text-[12px] font-bold text-[#0b1c30]">Trucks (Heavy)</div>
              <div className="text-[11px] font-mono text-[#45464d]">
                {truckSlotsOccupied} slots (10% dual)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-[#f8f9ff] border border-[#c6c6cd]/60">
            <span className="w-3.5 h-3.5 rounded bg-[#009668] shrink-0"></span>
            <div>
              <div className="text-[12px] font-bold text-[#0b1c30]">Unoccupied / Ready</div>
              <div className="text-[11px] font-mono text-[#45464d]">
                {availableSlots} slots ({Math.round((availableSlots / 20) * 100)}%)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VEHICLE TYPE BREAKDOWN CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bike Card */}
        <div className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">two_wheeler</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Motorcycles / Bikes</h3>
                  <span className="text-[10px] font-mono text-[#45464d]">ENUM: BIKE</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-300">
                1 Slot / Unit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Vehicles Parked</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{bikes.length} Vehicles</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Slots Occupied</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{bikeSlotsOccupied} Slots</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Hourly Rate</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block font-mono">
                  ₹10 <span className="text-[12px] font-normal text-[#45464d]">/ hr</span>
                </span>
              </div>
              <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                <span className="text-amber-800 font-semibold block">Today's Revenue</span>
                <span className="text-[16px] font-bold text-amber-900 mt-0.5 block font-mono">₹180</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e5eeff] flex items-center justify-between text-[11px] text-[#45464d]">
            <span>Capacity Usage: 15%</span>
            <span className="text-[#009668] font-semibold">Optimal Flow</span>
          </div>
        </div>

        {/* Car Card */}
        <div className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0051d5] border border-blue-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">directions_car</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Standard Sedans & SUVs</h3>
                  <span className="text-[10px] font-mono text-[#45464d]">ENUM: CAR</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-[#0051d5] border border-blue-300">
                1 Slot / Unit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Vehicles Parked</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{cars.length} Vehicles</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Slots Occupied</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{carSlotsOccupied} Slots</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Hourly Rate</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block font-mono">
                  ₹30 <span className="text-[12px] font-normal text-[#45464d]">/ hr</span>
                </span>
              </div>
              <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-200">
                <span className="text-[#0051d5] font-semibold block">Today's Revenue</span>
                <span className="text-[16px] font-bold text-[#0051d5] mt-0.5 block font-mono">₹1,980</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e5eeff] flex items-center justify-between text-[11px] text-[#45464d]">
            <span>Capacity Usage: 30%</span>
            <span className="text-[#0051d5] font-semibold">Primary Revenue Driver</span>
          </div>
        </div>

        {/* Truck Card */}
        <div className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Heavy Vehicles / Trucks</h3>
                  <span className="text-[10px] font-mono text-[#45464d]">ENUM: TRUCK</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-900 border border-indigo-300">
                Dual-Slot Bound (2 Stalls)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Vehicles Parked</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{trucks.length} Vehicle</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Slots Occupied</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block">{truckSlotsOccupied} Slots (Spanned)</span>
              </div>
              <div className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c6c6cd]/60">
                <span className="text-[#45464d] block font-medium">Hourly Rate</span>
                <span className="text-[16px] font-bold text-[#0b1c30] mt-0.5 block font-mono">
                  ₹60 <span className="text-[12px] font-normal text-[#45464d]">/ hr</span>
                </span>
              </div>
              <div className="bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-200">
                <span className="text-indigo-800 font-semibold block">Today's Revenue</span>
                <span className="text-[16px] font-bold text-indigo-950 mt-0.5 block font-mono">₹1,260</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e5eeff] flex items-center justify-between text-[11px] text-[#45464d]">
            <span>Capacity Usage: 10% (Contiguous)</span>
            <span className="text-indigo-700 font-semibold">Special Allocation</span>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE PARKING MANIFEST & BILLING AUDIT */}
      <section className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5]">table_view</span>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Active Parking Manifest & Billing Audit
              </h2>
            </div>
            <p className="text-[12px] text-[#45464d] mt-0.5">
              Real-time traversal list of all active vehicle tickets, slot allocations, and Chargeable dynamic computations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search plate or ticket..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="h-8 px-2.5 border border-[#c6c6cd] rounded text-[11px] font-mono uppercase bg-white text-[#0b1c30]"
            />
            <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#eff4ff] text-[#0051d5] font-semibold border border-[#c6c6cd]">
              Showing {filteredVehicles.length} Active Records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c6c6cd] text-[11px] font-bold tracking-wider text-[#45464d] uppercase font-mono">
                <th className="py-3 px-4">Ticket No.</th>
                <th className="py-3 px-4">Registration Plate</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Slot(s) Assigned</th>
                <th className="py-3 px-4">Entry Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Hourly Tariff</th>
                <th className="py-3 px-4 text-right">Est. Charge (8h Cap)</th>
                <th className="py-3 px-4 text-center">Billing Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff] text-[12px]">
              {filteredVehicles.map((v) => {
                const billable = Math.max(1, Math.min(8, Math.ceil(v.elapsedHours)));
                const fee = billable * v.hourlyRate;
                const capApplied = v.elapsedHours >= 8;
                const slotLabel = v.allocatedSlots
                  .map((s) => `BAY-${String(s + 1).padStart(2, '0')}`)
                  .join(' ⇄ ');

                return (
                  <tr key={v.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#0051d5]">
                      {v.ticketNumber}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">
                      <span className="px-2 py-0.5 rounded bg-[#f8f9ff] border border-[#c6c6cd]">
                        {v.registrationNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          v.type === 'Truck'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : v.type === 'Bike'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-[#0051d5] border border-blue-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {v.type === 'Truck'
                            ? 'local_shipping'
                            : v.type === 'Bike'
                            ? 'two_wheeler'
                            : 'directions_car'}
                        </span>
                        {v.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#0b1c30]">
                      {v.type === 'Truck' ? (
                        <span className="px-2 py-0.5 rounded border border-dashed border-indigo-400 bg-indigo-50 text-indigo-900 font-bold">
                          {slotLabel}
                        </span>
                      ) : (
                        slotLabel
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#45464d]">{v.entryTime}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#0b1c30]">
                      {v.elapsedHours.toFixed(1)}h
                    </td>
                    <td className="py-3 px-4 font-mono text-[#45464d]">₹{v.hourlyRate}/hr</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0b1c30]">
                      ₹{fee.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {capApplied ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                          <span className="material-symbols-outlined text-[12px]">lock_clock</span>
                          8-HR CAP APPLIED (₹{fee} MAX)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#eff4ff] text-[#45464d]">
                          Ceil({v.elapsedHours.toFixed(2)}h) × ₹{v.hourlyRate}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#c6c6cd] flex flex-col sm:flex-row sm:items-center justify-between text-[12px] text-[#45464d] gap-3">
          <div className="flex items-center gap-4">
            <span>
              Active Billed Slots: <strong className="text-[#0b1c30] font-mono">{occupiedSlots} / 20</strong>
            </span>
            <span className="text-[#c6c6cd]">|</span>
            <span>
              Vehicles with 8-Hr Cap Rule:{' '}
              <strong className="text-amber-800 font-semibold">
                {activeVehicles.filter((v) => v.elapsedHours >= 8).length} Vehicles
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Current Active Dwell Accrual:</span>
            <span className="font-mono text-[16px] font-bold text-[#0b1c30]">
              ₹{currentAccrual.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#76777d]">(Prior Exits Today: ₹{priorExits.toLocaleString()})</span>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC PROJECT NOTE / VIVA HELPER */}
      <section className="bg-white rounded-xl border-2 border-[#0051d5]/20 shadow-xs p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0051d5] via-[#316bf3] to-[#4edea3]"></div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-[#0051d5] font-bold">
                Object-Oriented Architecture Reference
              </div>
              <h2 className="text-[18px] font-bold text-[#0b1c30]">
                Academic Project Note & Viva Helper: Java OOP Concepts
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded bg-[#eff4ff] text-[11px] font-mono text-[#0051d5] border border-[#c6c6cd]">
            COMP-304 // SYSTEM DESIGN
          </span>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Pillar 1 */}
          <div className="p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0b1c30] font-bold text-[14px]">
                <span className="material-symbols-outlined text-[#0051d5] text-[18px]">data_array</span>
                <span>1. Slot Matrix Traversal</span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Implemented via contiguous fixed-size array <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">Slot[20]</code>. The system performs <code className="font-mono text-xs">O(1)</code> direct indexing or <code className="font-mono text-xs">O(N)</code> scans to locate adjacent free slots for multi-stall vehicles (e.g. Trucks).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 font-mono text-[10px] text-[#0051d5]">
              Array.traversal & bounds checking
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0b1c30] font-bold text-[14px]">
                <span className="material-symbols-outlined text-[#0051d5] text-[18px]">category</span>
                <span>2. VehicleType Enum</span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Strongly typed constants <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">BIKE(10, 1)</code>, <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">CAR(30, 1)</code>, and <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">TRUCK(60, 2)</code> bind hourly tariffs and required stall spans natively inside immutable Java enum instances.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 font-mono text-[10px] text-[#0051d5]">
              Enum state encapsulation
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0b1c30] font-bold text-[14px]">
                <span className="material-symbols-outlined text-[#0051d5] text-[18px]">confirmation_number</span>
                <span>3. Ticket Lifecycle</span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                The <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">ParkingTicket</code> class acts as an audit entity holding sequential token ID, license string, entrance instant, and assigned slot pointers, enforcing single active check-in invariant.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 font-mono text-[10px] text-[#0051d5]">
              Encapsulation & entity state
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0b1c30] font-bold text-[14px]">
                <span className="material-symbols-outlined text-[#0051d5] text-[18px]">calculate</span>
                <span>4. Chargeable Interface</span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Polymorphic contract <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">calculateCharge(int hours)</code>. Features ceiling hour conversion with an operational business cap: <code className="font-mono text-xs">Math.min(ceilHours * rate, 8 * rate)</code>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 font-mono text-[10px] text-[#0051d5]">
              Polymorphism & business rules
            </div>
          </div>
        </div>

        {/* Quick Viva Tip & Copy Button */}
        <div className="mt-4 p-3.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd] flex flex-col sm:flex-row sm:items-center justify-between text-[12px] gap-2">
          <div className="flex items-center gap-2 text-[#0b1c30]">
            <span className="material-symbols-outlined text-[#0051d5] text-[18px]">lightbulb</span>
            <span className="font-bold">Viva Defense Tip:</span>
            <span className="text-[#45464d]">
              Be prepared to explain why Trucks consume 2 contiguous array indices (e.g., indices 7 and 8) using synchronized atomic reservation methods to prevent race conditions.
            </span>
          </div>
          <button
            onClick={handleCopyVivaNotes}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#c6c6cd] text-[#0b1c30] text-[11px] font-mono hover:bg-[#eff4ff] hover:text-[#0051d5] cursor-pointer shrink-0 font-bold"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            <span>{copiedNotes ? 'Notes Copied!' : 'Copy Viva Notes'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

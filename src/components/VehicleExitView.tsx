import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';

export const VehicleExitView: React.FC = () => {
  const {
    activeVehicles,
    exitVehicle,
    completedTransactions,
    lastExitReceipt,
  } = useParking();

  const [searchInput, setSearchInput] = useState<string>('MH-12-DE-9876');
  const [hoursParkedInput, setHoursParkedInput] = useState<number>(7.5);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Clock
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

  // Find vehicle currently matched by search input
  const cleanSearch = searchInput.trim().toUpperCase();
  const matchedVehicle =
    activeVehicles.find(
      (v) =>
        v.ticketNumber.toUpperCase() === cleanSearch ||
        v.registrationNumber.toUpperCase().replace(/[\s-]+/g, '') === cleanSearch.replace(/[\s-]+/g, '')
    ) || activeVehicles[0];

  // Mathematical calculations
  const actualElapsed = hoursParkedInput || 7.5;
  const roundedHours = Math.ceil(actualElapsed);
  const billableHours = Math.max(1, Math.min(8, roundedHours));
  const rate = matchedVehicle ? matchedVehicle.hourlyRate : 60;
  const isCapApplied = roundedHours >= 8;
  const standardMathTotal = roundedHours * rate;
  const netPayable = billableHours * rate;

  const handleCheckout = () => {
    setErrorMessage(null);
    if (!matchedVehicle) {
      setErrorMessage('Please select or search for an active vehicle.');
      return;
    }

    const res = exitVehicle(matchedVehicle.ticketNumber, actualElapsed);
    if (res.success) {
      setCheckoutSuccess(true);
    } else {
      setErrorMessage(res.error || 'Failed to checkout vehicle.');
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-5">
      {/* Sub-Header Context Bar */}
      <div className="bg-white border border-[#c6c6cd] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#eff4ff] flex items-center justify-center text-[#0051d5]">
            <span className="material-symbols-outlined text-[22px]">output</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-bold text-[#0b1c30]">Terminal Outpost: Bay Gate East #02</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#e5eeff] text-[#0051d5] border border-[#c6c6cd]">
                JAVA_INTERFACE: CHARGEABLE_V2
              </span>
            </div>
            <p className="text-[12px] text-[#45464d]">
              Automated egress validation, dwell time calculation & real-time dual-slot release orchestration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[11px] font-mono text-[#0b1c30]">
            <span className="material-symbols-outlined text-[15px] text-[#45464d]">schedule</span>
            <span>SYSTEM TIME: <strong className="text-[#0b1c30]">{liveClock}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#c6c6cd] text-[11px] font-mono text-[#0b1c30]">
            <span className="material-symbols-outlined text-[15px] text-[#009668]">sensors</span>
            <span>RFID SENSOR ARRAY: SYNCED</span>
          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {checkoutSuccess && (
        <div className="p-4 rounded-xl bg-white border-2 border-[#10B981] shadow-xs flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] border border-[#6EE7B7] flex items-center justify-center text-[#047857]">
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
                  Egress Authorization Complete
                </span>
                <span className="text-[10px] font-mono bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  {lastExitReceipt?.transactionId || 'TXN-REC-90812'}
                </span>
              </div>
              <h2 className="text-[16px] font-bold text-[#0b1c30] mt-0.5">
                Vehicle{' '}
                <span className="font-mono bg-[#eff4ff] px-2 py-0.5 rounded border border-[#c6c6cd] font-bold">
                  {lastExitReceipt?.registrationNumber || 'MH-12-DE-9876'}
                </span>{' '}
                checked out.{' '}
                <span className="text-[#047857] font-semibold">
                  {lastExitReceipt?.allocatedSlotsLabel || 'Slots'}
                </span>{' '}
                are now <span className="underline decoration-[#10B981] font-bold">AVAILABLE</span>.
              </h2>
              <p className="text-[12px] text-[#45464d] mt-0.5">
                Heavy Freight barrier gate #02 raised. Telemetry signal propagated to central slot occupancy mesh.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCheckoutSuccess(false)}
            className="text-[#45464d] hover:text-[#0b1c30] p-1 rounded hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/40 text-[#93000a] text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TWO-COLUMN WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: SEARCH & VEHICLE IDENTIFICATION (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Search Card */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">search_check</span>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">
                  Vehicle Registration & Ticket Look-up
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#45464d]">INDEX: ANPR_LIVE + BARCODE</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCheckoutSuccess(false);
              }}
              className="mt-4"
            >
              <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1.5" htmlFor="vehicle-search-input">
                Enter Vehicle Registration Number (Plate) or Ticket ID:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#45464d]">
                    <span className="material-symbols-outlined text-[18px]">pin</span>
                  </span>
                  <input
                    id="vehicle-search-input"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                    placeholder="e.g. MH-12-DE-9876 or TKT-1075"
                    className="w-full h-10 pl-9 pr-3 bg-white border border-[#c6c6cd] rounded-lg font-mono text-[14px] uppercase text-[#0b1c30] focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 h-10 bg-[#0051d5] text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-[#003ea8] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>Instant Look-up</span>
                </button>
              </div>

              {/* Quick Filter Presets */}
              <div className="mt-3 flex items-center gap-2 text-[12px] text-[#45464d]">
                <span>Recent fast-keys:</span>
                {activeVehicles.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSearchInput(v.registrationNumber);
                      setCheckoutSuccess(false);
                    }}
                    className="px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] font-mono text-[#0b1c30] border border-[#c6c6cd] hover:border-[#0051d5] cursor-pointer"
                  >
                    {v.ticketNumber} ({v.registrationNumber})
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* ACTIVE PARKED VEHICLE MATCH CARD */}
          {matchedVehicle && (
            <div className="bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#0051d5]"></div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#dbe1ff] text-[#00174b]">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </span>
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Active Parked Vehicle Match Found</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded border border-[#ffdad6] bg-[#ffdad6]/40 text-[#ba1a1a] text-[11px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                    <span>Occupied Stall</span>
                  </span>
                </div>
              </div>

              {/* Dossier */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[12px] text-[#45464d] block">Vehicle Registration Plate:</span>
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-[#eff4ff] rounded-lg border border-[#c6c6cd]">
                      <span className="text-[10px] font-bold text-[#45464d] border-r border-[#c6c6cd] pr-1.5">IND</span>
                      <span className="text-[18px] font-mono font-bold text-[#0b1c30] tracking-wider">
                        {matchedVehicle.registrationNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[12px] text-[#45464d] block">Classification:</span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[14px] font-bold text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[#0051d5]">
                          {matchedVehicle.type === 'Truck'
                            ? 'local_shipping'
                            : matchedVehicle.type === 'Bike'
                            ? 'two_wheeler'
                            : 'directions_car'}
                        </span>
                        <span>{matchedVehicle.type}</span>
                      </div>
                    </div>
                    <div className="border-l border-[#c6c6cd] pl-4">
                      <span className="text-[12px] text-[#45464d] block">Ticket Identifier:</span>
                      <span className="font-mono text-[14px] font-bold text-[#0051d5] mt-0.5 block">
                        {matchedVehicle.ticketNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Info: Dual-slot or single slot display */}
                <div className="bg-[#f8f9ff] p-3.5 rounded-lg border border-[#c6c6cd]">
                  <span className="text-[12px] text-[#45464d] block mb-1">Assigned Slot Footprint:</span>
                  <div className="border-2 border-dashed border-[#76777d] rounded-lg bg-white p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#45464d] text-[24px]">width</span>
                      <div>
                        <span className="font-mono text-[14px] font-bold text-[#0b1c30]">
                          {matchedVehicle.assignedCorridorName || `BAY [${matchedVehicle.allocatedSlots.map((s) => s + 1).join(', ')}]`}
                        </span>
                        <span className="block text-[11px] font-mono text-[#45464d]">
                          {matchedVehicle.type === 'Truck' ? 'Continuous Spanned Corridors' : 'Standard Assigned Bay'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {matchedVehicle.allocatedSlots.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 bg-[#eff4ff] rounded border border-[#c6c6cd] font-mono text-[12px] font-bold text-[#0b1c30]"
                        >
                          Slot {String(s + 1).padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-[#45464d] mt-1.5">
                    {matchedVehicle.type === 'Truck'
                      ? 'Two vertically linked bays automatically locked for vehicle length clearance.'
                      : 'Single standard bay allocated via First-Fit linear search.'}
                  </p>
                </div>
              </div>

              {/* In-Time vs Out-Time Timeline Bar */}
              <div className="mt-4 pt-3 border-t border-[#e5eeff] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
                  <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-[#45464d]">
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#45464d] block">Entry Timestamp (In-Time):</span>
                    <span className="font-mono text-[14px] font-bold text-[#0b1c30]">
                      {matchedVehicle.entryTime}
                    </span>
                    <span className="text-[10px] font-mono text-[#76777d] block">
                      Session {matchedVehicle.ticketNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
                  <div className="w-8 h-8 rounded bg-[#dbe1ff] flex items-center justify-center text-[#0051d5]">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#45464d] block">Current Exit Time (Out-Time):</span>
                    <span className="font-mono text-[14px] font-bold text-[#0b1c30]">
                      {liveClock.replace(' IST', '')}
                    </span>
                    <span className="text-[10px] font-mono text-[#0051d5] block font-semibold">
                      Active Sensor Ping Match
                    </span>
                  </div>
                </div>
              </div>

              {/* DURATION COMPUTATION & CEILING RULE BOX */}
              <div className="mt-4 p-4 rounded-xl bg-[#eff4ff] border border-[#0051d5]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#0b1c30]">
                      Duration Computation Engine
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-[#0051d5] border border-[#0051d5]/30 flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[12px]">info</span>
                      Billing Rule: Math.ceil()
                    </span>
                  </div>

                  {/* Computed comparison stats */}
                  <div className="mt-2 flex items-baseline gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#45464d] block">ENTER ELAPSED HOURS:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="24"
                        value={hoursParkedInput}
                        onChange={(e) => setHoursParkedInput(parseFloat(e.target.value) || 1)}
                        className="w-24 h-8 px-2 rounded border border-[#c6c6cd] font-mono font-bold text-[14px] bg-white text-[#0b1c30] mt-0.5"
                      />
                    </div>
                    <div className="text-[#76777d]">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#0051d5] block font-bold">
                        ROUNDED BILLABLE HOURS:
                      </span>
                      <span className="font-mono text-[20px] font-bold text-[#0051d5]">
                        {billableHours}{' '}
                        <span className="text-[13px] font-normal text-[#0051d5]">billable hours</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro summary meter */}
                <div className="bg-white p-3 rounded-xl border border-[#c6c6cd] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-[#0051d5] flex items-center justify-center font-mono text-[15px] font-bold text-[#0051d5]">
                    {billableHours}h
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#0b1c30] block">Quota Exhaustion</span>
                    <span className="text-[10px] font-mono text-[#009668] bg-[#eff4ff] px-1.5 py-0.5 rounded font-bold">
                      {isCapApplied ? '100% of 8h Daily Cap' : `${Math.round((billableHours / 8) * 100)}% of 8h Daily Cap`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT PANEL: DETAILED BILLING & PAYMENT RECEIPT (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5]">receipt</span>
                  <h3 className="text-[16px] font-bold text-[#0b1c30]">Chargeable Billing Manifest</h3>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd]">
                  RECEIPT #INV-2026-{(matchedVehicle?.ticketNumber || '1075').replace('TKT-', '')}
                </span>
              </div>

              {/* Class runtime banner */}
              <div className="mt-4 p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#45464d] text-[20px]">code</span>
                  <div>
                    <span className="text-[10px] font-mono text-[#45464d] block">CLASS RUNTIME:</span>
                    <span className="font-mono text-[12px] font-bold text-[#0b1c30]">
                      {matchedVehicle?.type}ParkingChargesImpl
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-[#0051d5] font-bold border border-[#0051d5]/20">
                  HourlyTariff: ₹{rate}/hr
                </span>
              </div>

              {/* Mathematical Line Item Breakdown */}
              <div className="mt-4 space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5eeff]">
                  <span className="text-[#45464d]">Vehicle Class Tariff:</span>
                  <span className="font-mono font-semibold text-[#0b1c30]">
                    {matchedVehicle?.type} (₹{rate}.00 / hour)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5eeff]">
                  <span className="text-[#45464d]">Billable Dwell Units:</span>
                  <span className="font-mono font-semibold text-[#0b1c30]">
                    {billableHours} Billable Hours
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5eeff]">
                  <span className="text-[#45464d]">Standard Tariff Math:</span>
                  <span className="font-mono text-[#0b1c30]">
                    {actualElapsed} hrs ({roundedHours} rounded) × ₹{rate}.00 = ₹{standardMathTotal}.00
                  </span>
                </div>

                {/* 8-Hour Daily Cap Callout */}
                {isCapApplied && (
                  <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#f59e0b]/50 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#b45309] text-[20px] mt-0.5">
                      verified_user
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-[#b45309]">
                          8-Hour Daily Billing Cap Reached
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#fef3c7] text-[#92400e] rounded border border-[#f59e0b]/40">
                          ENFORCED
                        </span>
                      </div>
                      <p className="text-[11px] text-[#92400e] mt-0.5">
                        Maximum daily rate limit applied (8 hrs × ₹{rate} = ₹{billableHours * rate}).
                        Subsequent hours will not accrue additional charges.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-[#e5eeff]">
                  <span className="text-[#45464d]">Facility Access Cess:</span>
                  <span className="font-mono text-[#0b1c30]">₹0.00 (Waived)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5eeff]">
                  <span className="text-[#45464d]">Applicable GST / Surcharges:</span>
                  <span className="font-mono text-[#0b1c30]">Inclusive in Tariff</span>
                </div>
              </div>

              {/* TOTAL DUE CALLOUT */}
              <div className="mt-5 p-4 rounded-xl bg-[#eff4ff] flex items-center justify-between border border-[#0051d5]/30">
                <div>
                  <span className="text-[11px] font-bold text-[#45464d] block uppercase tracking-wide">
                    Net Payable Amount
                  </span>
                  <span className="text-[11px] text-[#45464d]">Method: POS Cash / FastTag Direct</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[32px] font-bold text-[#0b1c30] leading-none">
                    ₹{netPayable}
                  </span>
                  <span className="block text-[11px] font-mono text-[#0051d5] font-bold">
                    EXACT TARIFF MATCH
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#45464d]">
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>Operator: Raj Sharma (Terminal Kiosk East 02)</span>
              </div>
            </div>

            {/* ACTION BUTTON CLUSTER */}
            <div className="mt-6 pt-4 border-t border-[#e5eeff] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCheckout}
                className="flex-1 px-4 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">lock_open</span>
                <span>Confirm Payment & Release Slot</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 bg-white border border-[#c6c6cd] text-[#0b1c30] hover:bg-[#f8f9ff] rounded-lg font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Exit Receipt</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* RECENT CHECKOUT TRANSACTIONS MINI-LOG */}
      <section className="bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5]">history</span>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Recent Checkout Transactions Mini-Log</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#45464d]">AUTOREFRESH: 30s</span>
            <button className="p-1 rounded text-[#45464d] hover:text-[#0051d5] hover:bg-[#eff4ff]">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#45464d] text-[11px] font-bold uppercase tracking-wider border-b border-[#c6c6cd] font-mono">
                <th className="py-2.5 px-4">Ticket ID</th>
                <th className="py-2.5 px-4">Vehicle Reg Plate</th>
                <th className="py-2.5 px-4">Class</th>
                <th className="py-2.5 px-4">Bay / Slot Released</th>
                <th className="py-2.5 px-4">Entry Time</th>
                <th className="py-2.5 px-4">Exit Time</th>
                <th className="py-2.5 px-4">Billable Hrs</th>
                <th className="py-2.5 px-4">Paid Amount</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff] text-[12px]">
              {completedTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#0051d5]">{tx.ticketId}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-[#0b1c30]">
                    <span className="px-2 py-0.5 rounded bg-[#f8f9ff] border border-[#c6c6cd]">
                      {tx.registrationNumber}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#0b1c30]">{tx.type}</td>
                  <td className="py-2.5 px-4 font-mono text-[#0b1c30] font-semibold">
                    {tx.allocatedSlotsLabel}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#45464d]">{tx.entryTime}</td>
                  <td className="py-2.5 px-4 font-mono text-[#0b1c30] font-semibold">{tx.exitTime}</td>
                  <td className="py-2.5 px-4 font-mono text-[#0b1c30]">
                    {tx.billableHours} hrs {tx.capApplied ? '(Cap)' : ''}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-[#0b1c30]">
                    ₹{tx.paidAmount.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7] inline-flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#047857]"></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button className="text-[#0051d5] hover:underline font-mono text-[11px] cursor-pointer">
                      {tx.receiptNumber}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

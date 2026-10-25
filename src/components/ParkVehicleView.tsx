import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { VehicleCategory, VEHICLE_CONFIGS } from '../types/parking';

export const ParkVehicleView: React.FC = () => {
  const {
    slots,
    parkVehicle,
    findFirstAvailableSlotIndices,
    lastTicket,
  } = useParking();

  const [plateInput, setPlateInput] = useState<string>('KA-05-MJ-4321');
  const [selectedType, setSelectedType] = useState<VehicleCategory>('Car');
  const [alertState, setAlertState] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Clock
  const [serverTime, setServerTime] = useState<string>('20:16:58 UTC+5:30');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setServerTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC+5:30');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute recommended candidate slot based on selected type
  const candidateIndices = findFirstAvailableSlotIndices(selectedType);
  const candidateLabel = candidateIndices
    ? candidateIndices.length === 2
      ? `Slot ${String(candidateIndices[0] + 1).padStart(2, '0')} & ${String(candidateIndices[1] + 1).padStart(2, '0')} (Span)`
      : `Slot ${String(candidateIndices[0] + 1).padStart(2, '0')}`
    : 'NO SLOTS (LOT FULL)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertState(null);

    const res = parkVehicle(plateInput, selectedType);
    if (res.success && res.ticket) {
      setAlertState({
        type: 'success',
        message: `Success! Ticket ${res.ticket.ticketNumber} generated and ${
          res.ticket.allocatedSlots.length === 2 ? 'dual bays locked' : 'slot locked'
        } in database.`,
      });
    } else {
      setAlertState({
        type: 'error',
        message: res.error || 'Allocation failed.',
      });
    }
  };

  const currentDisplayTicket = lastTicket;

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-5">
      {/* Sub-Header / Operational Breadcrumb Strip */}
      <div className="w-full bg-white border border-[#c6c6cd] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-[12px] text-[#45464d]">
          <span className="flex items-center gap-1 font-semibold text-[#0b1c30]">
            <span className="material-symbols-outlined text-[16px] text-[#0051d5]">business</span>
            Central Terminal Facility
          </span>
          <span className="text-[#c6c6cd]">/</span>
          <span className="text-[#0b1c30] font-semibold">Entry Gate #01 (North Inbound)</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#0051d5] text-[10px] font-mono font-bold">
            TICKET TERMINAL ONLINE
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#45464d]">
          SERVER TIME: <span className="text-[#0b1c30] font-bold">{serverTime}</span>
        </div>
      </div>

      {/* Top System Alert States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Duplicate Vehicle Check Alert State */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#c6c6cd] shadow-xs relative overflow-hidden">
          <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#0051d5]"></div>
          <div className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#0051d5] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">info</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#0b1c30]">Live Validation Guard</span>
              <span className="text-[10px] font-mono text-[#45464d]">CODE: DUP_CHK_ON</span>
            </div>
            <p className="text-[12px] text-[#45464d] mt-0.5">
              System enforces single active session. Sample alert:{' '}
              <span className="font-mono text-[#ba1a1a] font-semibold bg-[#ffdad6]/60 px-1.5 py-0.5 rounded border border-[#ba1a1a]/20">
                Vehicle DL-04-CA-1029 is already parked in Slot 04
              </span>
              . Duplicate admissions are locked automatically.
            </p>
          </div>
        </div>

        {/* ParkingFullException Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/30 shadow-xs relative overflow-hidden">
          <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#ba1a1a]"></div>
          <div className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#ba1a1a]">ParkingFullException Monitor</span>
              <span className="text-[10px] font-mono text-[#ba1a1a] font-semibold">CONSECUTIVE_BAY_RESTRICTION</span>
            </div>
            <p className="text-[12px] text-[#45464d] mt-0.5">
              Heavy freight constraint:{' '}
              <span className="font-medium text-[#0b1c30]">
                No vacant slots available or no 2 consecutive slots for Truck
              </span>{' '}
              will trigger overflow exception handling automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Vehicle Entry Form (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
            <div>
              <h1 className="text-[18px] font-bold text-[#0b1c30]">Vehicle Entry & Admission</h1>
              <p className="text-[12px] text-[#45464d]">
                Issue physical/digital transit slip and trigger dynamic slot lock.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eff4ff] text-[#45464d] font-mono text-[11px] border border-[#c6c6cd]">
              <span className="material-symbols-outlined text-[14px] text-[#009668]">sensors</span>
              ANPR Camera Active
            </div>
          </div>

          {alertState && (
            <div
              className={`p-3.5 rounded-lg border text-[13px] flex items-start gap-2.5 ${
                alertState.type === 'success'
                  ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#047857]'
                  : 'bg-[#ffdad6] border-[#ba1a1a]/40 text-[#93000a]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {alertState.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <div className="flex-1 font-semibold">{alertState.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Registration Input Zone */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-[#0b1c30]" htmlFor="plateInput">
                  Vehicle Registration Number
                </label>
                <button
                  type="button"
                  onClick={() => setPlateInput('KA-05-MJ-4321')}
                  className="text-[11px] font-mono text-[#0051d5] hover:underline cursor-pointer"
                >
                  Populate Detected Plate (KA-05-MJ-4321)
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#45464d]">
                  <span className="material-symbols-outlined text-[18px] text-[#76777d]">badge</span>
                  <span className="text-[11px] font-mono font-bold text-[#76777d]">IND</span>
                </div>
                <input
                  id="plateInput"
                  type="text"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  placeholder="AB-12-CD-3456"
                  required
                  className="w-full h-11 pl-16 pr-24 text-[15px] font-mono font-bold text-[#0b1c30] bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 uppercase tracking-widest transition-all"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff4ff] text-[#005236] font-bold border border-[#c6c6cd]">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#45464d]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#76777d]">info</span>
                  Format: <code className="font-mono font-bold text-[#0b1c30]">AB-12-CD-3456</code> (State code, RTO numeric, series, unique number).
                </span>
                <span className="font-mono text-[#76777d]">AUTO-UPPERCASE VALIDATED</span>
              </div>
            </div>

            {/* Vehicle Type Selector Cards */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-[#0b1c30]">Select Vehicle Category</label>
                <span className="text-[12px] text-[#45464d]">
                  Select clearance height & dimension requirements
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Bike Card */}
                <label
                  onClick={() => setSelectedType('Bike')}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedType === 'Bike'
                      ? 'border-[#0051d5] bg-[#eff4ff] shadow-xs'
                      : 'border-[#c6c6cd] bg-white hover:border-[#76777d]'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleType"
                    checked={selectedType === 'Bike'}
                    onChange={() => setSelectedType('Bike')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#e5eeff] text-[#45464d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#45464d] bg-white px-1.5 py-0.5 rounded border border-[#c6c6cd]">
                      ₹10/hr
                    </span>
                  </div>
                  <div className="text-[15px] font-bold text-[#0b1c30]">Bike</div>
                  <div className="text-[12px] text-[#45464d] mt-0.5">Compact two-wheeler</div>
                  <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#005236] font-medium">1 Slot required</span>
                    <span className="text-[#76777d]">Standard bay</span>
                  </div>
                </label>

                {/* Car Card */}
                <label
                  onClick={() => setSelectedType('Car')}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedType === 'Car'
                      ? 'border-[#0051d5] bg-[#eff4ff] shadow-xs'
                      : 'border-[#c6c6cd] bg-white hover:border-[#76777d]'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleType"
                    checked={selectedType === 'Car'}
                    onChange={() => setSelectedType('Car')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#316bf3] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">directions_car</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#0051d5] bg-white px-1.5 py-0.5 rounded border border-[#0051d5]/30">
                      ₹30/hr
                    </span>
                  </div>
                  <div className="text-[15px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                    Car
                    {selectedType === 'Car' && <span className="w-2 h-2 rounded-full bg-[#0051d5]"></span>}
                  </div>
                  <div className="text-[12px] text-[#45464d] mt-0.5">Sedan, Hatchback, SUV</div>
                  <div className="mt-3 pt-2 border-t border-[#0051d5]/20 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#0051d5] font-medium">1 Slot required</span>
                    <span className="text-[#45464d]">Standard bay</span>
                  </div>
                </label>

                {/* Truck Card */}
                <label
                  onClick={() => setSelectedType('Truck')}
                  className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedType === 'Truck'
                      ? 'border-[#0051d5] bg-[#eff4ff] shadow-xs'
                      : 'border-[#c6c6cd] bg-white hover:border-[#76777d]'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleType"
                    checked={selectedType === 'Truck'}
                    onChange={() => setSelectedType('Truck')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#e5eeff] text-[#45464d] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#45464d] bg-white px-1.5 py-0.5 rounded border border-[#c6c6cd]">
                      ₹60/hr
                    </span>
                  </div>
                  <div className="text-[15px] font-bold text-[#0b1c30]">Truck</div>
                  <div className="text-[12px] text-[#45464d] mt-0.5">Heavy commercial & bus</div>
                  <div className="mt-3 pt-2 border-t border-[#c6c6cd]/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#ba1a1a] font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      2 consecutive!
                    </span>
                    <span className="text-[#76777d]">Dual span</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Slot Allocation Logic Preview */}
            <div className="p-4 rounded-lg bg-[#eff4ff] border border-[#c6c6cd] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5] text-[20px]">account_tree</span>
                  <span className="text-[12px] font-bold text-[#0b1c30]">
                    Automated Slot Allocation Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-[#0051d5] px-2 py-0.5 rounded bg-white border border-[#c6c6cd]">
                  FIRST-FIT ENGINE v1.2
                </span>
              </div>
              <p className="text-[12px] text-[#45464d]">
                The spatial allocator scans linearly,{' '}
                <strong className="text-[#0b1c30]">allocating lowest index available slot</strong> to
                minimize passenger travel distance. For trucks, contiguous slot pairing is verified prior to dispatch lock.
              </p>
              <div className="mt-1 pt-2 border-t border-[#c6c6cd] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#45464d]">Target Slot Candidate:</span>
                  <span className="px-2 py-0.5 rounded bg-white text-[#0051d5] font-bold border border-[#c6c6cd]">
                    {candidateLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#45464d]">
                  <span className="w-2 h-2 rounded-full bg-[#009668]"></span>
                  <span>Latency: 14ms (Optimal)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 h-12 bg-[#0051d5] hover:bg-[#003ea8] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                <span className="text-[14px]">Generate Ticket & Allocate Slot</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlateInput('');
                  setAlertState(null);
                }}
                className="h-12 px-5 border border-[#c6c6cd] bg-white hover:bg-[#f8f9ff] text-[#45464d] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT COLUMN: Ticket Print Manifest (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0b1c30] text-[20px]">receipt_long</span>
              <span className="text-[16px] font-bold text-[#0b1c30]">Ticket Print Manifest</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#e5eeff] text-[#45464d] border border-[#c6c6cd]">
              PREVIEW BUFFER
            </span>
          </div>

          {/* Printable Ticket Card */}
          <div className="bg-white rounded-xl border border-[#c6c6cd] shadow-xs overflow-hidden flex flex-col">
            {/* Top Perforation Header Aesthetic */}
            <div className="bg-[#131b2e] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#0051d5] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">local_parking</span>
                </div>
                <div>
                  <div className="text-[16px] font-bold text-white tracking-tight">ParkEase Transit Slip</div>
                  <div className="text-[11px] font-mono text-[#7c839b]">OFFICIAL ADMISSION RECEIPT</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[14px] font-mono text-[#6ffbbe] font-bold">
                  {currentDisplayTicket ? currentDisplayTicket.ticketNumber : 'TKT-1082'}
                </span>
                <div className="text-[11px] font-mono text-[#7c839b]">GATE #01-IN</div>
              </div>
            </div>

            {/* Sawtooth perforation line */}
            <div className="relative h-3 bg-white border-b border-dashed border-[#c6c6cd] flex items-center justify-between px-3">
              <div className="w-3 h-3 rounded-full bg-[#f8f9ff] -ml-4 border border-[#c6c6cd]"></div>
              <div className="w-3 h-3 rounded-full bg-[#f8f9ff] -mr-4 border border-[#c6c6cd]"></div>
            </div>

            {/* Ticket Core Body */}
            <div className="p-6 flex flex-col gap-4">
              {/* Plate Banner */}
              <div className="flex flex-col items-center justify-center p-3.5 bg-[#eff4ff] rounded-lg border border-[#c6c6cd]">
                <span className="text-[11px] font-mono text-[#76777d] tracking-wider uppercase">
                  Allocated Vehicle Registration
                </span>
                <div className="mt-1 text-[22px] font-mono font-bold text-[#0b1c30] tracking-widest bg-white px-4 py-1 rounded border border-[#76777d] shadow-2xs">
                  {currentDisplayTicket ? currentDisplayTicket.registrationNumber : plateInput || 'KA-05-MJ-4321'}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-[#45464d] uppercase">Vehicle Type</span>
                  <span className="text-[15px] font-semibold text-[#0b1c30] flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[18px] text-[#0051d5]">
                      {currentDisplayTicket?.type === 'Truck'
                        ? 'local_shipping'
                        : currentDisplayTicket?.type === 'Bike'
                        ? 'two_wheeler'
                        : 'directions_car'}
                    </span>
                    {currentDisplayTicket ? currentDisplayTicket.type : selectedType}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-[#45464d] uppercase">Assigned Slot</span>
                  <span className="text-[15px] font-bold text-[#0051d5] flex items-center gap-1 mt-0.5 font-mono">
                    <span className="material-symbols-outlined text-[18px]">local_parking</span>
                    {currentDisplayTicket
                      ? currentDisplayTicket.allocatedSlots.map((s) => `Slot ${String(s + 1).padStart(2, '0')}`).join(' & ')
                      : candidateLabel}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-[#45464d] uppercase">Entry Timestamp</span>
                  <span className="text-[13px] font-mono text-[#0b1c30] font-medium mt-0.5">
                    {currentDisplayTicket ? `${currentDisplayTicket.entryTime}, ${currentDisplayTicket.entryDate}` : '14:35, 24 Oct 2026'}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-[#45464d] uppercase">Hourly Tariff</span>
                  <span className="text-[13px] font-semibold text-[#0b1c30] mt-0.5">
                    ₹{VEHICLE_CONFIGS[currentDisplayTicket?.type || selectedType].hourlyRate}/hr{' '}
                    <span className="text-[11px] font-mono text-[#45464d] font-normal">(8-hr max cap)</span>
                  </span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-3 border-t border-[#c6c6cd] flex flex-col items-center justify-center gap-2">
                <div className="w-full h-10 barcode-lines rounded-xs opacity-90"></div>
                <div className="text-[11px] font-mono text-[#76777d] tracking-widest text-center">
                  *{currentDisplayTicket?.ticketNumber || 'TKT-1082'}-{(currentDisplayTicket?.registrationNumber || plateInput || 'KA05MJ4321').replace(/[^A-Z0-9]/g, '')}*
                </div>
              </div>

              {/* Footnote */}
              <div className="p-2.5 rounded bg-[#eff4ff] text-[#45464d] text-[11px] border border-[#c6c6cd] text-center">
                Please preserve this ticket. Lost ticket incurs an administrative fine of ₹250 plus accrued duration tariff.
              </div>
            </div>

            {/* Printable Actions Footer */}
            <div className="bg-[#f8f9ff] px-6 py-3 border-t border-[#c6c6cd] flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0b1c30] hover:bg-[#213145] text-white font-semibold text-[12px] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`Ticket ${currentDisplayTicket?.ticketNumber || 'TKT-1082'} exported as digital transit receipt.`)}
                className="px-4 py-2 border border-[#c6c6cd] bg-white hover:bg-[#eff4ff] text-[#0b1c30] font-semibold text-[12px] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Thermal Ticket Printer Status */}
          <div className="p-3.5 rounded-xl bg-white border border-[#c6c6cd] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009668] animate-pulse"></span>
              <div>
                <div className="text-[12px] font-bold text-[#0b1c30]">Thermal Ticket Printer #01</div>
                <div className="text-[11px] font-mono text-[#45464d]">Paper Roll: 84% Remaining | Feed Ready</div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#005236] font-bold bg-[#eff4ff] px-2 py-0.5 rounded border border-[#c6c6cd]">
              ONLINE
            </span>
          </div>
        </section>
      </div>

      {/* BOTTOM HELPER: Live Available Slots Preview Row */}
      <section className="bg-white rounded-xl border border-[#c6c6cd] p-5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">grid_view</span>
            <div>
              <h2 className="text-[15px] font-bold text-[#0b1c30]">Live Available Slots Preview</h2>
              <p className="text-[12px] text-[#45464d]">
                Real-time status of unallocated bays ready for immediate admission.
              </p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#eff4ff] border border-[#c6c6cd]"></span>
              <span className="text-[#45464d]">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#0051d5] text-white flex items-center justify-center text-[8px]">✓</span>
              <span className="text-[#0051d5] font-bold">Allocated Candidate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#e5eeff] border border-[#76777d]"></span>
              <span className="text-[#76777d]">Occupied</span>
            </div>
          </div>
        </div>

        {/* Free Slot Chips Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {slots.map((s) => {
            const isCandidate = candidateIndices?.includes(s.index);

            if (s.isOccupied) {
              return (
                <div
                  key={s.index}
                  className="px-2.5 py-1.5 rounded-lg bg-[#e5eeff]/50 border border-[#c6c6cd]/70 text-[#76777d] flex items-center gap-1.5 text-[11px] font-mono cursor-not-allowed"
                  title={`Slot ${s.slotNumber} Occupied by ${s.vehicle?.registrationNumber}`}
                >
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>{s.label}</span>
                  <span className="px-1 rounded bg-white text-[10px] text-[#ba1a1a]">
                    {s.vehicle?.registrationNumber.slice(0, 5) || 'OCC'}
                  </span>
                </div>
              );
            }

            if (isCandidate) {
              return (
                <div
                  key={s.index}
                  className="px-3 py-1.5 rounded-lg bg-[#0051d5] text-white shadow-xs flex items-center gap-1.5 font-mono text-[11px] font-bold ring-2 ring-[#0051d5] ring-offset-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">radio_button_checked</span>
                  <span>{s.label}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[#0051d5] text-[10px] font-bold">
                    ALLOCATING
                  </span>
                </div>
              );
            }

            return (
              <div
                key={s.index}
                className="px-3 py-1.5 rounded-lg bg-[#eff4ff] border border-[#c6c6cd] text-[#0b1c30] hover:border-[#0051d5] cursor-pointer transition-all flex items-center gap-1.5 font-mono text-[11px]"
              >
                <span className="w-2 h-2 rounded-full bg-[#009668]"></span>
                <span className="font-semibold">{s.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-white text-[#009668] text-[10px] font-medium border border-[#c6c6cd]">
                  Free
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

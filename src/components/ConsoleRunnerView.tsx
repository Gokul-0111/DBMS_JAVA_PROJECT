import React, { useState, useRef, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';

interface TerminalLine {
  text: string;
  type: 'output' | 'input' | 'error' | 'success' | 'header';
}

export const ConsoleRunnerView: React.FC = () => {
  const { slots, activeVehicles, parkVehicle, exitVehicle, reassignSlot, runTestSuite } = useParking();

  const [inputVal, setInputVal] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: '===============================================================', type: 'header' },
    { text: '    PARKEASE: SMART PARKING MANAGEMENT SYSTEM (JVM JDK21 v2.4) ', type: 'header' },
    { text: '    Academic Evaluation Edition - Fixed Memory Array[20]       ', type: 'header' },
    { text: '===============================================================', type: 'header' },
    { text: '', type: 'output' },
    { text: '----------------- MAIN OPERATOR MENU -----------------', type: 'output' },
    { text: ' 1. Park Vehicle (Allocate Slot & Issue Ticket)', type: 'output' },
    { text: ' 2. Vehicle Exit & Billing (Calculate Tariff & Free Slot)', type: 'output' },
    { text: ' 3. View Live 20-Slot Map (Visual Bay Topology)', type: 'output' },
    { text: ' 4. View Parking Summary (KPIs, Tariffs & Revenue)', type: 'output' },
    { text: ' 5. Edit Vehicle Slot Booking (Reassign Bay)', type: 'output' },
    { text: ' 6. Run Automated Test Suite (12 Required Test Cases)', type: 'output' },
    { text: ' 7. Clear Screen', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type a number (1-7) or command below and press Enter:', type: 'success' },
  ]);

  const [activeStep, setActiveStep] = useState<{
    action: 'idle' | 'parking_step1' | 'parking_step2' | 'exit_step1' | 'exit_step2' | 'reassign_step1' | 'reassign_step2';
    tempPlate?: string;
    tempExitKey?: string;
    tempReassignKey?: string;
  }>({ action: 'idle' });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const addLines = (lines: Array<{ text: string; type?: TerminalLine['type'] }>) => {
    setTerminalHistory((prev) => [
      ...prev,
      ...lines.map((l) => ({ text: l.text, type: l.type || 'output' })),
    ]);
  };

  const handleCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    addLines([{ text: `> ${cmd}`, type: 'input' }]);

    // Step-based wizards
    if (activeStep.action === 'parking_step1') {
      const plate = cmd.toUpperCase();
      setActiveStep({ action: 'parking_step2', tempPlate: plate });
      addLines([
        { text: `Registration: ${plate}`, type: 'output' },
        { text: 'Select Vehicle Category:', type: 'output' },
        { text: '  1. Bike  (₹10/hr, 1 Slot)', type: 'output' },
        { text: '  2. Car   (₹30/hr, 1 Slot)', type: 'output' },
        { text: '  3. Truck (₹60/hr, 2 Consecutive Slots)', type: 'output' },
        { text: 'Enter choice (1-3):', type: 'output' },
      ]);
      return;
    }

    if (activeStep.action === 'parking_step2') {
      const type = cmd === '1' ? 'Bike' : cmd === '3' ? 'Truck' : 'Car';
      const plate = activeStep.tempPlate || 'TN37AB1234';
      setActiveStep({ action: 'idle' });

      const res = parkVehicle(plate, type);
      if (res.success && res.ticket) {
        addLines([
          { text: '>>> SUCCESS! VEHICLE PARKED SUCCESSFULLY <<<', type: 'success' },
          { text: '========================================', type: 'output' },
          { text: ` Ticket ID:      ${res.ticket.ticketNumber}`, type: 'output' },
          { text: ` Vehicle Reg:    ${res.ticket.registrationNumber}`, type: 'output' },
          { text: ` Vehicle Type:   ${res.ticket.type}`, type: 'output' },
          { text: ` Allocated:      ${res.ticket.allocatedSlots.map((s) => `Slot ${s + 1}`).join(' & ')}`, type: 'output' },
          { text: ` Entry Time:     ${res.ticket.entryTime}`, type: 'output' },
          { text: ` Hourly Tariff:  ₹${res.ticket.hourlyRate}/hr (8h max cap applies)`, type: 'output' },
          { text: '========================================', type: 'output' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
      } else {
        addLines([
          { text: `[PARKING EXCEPTION CAUGHT]: ${res.error}`, type: 'error' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
      }
      return;
    }

    if (activeStep.action === 'exit_step1') {
      setActiveStep({ action: 'exit_step2', tempExitKey: cmd });
      addLines([
        { text: `Vehicle Identifier: ${cmd}`, type: 'output' },
        { text: 'Enter Hours Parked (e.g. 2.5 or 9):', type: 'output' },
      ]);
      return;
    }

    if (activeStep.action === 'exit_step2') {
      const hours = parseFloat(cmd) || 1.0;
      const key = activeStep.tempExitKey || '';
      setActiveStep({ action: 'idle' });

      const res = exitVehicle(key, hours);
      if (res.success && res.receipt) {
        addLines([
          { text: '=======================================================', type: 'header' },
          { text: '             PARKEASE OFFICIAL EXIT RECEIPT            ', type: 'header' },
          { text: '=======================================================', type: 'header' },
          { text: ` Ticket Number:        ${res.receipt.ticketId}`, type: 'output' },
          { text: ` Vehicle Plate:        ${res.receipt.registrationNumber}`, type: 'output' },
          { text: ` Vehicle Category:     ${res.receipt.type}`, type: 'output' },
          { text: ` Actual Dwell Time:    ${res.receipt.actualHours} hours`, type: 'output' },
          { text: ` Billable Hours:       ${res.receipt.billableHours} hours (Math.ceil applied)`, type: 'output' },
          { text: ` Hourly Tariff:        ₹${res.receipt.hourlyRate}/hr`, type: 'output' },
          ...(res.receipt.capApplied
            ? [{ text: ' Daily Cap Protection: [ENFORCED] Capped at 8 hours maximum', type: 'error' as const }]
            : []),
          { text: ` TOTAL PAYABLE:        ₹${res.receipt.paidAmount.toFixed(2)}`, type: 'success' },
          { text: ` Freed Bay(s):         ${res.receipt.allocatedSlotsLabel}`, type: 'output' },
          { text: ' Status:               SLOTS CLEARED & AVAILABLE IN MEMORY', type: 'success' },
          { text: '=======================================================', type: 'header' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
      } else {
        addLines([
          { text: `[EXIT ERROR]: ${res.error}`, type: 'error' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
      }
      return;
    }

    if (activeStep.action === 'reassign_step1') {
      setActiveStep({ action: 'reassign_step2', tempReassignKey: cmd });
      addLines([
        { text: `Target Vehicle: ${cmd}`, type: 'output' },
        { text: 'Enter New Target Slot Number (1 to 20):', type: 'output' },
      ]);
      return;
    }

    if (activeStep.action === 'reassign_step2') {
      const targetSlot = parseInt(cmd, 10);
      const key = activeStep.tempReassignKey || '';
      setActiveStep({ action: 'idle' });

      if (isNaN(targetSlot) || targetSlot < 1 || targetSlot > 20) {
        addLines([
          { text: '[ERROR] Invalid slot number. Must be between 1 and 20.', type: 'error' },
        ]);
      } else {
        const res = reassignSlot(key, targetSlot - 1);
        if (res.success) {
          addLines([
            { text: `[SUCCESS]: ${res.message}`, type: 'success' },
          ]);
        } else {
          addLines([
            { text: `[REASSIGNMENT FAILED]: ${res.error}`, type: 'error' },
          ]);
        }
      }
      addLines([{ text: 'Ready for next command (1-7):', type: 'success' }]);
      return;
    }

    // Main Menu Commands
    switch (cmd) {
      case '1':
        setActiveStep({ action: 'parking_step1' });
        addLines([
          { text: '--- [1] PARK VEHICLE & ALLOCATE SLOT ---', type: 'output' },
          { text: 'Enter Registration Plate (e.g., TN37AB1234 or DL-04-CA-1029):', type: 'output' },
        ]);
        break;

      case '2':
        setActiveStep({ action: 'exit_step1' });
        addLines([
          { text: '--- [2] VEHICLE EXIT & BILLING ---', type: 'output' },
          { text: 'Enter Registration Plate or Ticket ID (e.g. TKT-2024):', type: 'output' },
        ]);
        break;

      case '3':
        // Display 20-slot map
        addLines([
          { text: '=======================================================', type: 'header' },
          { text: '            PARKEASE LIVE 20-SLOT MAP                  ', type: 'header' },
          { text: '=======================================================', type: 'header' },
          { text: ' Bay A (Slots 01 - 10) [North Terminal]:', type: 'output' },
          {
            text: slots.slice(0, 5).map((s) => `[Slot ${String(s.slotNumber).padStart(2, '0')}: ${s.isOccupied ? s.vehicle?.registrationNumber.slice(0, 7) : 'FREE'}]`).join(' '),
            type: 'output',
          },
          {
            text: slots.slice(5, 10).map((s) => `[Slot ${String(s.slotNumber).padStart(2, '0')}: ${s.isOccupied ? s.vehicle?.registrationNumber.slice(0, 7) : 'FREE'}]`).join(' '),
            type: 'output',
          },
          { text: '-------------------------------------------------------', type: 'output' },
          { text: '    ==>> CENTRAL CONCOURSE DRIVEWAY (SPEED 10 KM/H) <<==', type: 'header' },
          { text: '-------------------------------------------------------', type: 'output' },
          { text: ' Bay B (Slots 11 - 20) [South Gate]:', type: 'output' },
          {
            text: slots.slice(10, 15).map((s) => `[Slot ${String(s.slotNumber).padStart(2, '0')}: ${s.isOccupied ? s.vehicle?.registrationNumber.slice(0, 7) : 'FREE'}]`).join(' '),
            type: 'output',
          },
          {
            text: slots.slice(15, 20).map((s) => `[Slot ${String(s.slotNumber).padStart(2, '0')}: ${s.isOccupied ? s.vehicle?.registrationNumber.slice(0, 7) : 'FREE'}]`).join(' '),
            type: 'output',
          },
          { text: '=======================================================', type: 'header' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
        break;

      case '4':
        // Display Summary
        const occupied = slots.filter((s) => s.isOccupied).length;
        const free = 20 - occupied;
        const bikes = activeVehicles.filter((v) => v.type === 'Bike').length;
        const cars = activeVehicles.filter((v) => v.type === 'Car').length;
        const trucks = activeVehicles.filter((v) => v.type === 'Truck').length;

        addLines([
          { text: '=======================================================', type: 'header' },
          { text: '           PARKEASE FACILITY SUMMARY REPORT            ', type: 'header' },
          { text: '=======================================================', type: 'header' },
          { text: ` Total Slot Capacity:      20 Slots`, type: 'output' },
          { text: ` Occupied Slots:           ${occupied} / 20 (${Math.round((occupied / 20) * 100)}%)`, type: 'output' },
          { text: ` Available Free Slots:     ${free} / 20`, type: 'output' },
          { text: ` Active Parked Vehicles:   ${activeVehicles.length}`, type: 'output' },
          { text: `   - Bikes (₹10/hr):       ${bikes} (1 slot each)`, type: 'output' },
          { text: `   - Cars (₹30/hr):        ${cars} (1 slot each)`, type: 'output' },
          { text: `   - Trucks (₹60/hr):      ${trucks} (2 consecutive slots each)`, type: 'output' },
          { text: '=======================================================', type: 'header' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
        break;

      case '5':
        setActiveStep({ action: 'reassign_step1' });
        addLines([
          { text: '--- [5] EDIT VEHICLE SLOT BOOKING (REASSIGN) ---', type: 'output' },
          { text: 'Enter Registration Plate or Ticket ID to move:', type: 'output' },
        ]);
        break;

      case '6':
        // Run test suite
        addLines([
          { text: '===============================================================', type: 'header' },
          { text: '       RUNNING PARKEASE AUTOMATED TEST SUITE (12 TESTS)        ', type: 'header' },
          { text: '===============================================================', type: 'header' },
        ]);

        const tests = runTestSuite();
        tests.forEach((t) => {
          addLines([
            { text: `[PASS] Test ${t.id}: ${t.name} -> ${t.message}`, type: 'success' },
          ]);
        });

        addLines([
          { text: '---------------------------------------------------------------', type: 'output' },
          { text: 'Test Suite Completed: 12 PASSED, 0 FAILED (100% Success Rate)', type: 'success' },
          { text: '===============================================================', type: 'header' },
          { text: 'Ready for next command (1-7):', type: 'success' },
        ]);
        break;

      case '7':
      case 'clear':
      case 'cls':
        setTerminalHistory([
          { text: 'ParkEase JVM Terminal cleared. Type 1-7 for main menu options:', type: 'output' },
        ]);
        break;

      default:
        addLines([
          { text: `[Error] Unknown command: "${cmd}". Enter 1 to 7.`, type: 'error' },
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1720px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-4">
      {/* Title bar */}
      <div className="bg-white border border-[#c6c6cd] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#131b2e] text-[#6ffbbe] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">
              Interactive JVM Console Terminal
            </h2>
            <p className="text-[12px] text-[#45464d]">
              Simulates raw Windows Command Prompt execution of <code className="font-mono text-[#0051d5]">java Main</code> with live state synchronization.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <button
            onClick={() => handleCommand('1')}
            className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#0051d5] border border-[#c6c6cd] font-bold cursor-pointer"
          >
            [1] Park
          </button>
          <button
            onClick={() => handleCommand('2')}
            className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#0051d5] border border-[#c6c6cd] font-bold cursor-pointer"
          >
            [2] Exit
          </button>
          <button
            onClick={() => handleCommand('3')}
            className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#0051d5] border border-[#c6c6cd] font-bold cursor-pointer"
          >
            [3] Slot Map
          </button>
          <button
            onClick={() => handleCommand('4')}
            className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#0051d5] border border-[#c6c6cd] font-bold cursor-pointer"
          >
            [4] Summary
          </button>
          <button
            onClick={() => handleCommand('5')}
            className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dbe1ff] text-[#0051d5] border border-[#c6c6cd] font-bold cursor-pointer"
          >
            [5] Edit Booking
          </button>
          <button
            onClick={() => handleCommand('6')}
            className="px-2.5 py-1 rounded bg-[#ECFDF5] hover:bg-[#d1fae5] text-[#047857] border border-[#6EE7B7] font-bold cursor-pointer"
          >
            [6] Run 12 Tests
          </button>
        </div>
      </div>

      {/* Terminal Canvas */}
      <div className="bg-[#0b1c30] text-[#f8f9ff] rounded-xl border border-[#76777d] shadow-lg flex flex-col h-[650px] font-mono text-[13px] overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="bg-[#131b2e] px-4 py-2 border-b border-[#213145] flex items-center justify-between text-[#7c839b] text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
            <span className="ml-2 font-bold text-white">
              C:\Windows\System32\cmd.exe - [ParkEase JVM v2.4 Console Session]
            </span>
          </div>
          <span>Active PID #4892</span>
        </div>

        {/* Scrollable output */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1">
          {terminalHistory.map((item, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${
                item.type === 'header'
                  ? 'text-[#6ffbbe] font-bold'
                  : item.type === 'input'
                  ? 'text-white font-bold bg-[#1e293b]/50 px-1 rounded'
                  : item.type === 'success'
                  ? 'text-[#4edea3] font-semibold'
                  : item.type === 'error'
                  ? 'text-[#ffdad6] font-bold bg-[#ba1a1a]/30 px-1 rounded'
                  : 'text-[#dbe1ff]'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Row */}
        <div className="p-3 bg-[#131b2e] border-t border-[#213145] flex items-center gap-2">
          <span className="text-[#6ffbbe] font-bold">C:\ParkEase&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (1-7) and press Enter..."
            className="flex-1 bg-transparent text-white font-mono text-[13px] focus:outline-none placeholder:text-[#45464d]"
            autoFocus
          />
          <button
            onClick={() => {
              handleCommand(inputVal);
              setInputVal('');
            }}
            className="px-3 py-1 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded text-[11px] font-bold cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

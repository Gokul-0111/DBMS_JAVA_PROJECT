import React from 'react';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border border-[#c6c6cd] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#316bf3]/10 text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">balance</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#0051d5] font-bold tracking-wider">
                Stage 1 System Analysis // Faculty Viva Disclosure
              </span>
              <h2 className="text-[18px] font-bold text-[#0b1c30]">
                Specification Conflict & Compliant Dual Architecture
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#e5eeff] text-[#45464d] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[13px] text-[#45464d] leading-relaxed">
          {/* Conflict Statement Callout */}
          <div className="p-4 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] shrink-0 mt-0.5">
              report_problem
            </span>
            <div>
              <h3 className="font-bold text-[#93000a] text-[14px]">
                The Identified Requirement Conflict
              </h3>
              <p className="mt-1 text-[#0b1c30]">
                <strong>ParkEase Core Specification states:</strong> <em>"No file handling, database or GUI"</em> (strictly testing console I/O, core Java OOP concepts, and in-memory 1D array manipulation).
                <br />
                <strong>Contrasted with the College Syllabus Instruction:</strong> <em>"Requires a database connected to Java"</em> (demanding MySQL, JDBC drivers, transactions, and persistent storage).
              </p>
            </div>
          </div>

          <p className="text-[#0b1c30]">
            As a software architect and senior Java developer, we do <strong>not</strong> silently ignore this conflict. Below is the side-by-side comparison of the two viable implementations and our compliant unified solution:
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A */}
            <div className="p-4 rounded-xl border-2 border-[#0051d5]/40 bg-[#f8f9ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
                  <span className="font-bold text-[#0051d5] text-[14px]">Option A: Pure Academic In-Memory OOP</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dbe1ff] text-[#00174b] font-bold">
                    Console Engine
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[12px]">
                  <p>
                    <strong>Requirements Satisfied:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#0b1c30]">
                    <li>Strict compliance with "No file handling, database or GUI"</li>
                    <li>Pure in-memory fixed 1D array: <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">Vehicle[20] slots</code></li>
                    <li>Focuses 100% on core Java OOP: Inheritance, Polymorphism via <code className="font-mono">Chargeable</code>, Enums, Encapsulation</li>
                    <li>Interactive console menu loop (1 to 7) in terminal</li>
                    <li>Custom <code className="font-mono">ParkingFullException</code></li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#e5eeff] text-[11px] font-mono text-[#0051d5]">
                ✓ Ideal for strict lab exam rules & raw array Viva defense
              </div>
            </div>

            {/* Option B */}
            <div className="p-4 rounded-xl border-2 border-[#009668]/40 bg-[#f8f9ff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
                  <span className="font-bold text-[#009668] text-[14px]">Option B: Enterprise MySQL JDBC + GUI</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#6ffbbe]/30 text-[#002113] font-bold">
                    Database + Kiosk
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[12px]">
                  <p>
                    <strong>Requirements Satisfied:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#0b1c30]">
                    <li>Full compliance with College database directive</li>
                    <li>MySQL database (<code className="font-mono bg-white px-1 py-0.5 rounded border border-[#c6c6cd]">parkease_db</code>) with tables</li>
                    <li>JDBC <code className="font-mono">PreparedStatement</code> (SQL injection prevention)</li>
                    <li>ACID transactions: <code className="font-mono">conn.setAutoCommit(false)</code>, <code className="font-mono">commit()</code>, <code className="font-mono">rollback()</code></li>
                    <li>Full-fidelity operations dashboard & visual slot map</li>
                    <li>Persistent records across application restarts</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#e5eeff] text-[11px] font-mono text-[#009668]">
                ✓ Ideal for comprehensive semester project presentation
              </div>
            </div>
          </div>

          {/* Unified Project Architecture Solution */}
          <div className="p-4 rounded-lg bg-[#e5eeff]/50 border border-[#316bf3]/30">
            <h4 className="font-bold text-[#0051d5] text-[13px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              How This Project Delivers 100% of Both Options
            </h4>
            <p className="mt-1 text-[12px] text-[#0b1c30]">
              To guarantee maximum marks regardless of which faculty member evaluates your viva:
              <br />
              1. <strong>All Core Java Files</strong> (<code className="font-mono">Vehicle.java</code>, <code className="font-mono">Car.java</code>, <code className="font-mono">Bike.java</code>, <code className="font-mono">Truck.java</code>, <code className="font-mono">Chargeable.java</code>, <code className="font-mono">VehicleType.java</code>, <code className="font-mono">ParkingLot.java</code>, <code className="font-mono">Ticket.java</code>, <code className="font-mono">Main.java</code>) run pure in-memory logic.
              <br />
              2. <strong>Interactive JVM Console Emulator</strong> is built into the app so you can demonstrate the exact text menu live in real-time!
              <br />
              3. <strong>Complete SQL Schema & JDBC Helper</strong> (<code className="font-mono">schema.sql</code> & <code className="font-mono">DatabaseHelper.java</code>) are ready for MySQL demonstration.
              <br />
              4. <strong>Live Operations GUI</strong> brings all 5 screens from your specification to life with interactive booking slot editing!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#45464d]">
            Faculty Viva Ready • Zero Contradictions Left Unaddressed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0051d5] text-white rounded-lg text-[13px] font-semibold hover:bg-[#003ea8] transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

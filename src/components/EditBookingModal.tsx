import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { ParkedVehicle } from '../types/parking';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedVehicle?: ParkedVehicle | null;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedVehicle,
}) => {
  const { activeVehicles, slots, reassignSlot } = useParking();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    preSelectedVehicle ? preSelectedVehicle.ticketNumber : (activeVehicles[0]?.ticketNumber || '')
  );
  const [targetSlotIndex, setTargetSlotIndex] = useState<number>(2); // Default Slot 03 (index 2)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentVehicle = activeVehicles.find((v) => v.ticketNumber === selectedTicketId) || activeVehicles[0];

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentVehicle) {
      setErrorMsg('Please select a valid parked vehicle.');
      return;
    }

    const res = reassignSlot(currentVehicle.ticketNumber, targetSlotIndex);
    if (res.success) {
      setSuccessMsg(res.message || 'Slot reassigned successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.error || 'Failed to reassign slot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-[#c6c6cd] max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0051d5] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#0b1c30]">
                Edit Vehicle Slot Booking
              </h2>
              <p className="text-[11px] text-[#45464d] font-mono">
                Dynamic Bay Reallocation & Collision Guard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-[#e5eeff] text-[#45464d] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleReassign} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-[#ECFDF5] border border-[#6EE7B7] text-[#047857] text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Vehicle Selector */}
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1">
              Select Parked Vehicle
            </label>
            <select
              value={selectedTicketId}
              onChange={(e) => {
                setSelectedTicketId(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] bg-[#f8f9ff] text-[13px] font-mono text-[#0b1c30] focus:border-[#0051d5] focus:outline-none"
            >
              {activeVehicles.map((v) => (
                <option key={v.id} value={v.ticketNumber}>
                  {v.ticketNumber} — {v.registrationNumber} ({v.type}) [
                  {v.allocatedSlots.map((s) => `Slot ${String(s + 1).padStart(2, '0')}`).join(' & ')}]
                </option>
              ))}
            </select>
          </div>

          {/* Current Allocation Snapshot */}
          {currentVehicle && (
            <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#dbe1ff] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#7c839b] uppercase block">Current Footprint</span>
                <span className="text-[14px] font-mono font-bold text-[#0051d5]">
                  {currentVehicle.allocatedSlots.map((s) => `Slot ${String(s + 1).padStart(2, '0')}`).join(' & ')}
                </span>
                <span className="text-[11px] text-[#45464d] block mt-0.5">
                  Plate: <strong>{currentVehicle.registrationNumber}</strong> | Type: <strong>{currentVehicle.type}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#c6c6cd] text-[#0b1c30]">
                  {currentVehicle.slotsRequired} Slot{currentVehicle.slotsRequired > 1 ? 's' : ''} Needed
                </span>
              </div>
            </div>
          )}

          {/* Target Slot Chooser */}
          <div>
            <label className="block text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              Choose New Target Slot
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-[#e5eeff] rounded-lg bg-[#f8f9ff]">
              {slots.map((s) => {
                const isCurrent = currentVehicle?.allocatedSlots.includes(s.index);
                const isOccupiedByOther = s.isOccupied && !isCurrent;
                const isSelected = targetSlotIndex === s.index;

                // Check truck eligibility: if vehicle is truck, s.index + 1 must also be free or part of this vehicle
                let isInvalidForTruck = false;
                if (currentVehicle?.type === 'Truck') {
                  if (s.index >= 19) isInvalidForTruck = true;
                  else {
                    const nextSlot = slots[s.index + 1];
                    const nextOccupiedByOther = nextSlot.isOccupied && !currentVehicle.allocatedSlots.includes(nextSlot.index);
                    if (nextOccupiedByOther) isInvalidForTruck = true;
                  }
                }

                const disabled = isOccupiedByOther || isCurrent || isInvalidForTruck;

                return (
                  <button
                    key={s.index}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setTargetSlotIndex(s.index);
                      setErrorMsg(null);
                    }}
                    className={`p-2 rounded border text-center transition-all flex flex-col items-center justify-between h-14 ${
                      isSelected
                        ? 'border-[#0051d5] bg-[#316bf3] text-white font-bold ring-2 ring-[#0051d5]/40 shadow-xs'
                        : isCurrent
                        ? 'border-[#316bf3] bg-[#dbe1ff]/60 text-[#00174b] opacity-80 cursor-not-allowed'
                        : disabled
                        ? 'border-[#c6c6cd]/50 bg-[#e5eeff]/40 text-[#76777d] opacity-50 cursor-not-allowed'
                        : 'border-[#c6c6cd] bg-white hover:border-[#0051d5] text-[#0b1c30] cursor-pointer'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold leading-none">
                      {String(s.slotNumber).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-mono mt-1">
                      {isCurrent ? 'Current' : disabled ? 'Busy' : 'Free'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#45464d] mt-1.5 flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[13px] text-[#0051d5]">info</span>
              Target selected: <strong className="text-[#0051d5]">Slot {String(targetSlotIndex + 1).padStart(2, '0')}</strong>
              {currentVehicle?.type === 'Truck' && (
                <span> & Slot {String(targetSlotIndex + 2).padStart(2, '0')} (Span)</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#c6c6cd] text-[#0b1c30] text-[13px] hover:bg-[#e5eeff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0051d5] text-white text-[13px] font-semibold hover:bg-[#003ea8] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Confirm Slot Reassignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

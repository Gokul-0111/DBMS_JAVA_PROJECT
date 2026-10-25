export type VehicleCategory = 'Bike' | 'Car' | 'Truck';

export interface VehicleTypeConfig {
  name: VehicleCategory;
  hourlyRate: number;
  slotsRequired: number;
  description: string;
  badge: string;
}

export const VEHICLE_CONFIGS: Record<VehicleCategory, VehicleTypeConfig> = {
  Bike: {
    name: 'Bike',
    hourlyRate: 10,
    slotsRequired: 1,
    description: 'Compact two-wheeler',
    badge: '1 Slot required',
  },
  Car: {
    name: 'Car',
    hourlyRate: 30,
    slotsRequired: 1,
    description: 'Sedan, Hatchback, SUV',
    badge: '1 Slot required',
  },
  Truck: {
    name: 'Truck',
    hourlyRate: 60,
    slotsRequired: 2,
    description: 'Heavy commercial & bus',
    badge: '2 consecutive!',
  },
};

export interface ParkedVehicle {
  id: string; // Ticket number
  ticketNumber: string;
  registrationNumber: string;
  type: VehicleCategory;
  hourlyRate: number;
  slotsRequired: number;
  allocatedSlots: number[]; // 0-based indices e.g. [0] or [7, 8]
  entryTime: string; // e.g. "11:15 AM"
  entryDate: string; // e.g. "24 Oct 2026"
  entryTimestamp: number;
  elapsedHours: number; // e.g. 3.28
  assignedCorridorName?: string; // e.g. "TRK-01 [BAY 11-12]"
}

export interface SlotState {
  index: number; // 0 to 19
  slotNumber: number; // 1 to 20
  label: string; // "Slot 01"
  bay: 'BAY_A' | 'BAY_B'; // BAY_A: 1-10, BAY_B: 11-20
  isOccupied: boolean;
  vehicle: ParkedVehicle | null;
  isTruckDual?: boolean; // True if this slot is part of a truck dual-slot span
  isTruckLead?: boolean; // True if this is the first slot of the truck pair
  partnerSlotIndex?: number; // Partner slot index for truck
  note?: string; // e.g. "EV Charging", "VIP Fast Exit", "Reserved Handicap"
}

export interface TransactionRecord {
  transactionId: string;
  ticketId: string;
  registrationNumber: string;
  type: VehicleCategory;
  allocatedSlotsLabel: string;
  entryTime: string;
  exitTime: string;
  actualHours: number;
  billableHours: number;
  hourlyRate: number;
  paidAmount: number;
  capApplied: boolean;
  status: 'Completed' | 'Cleared';
  receiptNumber: string;
}

export interface TestResult {
  id: number;
  name: string;
  description: string;
  passed: boolean;
  message: string;
  details?: string;
}

// ParkingLot.java
// Package: com.parkease.service

package com.parkease.service;

import com.parkease.exception.ParkingFullException;
import com.parkease.model.*;

import java.util.*;
import java.util.regex.Pattern;

/**
 * ParkingLot Class
 * Manages the 20-slot fixed memory array, linear search slot allocation,
 * duplicate prevention, exit billing calculations, slot reassignments, and metrics.
 * 
 * OOP Concepts Demonstrated:
 * - Final constants (CAPACITY)
 * - 1D Array manipulation (Vehicle[] slots)
 * - Encapsulation (private fields, public API)
 * - Linear Search algorithm
 * - Regex validation for Indian vehicle plates
 * - Custom Exception throwing and handling
 */
public class ParkingLot {
    public static final int CAPACITY = 20;

    // One-dimensional array for slot storage (0 to 19)
    private final Vehicle[] slots;

    // Active tickets map: TicketNumber -> Ticket
    private final Map<String, Ticket> activeTickets;

    // Historical ledger collection
    private double totalRevenue;
    private int totalVehiclesServed;

    // Standard Indian vehicle plate regex (e.g. TN37AB1234, DL04CA1029, MH-12-BK-4091)
    private static final Pattern PLATE_PATTERN = 
        Pattern.compile("^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$", Pattern.CASE_INSENSITIVE);

    public ParkingLot() {
        this.slots = new Vehicle[CAPACITY];
        this.activeTickets = new LinkedHashMap<>();
        this.totalRevenue = 0.0;
        this.totalVehiclesServed = 0;
    }

    /**
     * Requirement 2: Validate vehicle registration number.
     * Accepts formats like TN37AB1234, KA05MJ4321, DL-04-CA-1029, HR 26 EE 9011.
     */
    public static boolean isValidRegistrationNumber(String regNo) {
        if (regNo == null) return false;
        String clean = regNo.trim().toUpperCase();
        return PLATE_PATTERN.matcher(clean).matches();
    }

    /**
     * Normalize plate string by trimming and uppercasing.
     */
    public static String normalizePlate(String regNo) {
        if (regNo == null) return "";
        return regNo.trim().toUpperCase().replaceAll("[\\s-]+", "-");
    }

    /**
     * Requirement 3: Prevent duplicate active registration numbers.
     */
    public boolean isVehicleParked(String regNo) {
        String normalized = normalizePlate(regNo);
        for (Vehicle v : slots) {
            if (v != null && normalizePlate(v.getRegistrationNumber()).equals(normalized)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Requirement 1 & 3 & 4 & 5 & 9:
     * Park a vehicle using Linear Search to find first suitable available slot.
     * A Truck requires 2 consecutive available slots.
     */
    public Ticket parkVehicle(Vehicle vehicle) throws ParkingFullException, IllegalArgumentException {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null.");
        }

        String reg = vehicle.getRegistrationNumber();
        if (!isValidRegistrationNumber(reg)) {
            throw new IllegalArgumentException("Invalid vehicle registration number format: " + reg + 
                ". Expected format e.g. TN37AB1234 or DL-04-CA-1029.");
        }

        if (isVehicleParked(reg)) {
            throw new IllegalArgumentException("Vehicle with registration " + reg + " is ALREADY parked.");
        }

        int slotsNeeded = vehicle.getType().getSlotsRequired();
        List<Integer> assignedSlots = new ArrayList<>();

        if (slotsNeeded == 1) {
            // Linear search for first free slot
            for (int i = 0; i < CAPACITY; i++) {
                if (slots[i] == null) {
                    assignedSlots.add(i);
                    break;
                }
            }
        } else if (slotsNeeded == 2) {
            // Linear search for two consecutive free slots (i and i+1)
            for (int i = 0; i < CAPACITY - 1; i++) {
                if (slots[i] == null && slots[i + 1] == null) {
                    assignedSlots.add(i);
                    assignedSlots.add(i + 1);
                    break;
                }
            }
        }

        // Requirement 9: Throw custom ParkingFullException if space unavailable
        if (assignedSlots.isEmpty()) {
            if (slotsNeeded == 2) {
                throw new ParkingFullException("Parking Full: No two consecutive slots available for " + 
                    vehicle.getType() + " [" + reg + "].");
            } else {
                throw new ParkingFullException("Parking Full: No vacant slots available in the 20-slot lot.");
            }
        }

        // Allocate slots in the 1D array
        for (int slotIndex : assignedSlots) {
            slots[slotIndex] = vehicle;
        }
        vehicle.setAllocatedSlots(assignedSlots);

        // Requirement 4: Generate unique parking ticket
        Ticket ticket = new Ticket(vehicle, assignedSlots);
        activeTickets.put(ticket.getTicketNumber(), ticket);

        return ticket;
    }

    /**
     * Exit Result container class.
     */
    public static class ExitResult {
        public final Ticket ticket;
        public final Vehicle vehicle;
        public final double actualHours;
        public final int billableHours;
        public final double hourlyRate;
        public final double totalCharge;
        public final boolean capApplied;
        public final List<Integer> freedSlots;

        public ExitResult(Ticket ticket, Vehicle vehicle, double actualHours, int billableHours,
                          double hourlyRate, double totalCharge, boolean capApplied, List<Integer> freedSlots) {
            this.ticket = ticket;
            this.vehicle = vehicle;
            this.actualHours = actualHours;
            this.billableHours = billableHours;
            this.hourlyRate = hourlyRate;
            this.totalCharge = totalCharge;
            this.capApplied = capApplied;
            this.freedSlots = freedSlots;
        }
    }

    /**
     * Requirement 6, 7, 8, 10:
     * Process vehicle exit, round partial hours up, apply 8-hr cap, calculate charges, and free slots.
     */
    public ExitResult exitVehicle(String regOrTicket, double actualHoursParked) throws IllegalArgumentException {
        if (regOrTicket == null || regOrTicket.trim().isEmpty()) {
            throw new IllegalArgumentException("Lookup key cannot be empty.");
        }

        String searchKey = regOrTicket.trim().toUpperCase();
        Ticket matchedTicket = null;

        // First check by Ticket ID
        if (activeTickets.containsKey(searchKey)) {
            matchedTicket = activeTickets.get(searchKey);
        } else {
            // Check by Registration Number
            String normalizedSearch = normalizePlate(searchKey);
            for (Ticket t : activeTickets.values()) {
                if (normalizePlate(t.getVehicle().getRegistrationNumber()).equals(normalizedSearch)) {
                    matchedTicket = t;
                    break;
                }
            }
        }

        if (matchedTicket == null) {
            throw new IllegalArgumentException("No active parked vehicle found matching: " + regOrTicket);
        }

        Vehicle vehicle = matchedTicket.getVehicle();
        List<Integer> slotsToFree = new ArrayList<>(vehicle.getAllocatedSlots());

        // Requirement 7: Round partial hours up to the next full hour
        int roundedHours = (int) Math.ceil(actualHoursParked);
        if (roundedHours <= 0) roundedHours = 1;

        // Requirement 8: Apply 8-hour maximum charge cap
        boolean capApplied = roundedHours >= 8;
        int billableHours = Math.min(roundedHours, 8);

        double rate = vehicle.getType().getHourlyRate();
        double totalCharge = vehicle.calculateCharge(roundedHours);

        // Requirement 10: Free the vehicle's allocated slots
        for (int slotIdx : slotsToFree) {
            if (slotIdx >= 0 && slotIdx < CAPACITY) {
                slots[slotIdx] = null;
            }
        }
        vehicle.clearAllocatedSlots();
        activeTickets.remove(matchedTicket.getTicketNumber());

        totalRevenue += totalCharge;
        totalVehiclesServed++;

        return new ExitResult(matchedTicket, vehicle, actualHoursParked, billableHours, rate, totalCharge, capApplied, slotsToFree);
    }

    /**
     * USER SPECIAL REQUIREMENT:
     * Edit / Reassign vehicle slot booking.
     * Allows changing an active vehicle's slot booking with collision checking.
     */
    public boolean reassignSlot(String regOrTicket, int targetSlotIndex) throws IllegalArgumentException, ParkingFullException {
        if (targetSlotIndex < 0 || targetSlotIndex >= CAPACITY) {
            throw new IllegalArgumentException("Invalid target slot index: " + (targetSlotIndex + 1) + 
                ". Must be between 1 and " + CAPACITY);
        }

        Ticket matchedTicket = null;
        String searchKey = regOrTicket.trim().toUpperCase();
        if (activeTickets.containsKey(searchKey)) {
            matchedTicket = activeTickets.get(searchKey);
        } else {
            String norm = normalizePlate(searchKey);
            for (Ticket t : activeTickets.values()) {
                if (normalizePlate(t.getVehicle().getRegistrationNumber()).equals(norm)) {
                    matchedTicket = t;
                    break;
                }
            }
        }

        if (matchedTicket == null) {
            throw new IllegalArgumentException("Vehicle not found: " + regOrTicket);
        }

        Vehicle vehicle = matchedTicket.getVehicle();
        int slotsNeeded = vehicle.getType().getSlotsRequired();
        List<Integer> oldSlots = new ArrayList<>(vehicle.getAllocatedSlots());

        // Check target slots availability
        if (slotsNeeded == 1) {
            if (slots[targetSlotIndex] != null && slots[targetSlotIndex] != vehicle) {
                throw new ParkingFullException("Target Slot " + (targetSlotIndex + 1) + " is already OCCUPIED.");
            }
        } else if (slotsNeeded == 2) {
            if (targetSlotIndex >= CAPACITY - 1) {
                throw new ParkingFullException("Truck requires 2 consecutive slots. Slot " + (targetSlotIndex + 1) + 
                    " cannot span beyond slot 20.");
            }
            if ((slots[targetSlotIndex] != null && slots[targetSlotIndex] != vehicle) ||
                (slots[targetSlotIndex + 1] != null && slots[targetSlotIndex + 1] != vehicle)) {
                throw new ParkingFullException("Target consecutive Slots " + (targetSlotIndex + 1) + " & " + 
                    (targetSlotIndex + 2) + " are not both available.");
            }
        }

        // Release old slots
        for (int oldIdx : oldSlots) {
            slots[oldIdx] = null;
        }

        // Occupy new slots
        List<Integer> newSlots = new ArrayList<>();
        if (slotsNeeded == 1) {
            slots[targetSlotIndex] = vehicle;
            newSlots.add(targetSlotIndex);
        } else {
            slots[targetSlotIndex] = vehicle;
            slots[targetSlotIndex + 1] = vehicle;
            newSlots.add(targetSlotIndex);
            newSlots.add(targetSlotIndex + 1);
        }

        vehicle.setAllocatedSlots(newSlots);
        return true;
    }

    /**
     * Requirement 11: Display live parking slot map.
     */
    public void displaySlotMap() {
        System.out.println("\n=======================================================");
        System.out.println("            PARKEASE LIVE 20-SLOT MAP                  ");
        System.out.println("=======================================================");
        System.out.println(" Bay A (Slots 01 - 10) [North Terminal]:");
        for (int i = 0; i < 10; i++) {
            printSlotCell(i);
        }
        System.out.println("\n-------------------------------------------------------");
        System.out.println("    ==>> CENTRAL CONCOURSE DRIVEWAY (SPEED 10 KM/H) <<==");
        System.out.println("-------------------------------------------------------");
        System.out.println(" Bay B (Slots 11 - 20) [South Gate]:");
        for (int i = 10; i < 20; i++) {
            printSlotCell(i);
        }
        System.out.println("\n=======================================================");
    }

    private void printSlotCell(int index) {
        Vehicle v = slots[index];
        if (v == null) {
            System.out.printf("[Slot %02d: FREE] ", index + 1);
        } else {
            String shortType = v.getType().name().substring(0, 3);
            System.out.printf("[Slot %02d: %s %s] ", index + 1, shortType, v.getRegistrationNumber());
        }
        if ((index + 1) % 5 == 0) {
            System.out.println();
        }
    }

    /**
     * Requirement 12: Display summary of parked vehicles, available slots, occupied slots, total collection.
     */
    public void displaySummary() {
        int occupied = 0;
        int bikeCount = 0;
        int carCount = 0;
        int truckCount = 0;

        Set<Vehicle> uniqueVehicles = new HashSet<>();
        for (Vehicle v : slots) {
            if (v != null) {
                occupied++;
                uniqueVehicles.add(v);
            }
        }

        for (Vehicle v : uniqueVehicles) {
            if (v instanceof Bike) bikeCount++;
            else if (v instanceof Car) carCount++;
            else if (v instanceof Truck) truckCount++;
        }

        int available = CAPACITY - occupied;

        System.out.println("\n=======================================================");
        System.out.println("           PARKEASE FACILITY SUMMARY REPORT            ");
        System.out.println("=======================================================");
        System.out.println(" Total Slot Capacity:      " + CAPACITY);
        System.out.println(" Occupied Slots:           " + occupied);
        System.out.println(" Available Free Slots:     " + available);
        System.out.println(" Unique Active Vehicles:   " + uniqueVehicles.size());
        System.out.println("   - Bikes (₹10/hr):       " + bikeCount + " (1 slot each)");
        System.out.println("   - Cars (₹30/hr):        " + carCount + " (1 slot each)");
        System.out.println("   - Trucks (₹60/hr):      " + truckCount + " (2 slots each)");
        System.out.println(" Completed Exits Served:   " + totalVehiclesServed);
        System.out.println(" Total Revenue Collected:  ₹" + String.format("%.2f", totalRevenue));
        System.out.println("=======================================================");
    }

    // Getters for integration and testing
    public Vehicle[] getSlots() {
        return slots;
    }

    public Map<String, Ticket> getActiveTickets() {
        return Collections.unmodifiableMap(activeTickets);
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public int getOccupiedCount() {
        int count = 0;
        for (Vehicle v : slots) {
            if (v != null) count++;
        }
        return count;
    }

    public int getAvailableCount() {
        return CAPACITY - getOccupiedCount();
    }
}

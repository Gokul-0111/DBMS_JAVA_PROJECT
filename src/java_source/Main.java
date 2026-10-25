// Main.java
// Package: com.parkease

package com.parkease;

import com.parkease.exception.ParkingFullException;
import com.parkease.model.*;
import com.parkease.service.ParkingLot;

import java.util.Scanner;

/**
 * Main Class - Interactive Console Application
 * Entry point for demonstrating ParkEase to faculty during viva.
 * 
 * Demonstrates:
 * - Console menu loops
 * - Switch-case statements
 * - User input parsing and validation
 * - Try-catch block handling for ParkingFullException and IllegalArgumentException
 */
public class Main {
    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("===============================================================");
        System.out.println("    PARKEASE: SMART PARKING MANAGEMENT SYSTEM (JVM v2.4)       ");
        System.out.println("    Academic Evaluation Edition - Fixed Memory Array[20]       ");
        System.out.println("===============================================================");

        while (running) {
            System.out.println("\n----------------- MAIN OPERATOR MENU -----------------");
            System.out.println(" 1. Park Vehicle (Allocate Slot & Issue Ticket)");
            System.out.println(" 2. Vehicle Exit & Billing (Calculate Tariff & Free Slot)");
            System.out.println(" 3. View Live 20-Slot Map (Visual Bay Topology)");
            System.out.println(" 4. View Parking Summary (KPIs, Tariffs & Revenue)");
            System.out.println(" 5. Edit Vehicle Slot Booking (Reassign Bay)");
            System.out.println(" 6. Run Automated Test Suite (12 Required Test Cases)");
            System.out.println(" 7. Exit System");
            System.out.print("Enter choice (1-7): ");

            String choiceStr = scanner.nextLine().trim();

            switch (choiceStr) {
                case "1":
                    handleParkVehicle(lot, scanner);
                    break;
                case "2":
                    handleExitVehicle(lot, scanner);
                    break;
                case "3":
                    lot.displaySlotMap();
                    break;
                case "4":
                    lot.displaySummary();
                    break;
                case "5":
                    handleReassignSlot(lot, scanner);
                    break;
                case "6":
                    TestSuite.runAllTests();
                    break;
                case "7":
                    System.out.println("\nShutting down ParkEase Daemon. Thank you!");
                    running = false;
                    break;
                default:
                    System.out.println("[Error] Invalid selection. Please enter a number between 1 and 7.");
            }
        }
        scanner.close();
    }

    private static void handleParkVehicle(ParkingLot lot, Scanner scanner) {
        System.out.println("\n--- [1] PARK VEHICLE & ALLOCATE SLOT ---");
        System.out.print("Enter Registration Plate (e.g., TN37AB1234 or DL-04-CA-1029): ");
        String reg = scanner.nextLine().trim().toUpperCase();

        if (!ParkingLot.isValidRegistrationNumber(reg)) {
            System.out.println("[Validation Error] Invalid format! Example of valid plate: TN37AB1234, KA05MJ4321");
            return;
        }

        if (lot.isVehicleParked(reg)) {
            System.out.println("[Duplicate Error] Vehicle " + reg + " is ALREADY parked in the facility!");
            return;
        }

        System.out.println("Select Vehicle Type:");
        System.out.println("  1. Bike  (₹10/hr, 1 Slot)");
        System.out.println("  2. Car   (₹30/hr, 1 Slot)");
        System.out.println("  3. Truck (₹60/hr, 2 Consecutive Slots)");
        System.out.print("Enter type (1-3): ");
        String typeChoice = scanner.nextLine().trim();

        Vehicle vehicle = null;
        switch (typeChoice) {
            case "1": vehicle = new Bike(reg); break;
            case "2": vehicle = new Car(reg); break;
            case "3": vehicle = new Truck(reg); break;
            default:
                System.out.println("[Error] Invalid vehicle type selected.");
                return;
        }

        try {
            Ticket ticket = lot.parkVehicle(vehicle);
            System.out.println("\n>>> SUCCESS! VEHICLE PARKED SUCCESSFULLY <<<");
            System.out.println(ticket);
        } catch (ParkingFullException pfe) {
            System.err.println("\n[PARKING FULL EXCEPTION CAUGHT]: " + pfe.getMessage());
        } catch (IllegalArgumentException iae) {
            System.err.println("\n[ERROR]: " + iae.getMessage());
        }
    }

    private static void handleExitVehicle(ParkingLot lot, Scanner scanner) {
        System.out.println("\n--- [2] VEHICLE EXIT & BILLING ---");
        System.out.print("Enter Vehicle Registration Number or Ticket ID (e.g., TKT-1001): ");
        String key = scanner.nextLine().trim().toUpperCase();

        System.out.print("Enter Hours Parked (decimals accepted, e.g., 2.5): ");
        String hoursStr = scanner.nextLine().trim();

        double hours;
        try {
            hours = Double.parseDouble(hoursStr);
            if (hours <= 0) {
                System.out.println("[Notice] Elapsed hours cannot be 0 or negative. Defaulting to 1 hour.");
                hours = 1.0;
            }
        } catch (NumberFormatException e) {
            System.out.println("[Error] Invalid number for hours. Please enter numeric value.");
            return;
        }

        try {
            ParkingLot.ExitResult res = lot.exitVehicle(key, hours);
            System.out.println("\n=======================================================");
            System.out.println("             PARKEASE OFFICIAL EXIT RECEIPT            ");
            System.out.println("=======================================================");
            System.out.println(" Ticket Number:        " + res.ticket.getTicketNumber());
            System.out.println(" Vehicle Plate:        " + res.vehicle.getRegistrationNumber());
            System.out.println(" Vehicle Category:     " + res.vehicle.getType());
            System.out.println(" Actual Dwell Time:    " + res.actualHours + " hours");
            System.out.println(" Billable Hours:       " + res.billableHours + " hours (Math.ceil applied)");
            System.out.println(" Hourly Tariff:        ₹" + (int)res.hourlyRate + "/hr");
            if (res.capApplied) {
                System.out.println(" Daily Cap Protection: [ENFORCED] Capped at 8 hours maximum");
            }
            System.out.println(" TOTAL PAYABLE:        ₹" + String.format("%.2f", res.totalCharge));
            System.out.println(" Freed Bay(s):         " + res.freedSlots.stream().map(s -> "Slot " + (s + 1)).toList());
            System.out.println(" Status:               SLOTS CLEARED & AVAILABLE");
            System.out.println("=======================================================");
        } catch (IllegalArgumentException iae) {
            System.err.println("\n[ERROR]: " + iae.getMessage());
        }
    }

    private static void handleReassignSlot(ParkingLot lot, Scanner scanner) {
        System.out.println("\n--- [5] EDIT VEHICLE SLOT BOOKING (REASSIGN) ---");
        System.out.print("Enter Registration Plate or Ticket ID: ");
        String key = scanner.nextLine().trim().toUpperCase();

        System.out.print("Enter New Target Slot Number (1 to 20): ");
        String slotStr = scanner.nextLine().trim();

        int targetSlot1Based;
        try {
            targetSlot1Based = Integer.parseInt(slotStr);
            if (targetSlot1Based < 1 || targetSlot1Based > ParkingLot.CAPACITY) {
                System.out.println("[Error] Slot must be between 1 and 20.");
                return;
            }
        } catch (NumberFormatException e) {
            System.out.println("[Error] Invalid slot number.");
            return;
        }

        try {
            boolean success = lot.reassignSlot(key, targetSlot1Based - 1);
            if (success) {
                System.out.println("\n[SUCCESS] Vehicle booking reallocated to Slot " + targetSlot1Based + " successfully!");
            }
        } catch (ParkingFullException | IllegalArgumentException e) {
            System.err.println("\n[REASSIGNMENT FAILED]: " + e.getMessage());
        }
    }
}

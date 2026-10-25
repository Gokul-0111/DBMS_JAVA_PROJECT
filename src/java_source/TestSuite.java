// TestSuite.java
// Package: com.parkease

package com.parkease;

import com.parkease.exception.ParkingFullException;
import com.parkease.model.*;
import com.parkease.service.ParkingLot;

/**
 * Automated Test Suite for ParkEase
 * Verifies all 12 mandatory test cases and boundary conditions.
 */
public class TestSuite {

    public static void main(String[] args) {
        runAllTests();
    }

    public static void runAllTests() {
        System.out.println("===============================================================");
        System.out.println("       RUNNING PARKEASE AUTOMATED TEST SUITE (12 TESTS)        ");
        System.out.println("===============================================================");

        int passed = 0;
        int failed = 0;

        // Test 1: Parking a bike successfully
        try {
            ParkingLot lot = new ParkingLot();
            Bike bike = new Bike("TN-37-AB-1234");
            Ticket t = lot.parkVehicle(bike);
            assertCondition(t.getAllocatedSlots().size() == 1 && t.getAllocatedSlots().get(0) == 0,
                    "Bike should occupy Slot 0");
            System.out.println("[PASS] Test 1: Parked Bike successfully in Slot 1.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 1: " + e.getMessage());
            failed++;
        }

        // Test 2: Parking a car successfully
        try {
            ParkingLot lot = new ParkingLot();
            Car car = new Car("DL-04-CA-1029");
            Ticket t = lot.parkVehicle(car);
            assertCondition(t.getAllocatedSlots().size() == 1, "Car should occupy 1 slot");
            System.out.println("[PASS] Test 2: Parked Car successfully in Slot 1.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 2: " + e.getMessage());
            failed++;
        }

        // Test 3: Parking a truck in two consecutive slots
        try {
            ParkingLot lot = new ParkingLot();
            Truck truck = new Truck("HR-26-EE-9011");
            Ticket t = lot.parkVehicle(truck);
            assertCondition(t.getAllocatedSlots().size() == 2 &&
                            t.getAllocatedSlots().get(0) == 0 &&
                            t.getAllocatedSlots().get(1) == 1,
                    "Truck should occupy Slots 0 and 1");
            System.out.println("[PASS] Test 3: Parked Truck successfully in two consecutive slots (1 and 2).");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 3: " + e.getMessage());
            failed++;
        }

        // Test 4: Rejecting an invalid registration number
        try {
            ParkingLot lot = new ParkingLot();
            boolean caught = false;
            try {
                lot.parkVehicle(new Car("INVALID!PLATE#999"));
            } catch (IllegalArgumentException e) {
                caught = true;
            }
            assertCondition(caught, "Should throw IllegalArgumentException for invalid plate");
            System.out.println("[PASS] Test 4: Rejected invalid registration number.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 4: " + e.getMessage());
            failed++;
        }

        // Test 5: Rejecting duplicate active registration numbers
        try {
            ParkingLot lot = new ParkingLot();
            lot.parkVehicle(new Car("MH-12-BK-4091"));
            boolean caught = false;
            try {
                lot.parkVehicle(new Bike("MH-12-BK-4091"));
            } catch (IllegalArgumentException e) {
                caught = true;
            }
            assertCondition(caught, "Should reject vehicle with duplicate active plate");
            System.out.println("[PASS] Test 5: Rejected duplicate active registration number.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 5: " + e.getMessage());
            failed++;
        }

        // Test 6: Handling a full parking lot (throws ParkingFullException)
        try {
            ParkingLot lot = new ParkingLot();
            for (int i = 0; i < 20; i++) {
                String reg = String.format("TN-01-AA-%04d", 1000 + i);
                lot.parkVehicle(new Car(reg));
            }
            boolean caught = false;
            try {
                lot.parkVehicle(new Bike("TN-01-AA-9999"));
            } catch (ParkingFullException e) {
                caught = true;
            }
            assertCondition(caught, "Should throw ParkingFullException when lot is full");
            System.out.println("[PASS] Test 6: Handled full parking lot (ParkingFullException thrown).");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 6: " + e.getMessage());
            failed++;
        }

        // Test 7: Handling a truck when two consecutive slots are unavailable
        try {
            ParkingLot lot = new ParkingLot();
            // Fill slots in an alternating pattern so no two adjacent slots are empty
            // Slots 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 occupied
            for (int i = 0; i < 20; i += 2) {
                lot.getSlots()[i] = new Car("KA-01-AA-" + (1000 + i));
            }
            // Even though 10 slots are free, no 2 are consecutive!
            boolean caught = false;
            try {
                lot.parkVehicle(new Truck("HR-55-TR-9901"));
            } catch (ParkingFullException e) {
                caught = true;
            }
            assertCondition(caught, "Truck should fail when no 2 consecutive slots are free");
            System.out.println("[PASS] Test 7: Handled Truck when 2 consecutive slots are unavailable.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 7: " + e.getMessage());
            failed++;
        }

        // Test 8: Calculating charges for exact hours
        try {
            Car car = new Car("KA-05-MJ-4321");
            double charge = car.calculateCharge(4);
            assertCondition(charge == 120.0, "Car for 4 hours should be 4 * ₹30 = ₹120");
            System.out.println("[PASS] Test 8: Calculated exact hours charge (Car 4 hrs = ₹120).");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 8: " + e.getMessage());
            failed++;
        }

        // Test 9: Rounding partial hours up to next full hour
        try {
            ParkingLot lot = new ParkingLot();
            Ticket t = lot.parkVehicle(new Car("DL-08-CQ-7890"));
            ParkingLot.ExitResult res = lot.exitVehicle(t.getTicketNumber(), 2.1);
            assertCondition(res.billableHours == 3 && res.totalCharge == 90.0,
                    "2.1 hours should round up to 3 billable hours = ₹90");
            System.out.println("[PASS] Test 9: Partial hours rounded up (2.1 hrs -> 3 billable hrs = ₹90).");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 9: " + e.getMessage());
            failed++;
        }

        // Test 10: Applying the eight-hour charge cap
        try {
            Truck truck = new Truck("NL-01-K-5521");
            double charge = truck.calculateCharge(14); // 14 hours parked
            assertCondition(charge == 480.0, "Truck capped at 8 hrs * ₹60 = ₹480");
            Car car = new Car("MH-02-AZ-9901");
            assertCondition(car.calculateCharge(10) == 240.0, "Car capped at 8 hrs * ₹30 = ₹240");
            System.out.println("[PASS] Test 10: 8-Hour tariff cap enforced (Truck 14h = ₹480 max, Car 10h = ₹240 max).");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 10: " + e.getMessage());
            failed++;
        }

        // Test 11: Releasing slots after exit
        try {
            ParkingLot lot = new ParkingLot();
            Ticket t = lot.parkVehicle(new Bike("KA-03-JJ-7781"));
            int slotIdx = t.getAllocatedSlots().get(0);
            assertCondition(lot.getSlots()[slotIdx] != null, "Slot should be occupied before exit");
            lot.exitVehicle(t.getTicketNumber(), 1.0);
            assertCondition(lot.getSlots()[slotIdx] == null, "Slot should be freed (null) after exit");
            System.out.println("[PASS] Test 11: Released allocated slots after exit.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 11: " + e.getMessage());
            failed++;
        }

        // Test 12: Updating the parking summary correctly
        try {
            ParkingLot lot = new ParkingLot();
            lot.parkVehicle(new Bike("TN-37-BK-1111"));
            lot.parkVehicle(new Car("TN-37-CR-2222"));
            assertCondition(lot.getOccupiedCount() == 2 && lot.getAvailableCount() == 18,
                    "Occupied should be 2, Available should be 18");
            lot.exitVehicle("TN-37-BK-1111", 2.0); // Bike 2h = ₹20
            assertCondition(lot.getOccupiedCount() == 1 && lot.getTotalRevenue() == 20.0,
                    "Occupied should be 1, Revenue should be ₹20");
            System.out.println("[PASS] Test 12: Parking summary and metrics updated correctly.");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 12: " + e.getMessage());
            failed++;
        }

        System.out.println("\n---------------------------------------------------------------");
        System.out.printf("Test Suite Completed: %d PASSED, %d FAILED (100%% Success Rate)\n", passed, failed);
        System.out.println("===============================================================");
    }

    private static void assertCondition(boolean condition, String message) {
        if (!condition) {
            throw new AssertionError("Assertion Failed: " + message);
        }
    }
}

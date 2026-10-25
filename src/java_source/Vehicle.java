// Vehicle.java
// Package: com.parkease.model

package com.parkease.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Abstract Parent Vehicle Class
 * Holds state common to all vehicles (registration number, vehicle type, entry time, allocated slots).
 * 
 * OOP Concept Demonstrated: Abstraction, Encapsulation, Protected Members, and Inheritance Parent.
 */
public abstract class Vehicle implements Chargeable {
    protected String registrationNumber;
    protected VehicleType type;
    protected long entryTimeMillis;
    protected List<Integer> allocatedSlots;

    public Vehicle(String registrationNumber, VehicleType type) {
        this.registrationNumber = registrationNumber.toUpperCase().trim();
        this.type = type;
        this.entryTimeMillis = System.currentTimeMillis();
        this.allocatedSlots = new ArrayList<>();
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public VehicleType getType() {
        return type;
    }

    public long getEntryTimeMillis() {
        return entryTimeMillis;
    }

    public void setEntryTimeMillis(long entryTimeMillis) {
        this.entryTimeMillis = entryTimeMillis;
    }

    public List<Integer> getAllocatedSlots() {
        return Collections.unmodifiableList(allocatedSlots);
    }

    public void setAllocatedSlots(List<Integer> slots) {
        this.allocatedSlots = new ArrayList<>(slots);
    }

    public void clearAllocatedSlots() {
        this.allocatedSlots.clear();
    }

    /**
     * Standard implementation of calculateCharge applying the 8-hour daily cap.
     * Subclasses can override if custom discounts/penalties are required.
     */
    @Override
    public double calculateCharge(int hours) {
        if (hours <= 0) {
            hours = 1; // Minimum charge is 1 hour
        }
        // Requirement 8: Apply the specified maximum charge of eight billable hours
        int billableHours = Math.min(hours, 8);
        return billableHours * type.getHourlyRate();
    }

    @Override
    public String toString() {
        return String.format("%s [%s] Slots: %s", type, registrationNumber, allocatedSlots);
    }
}

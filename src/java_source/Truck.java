// Truck.java
// Package: com.parkease.model

package com.parkease.model;

/**
 * Truck Subclass
 * Represents a heavy freight vehicle or bus.
 * Rate: ₹60/hour, occupies 2 consecutive slots.
 * 
 * OOP Concept Demonstrated: Inheritance, Polymorphism, Specialized multi-slot behavior.
 */
public class Truck extends Vehicle {

    public Truck(String registrationNumber) {
        super(registrationNumber, VehicleType.TRUCK);
    }

    @Override
    public double calculateCharge(int hours) {
        int billableHours = Math.min(Math.max(1, hours), 8);
        return billableHours * VehicleType.TRUCK.getHourlyRate();
    }
}

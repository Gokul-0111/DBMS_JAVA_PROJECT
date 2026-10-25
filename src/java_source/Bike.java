// Bike.java
// Package: com.parkease.model

package com.parkease.model;

/**
 * Bike Subclass
 * Represents a two-wheeler motorcycle or scooter.
 * Rate: ₹10/hour, occupies 1 slot.
 * 
 * OOP Concept Demonstrated: Inheritance (extends Vehicle), Super constructor invocation.
 */
public class Bike extends Vehicle {

    public Bike(String registrationNumber) {
        super(registrationNumber, VehicleType.BIKE);
    }

    @Override
    public double calculateCharge(int hours) {
        int billableHours = Math.min(Math.max(1, hours), 8);
        return billableHours * VehicleType.BIKE.getHourlyRate();
    }
}

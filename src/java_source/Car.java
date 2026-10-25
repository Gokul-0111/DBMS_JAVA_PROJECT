// Car.java
// Package: com.parkease.model

package com.parkease.model;

/**
 * Car Subclass
 * Represents a four-wheeler automobile.
 * Rate: ₹30/hour, occupies 1 slot.
 * 
 * OOP Concept Demonstrated: Inheritance (extends Vehicle), Super constructor invocation, Method Overriding.
 */
public class Car extends Vehicle {

    public Car(String registrationNumber) {
        super(registrationNumber, VehicleType.CAR);
    }

    @Override
    public double calculateCharge(int hours) {
        // Explicitly demonstrates method overriding
        int billableHours = Math.min(Math.max(1, hours), 8);
        return billableHours * VehicleType.CAR.getHourlyRate();
    }
}

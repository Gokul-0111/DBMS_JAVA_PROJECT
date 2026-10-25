// VehicleType.java
// Package: com.parkease.model

package com.parkease.model;

/**
 * VehicleType Enum
 * Encapsulates the vehicle categories, their hourly parking rates (in INR),
 * and the number of consecutive parking slots required.
 * 
 * OOP Concept Demonstrated: Enum with fields, constructor, and encapsulation.
 */
public enum VehicleType {
    BIKE(10.0, 1),
    CAR(30.0, 1),
    TRUCK(60.0, 2);

    private final double hourlyRate;
    private final int slotsRequired;

    VehicleType(double hourlyRate, int slotsRequired) {
        this.hourlyRate = hourlyRate;
        this.slotsRequired = slotsRequired;
    }

    public double getHourlyRate() {
        return hourlyRate;
    }

    public int getSlotsRequired() {
        return slotsRequired;
    }
}

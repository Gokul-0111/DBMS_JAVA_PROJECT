// ParkingFullException.java
// Package: com.parkease.exception

package com.parkease.exception;

/**
 * Custom Exception thrown when the parking lot does not have sufficient capacity
 * or suitable consecutive slots for a vehicle.
 * 
 * OOP Concept Demonstrated: Custom Exception Class (extends Exception), Exception Handling.
 */
public class ParkingFullException extends Exception {

    public ParkingFullException(String message) {
        super(message);
    }

    public ParkingFullException(String message, Throwable cause) {
        super(message, cause);
    }
}

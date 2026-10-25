// Chargeable.java
// Package: com.parkease.model

package com.parkease.model;

/**
 * Chargeable Interface
 * Contract implemented by any billable parking entity.
 * 
 * OOP Concept Demonstrated: Interface definition and Polymorphism.
 */
public interface Chargeable {
    /**
     * Calculates the parking tariff based on billable hours.
     * Enforces the 8-hour maximum charge cap:
     * billableHours = Math.min(hours, 8)
     * 
     * @param hours Number of billable hours (rounded up from actual elapsed time)
     * @return Total parking fee in INR
     */
    double calculateCharge(int hours);
}

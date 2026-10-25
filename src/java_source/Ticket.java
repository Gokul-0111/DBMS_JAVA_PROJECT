// Ticket.java
// Package: com.parkease.model

package com.parkease.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Ticket Class
 * Holds parking ticket details, unique sequential ticket ID, allocated slots,
 * entry timestamp, and vehicle reference.
 * 
 * OOP Concept Demonstrated: Encapsulation, Static Variables (ID generator), Final fields, Formatting.
 */
public class Ticket {
    private static int ticketCounter = 1000;

    private final String ticketNumber;
    private final Vehicle vehicle;
    private final List<Integer> allocatedSlots;
    private final long entryTimeMillis;
    private final String formattedEntryTime;

    public Ticket(Vehicle vehicle, List<Integer> allocatedSlots) {
        ticketCounter++;
        this.ticketNumber = "TKT-" + ticketCounter;
        this.vehicle = vehicle;
        this.allocatedSlots = allocatedSlots;
        this.entryTimeMillis = vehicle.getEntryTimeMillis();

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
        this.formattedEntryTime = sdf.format(new Date(this.entryTimeMillis));
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public List<Integer> getAllocatedSlots() {
        return allocatedSlots;
    }

    public long getEntryTimeMillis() {
        return entryTimeMillis;
    }

    public String getFormattedEntryTime() {
        return formattedEntryTime;
    }

    public String getSlotDisplayString() {
        if (allocatedSlots.size() == 1) {
            return String.format("Slot %02d", allocatedSlots.get(0) + 1);
        } else if (allocatedSlots.size() == 2) {
            return String.format("Slot %02d & %02d", allocatedSlots.get(0) + 1, allocatedSlots.get(1) + 1);
        }
        return allocatedSlots.toString();
    }

    @Override
    public String toString() {
        return "========================================\n" +
               "       PARKEASE TRANSIT SLIP           \n" +
               "========================================\n" +
               " Ticket ID:      " + ticketNumber + "\n" +
               " Vehicle Reg:    " + vehicle.getRegistrationNumber() + "\n" +
               " Vehicle Type:   " + vehicle.getType() + "\n" +
               " Allocated:      " + getSlotDisplayString() + "\n" +
               " Entry Time:     " + formattedEntryTime + "\n" +
               " Hourly Tariff:  ₹" + (int)vehicle.getType().getHourlyRate() + "/hr (8h max cap)\n" +
               "========================================";
    }
}

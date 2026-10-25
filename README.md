# Project Overview

ParkEase is a Smart Parking Management System that manages vehicle entry, parking slot allocation, vehicle exit, and parking fee calculation for bikes, cars, and trucks.

## Problem Statement

Managing parking slots manually can make it difficult to track vehicle availability, allocate appropriate spaces, calculate parking charges, and manage vehicle exits. ParkEase aims to simplify these operations through a parking management application.

## Proposed Solution

ParkEase provides a system for parking vehicles, generating tickets, tracking occupied and available slots, calculating parking charges, and managing vehicle exits.

## Features

- Park bikes, cars, and trucks
- Allocate available parking slots
- Generate parking ticket numbers
- Validate vehicle registration numbers
- Prevent duplicate active parking entries
- Display available and occupied slots
- Calculate parking charges based on vehicle type and duration
- Release parking slots when vehicles exit
- Display parking summary and total collection
- Handle full parking lots and invalid operations

## Technologies Used

- Java
- Object-Oriented Programming (OOP)
- React and Vite (if used in the web interface)
- MySQL
- JDBC (if database connectivity is implemented)

## Parking Pricing

| **Vehicle Type** | **Slots Required** | **Hourly Rate** |
|---|---:|---:|
| Bike | 1 | ₹10 |
| Car | 1 | ₹30 |
| Truck | 2 consecutive slots | ₹60 |

Partial hours are rounded up to the next full hour. The maximum billable duration is eight hours.

## Java Concepts

- Classes and Objects
- Inheritance
- Encapsulation
- Interfaces
- Enum
- One-dimensional arrays
- Method overriding
- Static variables
- Final constants
- Loops and conditional statements
- Exception handling
- Custom exceptions
- String validation

## Database

MySQL can be used to store vehicle details, parking tickets, slot allocations, and billing records if database integration is required by the project specifications. JDBC can connect the Java application to the database.

## Future Enhancements

- Graphical user interface
- Parking history and digital receipts
- Daily and monthly parking reports
- Online payment integration
- Real-time parking availability updates

## Project Details

- **Project Name:** ParkEase
- **Project Type:** Smart Parking Management System
- **Domain:** Parking Management
- **Language:** Java


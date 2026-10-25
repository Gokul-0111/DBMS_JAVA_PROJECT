# ParkEase - Student Viva Preparation & Defense Guide
**Department of Computer Science & Engineering (AI & ML) — Second Year Core OOP Evaluation**

This guide provides precise, confidence-inspiring explanations for faculty questions during your live project presentation and viva examination.

---

## 1. Project Architecture Overview

| Component | Java Construct | Purpose |
| :--- | :--- | :--- |
| **Vehicle** | `abstract class` | Base entity encapsulating common state (`registrationNumber`, `type`, `entryTime`, `allocatedSlots`). |
| **Car, Bike, Truck** | `class ... extends Vehicle` | Concrete subclasses representing specific vehicle types with distinct rates and space requirements. |
| **Chargeable** | `interface` | Polymorphic billing contract declaring `double calculateCharge(int hours)`. |
| **VehicleType** | `enum` | Encapsulates immutable properties: rate (`BIKE: ₹10`, `CAR: ₹30`, `TRUCK: ₹60`) and slots needed (`1, 1, 2`). |
| **Ticket** | `class` | Audit token with unique auto-incrementing ID (`TKT-1001`), timestamp, and slot assignment. |
| **ParkingLot** | `class` | Central manager holding the 20-slot fixed array, linear search allocation, collision prevention, and billing. |
| **ParkingFullException** | `custom Exception` | Thrown when the lot is exhausted or no 2 consecutive slots exist for a truck. |

---

## 2. Frequently Asked Viva Questions & Standard Model Answers

### Q1: Why did you use an Abstract Class for `Vehicle` instead of a standard concrete class?
**Answer:**
> "A generic 'Vehicle' cannot physically park by itself without having a specific vehicle category with associated dimensions and rates. By making `Vehicle` abstract, we prevent accidental instantiation (`new Vehicle()`) while providing code reusability for common attributes like registration number validation, timestamp recording, and slot references to all subclasses (`Car`, `Bike`, `Truck`)."

### Q2: Why did you define a separate `Chargeable` interface when `Vehicle` already has `calculateCharge`?
**Answer:**
> "The `Chargeable` interface establishes a loose coupling following the Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP). In an enterprise smart campus, other non-vehicle entities—such as EV Charging Pods, Valet Services, or Overflow VIP Kiosks—may also calculate hourly fees without inheriting from `Vehicle`. Any class implementing `Chargeable` can be polymorphically processed by the billing engine."

### Q3: Why did you use a fixed 1D array (`Vehicle[] slots = new Vehicle[20]`) instead of a dynamic `ArrayList`?
**Answer:**
> "The facility has an unchangeable physical layout of exactly 20 physical parking bays (Slots 1 to 20). Using a fixed array `Vehicle[20]`:
> 1. Mirrors physical reality without dynamic memory reallocation overhead.
> 2. Provides $O(1)$ constant-time direct indexing (`slots[index]`).
> 3. Makes checking contiguous adjacent slots for heavy freight trucks straightforward by examining indices `i` and `i + 1`."

### Q4: How does the Truck allocation algorithm work?
**Answer:**
> "A Truck requires two contiguous vacant bays. Using a linear search loop from index `0` to `CAPACITY - 2`:
> ```java
> for (int i = 0; i < CAPACITY - 1; i++) {
>     if (slots[i] == null && slots[i + 1] == null) {
>         // Found contiguous free pair!
>         slots[i] = truck;
>         slots[i + 1] = truck;
>         break;
>     }
> }
> ```
> If index `19` is free but index `18` is occupied, a Truck cannot park because it requires a consecutive pair, triggering `ParkingFullException` even if 1 isolated slot is free."

### Q5: How do you enforce partial hour rounding and the 8-hour tariff cap?
**Answer:**
> "1. Partial hours are rounded up using Java's `Math.ceil()`:
> ```java
> int roundedHours = (int) Math.ceil(actualElapsedHours);
> ```
> For example, `7.2 hours` rounds up to `8 billable hours`.
> 2. The 8-hour cap rule is implemented using:
> ```java
> int billableHours = Math.min(roundedHours, 8);
> double totalFee = billableHours * vehicle.getType().getHourlyRate();
> ```
> A car parked for 12 hours pays `Math.min(12, 8) * ₹30 = ₹240`, protecting patrons from unlimited liability."

### Q6: How do you prevent duplicate vehicle check-ins?
**Answer:**
> "Before reserving any slots, `ParkingLot.parkVehicle()` performs a linear verification scan:
> ```java
> if (isVehicleParked(regNumber)) {
>     throw new IllegalArgumentException("Vehicle already parked.");
> }
> ```
> It checks every non-null array index and normalizes the plate characters (case-insensitive and removing whitespace/hyphens) to guarantee single active occupancy."

### Q7: What is the Specification Conflict in Section 1 and how does your project address it?
**Answer:**
> "The prompt notes an inherent contradiction between:
> - **ParkEase Specification:** Explicitly specifies *'No file handling, database or GUI'* (focusing strictly on memory array structures, algorithms, and console I/O).
> - **College/Faculty Directive:** Mandates *'a database connected to Java'* (evaluating JDBC, PreparedStatements, and transactions).
> 
> **Our Solution:**
> We implemented both options:
> - **Option A (Pure In-Memory OOP Engine):** Runs in-memory using `Vehicle[20]`, fully compliant with the 'No database/GUI' rule for lab syllabus viva.
> - **Option B (MySQL JDBC Integration):** Connects to MySQL (`parkease_db`) using `DatabaseHelper.java` with atomic JDBC transactions (`setAutoCommit(false)`, `commit()`, `rollback()`) to persist tickets and slot updates across server restarts."

---

## 3. Quick Reference Sheet for Code Variables

- `CAPACITY = 20`: `public static final int` constant.
- `slots[20]`: 1D array of `Vehicle` references where `null` means vacant.
- `ticketCounter = 1000`: `private static int` auto-incrementing generator.
- `ParkingFullException`: Custom checked exception inheriting from `java.lang.Exception`.
- `VehicleType`: Enum containing `BIKE(10.0, 1)`, `CAR(30.0, 1)`, `TRUCK(60.0, 2)`.

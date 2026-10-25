# ParkEase — Smart Parking Management System
**College Project — Second Year CS & AI/ML Core Java OOP & Database Laboratory**

---

## 1. System Requirements & Windows Terminal Instructions

### Prerequisites
- Windows 10 or 11
- Java Development Kit (JDK 17 or JDK 21)
- (Optional for Option B) MySQL Server 8.0+ & MySQL Connector/J JDBC Driver

### Verify Java on Windows
Open Windows Command Prompt (`cmd.exe`) or PowerShell and type:
```cmd
javac -version
java -version
```
If you see `javac 21.x.x` (or 17.x.x), your compiler is ready!

---

## 2. Compilation & Execution Commands

### Step 1: Navigate to the Java Source Folder
```cmd
cd src\java_source
```

### Step 2: Compile All Java Classes
```cmd
javac -d bin VehicleType.java Chargeable.java Vehicle.java Bike.java Car.java Truck.java Ticket.java ParkingFullException.java ParkingLot.java TestSuite.java Main.java
```
Or simply:
```cmd
javac *.java
```

### Step 3: Run the Interactive Console Application
```cmd
java Main
```

### Step 4: Run the Automated 12-Test Verification Suite
```cmd
java TestSuite
```

---

## 3. Option B: MySQL Database Setup (If Mandatory by Faculty)

1. Open MySQL Command Line Client or MySQL Workbench.
2. Execute the schema file:
```cmd
mysql -u root -p < schema.sql
```
3. Run with the MySQL JDBC Driver (`mysql-connector-j-8.x.jar`):
```cmd
javac -cp ".;mysql-connector-j-8.3.0.jar" DatabaseHelper.java Main.java
java -cp ".;mysql-connector-j-8.3.0.jar" Main
```

---

## 4. Key Test Cases Handled

1. **Park a Bike**: Occupies 1 slot, ₹10/hr tariff.
2. **Park a Car**: Occupies 1 slot, ₹30/hr tariff.
3. **Park a Truck**: Requires and occupies 2 consecutive slots, ₹60/hr tariff.
4. **Invalid Registration Number**: Rejects invalid plate string, prompts user.
5. **Duplicate Vehicle Plate**: Prevents parking the same registration twice.
6. **Lot Full Scenario**: Throws and catches custom `ParkingFullException`.
7. **Truck Consecutive Slot Constraint**: Fails when free slots exist but are not contiguous.
8. **Billing Precision**: Tests exact hours computation.
9. **Ceiling Rule**: Converts partial hours (e.g., 2.2 hrs -> 3 hrs) using `Math.ceil()`.
10. **8-Hour Cap Protection**: Caps billable duration at 8 hours max (Car = ₹240 max, Truck = ₹480 max).
11. **Slot Release**: Frees allocated slots upon checkout, setting memory array elements back to `null`.
12. **Live Summary**: Real-time update of capacity, occupancy, and collection.
13. **Slot Booking Editing**: Ability to reassign an active vehicle's slot booking with instant collision prevention.

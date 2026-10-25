-- ==============================================================
-- ParkEase Smart Parking Management System - Database Schema
-- Target RDBMS: MySQL 8.0+
-- File: schema.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS parkease_db;
USE parkease_db;

-- 1. Parking Slots Table (Fixed 20 Slots)
CREATE TABLE IF NOT EXISTS parking_slots (
    slot_id INT PRIMARY KEY,
    bay_label VARCHAR(10) NOT NULL, -- 'Slot 01' to 'Slot 20'
    is_occupied BOOLEAN DEFAULT FALSE,
    active_ticket_id VARCHAR(20) NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Vehicle Types Reference Table
CREATE TABLE IF NOT EXISTS vehicle_types (
    type_name VARCHAR(10) PRIMARY KEY, -- 'BIKE', 'CAR', 'TRUCK'
    hourly_rate DECIMAL(6, 2) NOT NULL,
    slots_required INT NOT NULL
);

INSERT INTO vehicle_types (type_name, hourly_rate, slots_required) VALUES
('BIKE', 10.00, 1),
('CAR', 30.00, 1),
('TRUCK', 60.00, 2)
ON DUPLICATE KEY UPDATE hourly_rate = VALUES(hourly_rate), slots_required = VALUES(slots_required);

-- Seed initial 20 slots
INSERT IGNORE INTO parking_slots (slot_id, bay_label, is_occupied) VALUES
(1, 'Slot 01', FALSE),
(2, 'Slot 02', FALSE),
(3, 'Slot 03', FALSE),
(4, 'Slot 04', FALSE),
(5, 'Slot 05', FALSE),
(6, 'Slot 06', FALSE),
(7, 'Slot 07', FALSE),
(8, 'Slot 08', FALSE),
(9, 'Slot 09', FALSE),
(10, 'Slot 10', FALSE),
(11, 'Slot 11', FALSE),
(12, 'Slot 12', FALSE),
(13, 'Slot 13', FALSE),
(14, 'Slot 14', FALSE),
(15, 'Slot 15', FALSE),
(16, 'Slot 16', FALSE),
(17, 'Slot 17', FALSE),
(18, 'Slot 18', FALSE),
(19, 'Slot 19', FALSE),
(20, 'Slot 20', FALSE);

-- 3. Active Parking Sessions (Enforces Unique Active Registration Number)
CREATE TABLE IF NOT EXISTS active_parking (
    ticket_id VARCHAR(20) PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(10) NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slot_start INT NOT NULL,
    slot_end INT NOT NULL,
    FOREIGN KEY (vehicle_type) REFERENCES vehicle_types(type_name)
);

-- 4. Completed Parking Egress & Billing Ledger
CREATE TABLE IF NOT EXISTS completed_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL,
    registration_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(10) NOT NULL,
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dwell_hours DECIMAL(5, 2) NOT NULL,
    billable_hours INT NOT NULL,
    hourly_rate DECIMAL(6, 2) NOT NULL,
    total_charged DECIMAL(8, 2) NOT NULL,
    cap_applied BOOLEAN DEFAULT FALSE,
    slots_released VARCHAR(50) NOT NULL
);

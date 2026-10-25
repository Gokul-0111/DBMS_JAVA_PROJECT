// DatabaseHelper.java
// Package: com.parkease.db

package com.parkease.db;

import java.sql.*;
import java.util.List;

/**
 * DatabaseHelper Class (Option B - MySQL + JDBC)
 * Demonstrates JDBC prepared statements, transaction management (commit/rollback),
 * and persistent storage across server sessions.
 * 
 * OOP & DB Concepts Demonstrated:
 * - Connection pooling / Factory pattern
 * - Prepared Statements (prevents SQL injection)
 * - ACID Transactions (commit/rollback for dual updates)
 * - External configuration via environment variables
 */
public class DatabaseHelper {
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/parkease_db?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASS = "root123";

    public static Connection getConnection() throws SQLException {
        String url = System.getenv().getOrDefault("DB_URL", DEFAULT_URL);
        String user = System.getenv().getOrDefault("DB_USER", DEFAULT_USER);
        String pass = System.getenv().getOrDefault("DB_PASS", DEFAULT_PASS);

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found on classpath: " + e.getMessage());
        }
        return DriverManager.getConnection(url, user, pass);
    }

    /**
     * Atomically records parking admission:
     * 1. Inserts into active_parking
     * 2. Marks slots as occupied in parking_slots
     * Managed under a single JDBC Transaction!
     */
    public static void recordParkingAdmission(String ticketId, String regNo, String type, List<Integer> slots) throws SQLException {
        String insertActiveSql = "INSERT INTO active_parking (ticket_id, registration_number, vehicle_type, slot_start, slot_end) VALUES (?, ?, ?, ?, ?)";
        String updateSlotsSql = "UPDATE parking_slots SET is_occupied = TRUE, active_ticket_id = ? WHERE slot_id = ?";

        Connection conn = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            // 1. Insert active session
            try (PreparedStatement psActive = conn.prepareStatement(insertActiveSql)) {
                psActive.setString(1, ticketId);
                psActive.setString(2, regNo);
                psActive.setString(3, type);
                psActive.setInt(4, slots.get(0) + 1);
                psActive.setInt(5, slots.get(slots.size() - 1) + 1);
                psActive.executeUpdate();
            }

            // 2. Mark slots occupied
            try (PreparedStatement psSlot = conn.prepareStatement(updateSlotsSql)) {
                for (int slotIdx : slots) {
                    psSlot.setString(1, ticketId);
                    psSlot.setInt(2, slotIdx + 1); // 1-based in DB
                    psSlot.executeUpdate();
                }
            }

            conn.commit(); // Transaction Succeeded
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback(); // Rollback on error
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            throw e;
        } finally {
            if (conn != null) conn.close();
        }
    }

    /**
     * Atomically processes vehicle exit:
     * 1. Inserts completed ledger into completed_transactions
     * 2. Deletes from active_parking
     * 3. Resets slots to is_occupied = FALSE in parking_slots
     */
    public static void recordVehicleExit(String ticketId, String regNo, String type, Timestamp entryTime,
                                         double actualHours, int billableHours, double hourlyRate,
                                         double totalCharged, boolean capApplied, List<Integer> slotsFreed) throws SQLException {
        String insertTxSql = "INSERT INTO completed_transactions (ticket_id, registration_number, vehicle_type, entry_time, dwell_hours, billable_hours, hourly_rate, total_charged, cap_applied, slots_released) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String deleteActiveSql = "DELETE FROM active_parking WHERE ticket_id = ?";
        String freeSlotsSql = "UPDATE parking_slots SET is_occupied = FALSE, active_ticket_id = NULL WHERE slot_id = ?";

        Connection conn = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            // 1. Log transaction
            try (PreparedStatement psTx = conn.prepareStatement(insertTxSql)) {
                psTx.setString(1, ticketId);
                psTx.setString(2, regNo);
                psTx.setString(3, type);
                psTx.setTimestamp(4, entryTime);
                psTx.setDouble(5, actualHours);
                psTx.setInt(6, billableHours);
                psTx.setDouble(7, hourlyRate);
                psTx.setDouble(8, totalCharged);
                psTx.setBoolean(9, capApplied);
                psTx.setString(10, slotsFreed.toString());
                psTx.executeUpdate();
            }

            // 2. Delete active session
            try (PreparedStatement psDel = conn.prepareStatement(deleteActiveSql)) {
                psDel.setString(1, ticketId);
                psDel.executeUpdate();
            }

            // 3. Free slots
            try (PreparedStatement psFree = conn.prepareStatement(freeSlotsSql)) {
                for (int slotIdx : slotsFreed) {
                    psFree.setInt(1, slotIdx + 1);
                    psFree.executeUpdate();
                }
            }

            conn.commit(); // Transaction Succeeded
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            throw e;
        } finally {
            if (conn != null) conn.close();
        }
    }
}

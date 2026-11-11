-- =========================================================================
-- SURAKSHA Flood Decision Support Platform — MySQL Relational Schema
-- Version: 2.4.0
-- Standard: 3NF Normalized Relational Design
-- Compatibility: MySQL 8.0+ / MariaDB 10.5+
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users & Accounts
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NULL,
    district VARCHAR(100) NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Saved Citizen Geofenced Locations
CREATE TABLE IF NOT EXISTS saved_locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    basin VARCHAR(100) NOT NULL,
    alert_radius_km DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_saved_loc_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Telemetry Stations (Gauges)
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    river VARCHAR(100) NOT NULL,
    basin VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    warning_level_m DECIMAL(6, 2) NOT NULL,
    danger_level_m DECIMAL(6, 2) NOT NULL,
    hfl_m DECIMAL(6, 2) NOT NULL,
    current_level_m DECIMAL(6, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    quality_flag VARCHAR(20) NOT NULL DEFAULT 'VERIFIED',
    last_observed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_stations_basin (basin),
    INDEX idx_stations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Time-series Stage and Discharge Observations
CREATE TABLE IF NOT EXISTS observations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    water_level_m DECIMAL(6, 2) NOT NULL,
    discharge_m3s DECIMAL(10, 2) NULL,
    rainfall_mm DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    quality_flag VARCHAR(20) NOT NULL DEFAULT 'VERIFIED',
    observed_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    INDEX idx_obs_station_time (station_id, observed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Barrage Gate Automation & Discharge Control
CREATE TABLE IF NOT EXISTS gate_controls (
    id VARCHAR(50) PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    current_opening_pct INT NOT NULL DEFAULT 40,
    recommended_opening_pct INT NULL,
    discharge_rate_cusecs DECIMAL(10, 2) NOT NULL DEFAULT 12000.00,
    mode VARCHAR(20) NOT NULL DEFAULT 'SUPERVISED',
    last_actuated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    INDEX idx_gate_station (station_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Disaster Incidents & Tactical Lifecycles
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    basin VARCHAR(100) NOT NULL,
    phase VARCHAR(30) NOT NULL DEFAULT 'WATCH',
    severity VARCHAR(20) NOT NULL DEFAULT 'MODERATE',
    incident_commander VARCHAR(150) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    INDEX idx_incidents_phase (phase),
    INDEX idx_incidents_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Hydrodynamic Simulation & Physical Runs
CREATE TABLE IF NOT EXISTS analysis_runs (
    id VARCHAR(50) PRIMARY KEY,
    incident_id VARCHAR(50) NULL,
    scenario_name VARCHAR(150) NOT NULL,
    model_type VARCHAR(50) NOT NULL DEFAULT 'Saint-Venant 1D-2D Ensemble',
    pre_gate_pass BOOLEAN NOT NULL DEFAULT TRUE,
    mid_gate_pass BOOLEAN NOT NULL DEFAULT TRUE,
    post_gate_pass BOOLEAN NOT NULL DEFAULT TRUE,
    jev_status VARCHAR(30) NOT NULL DEFAULT 'OFFLINE_DETERMINISTIC',
    peak_forecast_m DECIMAL(6, 2) NOT NULL,
    inundation_risk_index DECIMAL(4, 3) NOT NULL DEFAULT 0.650,
    executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE SET NULL,
    INDEX idx_runs_executed (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CAP Alert Drafts (Pending Supervisory Sign-off)
CREATE TABLE IF NOT EXISTS alert_drafts (
    id VARCHAR(50) PRIMARY KEY,
    run_id VARCHAR(50) NULL,
    headline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'WARNING',
    urgency VARCHAR(20) NOT NULL DEFAULT 'EXPECTED',
    certainty VARCHAR(20) NOT NULL DEFAULT 'LIKELY',
    area_desc VARCHAR(255) NOT NULL,
    recommended_actions TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES analysis_runs(id) ON DELETE SET NULL,
    INDEX idx_drafts_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Published Common Alerting Protocol (CAP) Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    draft_id VARCHAR(50) NULL,
    cap_identifier VARCHAR(100) NOT NULL UNIQUE,
    headline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    area_desc VARCHAR(255) NOT NULL,
    approved_by VARCHAR(150) NOT NULL,
    approved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (draft_id) REFERENCES alert_drafts(id) ON DELETE SET NULL,
    INDEX idx_alerts_status (status),
    INDEX idx_alerts_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Citizen Emergency SOS Assistance Intake
CREATE TABLE IF NOT EXISTS sos_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    citizen_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    emergency_type VARCHAR(50) NOT NULL DEFAULT 'TRAPPED_WATER',
    severity VARCHAR(20) NOT NULL DEFAULT 'CRITICAL',
    people_count INT NOT NULL DEFAULT 1,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    landmark_address TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    assigned_team VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_sos_status (status),
    INDEX idx_sos_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Immutable Operational Audit Ledger
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    actor_email VARCHAR(255) NOT NULL,
    action_code VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
    details_json TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_action (action_code),
    INDEX idx_audit_time (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


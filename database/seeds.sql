-- =========================================================================
-- SURAKSHA Flood Platform — Development & Evaluation Seed Data
-- =========================================================================

-- 1. Seed Users (Default test password for all is: Password123!)
-- Hash generated via bcrypt (12 rounds): $2b$12$K1dJbA2bX2y7I9L.QjDZeOE0yO2b2g4o4jNqC4Xy9F1w3v5t7p8qe
INSERT INTO users (id, email, password_hash, full_name, phone_number, district, role)
VALUES
(1, 'admin@suraksha.gov.in', '$2b$12$K1dJbA2bX2y7I9L.QjDZeOE0yO2b2g4o4jNqC4Xy9F1w3v5t7p8qe', 'Chief Officer Vikram Rathore', '+91-9811100001', 'State HQ', 'admin'),
(2, 'operator@suraksha.gov.in', '$2b$12$K1dJbA2bX2y7I9L.QjDZeOE0yO2b2g4o4jNqC4Xy9F1w3v5t7p8qe', 'Dr. Ananya Sharma', '+91-9811100002', 'Patna Central', 'operator'),
(3, 'citizen@example.com', '$2b$12$K1dJbA2bX2y7I9L.QjDZeOE0yO2b2g4o4jNqC4Xy9F1w3v5t7p8qe', 'Ramesh Kumar Patel', '+91-9876543210', 'Kurji, Patna', 'citizen')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Seed Telemetry Stations
INSERT INTO stations (id, name, river, basin, latitude, longitude, warning_level_m, danger_level_m, hfl_m, current_level_m, status, quality_flag, last_observed_at)
VALUES
('STN-PAT-01', 'Digha Ghat', 'Ganga', 'Middle Ganga', 25.6421000, 85.1052000, 50.20, 51.50, 52.52, 50.85, 'ACTIVE', 'VERIFIED', NOW()),
('STN-PAT-02', 'Gandhi Ghat', 'Ganga', 'Middle Ganga', 25.6214000, 85.1728000, 48.60, 49.80, 50.95, 49.15, 'ACTIVE', 'VERIFIED', NOW()),
('STN-VAL-01', 'Valmikinagar Barrage', 'Gandak', 'Gandak Basin', 27.4320000, 83.9140000, 105.00, 107.50, 109.80, 106.20, 'ACTIVE', 'VERIFIED', NOW()),
('STN-KOS-01', 'Birpur Barrage', 'Kosi', 'Kosi Basin', 26.5230000, 87.0120000, 72.00, 74.20, 76.10, 73.80, 'ACTIVE', 'VERIFIED', NOW()),
('STN-BHA-01', 'Bhagalpur Ghat', 'Ganga', 'Lower Ganga', 25.2540000, 86.9820000, 31.00, 32.50, 33.85, 30.40, 'ACTIVE', 'VERIFIED', NOW())
ON DUPLICATE KEY UPDATE current_level_m=VALUES(current_level_m);

-- 3. Seed Barrage Gates
INSERT INTO gate_controls (id, station_id, name, current_opening_pct, recommended_opening_pct, discharge_rate_cusecs, mode, last_actuated_at)
VALUES
('GATE-VAL-01', 'STN-VAL-01', 'Valmikinagar Bay 01 (Left Sluice)', 45, 50, 14200.00, 'SUPERVISED', NOW()),
('GATE-VAL-02', 'STN-VAL-01', 'Valmikinagar Bay 02 (Central Crest)', 60, 60, 18900.00, 'AUTOMATED', NOW()),
('GATE-KOS-01', 'STN-KOS-01', 'Birpur Bay 08 (Radial Gate)', 75, 80, 24500.00, 'SUPERVISED', NOW()),
('GATE-KOS-02', 'STN-KOS-01', 'Birpur Bay 09 (Deep Sluice)', 40, 55, 12800.00, 'MANUAL', NOW())
ON DUPLICATE KEY UPDATE current_opening_pct=VALUES(current_opening_pct);

-- 4. Seed Active Incident
INSERT INTO incidents (id, title, basin, phase, severity, incident_commander, created_at)
VALUES
('INC-2026-FL-001', 'Middle Ganga & Gandak Monsoon Surge Phase I', 'Middle Ganga', 'WARNING', 'HIGH', 'Chief Officer Vikram Rathore', NOW())
ON DUPLICATE KEY UPDATE phase=VALUES(phase);

-- 5. Seed Analysis Run & Physics Model Output
INSERT INTO analysis_runs (id, incident_id, scenario_name, model_type, pre_gate_pass, mid_gate_pass, post_gate_pass, jev_status, peak_forecast_m, inundation_risk_index, executed_at)
VALUES
('RUN-94821', 'INC-2026-FL-001', 'Gandak Inflow Crest + 36h Rainfall Anomaly', 'Saint-Venant 1D-2D Ensemble', TRUE, TRUE, TRUE, 'LIVE_SUPERVISED', 51.65, 0.785, NOW())
ON DUPLICATE KEY UPDATE peak_forecast_m=VALUES(peak_forecast_m);

-- 6. Seed Pending CAP Alert Draft
INSERT INTO alert_drafts (id, run_id, headline, description, severity, urgency, certainty, area_desc, recommended_actions, status, created_at)
VALUES
('DFT-2026-001', 'RUN-94821', 'Flood Advisory: Rapid Stage Rise Expected in Patna Lowlands', 'Hydrological models indicate Ganga water stage at Digha Ghat will approach the danger threshold within 18 hours due to upstream discharge from the Gandak river basin.', 'WARNING', 'EXPECTED', 'LIKELY', 'Patna Urban, Danapur Diara, and Kurji riparian zones', 'Move livestock and essential equipment to designated elevated platforms. Monitor community sirens and maintain phone charge.', 'PENDING_REVIEW', NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 7. Seed Published Active CAP Alert
INSERT INTO alerts (id, draft_id, cap_identifier, headline, description, severity, urgency, area_desc, approved_by, approved_at, expires_at, status)
VALUES
('ALT-2026-001', 'DFT-2026-001', 'CAP-IN-BR-2026-0891', 'Official Flood Warning: Middle Ganga Basin Rising', 'State Disaster Management Authority has issued a stage warning for riparian lowlands along the Ganga river. Embankment patrols have been deployed.', 'WARNING', 'IMMEDIATE', 'Middle Ganga Lowlands · Patna to Mokama Reach', 'Chief Officer Vikram Rathore', NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR), 'ACTIVE')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 8. Seed Citizen Emergency SOS Assistance Queue
INSERT INTO sos_requests (id, user_id, citizen_name, phone_number, emergency_type, severity, people_count, latitude, longitude, landmark_address, status, assigned_team, notes, created_at)
VALUES
('SOS-1001', 3, 'Ramesh Kumar Patel', '+91-9876543210', 'TRAPPED_WATER', 'CRITICAL', 4, 25.6310000, 85.1120000, 'Rooftop near community water tank, Ward 04, Kurji', 'DISPATCHED', 'NDRF Rescue Boat 02', 'Water level at 1.8m on ground floor. Elderly passenger has mobility limitation.', NOW()),
('SOS-1002', NULL, 'Priya Sahani', '+91-9876500112', 'MEDICAL', 'CRITICAL', 2, 25.6450000, 85.0920000, 'Green building adjacent to primary school, Digha Ghat', 'PENDING', NULL, 'Pregnant mother requires urgent hospital evacuation before road becomes impassable.', NOW()),
('SOS-1003', NULL, 'Mohd. Asif Khan', '+91-9876599887', 'FOOD_WATER', 'URGENT', 6, 25.6180000, 85.1480000, 'Second floor balcony, Nakhas, Patna City', 'RESCUED', 'SDRF Team 05', 'Food and potable water packets delivered. Family elected to shelter-in-place.', NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 9. Seed Audit Trail
INSERT INTO audit_events (id, user_id, actor_email, action_code, resource_id, ip_address, details_json, created_at)
VALUES
(1, 1, 'admin@suraksha.gov.in', 'ALERT_PUBLISH', 'ALT-2026-001', '127.0.0.1', '{"action": "publish_cap", "headline": "Official Flood Warning: Middle Ganga Basin Rising", "severity": "WARNING"}', NOW()),
(2, 2, 'operator@suraksha.gov.in', 'GATE_ADJUST', 'GATE-VAL-01', '127.0.0.1', '{"previous_opening_pct": 40, "new_opening_pct": 45, "reason": "Controlled discharge schedule"}', NOW())
ON DUPLICATE KEY UPDATE action_code=VALUES(action_code);


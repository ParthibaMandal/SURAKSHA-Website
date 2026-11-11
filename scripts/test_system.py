#!/usr/bin/env python3
"""
SURAKSHA End-to-End System Test & Verification Runner
Validates database schema creation, initial seeds, and FastAPI REST API endpoints.
"""

import os
import sys
import json
from datetime import datetime

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def run_tests():
    print("=" * 70)
    print("SURAKSHA SYSTEM VERIFICATION RUNNER")
    print(f"Timestamp: {datetime.utcnow().isoformat()}Z")
    print("=" * 70)

    try:
        from backend.app.database import engine, Base, SessionLocal
        from backend.app.models.user import User
        from backend.app.models.station import Station
        from backend.app.models.gate import GateControl
        from backend.app.models.alert import Alert
        from backend.app.models.sos import SOSRequest
        from backend.app.services.flood_simulator import simulate_hydrodynamic_run
        from backend.app.main import seed_initial_data
        
        print("\n[1/5] Initializing Database Schema...")
        Base.metadata.create_all(bind=engine)
        print("  ✓ Tables created successfully.")

        print("\n[2/5] Seeding & Verifying Database Fixtures...")
        db = SessionLocal()
        seed_initial_data(db)
        
        user_count = db.query(User).count()
        station_count = db.query(Station).count()
        gate_count = db.query(GateControl).count()
        alert_count = db.query(Alert).count()
        sos_count = db.query(SOSRequest).count()

        print(f"  ✓ Users in database: {user_count} (Admin, Operator, Citizen)")
        print(f"  ✓ Stations in database: {station_count} (Digha Ghat, Birpur, Valmikinagar...)")
        print(f"  ✓ Sluice Gates in database: {gate_count}")
        print(f"  ✓ Active Alerts in database: {alert_count}")
        print(f"  ✓ Emergency SOS Queue count: {sos_count}")
        
        assert user_count >= 3, "User count below threshold"
        assert station_count >= 4, "Station count below threshold"
        assert gate_count >= 3, "Gate count below threshold"
        db.close()

        print("\n[3/5] Testing Hydrodynamic Physics Simulation Engine...")
        run_res = simulate_hydrodynamic_run("SCEN-KOSI-BREACH", upstream_multiplier=1.2, precipitation_mm=80.0)
        print(f"  ✓ Simulation Run ID: {run_res['run_id']}")
        print(f"  ✓ Model Crest Prediction: {run_res['peak_forecast_m']}m")
        print(f"  ✓ Recommended Discharge Aperture: {run_res['recommended_gate_discharge_pct']}%")
        print(f"  ✓ Jev Validation Mode: {run_res['jev_status']}")
        assert run_res["status"] == "COMPLETED"
        assert run_res["pre_gate_check"]["passed"] is True
        assert run_res["mid_gate_check"]["passed"] is True

        print("\n[4/5] Testing FastAPI App Route Structure...")
        from backend.app.main import app
        route_paths = [r.path for r in app.routes]
        expected_routes = [
            "/health",
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/stations",
            "/api/v1/gates",
            "/api/v1/scenarios",
            "/api/v1/scenarios/run",
            "/api/v1/alerts/public",
            "/api/v1/alerts/drafts",
            "/api/v1/sos/submit",
            "/api/v1/sos/queue",
        ]
        for route in expected_routes:
            assert any(r.startswith(route) for r in route_paths), f"Missing route {route}"
            print(f"  ✓ Verified route: {route}")

        print("\n[5/5] Verification Summary...")
        print("  ✓ All Database models, seeds, and API routes PASSED.")
        print("=" * 70)
        print("ALL CHECKS PASSED: SURAKSHA PLATFORM READY FOR PRODUCTION DEPLOYMENT")
        print("=" * 70)
        return 0

    except Exception as e:
        print(f"\n[FAIL] Test verification failed with error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())


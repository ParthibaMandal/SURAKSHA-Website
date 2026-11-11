import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.routes import (
    auth,
    stations,
    gates,
    scenarios,
    alerts,
    sos,
    incidents,
    audit,
)
from backend.app.models.user import User
from backend.app.models.station import Station
from backend.app.models.gate import GateControl
from backend.app.models.scenario import Incident, AnalysisRun
from backend.app.models.alert import AlertDraft, Alert
from backend.app.models.sos import SOSRequest
from backend.app.models.audit import AuditEvent
from backend.app.services.auth_service import get_password_hash

def seed_initial_data(db):
    """Seed initial records if the database is newly initialized."""
    if db.query(User).count() == 0:
        admin_pass = get_password_hash("Password123!")
        users = [
            User(
                email="admin@suraksha.gov.in",
                password_hash=admin_pass,
                full_name="Chief Officer Vikram Rathore",
                phone_number="+91-9811100001",
                district="State HQ",
                role="admin",
            ),
            User(
                email="operator@suraksha.gov.in",
                password_hash=admin_pass,
                full_name="Dr. Ananya Sharma",
                phone_number="+91-9811100002",
                district="Patna Central",
                role="operator",
            ),
            User(
                email="citizen@example.com",
                password_hash=admin_pass,
                full_name="Ramesh Kumar Patel",
                phone_number="+91-9876543210",
                district="Kurji, Patna",
                role="citizen",
            ),
        ]
        db.add_all(users)

    if db.query(Station).count() == 0:
        stns = [
            Station(
                id="STN-PAT-01",
                name="Digha Ghat",
                river="Ganga",
                basin="Middle Ganga",
                latitude=25.6421,
                longitude=85.1052,
                warning_level_m=50.20,
                danger_level_m=51.50,
                hfl_m=52.52,
                current_level_m=50.85,
                status="ACTIVE",
            ),
            Station(
                id="STN-PAT-02",
                name="Gandhi Ghat",
                river="Ganga",
                basin="Middle Ganga",
                latitude=25.6214,
                longitude=85.1728,
                warning_level_m=48.60,
                danger_level_m=49.80,
                hfl_m=50.95,
                current_level_m=49.15,
                status="ACTIVE",
            ),
            Station(
                id="STN-VAL-01",
                name="Valmikinagar Barrage",
                river="Gandak",
                basin="Gandak Basin",
                latitude=27.4320,
                longitude=83.9140,
                warning_level_m=105.00,
                danger_level_m=107.50,
                hfl_m=109.80,
                current_level_m=106.20,
                status="ACTIVE",
            ),
            Station(
                id="STN-KOS-01",
                name="Birpur Barrage",
                river="Kosi",
                basin="Kosi Basin",
                latitude=26.5230,
                longitude=87.0120,
                warning_level_m=72.00,
                danger_level_m=74.20,
                hfl_m=76.10,
                current_level_m=73.80,
                status="ACTIVE",
            ),
        ]
        db.add_all(stns)
        db.commit()

        # Seed gates
        gates_list = [
            GateControl(id="GATE-VAL-01", station_id="STN-VAL-01", name="Valmikinagar Bay 01 (Left Sluice)", current_opening_pct=45, recommended_opening_pct=50, discharge_rate_cusecs=14200.00, mode="SUPERVISED"),
            GateControl(id="GATE-VAL-02", station_id="STN-VAL-01", name="Valmikinagar Bay 02 (Central Crest)", current_opening_pct=60, recommended_opening_pct=60, discharge_rate_cusecs=18900.00, mode="AUTOMATED"),
            GateControl(id="GATE-KOS-01", station_id="STN-KOS-01", name="Birpur Bay 08 (Radial Gate)", current_opening_pct=75, recommended_opening_pct=80, discharge_rate_cusecs=24500.00, mode="SUPERVISED"),
        ]
        db.add_all(gates_list)

    if db.query(Incident).count() == 0:
        inc = Incident(
            id="INC-2026-FL-001",
            title="Middle Ganga & Gandak Monsoon Surge Phase I",
            basin="Middle Ganga",
            phase="WARNING",
            severity="HIGH",
            incident_commander="Chief Officer Vikram Rathore",
        )
        db.add(inc)

    if db.query(Alert).count() == 0:
        draft = AlertDraft(
            id="DFT-2026-001",
            headline="Flood Stage Warning: Middle Ganga Basin Rising",
            description="Hydrological physical models predict water stage will approach danger levels at Digha Ghat.",
            severity="WARNING",
            urgency="EXPECTED",
            certainty="LIKELY",
            area_desc="Patna Urban and Danapur lowlands",
            recommended_actions="Prepare emergency family kits and monitor local sirens.",
            status="APPROVED",
        )
        db.add(draft)
        db.commit()

        alert = Alert(
            id="ALT-2026-001",
            draft_id=draft.id,
            cap_identifier="CAP-IN-BR-2026-0891",
            headline=draft.headline,
            description=draft.description,
            severity=draft.severity,
            urgency=draft.urgency,
            area_desc=draft.area_desc,
            approved_by="Chief Officer Vikram Rathore",
            expires_at=draft.created_at,
            status="ACTIVE",
        )
        db.add(alert)

    if db.query(SOSRequest).count() == 0:
        sos_items = [
            SOSRequest(
                id="SOS-1001",
                citizen_name="Ramesh Kumar Patel",
                phone_number="+91-9876543210",
                emergency_type="TRAPPED_WATER",
                severity="CRITICAL",
                people_count=4,
                latitude=25.6310,
                longitude=85.1120,
                landmark_address="Rooftop near community water tank, Ward 04, Kurji",
                status="DISPATCHED",
                assigned_team="NDRF Rescue Boat 02",
                notes="Water level at 1.8m on ground floor.",
            ),
            SOSRequest(
                id="SOS-1002",
                citizen_name="Priya Sahani",
                phone_number="+91-9876500112",
                emergency_type="MEDICAL",
                severity="CRITICAL",
                people_count=2,
                latitude=25.6450,
                longitude=85.0920,
                landmark_address="Green building adjacent to primary school, Digha Ghat",
                status="PENDING",
                notes="Requires urgent medical relocation.",
            ),
        ]
        db.add_all(sos_items)

    db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scientific Hydrological Intelligence, Barrage Automation & Emergency Response Decision Support API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred in hydrological calculation engine.", "error": str(exc)},
    )

# Mount Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(stations.router, prefix=api_v1)
app.include_router(gates.router, prefix=api_v1)
app.include_router(scenarios.router, prefix=api_v1)
app.include_router(alerts.router, prefix=api_v1)
app.include_router(sos.router, prefix=api_v1)
app.include_router(incidents.router, prefix=api_v1)
app.include_router(audit.router, prefix=api_v1)

@app.get("/health", tags=["System Telemetry"])
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "operational_readiness": "FULL_OPERATIONAL",
        "database": "CONNECTED",
        "jev_mode": settings.JEV_MODE,
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "documentation": "/docs",
        "api_v1": settings.API_V1_STR,
    }


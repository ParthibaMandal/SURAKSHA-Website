import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.sos import SOSRequest
from backend.app.models.audit import AuditEvent
from backend.app.schemas.sos import SOSSubmitRequest, SOSTriageUpdate, SOSOut
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/sos", tags=["Citizen Emergency Rescue SOS"])

@router.post("/submit", response_model=SOSOut, status_code=status.HTTP_201_CREATED)
def submit_sos_request(
    payload: SOSSubmitRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    sos_id = f"SOS-{uuid.uuid4().hex[:6].upper()}"
    notes = payload.additional_notes or ""
    user_id = current_user.id if current_user else None

    sos = SOSRequest(
        id=sos_id,
        user_id=user_id,
        citizen_name=payload.citizen_name,
        phone_number=payload.phone_number,
        emergency_type=payload.emergency_type,
        severity=payload.severity,
        people_count=payload.people_count,
        latitude=payload.latitude,
        longitude=payload.longitude,
        landmark_address=payload.landmark_address,
        status="PENDING",
        notes=notes,
    )
    db.add(sos)

    # Audit
    audit = AuditEvent(
        actor_email=current_user.email if current_user else "citizen_public@suraksha.local",
        action_code="SOS_SUBMIT",
        resource_id=sos_id,
        details_json=f'{{"citizen": "{payload.citizen_name}", "people": {payload.people_count}, "emergency": "{payload.emergency_type}"}}',
    )
    db.add(audit)
    db.commit()
    db.refresh(sos)
    return sos

@router.get("/queue", response_model=List[SOSOut])
def list_sos_queue(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(SOSRequest)
    if status_filter:
        query = query.filter(SOSRequest.status == status_filter)
    return query.order_by(SOSRequest.created_at.desc()).all()

@router.patch("/{sos_id}/status", response_model=SOSOut)
def update_sos_triage(
    sos_id: str,
    payload: SOSTriageUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    sos = db.query(SOSRequest).filter(SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail=f"SOS request '{sos_id}' not found.")
    
    sos.status = payload.status
    if payload.assigned_team:
        sos.assigned_team = payload.assigned_team
    if payload.notes:
        sos.notes = f"{sos.notes}\n[Update]: {payload.notes}".strip()
    
    actor_email = current_user.email if current_user else "operator@suraksha.local"
    audit = AuditEvent(
        actor_email=actor_email,
        action_code="SOS_TRIAGE_UPDATE",
        resource_id=sos_id,
        details_json=f'{{"new_status": "{payload.status}", "assigned_team": "{payload.assigned_team}"}}',
    )
    db.add(audit)
    db.commit()
    db.refresh(sos)
    return sos


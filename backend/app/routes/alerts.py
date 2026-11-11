import uuid
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.alert import AlertDraft, Alert
from backend.app.models.audit import AuditEvent
from backend.app.schemas.alert import AlertDraftOut, AlertApproveRequest, AlertOut
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/alerts", tags=["CAP Alerts & Approvals"])

@router.get("/public", response_model=List[AlertOut])
def get_public_alerts(db: Session = Depends(get_db)):
    """Open to public citizens and external aggregators."""
    return db.query(Alert).filter(Alert.status == "ACTIVE").order_by(Alert.approved_at.desc()).all()

@router.get("/drafts", response_model=List[AlertDraftOut])
def list_alert_drafts(db: Session = Depends(get_db)):
    """Operator / Commander inbox of pending alert drafts."""
    return db.query(AlertDraft).filter(AlertDraft.status == "PENDING_REVIEW").order_by(AlertDraft.created_at.desc()).all()

@router.post("/drafts/{draft_id}/approve", response_model=AlertOut)
def approve_alert_draft(
    draft_id: str,
    payload: AlertApproveRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    draft = db.query(AlertDraft).filter(AlertDraft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail=f"Alert draft '{draft_id}' not found.")
    
    approver = current_user.full_name if current_user else "Chief Officer Vikram Rathore"
    actor_email = current_user.email if current_user else "admin@suraksha.local"

    if payload.decision == "APPROVE":
        draft.status = "APPROVED"
        alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
        cap_id = f"CAP-IN-BR-2026-{uuid.uuid4().hex[:4].upper()}"
        expires_at = datetime.utcnow() + timedelta(hours=payload.effective_hours)

        alert = Alert(
            id=alert_id,
            draft_id=draft.id,
            cap_identifier=cap_id,
            headline=draft.headline,
            description=f"{draft.description}\n\nCommander Note: {payload.commander_comments}",
            severity=draft.severity,
            urgency=draft.urgency,
            area_desc=draft.area_desc,
            approved_by=approver,
            approved_at=datetime.utcnow(),
            expires_at=expires_at,
            status="ACTIVE",
        )
        db.add(alert)

        # Audit
        audit = AuditEvent(
            actor_email=actor_email,
            action_code="ALERT_PUBLISH",
            resource_id=alert_id,
            details_json=f'{{"cap_id": "{cap_id}", "headline": "{alert.headline}", "approved_by": "{approver}"}}',
        )
        db.add(audit)
        db.commit()
        db.refresh(alert)
        return alert
    else:
        draft.status = "REJECTED"
        db.commit()
        raise HTTPException(status_code=200, detail="Draft rejected and removed from approval queue.")


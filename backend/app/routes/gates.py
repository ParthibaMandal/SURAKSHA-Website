from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.gate import GateControl
from backend.app.models.audit import AuditEvent
from backend.app.schemas.gate import GateOut, GateActuate
from backend.app.services.auth_service import get_current_user

router = APIRouter(prefix="/gates", tags=["Barrage Gates & Discharge Controls"])

@router.get("", response_model=List[GateOut])
def list_gates(db: Session = Depends(get_db)):
    return db.query(GateControl).all()

@router.post("/{gate_id}/actuate", response_model=GateOut)
def actuate_gate(
    gate_id: str,
    payload: GateActuate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    gate = db.query(GateControl).filter(GateControl.id == gate_id).first()
    if not gate:
        raise HTTPException(status_code=404, detail=f"Gate '{gate_id}' not found.")
    
    prev_pct = gate.current_opening_pct
    gate.current_opening_pct = payload.target_opening_pct
    # Estimated discharge volume proportional to aperture
    gate.discharge_rate_cusecs = round(payload.target_opening_pct * 380.0, 2)
    gate.last_actuated_at = datetime.utcnow()
    
    # Record immutable audit entry
    actor_email = current_user.email if current_user else "operator@suraksha.local"
    audit = AuditEvent(
        actor_email=actor_email,
        action_code="GATE_OVERRIDE",
        resource_id=gate.id,
        details_json=f'{{"previous_opening_pct": {prev_pct}, "new_opening_pct": {payload.target_opening_pct}, "reason": "{payload.override_reason}"}}',
    )
    db.add(audit)
    db.commit()
    db.refresh(gate)
    return gate


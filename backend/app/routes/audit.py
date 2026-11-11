from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.audit import AuditEvent

router = APIRouter(prefix="/audit", tags=["Append-Only Audit Ledger"])

@router.get("")
def list_audit_events(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(limit).all()


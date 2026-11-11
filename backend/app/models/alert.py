from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class AlertDraft(Base):
    __tablename__ = "alert_drafts"

    id = Column(String(50), primary_key=True)
    run_id = Column(String(50), ForeignKey("analysis_runs.id", ondelete="SET NULL"), nullable=True)
    headline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False, default="WARNING")
    urgency = Column(String(20), nullable=False, default="EXPECTED")
    certainty = Column(String(20), nullable=False, default="LIKELY")
    area_desc = Column(String(255), nullable=False)
    recommended_actions = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="PENDING_REVIEW")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    run = relationship("AnalysisRun", back_populates="drafts")
    alert = relationship("Alert", back_populates="draft", uselist=False)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True)
    draft_id = Column(String(50), ForeignKey("alert_drafts.id", ondelete="SET NULL"), nullable=True)
    cap_identifier = Column(String(100), nullable=False, unique=True)
    headline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)
    urgency = Column(String(20), nullable=False)
    area_desc = Column(String(255), nullable=False)
    approved_by = Column(String(150), nullable=False)
    approved_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    status = Column(String(30), nullable=False, default="ACTIVE")

    draft = relationship("AlertDraft", back_populates="alert")


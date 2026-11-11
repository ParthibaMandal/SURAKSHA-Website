from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True)
    title = Column(String(200), nullable=False)
    basin = Column(String(100), nullable=False)
    phase = Column(String(30), nullable=False, default="WATCH")
    severity = Column(String(20), nullable=False, default="MODERATE")
    incident_commander = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    closed_at = Column(DateTime, nullable=True)

    analysis_runs = relationship("AnalysisRun", back_populates="incident")


class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(String(50), primary_key=True)
    incident_id = Column(String(50), ForeignKey("incidents.id", ondelete="SET NULL"), nullable=True)
    scenario_name = Column(String(150), nullable=False)
    model_type = Column(String(50), nullable=False, default="Saint-Venant 1D-2D Ensemble")
    pre_gate_pass = Column(Boolean, nullable=False, default=True)
    mid_gate_pass = Column(Boolean, nullable=False, default=True)
    post_gate_pass = Column(Boolean, nullable=False, default=True)
    jev_status = Column(String(30), nullable=False, default="OFFLINE_DETERMINISTIC")
    peak_forecast_m = Column(Numeric(6, 2), nullable=False)
    inundation_risk_index = Column(Numeric(4, 3), nullable=False, default=0.650)
    executed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    incident = relationship("Incident", back_populates="analysis_runs")
    drafts = relationship("AlertDraft", back_populates="run")


from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.app.database import Base

class GateControl(Base):
    __tablename__ = "gate_controls"

    id = Column(String(50), primary_key=True)
    station_id = Column(String(50), ForeignKey("stations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    current_opening_pct = Column(Integer, nullable=False, default=40)
    recommended_opening_pct = Column(Integer, nullable=True)
    discharge_rate_cusecs = Column(Numeric(10, 2), nullable=False, default=12000.00)
    mode = Column(String(20), nullable=False, default="SUPERVISED")
    last_actuated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    station = relationship("Station", back_populates="gates")


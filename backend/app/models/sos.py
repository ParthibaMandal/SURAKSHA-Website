from datetime import datetime
from sqlalchemy import Column, BigInteger, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.app.database import Base

class SOSRequest(Base):
    __tablename__ = "sos_requests"

    id = Column(String(50), primary_key=True)
    user_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    citizen_name = Column(String(150), nullable=False)
    phone_number = Column(String(30), nullable=False)
    emergency_type = Column(String(50), nullable=False, default="TRAPPED_WATER")
    severity = Column(String(20), nullable=False, default="CRITICAL")
    people_count = Column(Integer, nullable=False, default=1)
    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    landmark_address = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="PENDING")
    assigned_team = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="sos_requests")


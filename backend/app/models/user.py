from datetime import datetime
from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone_number = Column(String(30), nullable=True)
    district = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False, default="citizen", index=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    saved_locations = relationship("SavedLocation", back_populates="user", cascade="all, delete-orphan")
    sos_requests = relationship("SOSRequest", back_populates="user")
    audit_events = relationship("AuditEvent", back_populates="user")


class SavedLocation(Base):
    __tablename__ = "saved_locations"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    user_id = Column(BigInteger().with_variant(Integer, "sqlite"), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100), nullable=False)
    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    basin = Column(String(100), nullable=False)
    alert_radius_km = Column(Numeric(5, 2), nullable=False, default=10.00)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="saved_locations")


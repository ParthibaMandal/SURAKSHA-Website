from datetime import datetime
from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(String(50), primary_key=True)
    name = Column(String(150), nullable=False)
    river = Column(String(100), nullable=False)
    basin = Column(String(100), nullable=False, index=True)
    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    warning_level_m = Column(Numeric(6, 2), nullable=False)
    danger_level_m = Column(Numeric(6, 2), nullable=False)
    hfl_m = Column(Numeric(6, 2), nullable=False)
    current_level_m = Column(Numeric(6, 2), nullable=False)
    status = Column(String(30), nullable=False, default="ACTIVE", index=True)
    quality_flag = Column(String(20), nullable=False, default="VERIFIED")
    last_observed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    observations = relationship("Observation", back_populates="station", cascade="all, delete-orphan")
    gates = relationship("GateControl", back_populates="station")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    station_id = Column(String(50), ForeignKey("stations.id", ondelete="CASCADE"), nullable=False)
    water_level_m = Column(Numeric(6, 2), nullable=False)
    discharge_m3s = Column(Numeric(10, 2), nullable=True)
    rainfall_mm = Column(Numeric(6, 2), nullable=False, default=0.00)
    quality_flag = Column(String(20), nullable=False, default="VERIFIED")
    observed_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    station = relationship("Station", back_populates="observations")


from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.station import Station, Observation
from backend.app.schemas.station import StationOut, ObservationOut

router = APIRouter(prefix="/stations", tags=["River Telemetry Stations"])

@router.get("", response_model=List[StationOut])
def list_stations(
    basin: Optional[str] = Query(None, description="Filter by river basin"),
    status: Optional[str] = Query(None, description="Filter by status (ACTIVE/OFFLINE)"),
    db: Session = Depends(get_db),
):
    query = db.query(Station)
    if basin:
        query = query.filter(Station.basin == basin)
    if status:
        query = query.filter(Station.status == status)
    return query.all()

@router.get("/{station_id}", response_model=StationOut)
def get_station_detail(station_id: str, db: Session = Depends(get_db)):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail=f"Station '{station_id}' not found.")
    return station

@router.get("/{station_id}/observations", response_model=List[ObservationOut])
def get_station_observations(
    station_id: str,
    limit: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db),
):
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail=f"Station '{station_id}' not found.")
    
    observations = (
        db.query(Observation)
        .filter(Observation.station_id == station_id)
        .order_by(Observation.observed_at.desc())
        .limit(limit)
        .all()
    )
    return observations


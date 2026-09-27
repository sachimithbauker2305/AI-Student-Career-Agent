import json
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.saved_career import SavedCareer
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.schemas.saved_career import SavedCareerCreate
from backend.app.services.activity_service import record_activity

router = APIRouter(prefix="/api/saved-careers", tags=["Saved Careers"])


def _serialize_saved_career(item: SavedCareer) -> dict:
    return {
        "id": item.id,
        "user_id": item.user_id,
        "career_id": item.career_id,
        "title": item.title,
        "domain": item.domain,
        "match_score": item.match_score,
        "description": item.description,
        "why_fit": item.why_fit,
        "avg_salary_lpa": item.avg_salary_lpa,
        "required_education": item.required_education,
        "key_skills": SavedCareer.normalize_list(item.key_skills),
        "tags": SavedCareer.normalize_list(item.tags),
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }


@router.get("")
def list_saved_careers(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    saved = (
        db.query(SavedCareer)
        .filter(SavedCareer.user_id == user.id)
        .order_by(SavedCareer.created_at.desc())
        .all()
    )
    return [_serialize_saved_career(item) for item in saved]


@router.post("")
def save_career(payload: SavedCareerCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = (
        db.query(SavedCareer)
        .filter(SavedCareer.user_id == user.id, SavedCareer.career_id == payload.career_id)
        .first()
    )
    if existing:
        return _serialize_saved_career(existing)

    saved = SavedCareer(
        user_id=user.id,
        career_id=payload.career_id,
        title=payload.title,
        domain=payload.domain or "",
        match_score=payload.match_score or 0,
        description=payload.description or "",
        why_fit=payload.why_fit or "",
        avg_salary_lpa=payload.avg_salary_lpa or "",
        required_education=payload.required_education or "",
        key_skills=json.dumps(payload.key_skills or []),
        tags=json.dumps(payload.tags or []),
    )
    db.add(saved)
    db.flush()
    record_activity(db, user.id, "saved_career", f"Saved {saved.title} to your shortlist", datetime.utcnow(), commit=False)
    db.commit()
    db.refresh(saved)
    return _serialize_saved_career(saved)


@router.delete("/{career_id}")
def delete_saved_career(career_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = (
        db.query(SavedCareer)
        .filter(SavedCareer.user_id == user.id, SavedCareer.career_id == career_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Career not found in saved list")
    title = item.title
    db.delete(item)
    db.commit()
    record_activity(db, user.id, "saved_career_removed", f"Removed {title} from your shortlist")
    return {"status": "success", "career_id": career_id}


@router.get("/compare")
def compare_saved_careers(career_ids: str = Query(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    parsed_ids = [int(value.strip()) for value in career_ids.split(",") if value and value.strip()]
    if not parsed_ids:
        return []

    saved = (
        db.query(SavedCareer)
        .filter(SavedCareer.user_id == user.id, SavedCareer.career_id.in_(parsed_ids))
        .order_by(SavedCareer.created_at.desc())
        .all()
    )
    return [_serialize_saved_career(item) for item in saved]

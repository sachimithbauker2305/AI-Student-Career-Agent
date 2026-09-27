from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.schemas.action_plan import UpdateStepStatusRequest
from backend.app.services.profile_service import calculate_profile_completion, get_or_create_profile
from backend.app.services.action_plan_service import get_or_generate_action_plan, update_step_status
from backend.app.services.recommendation_service import fetch_recommendations

router = APIRouter(prefix="/api/action-plan", tags=["Action Plan"])

@router.get("")
def get_action_plan(
    career: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not career:
        profile = get_or_create_profile(db, user.id)
        if calculate_profile_completion(profile) < 75:
            return {"target_career": "", "steps": []}
        recs = fetch_recommendations({"major": profile.stream_major, "cgpa": profile.cgpa_percentage, "interests": profile.interests.split(",") if profile.interests else [], "skills": profile.skills.split(",") if profile.skills else []})
        if not recs:
            return {"target_career": "", "steps": []}
        career = recs[0]["title"]
    profile = get_or_create_profile(db, user.id)
    steps = get_or_generate_action_plan(db, user.id, target_career=career, stream_major=profile.stream_major or "")
    return {
        "target_career": career,
        "steps": steps
    }

@router.post("/update-status")
def update_status(
    req: UpdateStepStatusRequest,
    career: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = update_step_status(db, user.id, req.step_number, req.status, target_career=career)
    return {"status": "success" if success else "error", "message": "Step status updated."}

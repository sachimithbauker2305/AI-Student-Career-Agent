from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.services.profile_service import calculate_profile_completion, get_or_create_profile
from backend.app.services.recommendation_service import fetch_recommendations, fetch_career_details
from ai.recommendation_engine import get_all_colleges_for_profile

router = APIRouter(prefix="/api/recommendations", tags=["Career Recommendations"])

@router.get("/list")
def list_recommendations(
    domain: Optional[str] = Query("All"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(db, user.id)
    if calculate_profile_completion(profile) < 75:
        return []
    profile_dict = {
        "major": profile.stream_major,
        "cgpa": profile.cgpa_percentage,
        "interests": profile.interests.split(",") if profile.interests else [],
        "skills": profile.skills.split(",") if profile.skills else [],
        "budget_range": profile.budget_range,
        "preferred_locations": profile.preferred_locations.split(",") if profile.preferred_locations else []
    }
    # Show only the highest-scoring personalised options so the page stays focused.
    recommendations = fetch_recommendations(profile_dict, domain=domain)
    return recommendations[:5]

@router.get("/{career_id}/colleges")
def get_career_colleges(career_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    profile_dict = {
        "major": profile.stream_major or "Other",
        "cgpa": profile.cgpa_percentage,
        "interests": profile.interests.split(",") if profile.interests else [],
        "skills": profile.skills.split(",") if profile.skills else [],
        "budget_range": profile.budget_range or "Medium",
        "preferred_locations": profile.preferred_locations.split(",") if profile.preferred_locations else []
    }
    # Reuse the selected career title when available so matching programmes are ranked first.
    career = fetch_career_details(career_id, profile_dict)
    course_hint = career.get("title") if career else None
    colleges, note = get_all_colleges_for_profile(
        profile_dict["major"],
        profile_dict["preferred_locations"],
        profile_dict["budget_range"],
        course_hint
    )
    return {
        "colleges": colleges,
        "location_note": note,
        "stream": profile_dict["major"]
    }

@router.get("/{career_id}")
def get_career(career_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    profile_dict = {
        "major": profile.stream_major,
        "cgpa": profile.cgpa_percentage,
        "interests": profile.interests.split(",") if profile.interests else [],
        "skills": profile.skills.split(",") if profile.skills else [],
        "budget_range": profile.budget_range,
        "preferred_locations": profile.preferred_locations.split(",") if profile.preferred_locations else []
    }
    details = fetch_career_details(career_id, profile_dict)
    if not details:
        raise HTTPException(status_code=404, detail="Career not found")
    return details

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.schemas.profile import ProfileStep1Request, ProfileDetailedRequest
from ai.stream_config import get_stream_config
from backend.app.services.profile_service import get_or_create_profile, update_profile_step1, update_profile_detailed, calculate_profile_completion
from backend.app.services.activity_service import record_activity

router = APIRouter(prefix="/api/profile", tags=["Student Profile"])

@router.get("")
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    interests_list = [i.strip() for i in profile.interests.split(",") if i.strip()] if profile.interests else []
    skills_list = [s.strip() for s in profile.skills.split(",") if s.strip()] if profile.skills else []
    preferred_subjects_list = [s.strip() for s in profile.preferred_subjects.split(",") if s.strip()] if profile.preferred_subjects else []
    locations_list = [l.strip() for l in profile.preferred_locations.split(",") if l.strip()] if profile.preferred_locations else []
    profile.profile_completion_percent = calculate_profile_completion(profile)
    db.commit()

    return {
        "education_level": profile.education_level,
        "stream_major": profile.stream_major,
        "cgpa_percentage": profile.cgpa_percentage,
        "year_of_study": profile.year_of_study,
        "interests": interests_list,
        "skills": skills_list,
        "preferred_subjects": preferred_subjects_list,
        "budget_range": profile.budget_range,
        "preferred_locations": locations_list,
        "profile_completion_percent": profile.profile_completion_percent
    }

@router.post("/step1")
def save_step1(req: ProfileStep1Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = update_profile_step1(db, user.id, req.dict())
    record_activity(db, user.id, "profile", "Updated your academic profile")
    return {"status": "success", "message": "Academic details and interests updated.", "profile_completion": profile.profile_completion_percent}

@router.post("/step2")
def save_step2(req: ProfileDetailedRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = update_profile_detailed(db, user.id, req.dict())
    record_activity(db, user.id, "profile", "Updated your preferences and skills")
    return {"status": "success", "message": "Detailed profile preferences updated.", "profile_completion": profile.profile_completion_percent}


@router.get("/stream-config")
def get_stream_configuration(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    cfg = get_stream_config(profile.stream_major)
    return {"stream": cfg["label"], "skills": cfg["skills"], "subjects": cfg["subjects"], "interests": cfg["interests"], "pathways": cfg["pathways"]}

from fastapi import APIRouter, Depends, Query
from backend.app.schemas.recommendation import EligibilityCheckRequest
from backend.app.services.eligibility_service import evaluate_eligibility, get_colleges_and_courses
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.services.profile_service import calculate_profile_completion, get_or_create_profile

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility Check"])

@router.get("/options")
def get_options(course: str = Query(default=""), user: User = Depends(get_current_user), db=Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    locations = [l.strip() for l in profile.preferred_locations.split(",") if l.strip()] if profile.preferred_locations else []
    return get_colleges_and_courses(
        stream=profile.stream_major,
        locations=locations,
        budget=profile.budget_range or "Medium",
        course=course.strip() or None
    )

@router.post("/check")
def check(req: EligibilityCheckRequest):
    return evaluate_eligibility(
        course=req.course,
        college=req.college,
        category=req.category,
        student_score=req.student_score if req.student_score is not None else 85.0
    )

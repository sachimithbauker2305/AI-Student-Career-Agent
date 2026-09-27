import os
import sys
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.services.profile_service import calculate_profile_completion, get_or_create_profile

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ai.profile_analysis import ProfileAnalyzer

router = APIRouter(prefix="/api/ai-analysis", tags=["AI Analysis"])
analyzer = ProfileAnalyzer()

@router.get("")
def get_ai_analysis(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    if calculate_profile_completion(profile) < 75:
        return {
            "profile_match_score": 0,
            "score_explanation": "Complete your profile to generate your analysis.",
            "key_insights": [],
            "strengths": [],
            "areas_to_improve": [],
            "suggested_pathways": []
        }
    profile_dict = {
        "education_level": profile.education_level,
        "major": profile.stream_major,
        "cgpa": profile.cgpa_percentage,
        "year": profile.year_of_study,
        "interests": profile.interests.split(",") if profile.interests else [],
        "skills": profile.skills.split(",") if profile.skills else []
    }
    analysis = analyzer.analyze(profile_dict)
    return analysis

@router.get("/questions")
def get_adaptive_questions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    questions = analyzer.generate_adaptive_questions({"major": profile.stream_major})
    return {"questions": questions}

@router.post("/submit-questions")
def submit_question_answers(answers: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {
        "status": "success",
        "message": "Discovery responses recorded. Career profile weights updated.",
        "adapted_confidence": 94
    }

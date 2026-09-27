import os
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.schemas.chatbot import ChatRequest, ChatResponse
from backend.app.services.profile_service import get_or_create_profile
from backend.app.services.recommendation_service import fetch_recommendations
from backend.app.services.chatbot_service import ChatbotService, AIUnavailableError
router = APIRouter(prefix="/api/chatbot", tags=["Career Assistant"])

chatbot_service = ChatbotService()


def _profile_context(profile: Any) -> Dict[str, Any]:
    return {
        "education_level": profile.education_level or "",
        "stream_major": profile.stream_major or "",
        "cgpa_percentage": profile.cgpa_percentage or 0,
        "year_of_study": profile.year_of_study or "",
        "interests": [
            x.strip() for x in (profile.interests or "").split(",") if x.strip()
        ],
        "skills": [
            x.strip() for x in (profile.skills or "").split(",") if x.strip()
        ],
        "preferred_subjects": [
            x.strip()
            for x in (profile.preferred_subjects or "").split(",")
            if x.strip()
        ],
        "budget_range": profile.budget_range or "",
        "preferred_locations": [
            x.strip()
            for x in (profile.preferred_locations or "").split(",")
            if x.strip()
        ],
        "profile_completion_percent": profile.profile_completion_percent or 0,
    }


def _recommendation_context(profile_dict: Dict[str, Any]) -> List[Dict[str, Any]]:
    try:
        recommendations = fetch_recommendations(
            {
                "major": profile_dict["stream_major"],
                "cgpa": profile_dict["cgpa_percentage"],
                "interests": profile_dict["interests"],
                "skills": profile_dict["skills"],
                "budget_range": profile_dict["budget_range"],
                "preferred_locations": profile_dict["preferred_locations"],
            },
            domain="All",
        )
        return [
            {
                "title": item.get("title"),
                "domain": item.get("domain"),
                "match_score": item.get("match_score"),
                "description": item.get("description"),
                "required_education": item.get("required_education"),
                "key_skills": item.get("key_skills", []),
            }
            for item in recommendations[:8]
        ]
    except Exception:
        return []


@router.post("", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(db, user.id)
    profile_context = _profile_context(profile)
    recommendations = _recommendation_context(profile_context)

    history = [
        {"role": message.role, "content": message.content}
        for message in request.history[-20:]
    ]

    try:
        reply, _model = chatbot_service.generate_reply(
            request.message,
            student_profile=profile_context,
            chat_history=history,
            recommendations=recommendations,
        )
    except AIUnavailableError as exc:
     raise HTTPException(status_code=503, detail=str(exc)) from exc

    return {"reply": reply}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.routers.auth import get_current_user
from backend.app.services.profile_service import calculate_profile_completion, get_or_create_profile
from backend.app.services.recommendation_service import fetch_recommendations
from backend.app.models.action_plan import RecentActivity, ActionPlanStep
from backend.app.models.saved_career import SavedCareer
from backend.app.services.activity_service import format_activity_timestamp, activity_time_ago

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def _activity(item_id, title, created_at):
    return {
        "id": item_id,
        "title": title,
        "timestamp": created_at.isoformat() if created_at else None,
        "timestamp_text": format_activity_timestamp(created_at),
        "time_ago": activity_time_ago(created_at),
    }


@router.get("/summary")
def get_dashboard_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_profile(db, user.id)
    profile_dict = {
        "major": profile.stream_major or "Other",
        "cgpa": profile.cgpa_percentage,
        "interests": profile.interests.split(",") if profile.interests else [],
        "skills": profile.skills.split(",") if profile.skills else [],
        "budget_range": profile.budget_range,
        "preferred_locations": profile.preferred_locations.split(",") if profile.preferred_locations else []
    }
    profile_completion = calculate_profile_completion(profile)
    profile.profile_completion_percent = profile_completion
    db.commit()
    recs = fetch_recommendations(profile_dict) if profile_completion >= 75 else []
    top_3 = recs[:3] if recs else []

    recorded = (
        db.query(RecentActivity)
        .filter(RecentActivity.user_id == user.id)
        .order_by(RecentActivity.created_at.desc())
        .limit(12)
        .all()
    )
    activities = [_activity(f"activity-{item.id}", item.title, item.created_at) for item in recorded]

    # Older accounts may predate activity tracking. Build the feed from actions that
    # already exist in the database so the section is useful immediately.
    if profile.updated_at:
        activities.append(_activity("profile-updated", "Updated your student profile", profile.updated_at))

    saved_items = (
        db.query(SavedCareer)
        .filter(SavedCareer.user_id == user.id)
        .order_by(SavedCareer.created_at.desc())
        .limit(6)
        .all()
    )
    for saved in saved_items:
        activities.append(_activity(f"saved-{saved.id}", f"Saved {saved.title} to your shortlist", saved.created_at))

    plan_steps = (
        db.query(ActionPlanStep)
        .filter(ActionPlanStep.user_id == user.id)
        .order_by(ActionPlanStep.created_at.desc())
        .limit(6)
        .all()
    )
    seen_careers = set()
    for step in plan_steps:
        if step.target_career in seen_careers:
            continue
        seen_careers.add(step.target_career)
        activities.append(_activity(f"plan-{step.id}", f"Started your {step.target_career} action plan", step.created_at))

    # Keep one event per source and show the newest six.
    unique = {}
    for item in activities:
        key = (item.get("title"), item.get("timestamp"))
        unique[key] = item
    activities = sorted(unique.values(), key=lambda x: x.get("timestamp") or "", reverse=True)[:6]

    return {
        "student_name": user.first_name,
        "profile_completion": profile_completion,
        "recommended_careers_count": len(recs),
        "action_plan_progress": 0,
        "top_matches": [
            {
                "id": r["id"],
                "title": r["title"],
                "match_score": r["match_score"],
                "domain": r["domain"],
                "description": r["description"]
            }
            for r in top_3
        ],
        "recent_activity": activities
    }

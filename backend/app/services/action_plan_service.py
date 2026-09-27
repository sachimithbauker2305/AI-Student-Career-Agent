import os
import sys
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.action_plan import ActionPlanStep

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ai.action_plan_generator import ActionPlanGenerator
from backend.app.services.activity_service import record_activity

generator = ActionPlanGenerator()


def get_or_generate_action_plan(db: Session, user_id: int, target_career: str = "Software Developer", stream_major: str = "") -> List[Dict[str, Any]]:
    steps = db.query(ActionPlanStep).filter(
        ActionPlanStep.user_id == user_id,
        ActionPlanStep.target_career == target_career
    ).order_by(ActionPlanStep.step_number).all()

    if not steps:
        raw_plan = generator.generate_plan(target_career, stream_major)
        db_steps = []
        for p in raw_plan:
            db_step = ActionPlanStep(
                user_id=user_id,
                target_career=target_career,
                step_number=p["step_number"],
                title=p["title"],
                description=p["description"],
                timeline=p["timeline"],
                status=p["status"]
            )
            db.add(db_step)
            db_steps.append(db_step)
        db.commit()
        for s in db_steps:
            db.refresh(s)
        steps = db_steps
        record_activity(db, user_id, "action_plan", f"Started your {target_career} action plan")

    return [
        {
            "id": s.id,
            "step_number": s.step_number,
            "title": s.title,
            "description": s.description,
            "timeline": s.timeline,
            "status": s.status
        }
        for s in steps
    ]


def update_step_status(db: Session, user_id: int, step_number: int, new_status: str, target_career: str = "Software Developer") -> bool:
    query = db.query(ActionPlanStep).filter(
        ActionPlanStep.user_id == user_id,
        ActionPlanStep.step_number == step_number
    )
    if target_career:
        query = query.filter(ActionPlanStep.target_career == target_career)
    step = query.first()
    if step:
        step.status = new_status
        db.commit()
        label = {"Completed": "Completed", "In Progress": "Started", "Upcoming": "Reopened"}.get(new_status, new_status)
        record_activity(db, user_id, "action_plan_step", f"{label} step {step_number} of your {step.target_career} action plan")
        return True
    return False

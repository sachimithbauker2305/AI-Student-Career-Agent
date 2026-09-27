from pydantic import BaseModel
from typing import List, Optional

class ActionPlanStepSchema(BaseModel):
    step_number: int
    title: str
    status: str # 'In Progress', 'Upcoming', 'Completed'
    description: str
    timeline: str

class ActionPlanResponse(BaseModel):
    target_career: str
    steps: List[ActionPlanStepSchema]

class UpdateStepStatusRequest(BaseModel):
    step_number: int
    status: str # 'In Progress', 'Upcoming', 'Completed'

class DashboardSummaryResponse(BaseModel):
    student_name: str
    profile_completion: int
    recommended_careers_count: int
    action_plan_progress: int
    top_matches: List[dict]
    recent_activity: List[dict]

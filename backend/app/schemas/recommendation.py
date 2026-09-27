from pydantic import BaseModel
from typing import List, Optional

class CareerSummary(BaseModel):
    id: int
    title: str
    domain: str
    match_score: int
    description: str
    why_fit: str
    avg_salary_lpa: str
    job_outlook: str
    tags: List[str]

class CareerDetailResponse(BaseModel):
    id: int
    title: str
    domain: str
    match_score: int
    description: str
    why_fit: str
    why_fit_points: List[str]
    avg_salary_lpa: str
    job_outlook: str
    required_education: str
    key_skills: List[str]
    tags: List[str]
    overview: str
    career_path: List[dict]
    top_colleges: List[str]

class EligibilityCheckRequest(BaseModel):
    course: str
    college: str
    category: str = "General"
    student_score: Optional[float] = 85.0

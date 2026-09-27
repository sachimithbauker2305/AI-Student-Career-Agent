from pydantic import BaseModel
from typing import List, Optional

class ProfileStep1Request(BaseModel):
    education_level: str = "Undergraduate"
    stream_major: str = "Computer Science"
    cgpa_percentage: float = 8.5
    year_of_study: str = "2nd Year"
    interests: List[str] = ["Technology"]

class ProfileDetailedRequest(BaseModel):
    skills: List[str] = ["Problem solving", "Programming", "Analytical thinking", "Adaptability"]
    preferred_subjects: List[str] = ["Data Structures", "Algorithms", "Web Development"]
    budget_range: Optional[str] = "Medium"
    preferred_locations: Optional[List[str]] = ["Bangalore", "Hyderabad", "Remote"]

class ProfileResponse(BaseModel):
    education_level: str
    stream_major: str
    cgpa_percentage: float
    year_of_study: str
    interests: List[str]
    skills: List[str]
    profile_completion_percent: int

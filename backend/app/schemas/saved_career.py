from typing import List, Optional

from pydantic import BaseModel


class SavedCareerCreate(BaseModel):
    career_id: int
    title: str
    domain: Optional[str] = ""
    match_score: Optional[int] = 0
    description: Optional[str] = ""
    why_fit: Optional[str] = ""
    avg_salary_lpa: Optional[str] = ""
    required_education: Optional[str] = ""
    key_skills: Optional[List[str]] = []
    tags: Optional[List[str]] = []

    class Config:
        orm_mode = True

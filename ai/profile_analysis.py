"""
Profile Analysis Engine
Stream-aware analysis: insights, strengths, improvement areas and pathways follow the selected stream.
"""
from typing import Dict, Any, List
from ai.stream_config import get_stream_config

class ProfileAnalyzer:
    def analyze(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        education_level = profile_data.get("education_level", "Undergraduate")
        major = profile_data.get("major", "Other")
        cfg = get_stream_config(major)
        cgpa = float(profile_data.get("cgpa", 0) or 0)
        year = profile_data.get("year", "2nd Year")
        interests = profile_data.get("interests") or []
        if isinstance(interests, str):
            interests = [i.strip() for i in interests.split(",") if i.strip()]
        user_skills = profile_data.get("skills") or []
        if isinstance(user_skills, str):
            user_skills = [s.strip() for s in user_skills.split(",") if s.strip()]

        academic_score = min(25, max(0, (cgpa / 100 if cgpa > 10 else cgpa / 10) * 25))
        education_score = 15 if education_level and education_level != "Unknown" else 0
        interest_score = min(20, len(interests) * 5)
        skill_score = min(20, len(user_skills) * 5)
        profile_match_score = round(academic_score + education_score + interest_score + skill_score)

        focus = ", ".join(cfg["subjects"][:3])
        academic_value = int(cgpa) if cgpa.is_integer() else cgpa
        academic_label = f"{academic_value}%" if cgpa > 10 else f"{academic_value}/10 CGPA"
        key_insights = [
            f"Your profile is aligned with {cfg['label']}.",
            f"Your current focus includes {focus}.",
            f"Good academic performance ({academic_label})",
            f"Your selected skills can support {cfg['pathways'][0]} and related {cfg['label']} careers."
        ]
        strengths = list(dict.fromkeys(user_skills))[:5]
        strengths_set = set(strengths)
        areas_to_improve = [
            area for area in [f"Advanced {cfg['subjects'][0]}", "Communication", "Practical project experience", "Time management"]
            if area.lower() not in {item.lower() for item in strengths_set}
        ]
        pathways = cfg["pathways"][:4]

        return {
            "profile_match_score": profile_match_score,
            "score_explanation": f"Based on your academics, interests, skills and your selected {cfg['label']} stream.",
            "key_insights": key_insights,
            "strengths": strengths,
            "areas_to_improve": areas_to_improve,
            "suggested_pathways": pathways,
            "education_level": education_level, "major": major, "cgpa": cgpa, "year": year,
            "stream": cfg["label"]
        }

    def generate_adaptive_questions(self, profile_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        major = profile_data.get("major", "Other") if isinstance(profile_data, dict) else "Computer Science"
        return get_stream_config(major)["questions"]

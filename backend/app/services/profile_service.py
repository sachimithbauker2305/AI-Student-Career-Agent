from sqlalchemy.orm import Session
from backend.app.models.student_profile import StudentProfile
from typing import Dict, Any, List


def normalize_year_of_study(education_level: str, year_of_study: str) -> str:
    mapping = {
        'High School (Class 10-12)': ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Completed High School'],
        'Undergraduate': ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'],
        'Postgraduate': ['1st Year', '2nd Year', 'Completed'],
        'Diploma / Vocational': ['1st Year', '2nd Year', '3rd Year', 'Completed'],
    }

    if not education_level:
        return ""
    valid_years = mapping.get(education_level, mapping['Undergraduate'])
    if year_of_study in valid_years:
        return year_of_study
    return valid_years[0]


CITY_STATES = {
    "mumbai": "Maharashtra", "pune": "Maharashtra", "nashik": "Maharashtra", "nagpur": "Maharashtra",
    "bengaluru": "Karnataka", "bangalore": "Karnataka", "mysuru": "Karnataka",
    "hyderabad": "Telangana", "chennai": "Tamil Nadu", "coimbatore": "Tamil Nadu",
    "new delhi": "Delhi", "delhi": "Delhi", "noida": "Uttar Pradesh", "gurugram": "Haryana",
    "gurgaon": "Haryana", "kolkata": "West Bengal", "ahmedabad": "Gujarat", "surat": "Gujarat",
    "jaipur": "Rajasthan", "lucknow": "Uttar Pradesh", "bhopal": "Madhya Pradesh",
    "indore": "Madhya Pradesh", "chandigarh": "Chandigarh", "kochi": "Kerala", "thiruvananthapuram": "Kerala",
    "visakhapatnam": "Andhra Pradesh", "vijayawada": "Andhra Pradesh", "bhubaneswar": "Odisha",
    "patna": "Bihar", "guwahati": "Assam", "remote": "Remote"
}

def normalize_locations(locations):
    result = []
    for value in locations or []:
        raw = str(value).strip()
        if not raw:
            continue
        if raw.lower() == "remote":
            result.append("Remote")
            continue
        if raw.lower() in {"india", "all india", "pan india"}:
            result.append("India")
            continue
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        if len(parts) == 1 and parts[0].lower() in CITY_STATES:
            result.append(f"{parts[0]}, {CITY_STATES[parts[0].lower()]}")
        else:
            result.append(raw)
    return result


def calculate_profile_completion(profile) -> int:
    # Completion reflects the four profile areas the onboarding UI actually collects.
    checks = [
        bool(profile.education_level and profile.stream_major and profile.year_of_study),
        bool(profile.interests),
        bool(profile.skills),
        bool(profile.budget_range and profile.preferred_locations),
    ]
    return round(sum(checks) / len(checks) * 100)

def get_or_create_profile(db: Session, user_id: int) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = StudentProfile(
            user_id=user_id,
            education_level="",
            stream_major="",
            cgpa_percentage=0,
            year_of_study="",
            interests="",
            skills="",
            profile_completion_percent=0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    elif (
        (not profile.education_level and not profile.stream_major and not profile.interests and not profile.skills)
        or (
            not profile.skills
            and not profile.preferred_subjects
            and profile.budget_range in {"Medium", "Medium (₹ 4 - 10 Lakhs)"}
            and profile.preferred_locations in {"Bangalore,Hyderabad,Remote", "Bangalore, Hyderabad, Remote"}
        )
    ):
        # Clear legacy schema defaults on profiles that have never started onboarding.
        profile.cgpa_percentage = 0
        profile.year_of_study = ""
        profile.preferred_subjects = ""
        profile.budget_range = ""
        profile.preferred_locations = ""
        profile.profile_completion_percent = 0
        db.commit()
        db.refresh(profile)
    return profile

def update_profile_step1(db: Session, user_id: int, data: dict) -> StudentProfile:
    profile = get_or_create_profile(db, user_id)
    education_level = data.get("education_level", profile.education_level)
    year_of_study = data.get("year_of_study", profile.year_of_study)

    profile.education_level = education_level
    profile.stream_major = data.get("stream_major", profile.stream_major)
    profile.cgpa_percentage = float(data.get("cgpa_percentage", profile.cgpa_percentage))
    profile.year_of_study = normalize_year_of_study(education_level, year_of_study)
    interests = data.get("interests", [])
    if isinstance(interests, list):
        profile.interests = ",".join(interests)
    profile.profile_completion_percent = calculate_profile_completion(profile)
    db.commit()
    db.refresh(profile)
    return profile

def update_profile_detailed(db: Session, user_id: int, data: dict) -> StudentProfile:
    profile = get_or_create_profile(db, user_id)
    skills = data.get("skills", [])
    if isinstance(skills, list):
        profile.skills = ",".join(skills)
    subjects = data.get("preferred_subjects", [])
    if isinstance(subjects, list):
        profile.preferred_subjects = ",".join(subjects)
    profile.budget_range = data.get("budget_range", profile.budget_range)
    locations = data.get("preferred_locations", [])
    if isinstance(locations, list):
        profile.preferred_locations = ",".join(normalize_locations(locations))
    profile.profile_completion_percent = calculate_profile_completion(profile)
    db.commit()
    db.refresh(profile)
    return profile

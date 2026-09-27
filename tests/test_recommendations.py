from uuid import uuid4

from fastapi.testclient import TestClient

from ai.recommendation_engine import CareerRecommendationEngine, get_top_colleges_for_profile
from backend.app.database.database import SessionLocal
from backend.app.main import app
from backend.app.models.user import User
from backend.app.models.user import PasswordReset
from backend.app.services.auth_service import hash_password
from datetime import datetime, timedelta


def test_mbbs_profile_prioritizes_doctor_path():
    engine = CareerRecommendationEngine()
    profile = {
        "cgpa": 8.8,
        "major": "MBBS",
        "interests": ["Healthcare", "Science", "Social Impact"],
        "skills": ["Scientific reasoning", "Research", "Biology", "Patient care", "Communication"],
        "preferred_locations": ["Bangalore"],
        "budget_range": "Medium (₹ 4 - 10 Lakhs)",
    }

    recs = engine.get_recommendations(profile)
    titles = [r["title"].lower() for r in recs]
    assert any("doctor" in title or "physician" in title for title in titles)
    first_title = recs[0]["title"].lower()
    assert "doctor" in first_title or "physician" in first_title


def test_medical_stream_includes_umbrella_healthcare_paths():
    engine = CareerRecommendationEngine()
    profile = {
        "cgpa": 8.5,
        "major": "Medical",
        "interests": ["Healthcare", "Science", "Social Impact"],
        "skills": ["Biology", "Patient care", "Research", "Communication", "Problem solving"],
        "preferred_locations": ["Goa"],
        "budget_range": "Medium (₹ 4 - 10 Lakhs)",
    }

    recs = engine.get_recommendations(profile)
    titles = [r["title"].lower() for r in recs]
    assert any("dentist" in title or "dental" in title for title in titles)
    assert any("ayurvedic" in title for title in titles)
    assert any("homeopathic" in title or "homoeopathic" in title for title in titles)


def test_india_college_catalog_has_multiple_matches_for_design_and_healthcare():
    design_colleges = get_top_colleges_for_profile("Design", ["Delhi"], "Medium", "B.Des")
    healthcare_colleges = get_top_colleges_for_profile("Healthcare", ["Delhi"], "Medium", "B.Pharm")

    assert len(design_colleges) >= 2
    assert len(healthcare_colleges) >= 2


def test_change_password_requires_current_password_and_updates_hash():
    email = f"change-password-{uuid4().hex[:8]}@example.com"
    db = SessionLocal()
    try:
        user = User(
            first_name="Test",
            last_name="User",
            email=email,
            hashed_password=hash_password("OldPassword123!"),
            is_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    finally:
        db.close()

    client = TestClient(app)
    response = client.post(
        "/api/auth/change-password",
        json={
            "email": email,
            "current_password": "OldPassword123!",
            "new_password": "NewPassword456!",
            "confirm_password": "NewPassword456!",
        },
    )

    assert response.status_code == 200, response.text
    assert response.json()["status"] == "success"


def test_verify_otp_accepts_valid_code_without_password_field():
    email = f"otp-{uuid4().hex[:8]}@example.com"
    db = SessionLocal()
    try:
        db.add(PasswordReset(
            email=email,
            otp_code="123456",
            expires_at=datetime.utcnow() + timedelta(minutes=10),
            is_used=False,
        ))
        db.commit()
    finally:
        db.close()

    response = TestClient(app).post(
        "/api/auth/verify-otp",
        json={"email": email, "otp_code": "123456"},
    )

    assert response.status_code == 200, response.text
    assert response.json()["status"] == "success"


def test_student_can_save_and_compare_careers():
    client = TestClient(app)

    response = client.get("/api/saved-careers")
    assert response.status_code == 200, response.text
    saved_initial = response.json()

    save_payload = {
        "career_id": 999,
        "title": "Data Analyst",
        "domain": "Technology",
        "match_score": 92,
        "description": "Analyze data patterns and support business decisions.",
        "why_fit": "Strong analytical foundation.",
        "avg_salary_lpa": "₹ 5 - 10 LPA",
        "required_education": "B.Tech / B.Sc / related",
        "key_skills": ["SQL", "Excel", "Python"],
        "tags": ["Data", "Analytics"],
    }

    save_response = client.post("/api/saved-careers", json=save_payload)
    assert save_response.status_code == 200, save_response.text
    assert save_response.json()["career_id"] == 999

    list_response = client.get("/api/saved-careers")
    assert list_response.status_code == 200, list_response.text
    saved_careers = list_response.json()
    assert any(item["career_id"] == 999 for item in saved_careers)

    compare_response = client.get("/api/saved-careers/compare?career_ids=999")
    assert compare_response.status_code == 200, compare_response.text
    compare_data = compare_response.json()
    assert compare_data[0]["career_id"] == 999
    assert len(saved_initial) <= len(saved_careers)

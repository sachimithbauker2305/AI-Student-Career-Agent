"""
Eligibility Checker Engine
Uses the same stream/location/budget-aware college catalogue as career recommendations.
"""
from typing import Dict, Any
from ai.stream_config import detect_stream
from ai.recommendation_engine import get_top_colleges_for_profile, COLLEGE_CATALOG, _course_matches_program


class EligibilityChecker:
    def __init__(self):
        self.categories = ["General", "OBC-NCL", "SC", "ST", "EWS"]
        self.courses_by_stream = {
            "computer science": ["B.Tech Computer Science", "B.Tech Artificial Intelligence & Data Science", "B.Sc Data Science & Applications", "Bachelor of Computer Applications (BCA)"],
            "commerce": ["B.Com", "BBA", "B.Com Accounting & Finance", "B.Com Banking & Insurance"],
            "science": ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Biology", "B.Sc Data Science & Applications"],
            "arts": ["B.A. Psychology", "B.A. Journalism & Mass Communication", "B.A. Political Science", "B.A. Sociology"],
            "design": ["Bachelor of Design (B.Des)", "B.Des Communication Design", "B.Des Product Design", "B.Des Fashion Design"],
            "healthcare": ["MBBS", "B.Pharm", "B.Sc Nursing", "B.Sc Allied Health Sciences"],
            "engineering": ["B.Tech Mechanical Engineering", "B.Tech Civil Engineering", "B.Tech Electronics & Communication", "B.Tech Computer Science"],
            "management": ["Bachelor of Business Administration (BBA)", "BBA Marketing", "BBA Human Resources", "BBA Finance"],
            "law": ["LL.B", "B.A. LL.B", "BBA LL.B", "B.Com LL.B"],
            "media": ["B.A. Journalism & Mass Communication", "B.A. Media Studies", "Bachelor of Mass Communication", "B.A. Advertising & Public Relations"],
            "government": [
                "UPSC Civil Services Examination", "SSC CGL", "SSC CHSL", "IBPS PO", "SBI PO",
                "RRB NTPC", "RBI Grade B", "NDA", "CDS", "AFCAT",
                "CAPF Assistant Commandant", "State PSC / Civil Services", "Police Sub-Inspector",
                "Defence Officer", "Government / Public Administration"
            ],
            "other": ["General Career Exploration"]
        }
        self.courses = [c for values in self.courses_by_stream.values() for c in values]

    def get_options(self, stream: str, locations=None, budget='Medium', course: str = None):
        stream_key = detect_stream(stream or "Other / Exploring")
        courses = self.courses_by_stream.get(stream_key, self.courses)
        if course and course not in courses:
            courses = [course] + [c for c in courses if c != course]

        colleges = get_top_colleges_for_profile(
            stream=stream,
            locations=locations,
            budget=budget,
            course=course,
            limit=200
        )
        location_note = None
        if colleges:
            location_note = colleges[0].get("location_note")

        return {
            "colleges": [c["name"] for c in colleges],
            "college_details": [
                {
                    "name": c["name"],
                    "city": c["city"],
                    "state": c["state"],
                    "programs": c.get("programs", []),
                    "budget": c.get("budget", "Medium"),
                    "rating": c.get("rating"),
                    "placement": c.get("placement"),
                    "source": c.get("source", "Project college catalogue"),
                    "is_fallback": c.get("is_fallback", False)
                }
                for c in colleges
            ],
            "location_note": location_note,
            "courses": courses,
            "categories": self.categories,
            "catalog_source": "Project college catalogue + bundled Indian college dataset"
        }

    def _find_college(self, college: str):
        target = str(college or '').strip().lower()
        return next((c for c in COLLEGE_CATALOG if c['name'].strip().lower() == target), None)

    def _course_guidance(self, course: str):
        text = str(course or "").lower()
        if any(k in text for k in ["nda", "national defence academy"]):
            return "NDA (UPSC) entrance examination", 60.0, "Check the current UPSC NDA notification and official schedule"
        if "cds" in text:
            return "CDS (UPSC) examination", 60.0, "Check the current UPSC CDS notification and official schedule"
        if "afcat" in text:
            return "AFCAT examination", 60.0, "Check the current AFCAT notification and official schedule"
        if "capf" in text:
            return "UPSC CAPF (Assistant Commandant)", 60.0, "Check the current UPSC CAPF notification and official schedule"
        if "police" in text:
            return "State Police / Police Sub-Inspector recruitment exam, as applicable", 55.0, "Check the relevant State Police recruitment notification"
        if "upsc" in text or "civil services" in text:
            return "UPSC Civil Services Examination", 60.0, "Check the current UPSC Civil Services notification and official schedule"
        if "ssc cgl" in text:
            return "SSC CGL", 50.0, "Check the current SSC CGL notification and official schedule"
        if "ssc chsl" in text:
            return "SSC CHSL", 50.0, "Check the current SSC CHSL notification and official schedule"
        if "ibps" in text or "sbi po" in text:
            return "IBPS / SBI recruitment examination, as applicable", 55.0, "Check the current bank recruitment notification"
        if "rrb" in text:
            return "RRB NTPC examination", 50.0, "Check the current Railway Recruitment Board notification"
        if "rbi" in text:
            return "RBI Grade B", 60.0, "Check the current RBI recruitment notification"
        if any(k in text for k in ["computer science", "cse", "artificial intelligence", "data science", "software engineering"]):
            return "JEE Main / State CET / institute-specific admission process, as applicable", 88.0, "Check the current engineering counselling/admission calendar"
        if "mechanical" in text:
            return "JEE Main / State CET / institute-specific admission process, as applicable", 72.0, "Check the current engineering counselling/admission calendar"
        if "civil" in text:
            return "JEE Main / State CET / institute-specific admission process, as applicable", 70.0, "Check the current engineering counselling/admission calendar"
        if "electronics" in text or "electrical" in text:
            return "JEE Main / State CET / institute-specific admission process, as applicable", 74.0, "Check the current engineering counselling/admission calendar"
        if any(k in text for k in ["btech", "b.e", "engineering"]):
            return "JEE Main / State CET / institute-specific admission process, as applicable", 75.0, "Check the current engineering counselling/admission calendar"
        if any(k in text for k in ["mbbs", "bds", "bams", "bhms", "dental", "medical"]):
            return "NEET-UG / relevant professional admission process, as applicable", 92.0, "Check the current medical admission calendar"
        if any(k in text for k in ["b.pharm", "pharmacy", "nursing", "allied health"]):
            return "NEET / State or university admission process, as applicable", 68.0, "Check the current health-sciences admission calendar"
        if any(k in text for k in ["bba", "b.com", "commerce", "management", "finance", "accounting", "banking"]):
            return "CUET / University Merit / Institution-specific admission process, as applicable", 62.0, "Check the institution's current admission schedule"
        if "law" in text or "ll.b" in text:
            return "CLAT / AILET / University-specific admission process, as applicable", 58.0, "Check the current law admission calendar"
        if "design" in text or "b.des" in text:
            return "UCEED / NID DAT / institute-specific process, as applicable", 55.0, "Check the current design admission calendar"
        if any(k in text for k in ["media", "journalism", "mass communication", "advertising"]):
            return "CUET / University Merit / institution-specific admission process, as applicable", 55.0, "Check the institution's current media admission schedule"
        if any(k in text for k in ["b.sc", "science", "physics", "chemistry", "biology"]):
            return "CUET / University Merit / institution-specific admission process, as applicable", 58.0, "Check the institution's current science admission schedule"
        if any(k in text for k in ["b.a", "arts", "psychology", "sociology"]):
            return "CUET / University Merit / institution-specific admission process, as applicable", 50.0, "Check the institution's current arts admission schedule"
        return "University Merit / Institution-specific admission process, as applicable", 50.0, "Check the institution's official admission calendar"

    def check_eligibility(self, course: str, college: str, category: str, student_score: float = 85.0) -> Dict[str, Any]:
        category_relaxation = {"General": 0.0, "EWS": 2.0, "OBC-NCL": 5.0, "SC": 10.0, "ST": 10.0}
        relaxation = category_relaxation.get(category, 0.0)
        exam, base_cutoff, deadline = self._course_guidance(course)
        if not course:
            exam, base_cutoff, deadline = self._course_guidance("general")

        college_record = self._find_college(college)
        if not college_record:
            adjusted_cutoff = max(45.0, base_cutoff - relaxation)
            return {
                "status": "College Not Available",
                "confidence": "High",
                "course": course,
                "college": college,
                "category": category,
                "student_score": student_score,
                "required_cutoff": adjusted_cutoff,
                "entrance_exam": exam,
                "application_deadline": deadline,
                "official_portal": "https://www.google.com/search?q=" + str(college).replace(' ', '+') + "+official+admissions",
                "criteria_summary": [
                    "This college is not currently in the recommendation catalogue used by this project.",
                    f"Reference admission threshold for {category}: {adjusted_cutoff}% based on the selected course and category."
                ],
                "disclaimer": "Please verify all admission details, eligibility criteria, deadlines and current availability through official university or admission websites."
            }

        if not _course_matches_program(course, college_record.get('programs', [])):
            adjusted_cutoff = max(45.0, base_cutoff - relaxation)
            return {
                "status": "Course Not Listed For Selected College",
                "confidence": "High",
                "course": course,
                "college": college,
                "category": category,
                "student_score": student_score,
                "required_cutoff": adjusted_cutoff,
                "entrance_exam": exam,
                "application_deadline": deadline,
                "official_portal": "https://www.google.com/search?q=" + str(college).replace(' ', '+') + "+official+admissions",
                "criteria_summary": [
                    f"{college_record['name']} is currently listed for: {', '.join(college_record['programs'])}.",
                    f"The selected course/program ({course}) is not listed for this institution in the project's current catalogue.",
                    f"Estimated cutoff for {category}: {adjusted_cutoff}%"
                ],
                "disclaimer": "This is a project-level guidance check. Verify the current course list and admission rules on the institution's official website."
            }

        programs_text = ' '.join(college_record.get('programs', [])).lower()
        college_name = college_record['name'].lower()

        portal_query = college_record['name'].replace(' ', '+') + '+official+admissions'

        adjusted_cutoff = max(45.0, base_cutoff - relaxation)
        eligible = float(student_score or 0) >= adjusted_cutoff
        status = "Eligible" if eligible else "Additional Preparation Needed"
        confidence = "High" if float(student_score or 0) >= adjusted_cutoff + 5 else "Moderate"

        return {
            "status": status,
            "confidence": confidence,
            "course": course,
            "college": college,
            "category": category,
            "student_score": student_score,
            "required_cutoff": adjusted_cutoff,
            "entrance_exam": exam,
            "application_deadline": deadline,
            "official_portal": "https://www.google.com/search?q=" + portal_query,
            "criteria_summary": [
                f"Approximate baseline academic threshold: {adjusted_cutoff}% for {category} category.",
                f"Relevant programme/admission route: {exam}",
                "Course availability, cutoff, age, category and other conditions must be verified with the institution."
            ],
            "disclaimer": "Please verify all admission details, eligibility criteria, deadlines and current availability through official university or admission websites. This project provides guidance rather than an official admission decision."
        }

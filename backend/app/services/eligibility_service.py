from typing import Dict, Any, Optional
from ai.eligibility_checker import EligibilityChecker

checker = EligibilityChecker()

def evaluate_eligibility(course: str, college: str, category: str, student_score: float) -> Dict[str, Any]:
    result = checker.check_eligibility(
        course=course,
        college=college,
        category=category,
        student_score=student_score
    )

    # Keep the response shape stable so the Eligibility Check screen never
    # loses the entrance-exam or cutoff fields.
    result['entrance_exam'] = (
        result.get('entrance_exam')
        or result.get('entranceExam')
        or result.get('exam')
        or 'See the institution’s official admission process'
    )
    result['required_cutoff'] = (
        result.get('required_cutoff')
        if result.get('required_cutoff') is not None
        else result.get('requiredCutoff', result.get('cutoff'))
    )
    result['application_deadline'] = (
        result.get('application_deadline')
        or result.get('applicationDeadline')
        or 'Check the official admission calendar'
    )
    return result

def get_colleges_and_courses(stream: Optional[str] = None, locations=None, budget='Medium', course: str = None) -> Dict[str, Any]:
    return checker.get_options(stream or 'Computer Science', locations=locations or [], budget=budget, course=course)

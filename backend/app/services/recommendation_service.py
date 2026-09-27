import os
import sys
from typing import List, Dict, Any, Optional

# Ensure project root is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ai.recommendation_engine import CareerRecommendationEngine

engine = CareerRecommendationEngine()

def fetch_recommendations(profile_dict: dict, domain: Optional[str] = None) -> List[Dict[str, Any]]:
    return engine.get_recommendations(profile_dict, domain_filter=domain)

def fetch_career_details(career_id: int, profile_dict: Optional[dict] = None) -> Optional[Dict[str, Any]]:
    return engine.get_career_details(career_id, profile=profile_dict)

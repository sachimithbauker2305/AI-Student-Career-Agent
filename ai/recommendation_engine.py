"""
Career Recommendation Engine
Explores digital and non-digital careers across streams, then ranks them using
profile interests, skills, academics and stream relevance. A student's stream is
used as a relevance signal, not a hard restriction on career exploration.
"""
import os
import csv
import re
from typing import Dict, Any, List, Optional
from ai.stream_config import detect_stream, get_stream_config


# Stream, location and budget-aware institution catalogue.
# Fee bands are broad planning ranges (not official fee quotations); students should
# verify current fees with the institution before applying.
CURATED_COLLEGE_CATALOG = [
    # Computer Science / Engineering
    {"name":"IIT Bombay","city":"Mumbai","state":"Maharashtra","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech Engineering"],"budget":"High"},
    {"name":"IIT Delhi","city":"New Delhi","state":"Delhi","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech Engineering"],"budget":"High"},
    {"name":"IIT Madras","city":"Chennai","state":"Tamil Nadu","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech Engineering"],"budget":"High"},
    {"name":"BITS Pilani","city":"Pilani","state":"Rajasthan","streams":["computer science","engineering","science"],"programs":["B.Sc. Science","B.E. Computer Science","B.E. Engineering"],"budget":"High"},
    {"name":"IIIT Hyderabad","city":"Hyderabad","state":"Telangana","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech AI/ML"],"budget":"High"},
    {"name":"NIT Trichy","city":"Tiruchirappalli","state":"Tamil Nadu","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech Engineering"],"budget":"Medium"},
    {"name":"VIT Vellore","city":"Vellore","state":"Tamil Nadu","streams":["computer science","engineering"],"programs":["B.Tech Computer Science","B.Tech Engineering"],"budget":"Medium"},
    # Commerce / Management
    {"name":"Shri Ram College of Commerce (SRCC)","city":"New Delhi","state":"Delhi","streams":["commerce","management"],"programs":["B.Com (Hons.)","Economics"],"budget":"Low"},
    {"name":"Christ University","city":"Bengaluru","state":"Karnataka","streams":["commerce","management","law","media","arts","science"],"programs":["B.Com","BBA","BBA/LL.B.","B.A. Psychology","B.Sc. Psychology","Media & Communication"],"budget":"Medium"},
    {"name":"Hindu College","city":"New Delhi","state":"Delhi","streams":["commerce","arts","science"],"programs":["B.Com","B.A.","B.Sc."],"budget":"Low"},
    {"name":"Hansraj College","city":"New Delhi","state":"Delhi","streams":["commerce","science","arts"],"programs":["B.Com","B.Sc.","B.A."],"budget":"Low"},
    {"name":"St. Xavier's College Mumbai","city":"Mumbai","state":"Maharashtra","streams":["commerce","arts","science","media"],"programs":["B.Com","B.A.","B.A. Psychology","B.Sc.","Media Studies"],"budget":"Low"},
    {"name":"NM College of Commerce and Economics","city":"Mumbai","state":"Maharashtra","streams":["commerce","management"],"programs":["B.Com","BMS"],"budget":"Low"},
    {"name":"Symbiosis College of Arts and Commerce","city":"Pune","state":"Maharashtra","streams":["commerce","arts"],"programs":["B.Com","B.A."],"budget":"Medium"},
    {"name":"NMIMS","city":"Mumbai","state":"Maharashtra","streams":["commerce","management"],"programs":["B.Com","BBA","B.Sc. Finance"],"budget":"High"},
    {"name":"St. Joseph's University","city":"Bengaluru","state":"Karnataka","streams":["commerce","management","arts","media"],"programs":["B.Com","BBA","B.A."],"budget":"Medium"},
    # Goa
    {"name":"Goa University","city":"Taleigao","state":"Goa","streams":["commerce","science","arts","management","law"],"programs":["Arts","Science","Commerce","Management","Law"],"budget":"Low"},
    {"name":"Goa College of Engineering","city":"Ponda","state":"Goa","streams":["engineering","computer science"],"programs":["B.E. Engineering","B.E. Computer Engineering"],"budget":"Medium"},
    {"name":"Government College of Arts, Science & Commerce, Khandola","city":"Khandola","state":"Goa","streams":["commerce","science","arts"],"programs":["B.Com","B.Sc.","B.A."],"budget":"Low"},
    {"name":"Government College of Commerce & Economics","city":"Margao","state":"Goa","streams":["commerce","management"],"programs":["B.Com","Commerce","Management"],"budget":"Low"},
    {"name":"St. Xavier's College, Mapusa","city":"Mapusa","state":"Goa","streams":["commerce","science","arts"],"programs":["B.Com","B.Sc.","B.A."],"budget":"Low"},
    {"name":"Parvatibai Chowgule College of Arts and Science","city":"Margao","state":"Goa","streams":["science","arts","commerce"],"programs":["B.Sc.","B.A.","B.Com"],"budget":"Low"},
    {"name":"MES Vasant Joshi College of Arts and Commerce","city":"Zuarinagar","state":"Goa","streams":["commerce","arts"],"programs":["B.Com","B.A."],"budget":"Low"},
    {"name":"Dhempe College of Arts & Science","city":"Panaji","state":"Goa","streams":["science","arts"],"programs":["B.Sc.","B.A."],"budget":"Low"},
    {"name":"Don Bosco College of Engineering","city":"Margao","state":"Goa","streams":["engineering","computer science"],"programs":["B.E. Engineering","Engineering"],"budget":"Medium"},
    # Science
    {"name":"Indian Institute of Science (IISc)","city":"Bengaluru","state":"Karnataka","streams":["science"],"programs":["Science and Research"],"budget":"High"},
    {"name":"Fergusson College","city":"Pune","state":"Maharashtra","streams":["science","arts"],"programs":["B.Sc.","B.A.","B.A. Psychology"],"budget":"Low"},
    {"name":"Loyola College","city":"Chennai","state":"Tamil Nadu","streams":["science","arts","commerce"],"programs":["B.Sc.","B.A.","Commerce"],"budget":"Medium"},
    {"name":"St. Xavier's College","city":"Kolkata","state":"West Bengal","streams":["science","arts","commerce"],"programs":["B.Sc.","B.A.","Commerce"],"budget":"Medium"},
    # Design / Media
    {"name":"National Institute of Design (NID)","city":"Ahmedabad","state":"Gujarat","streams":["design"],"programs":["B.Des"],"budget":"Medium"},
    {"name":"MIT Institute of Design","city":"Pune","state":"Maharashtra","streams":["design"],"programs":["B.Des"],"budget":"High"},
    {"name":"Srishti Manipal Institute of Art, Design and Technology","city":"Bengaluru","state":"Karnataka","streams":["design"],"programs":["B.Des"],"budget":"High"},
    {"name":"Whistling Woods International","city":"Mumbai","state":"Maharashtra","streams":["media","design"],"programs":["Film & Media","Design"],"budget":"High"},
    # Healthcare
    {"name":"Manipal College of Pharmaceutical Sciences","city":"Manipal","state":"Karnataka","streams":["healthcare","science"],"programs":["B.Pharm","Pharmaceutical Sciences"],"budget":"High"},
    {"name":"Jamia Hamdard","city":"New Delhi","state":"Delhi","streams":["healthcare","science"],"programs":["B.Pharm","Health Sciences"],"budget":"Medium"},
    {"name":"Goa Medical College","city":"Bambolim","state":"Goa","streams":["healthcare","science"],"programs":["MBBS","Medicine","Health Sciences"],"budget":"Medium"},
    {"name":"KLE Academy of Higher Education and Research","city":"Belagavi","state":"Karnataka","streams":["healthcare","science"],"programs":["Health Sciences","Pharmacy"],"budget":"High"},
    # Law
    {"name":"National Law School of India University","city":"Bengaluru","state":"Karnataka","streams":["law"],"programs":["B.A. LL.B. (Hons.)"],"budget":"High"},
    {"name":"NALSAR University of Law","city":"Hyderabad","state":"Telangana","streams":["law"],"programs":["B.A. LL.B. (Hons.)"],"budget":"High"},
    {"name":"GNLU","city":"Gandhinagar","state":"Gujarat","streams":["law"],"programs":["B.A. LL.B. (Hons.)"],"budget":"High"},
    # Government / Defence / Security
    {"name":"National Defence Academy","city":"Khadakwasla","state":"Maharashtra","streams":["government"],"programs":["NDA / Officer Entry"],"budget":"High"},
    {"name":"Indian Military Academy","city":"Dehradun","state":"Uttarakhand","streams":["government"],"programs":["Army Officer Training"],"budget":"High"},
    {"name":"Officers Training Academy","city":"Chennai","state":"Tamil Nadu","streams":["government"],"programs":["Short Service Commission / Officer Training"],"budget":"High"},
    {"name":"Air Force Academy","city":"Dundigal","state":"Telangana","streams":["government"],"programs":["Flying Branch / Ground Duty"],"budget":"High"},
    {"name":"Indian Naval Academy","city":"Ezhimala","state":"Kerala","streams":["government"],"programs":["Naval Officer Training"],"budget":"High"},
    {"name":"Army Institute of Law","city":"Mohali","state":"Punjab","streams":["government","law"],"programs":["Law / Defence Legal Training"],"budget":"Medium"},
    {"name":"Army Institute of Management","city":"Kolkata","state":"West Bengal","streams":["government","management"],"programs":["MBA / Management"],"budget":"High"},
    # Arts
    {"name":"Jawaharlal Nehru University","city":"New Delhi","state":"Delhi","streams":["arts","science"],"programs":["B.A.","B.A. Psychology","Social Sciences"],"budget":"Low"},
    {"name":"University of Hyderabad","city":"Hyderabad","state":"Telangana","streams":["arts","science"],"programs":["Arts","B.A. Psychology","Social Sciences","Science"],"budget":"Low"},
]

KAGGLE_COLLEGE_DATASET = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "kaggle_top_indian_colleges",
    "College_data.csv",
)

INDIA_COLLEGE_DATASET = os.path.join(
    os.path.dirname(__file__),
    "datasets",
    "india_colleges.csv",
)

DATASET_STREAMS = {
    "engineering": ("engineering", ["B.Tech Engineering"]),
    "commerce": ("commerce", ["B.Com", "Commerce"]),
    "management": ("management", ["BBA", "Management"]),
    "arts": ("arts", ["B.A.", "Arts"]),
    "science": ("science", ["B.Sc.", "Science"]),
    "law": ("law", ["LL.B", "Law"]),
    "medical": ("healthcare", ["MBBS", "Medicine", "Health Sciences"]),
    "pharmacy": ("healthcare", ["B.Pharm", "Pharmacy"]),
    "agriculture": ("science", ["Agriculture", "Science"]),
    "hotel-management": ("management", ["Hotel Management"]),
}


def _dataset_budget(ug_fee: str) -> str:
    digits = ''.join(character for character in str(ug_fee or '') if character.isdigit())
    fee = int(digits) if digits else 0
    if fee <= 100000:
        return "Low"
    if fee <= 200000:
        return "Medium"
    return "High"


def _load_kaggle_colleges():
    if not os.path.exists(KAGGLE_COLLEGE_DATASET):
        return []

    colleges = []
    try:
        with open(KAGGLE_COLLEGE_DATASET, newline='', encoding='utf-8-sig') as dataset_file:
            for row in csv.DictReader(dataset_file):
                name = str(row.get('College_Name') or '').strip()
                stream_name = str(row.get('Stream') or '').strip().lower()
                state = str(row.get('State') or '').strip().title()
                mapped = DATASET_STREAMS.get(stream_name)
                if not name or not state or not mapped:
                    continue

                # Keep the institution names data-driven and state-aware so campus names like
                # "National Institute of Technology" are resolved to "National Institute of Technology Goa"
                # without hard-coding specific colleges into the recommendation engine.
                campus_name = name.strip()
                if state and state not in campus_name and any(
                    keyword in campus_name.lower()
                    for keyword in [
                        "national institute of technology",
                        "indian institute of technology",
                        "birla institute of technology and science",
                        "goa university",
                        "goa college of engineering",
                        "padre conceicao"
                    ]
                ):
                    campus_name = f"{campus_name}, {state}" if "," not in campus_name else campus_name
                    if campus_name.lower().endswith(state.lower()):
                        campus_name = campus_name
                    else:
                        campus_name = f"{campus_name}, {state}" if "," not in campus_name else campus_name
                name = campus_name

                stream, programs = mapped
                dataset_streams = [stream]
                dataset_programs = list(programs)

                # The bundled dataset does not identify Computer Science programmes separately.
                # Only promote well-known technology institutions to the Computer Science stream;
                # do not label every engineering college as a Computer Science college.
                if stream_name == "engineering":
                    name_lower = name.lower()
                    cs_name_hints = [
                        "iit ", "i.i.t", "nit ", "n.i.t", "iiit", "bits", "vit ",
                        "manipal", "srm", "thapar", "dtu", "nsut", "coep", "rv college",
                        "rvce", "bms college", "pes university", "ramaiah", "amrita",
                        "kiit", "kalinga institute", "jntu", "jntuh", "anna university"
                    ]
                    if any(hint in name_lower for hint in cs_name_hints):
                        dataset_streams.append("computer science")
                        dataset_programs = list(dict.fromkeys(["B.Tech Computer Science"] + dataset_programs))

                name_parts = [part.strip() for part in name.split(',') if part.strip()]
                city = name_parts[-1] if len(name_parts) > 1 else state
                colleges.append({
                    "name": name,
                    "city": city,
                    "state": state,
                    "streams": dataset_streams,
                    "programs": dataset_programs,
                    "budget": _dataset_budget(row.get('UG_fee')),
                    "rating": row.get('Rating'),
                    "placement": row.get('Placement'),
                    "source": "Kaggle: soumyadipghorai/top-indian-colleges",
                })
    except (OSError, csv.Error, UnicodeError):
        return []
    return colleges


def _load_india_college_dataset():
    if not os.path.exists(INDIA_COLLEGE_DATASET):
        return []

    colleges = []
    try:
        with open(INDIA_COLLEGE_DATASET, newline='', encoding='utf-8-sig') as dataset_file:
            for row in csv.DictReader(dataset_file):
                name = str(row.get('name') or '').strip()
                city = str(row.get('city') or '').strip()
                state = str(row.get('state') or '').strip()
                streams = [s.strip().lower() for s in str(row.get('streams') or '').split('|') if s.strip()]
                programs = [p.strip() for p in str(row.get('programs') or '').split('|') if p.strip()]
                budget = str(row.get('budget') or 'Medium').strip()
                if not name or not city or not state or not streams:
                    continue
                colleges.append({
                    "name": name,
                    "city": city,
                    "state": state,
                    "streams": streams,
                    "programs": programs,
                    "budget": budget,
                    "source": "India College Catalogue",
                })
    except (OSError, csv.Error, UnicodeError):
        return []
    return colleges


COLLEGE_CATALOG = CURATED_COLLEGE_CATALOG + _load_kaggle_colleges() + _load_india_college_dataset()

BUDGET_RANK = {"low": 0, "medium": 1, "high": 2, "international / open": 3, "international": 3, "open": 3}

def _budget_key(value: str) -> str:
    v = str(value or "").lower()
    if "under" in v or "low" in v or "3 lakh" in v:
        return "low"
    if "4 - 10" in v or "medium" in v:
        return "medium"
    if "10 - 25" in v or "high" in v:
        return "high"
    return "international / open"

def _location_parts(value: str):
    """Return (city, state) for one location token.
    A token such as `Goa` is treated as a state/region, while `Bangalore`
    is treated as a city. Explicit `City, State` is also supported.
    """
    raw = str(value or "").strip().lower()
    if not raw or raw == "remote":
        return "", ""
    raw = raw.replace("remote", "").strip(" ,")
    parts = [p.strip() for p in raw.split(",") if p.strip()]
    city = parts[0] if parts else ""
    state = parts[1] if len(parts) > 1 else ""
    state_aliases = {
        "maharashtra":"maharashtra", "mh":"maharashtra",
        "karnataka":"karnataka", "ka":"karnataka",
        "delhi":"delhi", "new delhi":"delhi",
        "telangana":"telangana", "tn":"tamil nadu",
        "tamil nadu":"tamil nadu", "gujarat":"gujarat",
        "rajasthan":"rajasthan", "west bengal":"west bengal",
        "goa":"goa", "kerala":"kerala", "odisha":"odisha",
        "uttar pradesh":"uttar pradesh", "up":"uttar pradesh",
        "madhya pradesh":"madhya pradesh", "mp":"madhya pradesh",
        "punjab":"punjab", "haryana":"haryana", "bihar":"bihar",
        "jharkhand":"jharkhand", "chhattisgarh":"chhattisgarh",
        "andhra pradesh":"andhra pradesh", "assam":"assam",
    }
    state = state_aliases.get(state, state)
    return city, state


CITY_ALIASES = {
    "bangalore":"bengaluru", "bengaluru":"bengaluru",
    "bombay":"mumbai", "mumbai":"mumbai",
    "new delhi":"new delhi", "delhi":"new delhi",
    "madras":"chennai", "chennai":"chennai",
    "calcutta":"kolkata", "kolkata":"kolkata",
    "trivandrum":"thiruvananthapuram", "thiruvananthapuram":"thiruvananthapuram",
    "mysore":"mysuru", "mysuru":"mysuru",
    "pondicherry":"puducherry", "puducherry":"puducherry",
}

STATE_NAMES = {
    "goa":"goa", "maharashtra":"maharashtra", "karnataka":"karnataka",
    "delhi":"delhi", "tamil nadu":"tamil nadu", "telangana":"telangana",
    "gujarat":"gujarat", "rajasthan":"rajasthan", "west bengal":"west bengal",
    "kerala":"kerala", "odisha":"odisha", "uttar pradesh":"uttar pradesh",
    "madhya pradesh":"madhya pradesh", "punjab":"punjab", "haryana":"haryana",
    "bihar":"bihar", "jharkhand":"jharkhand", "chhattisgarh":"chhattisgarh",
    "andhra pradesh":"andhra pradesh", "assam":"assam"
}

def _requested_location_filters(locations):
    """Parse one or more requested locations.

    Supported examples:
      - ["Goa"] -> state-wide Goa
      - ["Bangalore"] -> Bengaluru city only
      - ["Goa and Bangalore"] -> Goa OR Bengaluru
      - ["Pune, Mumbai"] -> Pune OR Mumbai
      - ["Mumbai, Maharashtra"] -> Mumbai with an explicit state
      - ["India"] / ["Remote"] -> all-India mode (no city restriction)
    """
    filters = []
    all_india = False
    import re

    for item in locations or []:
        raw = str(item or "").strip()
        if not raw:
            continue
        # Treat India / all-India / remote as intentionally unrestricted.
        if raw.lower() in {"india", "all india", "pan india", "remote", "remote work"}:
            all_india = True
            continue

        pieces = [p.strip() for p in re.split(r"\s+(?:and|&|/|\+|or)\s+|,", raw, flags=re.I) if p.strip()]
        for piece in pieces:
            lower_piece = piece.lower().strip()
            if lower_piece in {"india", "all india", "pan india", "remote", "remote work"}:
                all_india = True
                continue
            city, state = _location_parts(piece)
            if not city and not state:
                continue
            city = city.strip().lower()
            state = state.strip().lower()
            if city in STATE_NAMES and not state:
                filters.append(("", STATE_NAMES[city]))
            else:
                filters.append((CITY_ALIASES.get(city, city), state))

    # De-duplicate while preserving the student's order.
    deduped = []
    seen = set()
    for value in filters:
        if value not in seen:
            seen.add(value)
            deduped.append(value)
    return None if all_india else deduped


def _program_for_stream(c, stream_key):
    programs = c.get("programs", [])
    keywords = {
        "commerce": ["b.com", "commerce", "bba", "finance", "economics"],
        "management": ["bba", "management", "business", "mba"],
        "science": ["b.sc", "science", "research"],
        "arts": ["b.a.", "b.a", "arts", "social sciences"],
        "design": ["b.des", "design"],
        "healthcare": ["health", "pharm", "medical"],
        "engineering": ["b.tech", "b.e.", "engineering"],
        "computer science": ["computer", "b.tech", "b.e."],
        "law": ["ll.b", "law"],
        "media": ["media", "communication", "film"]
    }
    for p in programs:
        if any(k in p.lower() for k in keywords.get(stream_key, [])):
            return p
    return programs[0] if programs else "Relevant program"


def _normalize_program_text(value: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', str(value or '').lower()).strip()


def _course_matches_program(course: str, programs: List[str]) -> bool:
    """Match common course naming variants without requiring exact catalogue wording."""
    target = _normalize_program_text(course)
    if not target:
        return True

    hay_parts = [_normalize_program_text(p) for p in programs if str(p or '').strip()]
    hay = " ".join(hay_parts)
    if not hay:
        return False

    if target in hay or any(part and part in target for part in hay_parts):
        return True

    # Recognise the degree family first, then match specialisations where present.
    degree_aliases = {
        "bba": ["bba", "bachelor of business administration", "business administration", "business management", "management"],
        "bcom": ["bcom", "b com", "bachelor of commerce", "commerce", "accounting", "finance", "banking"],
        "btech": ["btech", "b tech", "be", "b e", "engineering"],
        "bsc": ["bsc", "b sc", "bachelor of science", "science"],
        "ba": ["ba", "b a", "bachelor of arts", "arts", "humanities", "social sciences", "journalism", "media"],
        "bdes": ["bdes", "b des", "bachelor of design", "design"],
        "bca": ["bca", "computer applications", "computer"],
        "llb": ["llb", "law", "legal"],
        "bpharm": ["bpharm", "b pharm", "pharmacy", "pharmaceutical"],
        "mbbs": ["mbbs", "medicine", "medical", "health"],
        "bds": ["bds", "dental", "dentistry"],
        "bams": ["bams", "ayurveda", "ayurvedic"],
        "bhms": ["bhms", "homeopathy", "homoeopathy"],
        "nursing": ["nursing"],
        "allied": ["allied health", "health sciences"],
    }

    family = None
    for key, aliases in degree_aliases.items():
        if any(alias in target for alias in aliases):
            family = key
            break

    if family:
        # For specialised computer-science/engineering courses, a generic "B.Tech Engineering"
        # label is not enough; the catalogue must mention a computer-related programme.
        if family == "btech" and any(k in target for k in ["computer", "artificial intelligence", "data science"]):
            if any(k in hay for k in ["computer", "artificial intelligence", "data science", "ai ml", "information technology"]):
                return True
        elif any(alias in hay for alias in degree_aliases[family]):
            return True

    # For specialised names, match a meaningful token rather than the whole phrase.
    stop = {"b", "ba", "bba", "bcom", "bsc", "btech", "be", "bdes", "llb", "of", "and", "the"}
    meaningful = [tok for tok in target.split() if len(tok) > 2 and tok not in stop]
    if meaningful:
        hits = sum(1 for tok in meaningful if tok in hay)
        if hits >= max(1, len(meaningful) // 2):
            return True

    return False


def _college_pool_for_profile(stream: str, locations=None, budget='Medium', course: Optional[str] = None):
    """Return all catalogue colleges relevant to stream, course, budget and preferred locations."""
    stream_key = detect_stream(stream or "other")
    requested = _requested_location_filters(locations or [])
    bkey = _budget_key(budget)
    user_rank = BUDGET_RANK.get(bkey, 1)

    def budget_ok(c):
        return BUDGET_RANK.get(str(c.get("budget", "Medium")).lower(), 2) <= user_rank

    def norm_loc(c):
        return (
            CITY_ALIASES.get(str(c.get('city', '')).strip().lower(), str(c.get('city', '')).strip().lower()),
            str(c.get('state', '')).strip().lower()
        )

    if stream_key == "other":
        stream_candidates = [c for c in COLLEGE_CATALOG if budget_ok(c)]
    else:
        stream_candidates = [
            c for c in COLLEGE_CATALOG
            if stream_key in c.get("streams", []) and budget_ok(c)
        ]

    def matches_location(c, loc):
        ccity, cstate = norm_loc(c)
        city, state = loc
        if city:
            return ccity == CITY_ALIASES.get(city, city) and (not state or cstate == state)
        if state:
            return cstate == state
        return False

    location_note = None
    is_fallback = False

    if requested is None or not requested:
        location_candidates = list(stream_candidates)
    else:
        location_candidates = [
            c for c in stream_candidates
            if any(matches_location(c, loc) for loc in requested)
        ]

        if location_candidates:
            matched_locations = {
                loc for c in location_candidates
                for loc in requested
                if matches_location(c, loc)
            }
            missing = [loc for loc in requested if loc not in matched_locations]
            if missing:
                missing_text = ", ".join(city.title() if city else state.title() for city, state in missing)
                location_note = (
                    f"No matching {stream_key.title()} institutions were found in {missing_text} "
                    f"for the selected budget. Showing matches only from your other selected location(s)."
                )
        else:
            location_labels = ", ".join(city.title() if city else state.title() for city, state in requested)
            location_note = (
                f"According to your preferences, no matching {stream_key.title()} institutions are "
                f"available in {location_labels} for the selected budget. "
                f"Showing top matching institutions from other Indian cities instead."
            )
            location_candidates = list(stream_candidates)
            is_fallback = True

    # A selected course is a stronger filter than the broad stream. If no course match
    # exists in the requested locations, try the same stream/course elsewhere and clearly
    # mark the result as a fallback. Only when there is no course match anywhere do we
    # keep the requested stream institutions for manual checking.
    if course:
        course_candidates = [
            c for c in location_candidates
            if _course_matches_program(course, c.get("programs", []))
        ]

        if course_candidates:
            location_candidates = course_candidates
        elif requested:
            global_course_candidates = [
                c for c in stream_candidates
                if _course_matches_program(course, c.get("programs", []))
            ]
            if global_course_candidates:
                location_labels = ", ".join(city.title() if city else state.title() for city, state in requested)
                location_note = (
                    f"According to your preferences, the selected course ({course}) is not listed "
                    f"for a matching institution in {location_labels}. "
                    f"Showing matching {course} institutions from other Indian cities instead."
                )
                location_candidates = global_course_candidates
                is_fallback = True
            elif location_candidates:
                location_labels = ", ".join(city.title() if city else state.title() for city, state in requested)
                location_note = (
                    f"The selected course ({course}) is not explicitly listed in the current college "
                    f"catalogue for {location_labels}. Showing relevant {stream_key.title()} institutions "
                    f"from those selected locations for manual verification."
                )
        else:
            # India / Remote mode: use course matches when available; otherwise keep stream matches.
            if course_candidates:
                location_candidates = course_candidates

    def score(c):
        score_value = 0
        ccity, cstate = norm_loc(c)
        if requested:
            for idx, (city, state) in enumerate(requested):
                if city and ccity == CITY_ALIASES.get(city, city):
                    score_value += 100 - idx * 5
                elif state and not city and cstate == state:
                    score_value += 80 - idx * 5

        programs = c.get("programs", [])
        if course and _course_matches_program(course, programs):
            score_value += 100  # matching programme should come first
        score_value += {'Low': 3, 'Medium': 2, 'High': 1}.get(str(c.get("budget", "")).title(), 0)
        try:
            score_value += float(c.get("rating") or 0) * 2
            score_value += float(c.get("placement") or 0)
        except (TypeError, ValueError):
            pass
        return score_value

    ranked = sorted(location_candidates, key=score, reverse=True)

    # De-duplicate the merged curated + dataset catalogue.
    deduped = []
    seen = set()
    for c in ranked:
        identity = (
            str(c.get("name", "")).strip().lower(),
            str(c.get("city", "")).strip().lower(),
            str(c.get("state", "")).strip().lower()
        )
        if identity in seen:
            continue
        seen.add(identity)
        deduped.append(c)

    # Attach transparent metadata without changing the visible college names.
    enriched = []
    for c in deduped:
        item = dict(c)
        item["location_note"] = location_note
        item["is_fallback"] = is_fallback
        enriched.append(item)

    return enriched, location_note


def get_top_colleges_for_profile(stream: str, locations=None, budget='Medium', course: Optional[str] = None, limit: int = 10):
    colleges, _ = _college_pool_for_profile(stream, locations=locations, budget=budget, course=course)
    return colleges[:limit]


def get_all_colleges_for_profile(stream: str, locations=None, budget='Medium', course: Optional[str] = None):
    """Return every relevant college in the project's catalogue for the selected profile."""
    colleges, note = _college_pool_for_profile(
        stream, locations=locations, budget=budget, course=course
    )
    return colleges, note


def _college_recommendations(stream_key: str, career_title: str, locations, budget):
    """Return the compact Top Colleges list shown on a career detail card."""
    candidates, location_note = get_all_colleges_for_profile(
        stream=stream_key,
        locations=locations,
        budget=budget,
        course=career_title
    )
    out = []
    if location_note:
        out.append(location_note)

    for c in candidates[:5]:
        out.append(
            f"{c['name']} — {c['city']}, {c['state']} • "
            f"{_program_for_stream(c, stream_key)} • {c.get('budget', 'Medium')} budget band"
        )

    return out or [
        f"No matching {stream_key.title()} institutions are available in the selected locations or the current catalogue."
    ]


class CareerRecommendationEngine:
    def __init__(self, dataset_path: Optional[str] = None):
        if not dataset_path:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            dataset_path = os.path.join(base_dir, "datasets", "careers.csv")
        self.dataset_path = dataset_path
        self.careers = self._load_careers()

    def _load_careers(self) -> List[Dict[str, Any]]:
        careers = []
        if os.path.exists(self.dataset_path):
            with open(self.dataset_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    careers.append({
                        "id": int(row.get("career_id", 0)),
                        "title": row.get("title", ""),
                        "domain": row.get("domain", ""),
                        "streams": [s.strip().lower() for s in row.get("streams", "").split("|") if s.strip()],
                        "match_keywords": [k.strip().lower() for k in row.get("match_keywords", "").split(",") if k.strip()],
                        "min_cgpa": float(row.get("min_cgpa", 6.0)),
                        "avg_salary_lpa": row.get("avg_salary_lpa", "₹ 6 - 12 LPA"),
                        "job_outlook": row.get("job_outlook", "High"),
                        "required_education": row.get("required_education", "Bachelor's degree"),
                        "description": row.get("description", ""),
                        "why_fit": row.get("why_fit_template", ""),
                        "key_skills": [s.strip() for s in row.get("key_skills", "").split(",") if s.strip()],
                        "suggested_pathway": row.get("suggested_pathway", "")
                    })
        return careers

    def get_recommendations(self, profile: Dict[str, Any], domain_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        cgpa = float(profile.get("cgpa", 8.5) or 8.5)
        major = profile.get("major") or profile.get("stream_major") or "Other"
        stream_key = detect_stream(major)
        cfg = get_stream_config(major)
        user_interests = {str(i).strip().lower() for i in profile.get("interests", []) if str(i).strip()}
        user_skills = {str(i).strip().lower() for i in profile.get("skills", []) if str(i).strip()}
        stream_interest_words = {str(i).lower() for i in cfg["interests"]}

        results = []
        for c in self.careers:
            if domain_filter and domain_filter.lower() != "all" and c["domain"].lower() != domain_filter.lower():
                continue

            title_lower = str(c["title"]).lower()
            domain_lower = str(c["domain"]).lower()
            keyword_text = " ".join(c["match_keywords"]).lower()
            stream_match = bool(c["streams"] and stream_key in c["streams"])

            # The selected stream is a relevance signal, not a gate. This keeps
            # non-digital and cross-disciplinary careers visible for every student.
            keyword_hits = sum(1 for kw in c["match_keywords"] if kw in user_interests or kw in user_skills)
            interest_hits = sum(
                1 for si in stream_interest_words
                if si in domain_lower or si in keyword_text or si in title_lower
            )
            direct_profile_hits = sum(
                1 for item in (user_interests | user_skills)
                if item and (item in title_lower or item in domain_lower or item in keyword_text)
            )

            score = 48
            if stream_match:
                score += 10
            score += min(20, keyword_hits * 4)
            score += min(12, interest_hits * 3)
            score += min(12, direct_profile_hits * 3)
            if cgpa >= c["min_cgpa"]:
                score += 6
            elif cgpa >= max(0, c["min_cgpa"] - 1):
                score += 2
            score = min(97, max(0, score))

            if keyword_hits or direct_profile_hits:
                why = f"Your selected skills and interests connect with {c['title']}."
            elif stream_match:
                why = f"{c['title']} connects directly with your {cfg['label']} background."
            else:
                why = f"{c['title']} is an alternative pathway worth exploring alongside your current background."

            why_fit_points = [
                why,
                f"Relevant focus: {', '.join(cfg['subjects'][:3])}",
                f"Academic performance: {cgpa}/10 CGPA"
            ]
            card_info = {
                "id": c["id"], "title": c["title"], "domain": c["domain"], "stream": cfg["label"],
                "match_score": score, "description": c["description"], "why_fit": c["why_fit"] or why,
                "why_fit_points": why_fit_points,
                "avg_salary_lpa": f"₹ {c['avg_salary_lpa']}" if not c['avg_salary_lpa'].startswith("₹") else c['avg_salary_lpa'],
                "job_outlook": c["job_outlook"], "required_education": c["required_education"],
                "key_skills": c["key_skills"], "tags": [c["domain"], f"{c['job_outlook']} Demand", "Good Growth"],
                "overview": c["description"],
                "career_path": [
                    {"level":"Entry Level (0-2 yrs)", "role":f"Junior {c['title']}", "salary":c['avg_salary_lpa']},
                    {"level":"Mid Level (3-5 yrs)", "role":f"Senior {c['title']}", "salary":"₹ 14 - 24 LPA"},
                    {"level":"Lead / Management (6+ yrs)", "role":f"Lead / Senior {c['title']}", "salary":"₹ 28 - 45+ LPA"}
                ],
                "top_colleges": _college_recommendations(
                    stream_key,
                    c["title"],
                    profile.get("preferred_locations", []),
                    profile.get("budget_range", "Medium")
                )
            }
            results.append(card_info)

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

    def get_career_details(self, career_id: int, profile: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        # Keep the selected student's stream/location/budget when opening details.
        for c in self.careers:
            if c["id"] == career_id:
                if profile:
                    recs = self.get_recommendations(profile, domain_filter=c["domain"])
                    matching = [r for r in recs if r["id"] == career_id]
                    if matching:
                        return matching[0]
                cfg = get_stream_config(c["streams"][0] if c["streams"] else "Other")
                fallback = {
                    "major": cfg["label"], "interests": cfg["interests"],
                    "budget_range": "Medium", "preferred_locations": []
                }
                recs = self.get_recommendations(fallback, domain_filter=c["domain"])
                matching = [r for r in recs if r["id"] == career_id]
                return matching[0] if matching else (recs[0] if recs else None)
        return None

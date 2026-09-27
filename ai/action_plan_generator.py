"""Career- and study-path-specific action plan generator."""
from typing import Dict, Any, List


class ActionPlanGenerator:
    def generate_plan(self, career_title: str = "General Career Exploration", stream_major: str = "") -> List[Dict[str, Any]]:
        title = (career_title or "General Career Exploration").strip()
        t = title.lower()
        stream = (stream_major or "").lower()

        plans = {
            "software developer": [
                ("Strengthen Programming Foundations", "Practise data structures, problem solving and one main programming language used in your target roles.", "1-2 months"),
                ("Build a Full-Stack Project", "Create one usable project with a frontend, backend and database, then document what you built.", "2-3 months"),
                ("Work With Git and APIs", "Use Git properly and build or consume REST APIs so your project mirrors a real development workflow.", "1 month"),
                ("Prepare for Developer Interviews", "Practise coding questions, project explanations and common technical interview topics.", "1-2 months"),
                ("Build Your Job Portfolio", "Polish your GitHub, resume and project links, then start applying for internships or junior roles.", "Ongoing")],
            "data analyst": [
                ("Strengthen SQL and Excel", "Practise joins, aggregation, cleaning and spreadsheet analysis using small real-world datasets.", "1-2 months"),
                ("Learn Data Visualisation", "Build dashboards and clear charts with a tool such as Power BI or Tableau.", "1 month"),
                ("Complete 2 Analysis Projects", "Analyse two datasets from start to finish and explain the findings in simple language.", "2 months"),
                ("Build a Portfolio Case Study", "Turn one project into a short case study showing the question, method, findings and recommendations.", "1 month"),
                ("Prepare for Analyst Roles", "Update your resume, practise SQL and analytics questions, and apply to relevant internships and entry-level roles.", "Ongoing")],
            "ai/ml engineer": [
                ("Strengthen Python and Mathematics", "Revise Python, statistics, probability and linear algebra used in machine learning.", "1-2 months"),
                ("Build Machine Learning Projects", "Train, evaluate and document two practical models using clean datasets.", "2-3 months"),
                ("Learn Model Development Tools", "Practise NumPy, pandas, scikit-learn and one deep-learning framework.", "1-2 months"),
                ("Deploy One Model", "Expose a trained model through a simple API or application and document the workflow.", "1 month"),
                ("Prepare for AI/ML Roles", "Build a focused portfolio and practise ML concepts, coding and project-based interview questions.", "Ongoing")],
            "financial analyst": [
                ("Master Financial Statements", "Learn income statements, balance sheets and cash-flow analysis.", "1-2 months"),
                ("Build Financial Models", "Use Excel to create forecasting, valuation and scenario models.", "2 months"),
                ("Follow Markets and Companies", "Practise reading company reports and writing short investment or business analyses.", "1-2 months"),
                ("Create Finance Case Studies", "Build two concise company or investment-analysis reports for your portfolio.", "1-2 months"),
                ("Prepare for Analyst Applications", "Tailor your CV, practise finance interviews and apply for relevant internships and analyst roles.", "Ongoing")],
            "chartered accountant": [
                ("Build Accounting Fundamentals", "Strengthen journal entries, financial statements and accounting standards.", "1-2 months"),
                ("Practise Tax and Audit", "Work through practical taxation and audit case studies.", "2 months"),
                ("Improve Excel and Reporting", "Build financial models and reporting sheets using Excel.", "1 month"),
                ("Map Your CA Preparation", "Review the current qualification stages and create a realistic study schedule for your next stage.", "2-3 months"),
                ("Build Professional Exposure", "Document projects, training and internships that support your accounting and finance profile.", "Ongoing")],
            "banking & relationship manager": [
                ("Learn Banking Operations", "Understand deposits, loans, credit, KYC and day-to-day banking operations.", "1 month"),
                ("Understand Financial Products", "Study common banking, insurance and investment products and when they are used.", "1-2 months"),
                ("Practise Customer Communication", "Work on presentation, negotiation and clear customer conversations.", "1 month"),
                ("Gain Practical Exposure", "Look for a banking internship, customer-service project or finance-related experience.", "2-3 months"),
                ("Prepare for Banking Roles", "Practise aptitude, interviews and relevant banking examinations where applicable.", "Ongoing")],
            "content writer / journalist": [
                ("Build Writing Fundamentals", "Practise reporting, structure, grammar, headlines and concise writing.", "1 month"),
                ("Create a Writing Portfolio", "Publish a small set of articles, interviews or feature pieces across a few topics.", "1-2 months"),
                ("Learn Digital Publishing", "Learn CMS basics, SEO and social publishing workflows.", "1 month"),
                ("Develop Research and Fact-Checking", "Practise source verification, interviewing and checking claims before publishing.", "1-2 months"),
                ("Apply for Media Opportunities", "Target publications, internships and entry-level writing or journalism roles.", "Ongoing")],
            "corporate lawyer": [
                ("Build Commercial Law Foundations", "Strengthen company law, contract law and commercial law concepts.", "2 months"),
                ("Practise Legal Research", "Work through case law, statutes and legal databases and summarise your findings.", "1-2 months"),
                ("Practise Contract Drafting", "Review and draft common commercial clauses and simple agreements.", "2 months"),
                ("Gain Legal Internship Experience", "Seek corporate law, compliance or legal-research exposure.", "2-3 months"),
                ("Prepare for Legal Roles", "Build a focused legal CV, writing samples and interview preparation plan.", "Ongoing")],
        }

        key = next((k for k in plans if k in t), None)
        if key:
            data = plans[key]
        elif any(x in t for x in ["doctor", "physician", "surgeon", "dentist", "pediatric", "gynec", "medical", "nurse", "pharmacist", "physiotherapist"]):
            data = [
                ("Strengthen Clinical Foundations", f"Revise the core subjects and concepts that support your path toward {title}.", "1-2 months"),
                ("Build Practical Knowledge", "Use case-based learning, structured notes and practice questions to connect theory with real situations.", "2 months"),
                ("Gain Relevant Exposure", "Look for supervised volunteering, clinical observation, research or healthcare experience that is appropriate to your stage.", "2-3 months"),
                ("Plan the Required Qualification", "Map the degree, entrance process and professional requirements for the pathway you want to follow.", "1 month"),
                ("Prepare for the Next Application or Exam", "Organise your documents, study schedule, resume where relevant and application deadlines.", "Ongoing")]
        elif any(x in t for x in ["teacher", "lecturer", "professor", "education"]):
            data = [
                ("Strengthen Subject Knowledge", f"Deepen the subject knowledge you would teach as a {title}.", "1-2 months"),
                ("Practise Teaching", "Prepare short lessons, explanations and activities and get feedback on how clearly you communicate.", "1-2 months"),
                ("Learn Assessment Methods", "Practise creating questions, rubrics and simple ways to track learner progress.", "1 month"),
                ("Gain Classroom Experience", "Look for tutoring, mentoring, teaching assistance or education-focused volunteering.", "2-3 months"),
                ("Plan Your Teaching Qualification", "Check the qualification and recruitment requirements for the schools or institutions you want to target.", "Ongoing")]
        elif any(x in t for x in ["designer", "design", "ui/ux", "ux"]):
            data = [
                ("Build Design Foundations", "Strengthen visual hierarchy, typography, layout and design thinking.", "1-2 months"),
                ("Create Portfolio Projects", f"Build 2-3 projects that show the kind of work expected from a {title}.", "2-3 months"),
                ("Practise Industry Tools", "Use Figma or the main tools used in your target design workflow.", "1 month"),
                ("Test and Improve Your Work", "Get feedback from users or peers and iterate on your designs.", "1-2 months"),
                ("Prepare Your Portfolio", "Polish case studies, resume and portfolio links before applying for internships or roles.", "Ongoing")]
        elif any(x in t for x in ["marketing", "sales", "business development"]):
            data = [
                ("Learn Marketing and Sales Basics", f"Understand customers, positioning, funnels and communication relevant to {title}.", "1 month"),
                ("Build Digital Skills", "Practise content, social media, SEO, CRM or campaign tools relevant to your target role.", "1-2 months"),
                ("Create Campaign or Sales Projects", "Build sample campaigns, outreach plans or sales case studies with clear goals.", "1-2 months"),
                ("Learn Basic Analytics", "Use spreadsheets and analytics tools to measure reach, conversion and campaign performance.", "1 month"),
                ("Build a Role-Focused Portfolio", "Document your campaigns, strategy and results and start applying for relevant opportunities.", "Ongoing")]
        elif any(x in t for x in ["cloud architect", "cloud"]):
            data = [("Build Cloud Fundamentals", "Strengthen networking, operating systems, storage, security and cloud concepts." , "1-2 months"), ("Practise Cloud Services", "Build small deployments using compute, storage, databases and identity services on one cloud platform.", "2 months"), ("Learn Architecture Patterns", "Study scalable, fault-tolerant and cost-aware cloud architecture patterns.", "1-2 months"), ("Build a Cloud Project", "Deploy a complete application and document the architecture, security and cost choices.", "2 months"), ("Prepare for Cloud Roles", "Polish your architecture portfolio and prepare for cloud interviews or certifications.", "Ongoing")]
        elif "cybersecurity" in t or "security analyst" in t:
            data = [("Build Security Foundations", "Strengthen networking, operating systems, authentication and common security concepts.", "1-2 months"), ("Practise Security Tools", "Use safe lab environments to practise monitoring, scanning and basic incident analysis.", "2 months"), ("Learn Security Frameworks", "Study common security controls, risk concepts and incident-response workflows.", "1 month"), ("Complete a Security Lab Project", "Document a small defensive security project or lab exercise without using real-world targets.", "1-2 months"), ("Prepare for Security Roles", "Build a focused portfolio and practise security, networking and scenario-based interview questions.", "Ongoing")]
        elif "product manager" in t:
            data = [("Learn Product Fundamentals", "Understand user problems, product goals, prioritisation and basic product metrics.", "1 month"), ("Practise User Research", "Conduct simple interviews or surveys and turn findings into clear product problems.", "1-2 months"), ("Write Product Requirements", "Create user stories, acceptance criteria and a simple product roadmap.", "1 month"), ("Build a Product Case Study", "Take one product idea from problem definition to solution, trade-offs and success metrics.", "1-2 months"), ("Prepare for Product Roles", "Polish case studies and practise product sense, prioritisation and execution interviews.", "Ongoing")]
        elif "business analyst" in t:
            data = [("Learn Business Analysis Basics", "Practise requirements gathering, process mapping and stakeholder analysis.", "1 month"), ("Improve Excel and SQL", "Use spreadsheets and SQL to organise, validate and analyse business data.", "1-2 months"), ("Map a Real Process", "Create an as-is/to-be process map and identify practical improvements.", "1 month"), ("Build a Business Case Study", "Document a business problem, analysis, proposed solution and expected impact.", "1-2 months"), ("Prepare for BA Roles", "Build a portfolio of process and analysis work and practise case-based interviews.", "Ongoing")]
        elif "investment banking" in t:
            data = [("Strengthen Corporate Finance", "Learn valuation, financial statements, capital structure and transaction basics.", "1-2 months"), ("Practise Financial Modelling", "Build three-statement, valuation and scenario models in Excel.", "2 months"), ("Study Deals and Markets", "Read transaction announcements and practise understanding why deals happen.", "1-2 months"), ("Create Deal Analysis", "Write a short analysis of two public transactions and the reasoning behind them.", "1 month"), ("Prepare for Finance Interviews", "Practise technical finance questions, market awareness and concise deal discussions.", "Ongoing")]
        elif "economist" in t:
            data = [("Strengthen Economics Foundations", "Revise microeconomics, macroeconomics, statistics and quantitative reasoning.", "1-2 months"), ("Work With Economic Data", "Use spreadsheets or Python to clean and analyse public economic datasets.", "2 months"), ("Write Policy or Market Notes", "Turn data into short, clear explanations of an economic trend or issue.", "1 month"), ("Complete an Economic Analysis", "Build one evidence-based report with data, assumptions and a clear conclusion.", "1-2 months"), ("Prepare for Research Roles", "Build writing samples and practise quantitative and policy-focused interviews.", "Ongoing")]
        elif any(x in t for x in ["public relations", "communications associate"]):
            data = [("Build Communication Foundations", "Practise audience analysis, messaging, professional writing and media communication.", "1 month"), ("Create Communication Samples", "Prepare press releases, social posts, briefing notes and campaign copy.", "1-2 months"), ("Learn Media Monitoring", "Track coverage and practise summarising public response to a campaign or announcement.", "1 month"), ("Plan a Small Campaign", "Create a communication plan with audience, message, channels and measures of success.", "1-2 months"), ("Build a Communications Portfolio", "Organise your writing and campaign samples and apply for relevant internships or roles.", "Ongoing")]
        elif any(x in t for x in ["graphic designer", "product designer"]):
            data = [("Strengthen Visual Design", "Practise composition, typography, colour, hierarchy and consistent visual systems.", "1-2 months"), ("Build Three Design Projects", "Create projects that show different problems, constraints and design decisions.", "2-3 months"), ("Improve Tool Skills", "Practise Figma, Adobe tools or the software expected in your target design work.", "1 month"), ("Write Design Case Studies", "Explain the problem, process, iterations and final outcome for your strongest projects.", "1 month"), ("Prepare Your Portfolio", "Polish the portfolio, resume and presentation of your work before applying.", "Ongoing")]
        elif any(x in t for x in ["mechanical design", "civil project", "electronics engineer"]):
            data = [("Strengthen Engineering Fundamentals", f"Review the core engineering subjects that support a {title} path.", "1-2 months"), ("Practise Engineering Software", "Use the CAD, simulation, embedded or analysis tools relevant to your role.", "1-2 months"), ("Build a Practical Engineering Project", f"Complete a project that demonstrates the kind of work expected in {title}.", "2-3 months"), ("Document Your Technical Work", "Prepare drawings, calculations, test results or technical notes that show how you solved the problem.", "1 month"), ("Prepare for Engineering Opportunities", "Build a focused resume and practise technical interviews for internships or entry-level roles.", "Ongoing")]
        elif "human resources" in t:
            data = [("Learn HR Fundamentals", "Understand recruitment, onboarding, performance, employee relations and basic HR policies.", "1 month"), ("Practise Recruitment Work", "Create sample job descriptions, screening criteria and interview plans.", "1-2 months"), ("Learn HR Data Basics", "Use spreadsheets to track simple workforce and recruitment metrics.", "1 month"), ("Build an HR Case Study", "Work through a realistic people-management case and document your recommendation.", "1-2 months"), ("Prepare for HR Roles", "Build a people-focused resume and practise behavioural and HR interview questions.", "Ongoing")]
        elif "lawyer" in t or "litigation advocate" in t:
            data = [("Strengthen Legal Foundations", f"Review the laws and legal concepts most relevant to {title}.", "1-2 months"), ("Practise Legal Research", "Work through statutes, case law and legal databases and write short research notes.", "1-2 months"), ("Develop Legal Writing", "Practise case summaries, arguments, notices or contract clauses appropriate to your path.", "1-2 months"), ("Gain Legal Exposure", "Seek a law internship, court observation, compliance project or supervised research opportunity.", "2-3 months"), ("Prepare for Legal Practice", "Organise your writing samples, resume and interview or exam preparation for the next opportunity.", "Ongoing")]
        elif any(x in t for x in ["civil services", "public sector", "police", "defence", "defence officer", "public administration"]):
            data = [("Build General Studies Foundations", f"Strengthen the subjects and current-affairs knowledge relevant to {title}.", "1-2 months"), ("Create a Consistent Study Routine", "Set weekly targets for reading, practice questions and revision instead of relying on last-minute preparation.", "Ongoing"), ("Practise Role-Specific Tests", "Use mock tests, aptitude practice or physical preparation where the selected pathway requires it.", "2-3 months"), ("Track Eligibility and Exams", "Keep a simple record of qualifications, age limits, exam stages and official deadlines for your target pathway.", "1 month"), ("Prepare Applications and Interviews", "Organise documents and practise interviews, written responses or other selection stages relevant to the role.", "Ongoing")]
        elif any(x in t for x in ["operations", "business coordinator"]):
            data = [("Learn Operations Basics", "Understand process flow, scheduling, documentation and day-to-day business coordination.", "1 month"), ("Improve Excel and Reporting", "Practise trackers, summaries and simple dashboards used to monitor work.", "1 month"), ("Map and Improve a Process", "Choose a simple workflow, map it and suggest practical improvements.", "1 month"), ("Build a Coordination Project", "Plan a small event, project or workflow and document how you managed tasks and follow-ups.", "1-2 months"), ("Prepare for Operations Roles", "Build a clear resume and practise organisation, communication and situational interview questions.", "Ongoing")]
        elif any(x in t for x in ["research & analysis", "social researcher", "researcher"]):
            data = [("Strengthen Research Foundations", f"Review research concepts and subject knowledge relevant to {title}.", "1-2 months"), ("Practise Data Collection", "Work with surveys, interviews or public datasets and document your method clearly.", "1-2 months"), ("Learn Analysis Methods", "Use appropriate qualitative or quantitative techniques to make sense of the evidence.", "2 months"), ("Write a Research Report", "Produce one concise report with a clear question, evidence, findings and limitations.", "1 month"), ("Find Research Exposure", "Look for projects, labs, internships or assistant opportunities related to your interests.", "Ongoing")]
        elif any(x in t for x in ["scientist", "researcher", "biotechnologist", "economist"]):
            data = [
                ("Strengthen Subject Foundations", f"Review the core subjects relevant to {title}.", "1-2 months"),
                ("Learn Research Methods", "Practise literature review, data collection, experiments and analysis.", "2 months"),
                ("Complete a Research Project", "Work on a small project and document the method, results and limitations.", "2-3 months"),
                ("Develop Technical Writing", "Prepare clear reports, presentations and research summaries.", "1 month"),
                ("Find Research Exposure", "Look for labs, internships, projects or research-assistant opportunities.", "Ongoing")]
        elif "commerce" in stream or any(x in t for x in ["account", "finance", "bank", "hr", "human resource"]):
            data = [
                ("Build Business Foundations", f"Strengthen the business concepts most useful for a future {title}.", "1-2 months"),
                ("Practise Role-Specific Tools", "Use spreadsheets, business cases and the common tools used in your target role.", "1-2 months"),
                ("Complete a Practical Case Project", f"Create a small case study or project that demonstrates how you would handle a real {title} task.", "2 months"),
                ("Gain Workplace Exposure", "Look for an internship, campus responsibility or practical project related to the role.", "2-3 months"),
                ("Prepare for Applications", "Tailor your resume, practise interviews and start applying to relevant opportunities.", "Ongoing")]
        else:
            data = [
                ("Build Core Knowledge", f"Strengthen the subjects and concepts you will use in a {title} role.", "1-2 months"),
                ("Practise the Main Skills", f"Work on the practical skills employers usually expect for {title} roles.", "2 months"),
                ("Complete a Relevant Project", f"Build a project, case study or portfolio piece that shows your ability in {title}.", "2-3 months"),
                ("Gain Real-World Exposure", "Look for an internship, volunteering opportunity, competition or practical assignment related to the path.", "2-3 months"),
                ("Prepare for the Next Opportunity", f"Tailor your resume, portfolio and interview preparation to {title}, then start applying.", "Ongoing")]

        return [{"step_number": i + 1, "title": x[0], "status": "In Progress" if i == 0 else "Upcoming", "description": x[1], "timeline": x[2]} for i, x in enumerate(data)]

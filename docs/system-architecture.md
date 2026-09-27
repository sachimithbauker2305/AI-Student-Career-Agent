# System Architecture: AI Student & Career Agent

The AI Student & Career Agent is structured as a decoupled, multi-tier system with an interactive single-page application frontend, a high-throughput RESTful FastAPI backend, a multi-factor AI recommendation engine, and relational persistence.

```mermaid
graph TD
    subgraph Client ["Frontend Layer (React + Vite + Tailwind CSS)"]
        UI_Home["Landing & Auth (Home, Register, Login, Reset)"]
        UI_Profile["Student Profile Wizard (3 Steps)"]
        UI_AI["AI Analysis & Conversational Discovery"]
        UI_Recs["Career Recommendations & Details"]
        UI_Plan["Personalized Action Plan & Dashboard"]
    end

    subgraph API ["Backend API Layer (FastAPI)"]
        Router_Profile["Profile Router (Academics & Preferences)"]
        Router_AI["AI Analysis Router (Discovery & Scoring)"]
        Router_Recs["Recommendations Router"]
        Router_Elig["Eligibility Router"]
        Router_Plan["Action Plan Router"]
        Router_Dash["Dashboard Router"]
    end

    subgraph AI_Engine ["AI & Decision Support Layer"]
        Engine_Analysis["Profile Analyzer (Match %, Strengths, Gaps)"]
        Engine_Rec["Multi-Factor Recommendation Engine"]
        Engine_Elig["Eligibility Rule & Cutoff Evaluator"]
        Engine_Plan["Action Plan Generator (Milestones & Deadlines)"]
    end

    subgraph Data ["Data & Persistence Layer"]
        DB[(SQLite / Relational Database)]
        DS_Careers[("careers.csv (25+ Careers)")]
        DS_Courses[("courses.csv (Colleges & Degrees)")]
        DS_Skills[("skills.csv (Competency Weights)")]
    end

    Client -->|Axios JSON HTTP Requests| API
    API -->|Services| AI_Engine
    API -->|SQLAlchemy ORM| DB
    AI_Engine -->|Query Datasets| DS_Careers
    AI_Engine -->|Query Datasets| DS_Courses
    AI_Engine -->|Query Datasets| DS_Skills
```

## Data Flow Pipeline

1. **Understand**: Student enters academic information (CGPA, degree, year) and primary interests.
2. **Ask**: Agent asks dynamic conversational discovery questions to fill gaps in motivation, culture, and goals.
3. **Analyze**: AI scores profile completion, extracts top strengths, identifies growth areas, and computes match scores.
4. **Recommend**: Multi-factor scoring ranks career paths with transparent "Why this is a good fit" rationales.
5. **Explain**: System presents clear compensation projections, required skills, and growth outlook.
6. **Act**: System converts recommendations into a time-bound milestone action plan with counselor escalation options.

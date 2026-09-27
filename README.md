# AI Student & Career Agent

## OTP Email Setup

Password-reset OTP delivery uses SMTP and never exposes the OTP in the browser. Copy `backend/.env.example` to `backend/.env` and fill in the SMTP values before starting the backend. For Gmail, enable 2-Step Verification, create an App Password named `NextStep`, and use the generated 16-character value as `SMTP_PASSWORD`; do not use your normal account password.

The Career Assistant sends the student's conversation and profile context to the OpenAI Responses API. Set `OPENAI_API_KEY` in `backend/.env`, choose a supported model such as `gpt-4o-mini`, and restart the backend. The key stays server-side and is never sent to the frontend.

An AI-powered academic and career decision-support companion that understands student profiles, asks adaptive conversational discovery questions, matches courses & careers with transparent reasoning, verifies admission eligibility with official source disclaimers, and generates actionable, milestone-based roadmaps.

---

## Visual Design & UI Reference

The application replicates the clean, modern aesthetic with dedicated screens for:
1. **Home / Landing Page**: Hero banner, feature highlights, and intuitive call-to-actions.
2. **Account Creation & Auth**: Split-card registration with guidance illustration, login, OTP recovery, and password resets.
3. **Student Profile (3-Step Wizard)**: Academics, CGPA, year of study, interactive interest chips, and skills competencies.
4. **Adaptive Conversational Discovery**: Follow-up questions to fill profile gaps (*Understand &rarr; Ask &rarr; Analyze &rarr; Recommend &rarr; Explain &rarr; Act*).
5. **Profile Analysis**: 78% circular match score gauge, key insights, strengths, and areas to improve.
6. **Career Recommendations**: Category tabs (All, Technology, Data, Business, Design) with match percentage badges and explainability bullet points.
7. **Career Details**: Comprehensive view with Overview, Required Skills, Career Path, Top Colleges, and salary ranges.
8. **Eligibility Check**: Program and university criteria evaluator with official admission source alerts.
9. **Personalized Action Plan**: Vertical numbered milestone timeline with toggleable status progression.
10. **Student Dashboard**: Command center displaying profile completion rings, recommended career tallies, action plan velocity, top matches, and recent activity logs.

---

## Project Structure

```
AI-Student-Career-Agent/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── CreateNewPassword.jsx
│   │   │   ├── PasswordResetSuccess.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── DetailedProfile.jsx
│   │   │   ├── ProfileAnalysis.jsx
│   │   │   ├── PersonalizedQuestions.jsx
│   │   │   ├── AIAnalysisResult.jsx
│   │   │   ├── CareerRecommendations.jsx
│   │   │   ├── EligibilityCheck.jsx
│   │   │   ├── ExploreOtherOptions.jsx
│   │   │   ├── ActionPlan.jsx
│   │   │   ├── CareerDetails.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── CareerCard.jsx
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   ├── recommendationService.js
│   │   │   └── dashboardService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── ai_analysis.py
│   │   │   ├── recommendations.py
│   │   │   ├── eligibility.py
│   │   │   ├── action_plan.py
│   │   │   └── dashboard.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── student_profile.py
│   │   │   ├── career.py
│   │   │   ├── recommendation.py
│   │   │   └── action_plan.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── recommendation.py
│   │   │   └── action_plan.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── profile_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── eligibility_service.py
│   │   │   └── action_plan_service.py
│   │   └── database/
│   │       └── database.py
│   ├── requirements.txt
│   └── .env
│
├── ai/
│   ├── profile_analysis.py
│   ├── recommendation_engine.py
│   ├── eligibility_checker.py
│   ├── action_plan_generator.py
│   └── datasets/
│       ├── careers.csv
│       ├── courses.csv
│       └── skills.csv
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── screen-flow.pdf
│   ├── screen-flow.md
│   ├── database-design.png
│   ├── database-design.md
│   ├── system-architecture.png
│   └── system-architecture.md
│
├── .vscode/
│   ├── launch.json
│   ├── tasks.json
│   └── settings.json
│
├── start.bat
├── start.ps1
├── .gitignore
├── README.md
└── requirements.txt
```

---


## Chatbot Setup

The Career Assistant in the React application uses Ollama locally, so no OpenAI API key is required.

1. Install Ollama for Windows.
2. Open a new terminal and run:
```powershell
ollama pull llama3.2
```
3. Make sure Ollama is running.
4. Start the FastAPI backend and React frontend using the normal project startup steps below.
5. Log in to the application and open the Career Assistant button.

The chatbot endpoint is `/api/chatbot`. It uses the logged-in student's profile and current career recommendations as context.

## How to Run in VS Code (Quickstart)

### Method 1: Open in VS Code & Use "Run & Debug" (Recommended)
1. Open Visual Studio Code.
2. Click **File > Open Folder...** and select this directory:
   `AI-Student-Career-Agent`
3. Open the **Run and Debug** tab (`Ctrl + Shift + D` on Windows / Linux).
4. In the dropdown at the top, select **"Full Stack: Backend + Frontend"** and press **F5** (or the green play button).
5. VS Code will concurrently launch:
   - FastAPI Backend at `http://127.0.0.1:8000` (API documentation at `/docs`)
   - Vite React Frontend at `http://localhost:5173`

---

### Method 2: Use VS Code Tasks
1. In VS Code, press `Ctrl + Shift + P` and type `Tasks: Run Task`.
2. Choose **Run Full Application**.
3. To install dependencies first, choose **1. Install All Dependencies**.

---

### Method 3: One-Click Runner Scripts
Double-click `start.bat` (or right-click `start.ps1` &rarr; Run with PowerShell) from the project root. It automatically opens two dedicated terminals and starts both backend and frontend development servers.

---

### Method 4: Manual Terminal Execution

#### 1. Setup Backend:
```powershell
pip install -r requirements.txt
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Setup Frontend:
```powershell
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** to use the application!

---

## Local Sample Account

The backend creates one neutral sample profile for local testing:
- **Email**: `name@gmail.com`
- **Password**: `DemoPassword123!`
- **Sample OTP for Reset**: `123456`

You can also register a new account from the application. Email addresses must be unique.

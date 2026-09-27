import os
import sys
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles 
from fastapi.middleware.cors import CORSMiddleware

# Ensure root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.app.database.database import engine, Base, SessionLocal
from backend.app.models.user import User
from backend.app.models.student_profile import StudentProfile
from backend.app.models.saved_career import SavedCareer
from backend.app.services.auth_service import hash_password
from backend.app.routers import (
    auth,
    profile,
    ai_analysis,
    recommendations,
    eligibility,
    action_plan,
    dashboard,
    chatbot,
    saved_careers
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed a neutral sample user for local development if not exists
def init_db_seed():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "name@gmail.com").first()
        if not user:
            user = User(
                first_name="Name",
                last_name="",
                email="name@gmail.com",
                hashed_password=hash_password("DemoPassword123!"),
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            profile = StudentProfile(
                user_id=user.id,
                education_level="Undergraduate",
                stream_major="Computer Science",
                cgpa_percentage=8.5,
                year_of_study="2nd Year",
                interests="Technology,Science",
                skills="Problem solving,Programming,Analytical thinking,Adaptability",
                profile_completion_percent=85
            )
            db.add(profile)
            db.commit()
        else:
            # Keep the local sample account usable after database changes.
            user.hashed_password = hash_password("DemoPassword123!")
            user.first_name = "Name"
            user.last_name = ""
            user.is_verified = True
            db.commit()
    except Exception as e:
        print(f"Seed DB warning: {e}")
    finally:
        db.close()

init_db_seed()

show_api_docs = os.getenv("ENABLE_API_DOCS", "false").lower() == "true"
FRONTEND_DIST = os.path.abspath(os.path.join(PROJECT_ROOT, "frontend", "dist"))

app = FastAPI(
    title="NextStep — From Uncertainty to Clarity API",
    description="Backend API supporting profile discovery, career recommendations, eligibility checks, and personalised action plans.",
    version="1.0.0",
    docs_url="/docs" if show_api_docs else None,
    redoc_url="/redoc" if show_api_docs else None,
    openapi_url="/openapi.json" if show_api_docs else None,
)

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(ai_analysis.router)
app.include_router(recommendations.router)
app.include_router(eligibility.router)
app.include_router(action_plan.router)
app.include_router(dashboard.router)
app.include_router(chatbot.router)
app.include_router(saved_careers.router)

# Serve React/Vite static assets
if os.path.isdir(FRONTEND_DIST):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")),
        name="assets"
    )

@app.get("/")
def root():
    index_file = os.path.join(FRONTEND_DIST, "index.html")

    if os.path.isfile(index_file):
        return FileResponse(index_file)

    return {"status": "ok"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AI-Student-Career-Agent"}

@app.get("/api/network-link")
def network_link():
    """Return a browser link other devices can use on the same local Wi-Fi network."""
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.connect(("10.255.255.255", 1))
        local_ip = sock.getsockname()[0]
        sock.close()
    except OSError:
        local_ip = "127.0.0.1"
    return {"name": "NextStep", "url": f"http://{local_ip}:5173"}


# When the React production build is present, serve it from the same FastAPI
# process. This gives a single shareable URL that also works as a mobile PWA.
if os.path.isdir(FRONTEND_DIST):
    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        requested = os.path.abspath(os.path.join(FRONTEND_DIST, full_path))
        if requested.startswith(FRONTEND_DIST) and os.path.isfile(requested):
            return FileResponse(requested)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

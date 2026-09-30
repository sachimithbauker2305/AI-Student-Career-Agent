from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import secrets
import requests


def _load_backend_env():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    if not os.path.exists(env_path):
        return
    try:
        with open(env_path, encoding="utf-8") as env_file:
            for line in env_file:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    except OSError:
        return


_load_backend_env()
from typing import Optional

from backend.app.database.database import get_db
from backend.app.models.user import User, PasswordReset
from backend.app.models.student_profile import StudentProfile
from backend.app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    UserResponse
)
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization:
        # Provide default demo user if unauthenticated for smooth UX
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
        return user

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid token scheme")
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Expired or invalid token")
        user = db.query(User).filter(User.id == payload.get("sub")).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception:
        # Fallback to demo user
        user = db.query(User).filter(User.email == "name@gmail.com").first()
        if user:
            return user
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/register")
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    existing = db.query(User).filter(func.lower(User.email) == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        email=email,
        hashed_password=hash_password(req.password),
        is_verified=True # Auto-verify for streamlined onboarding
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize default student profile
    profile = StudentProfile(
        user_id=user.id,
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

    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        },
        "message": "Account created successfully!"
    }

@router.post("/login")
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="No account found for this email. Please register first.")

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }
    }

@router.post("/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.is_verified = True
        db.commit()
    return {"status": "success", "message": "Email verified successfully."}

@router.post("/change-password")
def change_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Account not found.")
    if not verify_password(req.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirm password do not match.")
    if req.new_password == req.current_password:
        raise HTTPException(status_code=400, detail="New password must be different from the current password.")
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"status": "success", "message": "Password changed successfully."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    if not db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(status_code=404, detail="No account found for this email.")

    otp = f"{secrets.randbelow(1000000):06d}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    reset_entry = PasswordReset(
        email=email,
        otp_code=otp,
        expires_at=expires_at,
        is_used=False
    )
    db.add(reset_entry)
    db.commit()

    resend_api_key = os.getenv("RESEND_API_KEY")
    sender = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
    if not resend_api_key:
        db.delete(reset_entry)
        db.commit()
        raise HTTPException(status_code=503, detail="Email delivery is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.")

    email_payload = {
        "from": sender,
        "to": [email],
        "subject": "Your NextStep password reset code",
        "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px;">
                <h2>NextStep Password Reset</h2>
                <p>Your password reset verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">{otp}</div>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
        """
    }

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json"
            },
            json=email_payload,
            timeout=20
        )
        if not response.ok:
            error_detail = response.text[:500]
            raise RuntimeError(f"Resend API returned {response.status_code}: {error_detail}")
    except (requests.RequestException, RuntimeError) as exc:
        db.delete(reset_entry)
        db.commit()
        raise HTTPException(status_code=502, detail=f"Unable to send the OTP email: {exc}")

    return {
        "status": "success",
        "message": f"Verification code sent to {email}",
        "expires_in_seconds": 600
    }

@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    entry = db.query(PasswordReset).filter(
        func.lower(PasswordReset.email) == req.email.strip().lower(),
        PasswordReset.otp_code == req.otp_code,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).order_by(PasswordReset.id.desc()).first()

    if not entry:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

    return {"status": "success", "message": "OTP verified successfully."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(func.lower(User.email) == req.email.strip().lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Account not found.")
    entry = db.query(PasswordReset).filter(
        func.lower(PasswordReset.email) == req.email.strip().lower(),
        PasswordReset.otp_code == req.otp_code,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).order_by(PasswordReset.id.desc()).first()
    if not entry:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")
    if verify_password(req.new_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="New password should be different from your old password.")
    user.hashed_password = hash_password(req.new_password)
    entry.is_used = True
    db.commit()
    return {"status": "success", "message": "Password reset successfully."}

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "is_verified": current_user.is_verified
    }

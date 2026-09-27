from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from backend.app.models.action_plan import RecentActivity

IST = ZoneInfo("Asia/Kolkata")


def _as_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def format_activity_timestamp(dt: datetime | None) -> str:
    value = _as_utc(dt)
    if value is None:
        return ""
    return value.astimezone(IST).strftime("%d %b %Y, %I:%M %p")


def activity_time_ago(dt: datetime | None) -> str:
    value = _as_utc(dt)
    if value is None:
        return ""
    now = datetime.now(timezone.utc)
    seconds = max(0, int((now - value).total_seconds()))
    if seconds < 60:
        return "Just now"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} min ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours} hr ago"
    days = hours // 24
    if days < 7:
        return f"{days} day{'s' if days != 1 else ''} ago"
    return value.astimezone(IST).strftime("%d %b %Y")


def record_activity(db: Session, user_id: int, activity_type: str, title: str, created_at: datetime | None = None, commit: bool = True) -> RecentActivity:
    timestamp = created_at or datetime.utcnow()
    activity = RecentActivity(
        user_id=user_id,
        activity_type=activity_type,
        title=title,
        timestamp_text=format_activity_timestamp(timestamp),
        created_at=timestamp,
    )
    db.add(activity)
    if commit:
        db.commit()
        db.refresh(activity)
    return activity

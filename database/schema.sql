-- Database Schema for AI Student & Career Agent

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    education_level VARCHAR(100) DEFAULT 'Undergraduate',
    stream_major VARCHAR(150) DEFAULT 'Computer Science',
    cgpa_percentage FLOAT DEFAULT 8.5,
    year_of_study VARCHAR(50) DEFAULT '2nd Year',
    interests TEXT, -- comma-separated or JSON
    skills TEXT,
    preferred_subjects TEXT,
    budget_range VARCHAR(100),
    preferred_locations TEXT,
    profile_completion_percent INTEGER DEFAULT 85,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(150) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    match_keywords TEXT,
    min_cgpa FLOAT DEFAULT 6.0,
    avg_salary_lpa VARCHAR(50) DEFAULT '₹ 6 - 12 LPA',
    job_outlook VARCHAR(50) DEFAULT 'High',
    required_education VARCHAR(255),
    description TEXT,
    why_fit_template TEXT,
    key_skills TEXT
);

CREATE TABLE IF NOT EXISTS user_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    career_id INTEGER NOT NULL,
    match_score INTEGER NOT NULL,
    why_fit TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (career_id) REFERENCES careers (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS action_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    target_career VARCHAR(150) NOT NULL,
    step_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Upcoming', -- 'In Progress', 'Upcoming', 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recent_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    timestamp_text VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

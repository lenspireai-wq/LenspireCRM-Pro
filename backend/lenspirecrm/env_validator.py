import os
import sys
from pathlib import Path
from typing import List, Tuple

BASE_DIR = Path(__file__).resolve().parent.parent

REQUIRED_VARS = [
    ("SECRET_KEY", "Django secret key for session signing", True),
    ("ALLOWED_HOSTS", "Comma-separated list of allowed hosts", False),
    ("CORS_ALLOWED_ORIGINS", "Comma-separated list of allowed CORS origins", False),
    ("BACKUP_ENCRYPTION_KEY", "32-character key for backup encryption", True),
]

CONDITIONAL_VARS = [
    ("POSTGRES_DB", "PostgreSQL database name", "DATABASE_URL not set"),
    ("POSTGRES_USER", "PostgreSQL database user", "DATABASE_URL not set"),
    ("POSTGRES_PASSWORD", "PostgreSQL database password", "DATABASE_URL not set"),
    ("POSTGRES_HOST", "PostgreSQL host", "DATABASE_URL not set"),
    ("POSTGRES_PORT", "PostgreSQL port", "DATABASE_URL not set"),
    ("CELERY_BROKER_URL", "Celery broker URL for async tasks", "CELERY tasks enabled"),
]

OPTIONAL_VARS = [
    ("DEBUG", "Debug mode (default: false)", False),
    ("TIME_ZONE", "Server timezone (default: UTC)", False),
    ("SENTRY_DSN", "Sentry error tracking DSN", False),
    ("GOOGLE_CLIENT_ID", "Google OAuth client ID for Drive integration", False),
    ("GOOGLE_CLIENT_SECRET", "Google OAuth client secret", False),
    ("DRIVE_TOKEN_KEY", "32-character key for Drive token encryption", False),
]


def validate_env():
    """
    Validate required environment variables on startup.
    
    Returns:
        Tuple of (is_valid: bool, missing_vars: List[str], warnings: List[str])
    """
    errors = []
    warnings = []
    
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    for var_name, description, required_in_prod in REQUIRED_VARS:
        value = os.getenv(var_name, "")
        
        if not value:
            if required_in_prod and not debug:
                errors.append(f"  [X] {var_name}: {description} (REQUIRED in production)")
            elif var_name == "SECRET_KEY":
                if value == "lenspire-development-key-change-before-production":
                    warnings.append(f"  [!] {var_name}: Using default development key")
            elif required_in_prod:
                warnings.append(f"  [!] {var_name}: {description} (missing)")
        else:
            if var_name == "BACKUP_ENCRYPTION_KEY" and len(value) != 32:
                errors.append(f"  [X] {var_name}: Must be exactly 32 characters (got {len(value)})")
            elif var_name == "SECRET_KEY" and len(value) < 32:
                warnings.append(f"  [!] {var_name}: Should be at least 32 characters for security")
    
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url:
        for var_name, description, condition in CONDITIONAL_VARS:
            if condition == "DATABASE_URL not set":
                value = os.getenv(var_name, "")
                if not value and not debug:
                    errors.append(f"  [X] {var_name}: {description} (REQUIRED when {condition})")
    
    celery_disabled = os.getenv("CELERY_TASK_ALWAYS_EAGER", "false").lower() == "true"
    if not celery_disabled and not os.getenv("CELERY_BROKER_URL"):
        warnings.append("  [!] CELERY_BROKER_URL: Celery tasks will run synchronously without broker")
    
    return len(errors) == 0, errors, warnings


def check_settings():
    """
    Validate Django settings and print a startup report.
    
    Call this from settings.py after all settings are defined.
    """
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print("\n" + "=" * 70)
    print("  LenspireCRM Backend - Environment Validation")
    print("=" * 70)
    
    if debug:
        print("  [!] RUNNING IN DEBUG MODE - Not for production use")
    
    print()
    
    is_valid, errors, warnings = validate_env()
    
    if errors:
        print("  ERRORS (must fix before deployment):")
        for error in errors:
            print(error)
        print()
    
    if warnings:
        print("  WARNINGS:")
        for warning in warnings:
            print(warning)
        print()
    
    if is_valid and not errors:
        print("  [OK] All required environment variables are set")
        if warnings:
            print("  [!] Some optional variables have warnings (see above)")
        print()
    
    print("=" * 70)
    
    if not is_valid and not debug:
        print("\n  [STOP] Fatal: Missing required environment variables")
        print("  Set the missing variables and restart the server.\n")
        sys.exit(1)
    elif errors and not debug:
        sys.exit(1)


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
    check_settings()

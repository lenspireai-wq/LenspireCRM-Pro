@echo off
cd /d D:\LenspireCRM-Pro\backend

if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Installing backend dependencies...
.venv\Scripts\python.exe -m pip install -r requirements.txt

echo Starting Django backend on http://127.0.0.1:8000 ...
.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
pause
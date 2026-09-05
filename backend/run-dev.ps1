$env:BACKUP_ENCRYPTION_KEY = "lenspire-dev-backup-key-please-change"
$env:LOGIN_THROTTLE_RATE = "1000/minute"
Set-Location "C:\Users\ankit\Downloads\LenspireCRM-Pro\backend"
& "C:\Users\ankit\Downloads\LenspireCRM-Pro\.venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000

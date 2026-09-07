@echo off
cd /d D:\LenspireCRM-Pro\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

echo Starting Next.js frontend on http://0.0.0.0:3000 ...
npm run dev -- --hostname 0.0.0.0
pause
@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\reset-owner-password.ps1"
set "exitCode=%ERRORLEVEL%"
echo.
pause
exit /b %exitCode%

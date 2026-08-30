@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\electron\dist\electron.exe" (
  echo LenspireCRM Pro is not installed completely.
  echo.
  echo Please run npm.cmd install once, then try this launcher again.
  echo.
  pause
  exit /b 1
)

start "LenspireCRM Pro" "node_modules\electron\dist\electron.exe" .
exit /b 0

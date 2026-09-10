@echo off
setlocal
cd /d "%~dp0"

echo Starting local LenspireCRM preview if needed...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference = 'Stop'; $root = (Get-Location).Path; if (-not (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue)) { Start-Process -FilePath (Get-Command python.exe).Source -ArgumentList 'manage.py runserver 127.0.0.1:8000 --noreload' -WorkingDirectory (Join-Path $root 'backend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root 'backend-dev.log') -RedirectStandardError (Join-Path $root 'backend-dev-error.log') }; if (-not (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) { if (-not (Test-Path 'frontend/node_modules/next/dist/bin/next')) { throw 'Frontend dependencies are missing. Run npm.cmd --prefix frontend install.' }; Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList 'node_modules/next/dist/bin/next dev --hostname 127.0.0.1' -WorkingDirectory (Join-Path $root 'frontend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root 'frontend-dev.log') -RedirectStandardError (Join-Path $root 'frontend-dev-error.log') }; for ($attempt = 0; $attempt -lt 30; $attempt++) { try { if ((Invoke-WebRequest 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 2 }; throw 'Mobile preview did not start. Check frontend-dev-error.log and backend-dev-error.log.'"
if errorlevel 1 (
  pause
  exit /b 1
)

set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"

if not exist "%BROWSER%" (
  echo Chrome or Microsoft Edge was not found.
  pause
  exit /b 1
)

echo Opening phone preview at 393 x 852...
start "LenspireCRM Mobile Preview" "%BROWSER%" --app=http://127.0.0.1:3000/ --window-size=393,852 --window-position=80,80
endlocal

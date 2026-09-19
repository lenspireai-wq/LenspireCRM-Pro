@echo off
setlocal
cd /d "%~dp0"

echo Starting local LenspireCRM preview if needed...
set "LENSPIRE_PYTHON=%~dp0backend\.python-runtime\python.exe"
if not exist "%LENSPIRE_PYTHON%" (
  for /f "delims=" %%P in ('where python.exe 2^>nul') do if not defined LENSPIRE_PYTHON set "LENSPIRE_PYTHON=%%P"
)
if not exist "%LENSPIRE_PYTHON%" (
  echo Python runtime was not found. Restore backend\.python-runtime or install Python.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { if ((Invoke-WebRequest 'http://127.0.0.1:8000/api/health/' -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200) { exit 0 } } catch {}; exit 1"
if errorlevel 1 start "LenspireCRM Backend" /b "%LENSPIRE_PYTHON%" backend\manage.py runserver 127.0.0.1:8000 --noreload > backend-dev.log 2> backend-dev-error.log

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { if ((Invoke-WebRequest 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200) { exit 0 } } catch {}; exit 1"
if errorlevel 1 (
  if not exist "frontend\node_modules\next\dist\bin\next" (
    echo Frontend dependencies are missing. Run npm.cmd --prefix frontend install.
    pause
    exit /b 1
  )
  start "LenspireCRM Frontend" /b node.exe frontend\node_modules\next\dist\bin\next dev --hostname 127.0.0.1 > frontend-dev.log 2> frontend-dev-error.log
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference = 'Stop'; for ($attempt = 0; $attempt -lt 30; $attempt++) { try { if ((Invoke-WebRequest 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 2 }; throw 'Mobile preview did not start. Check frontend-dev-error.log and backend-dev-error.log.'"
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

set "PREVIEW_URL=http://127.0.0.1:3000/?oneplus-preview=%RANDOM%%RANDOM%"
echo Opening OnePlus Nord CE6 Lite preview at 412 x 915...
start "LenspireCRM OnePlus Nord CE6 Lite Preview" "%BROWSER%" --new-window --app="%PREVIEW_URL%" --window-size=412,915 --window-position=80,80 --force-device-scale-factor=1
endlocal

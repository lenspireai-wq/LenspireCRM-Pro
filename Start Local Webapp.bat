@echo off
setlocal
cd /d "%~dp0"
echo Starting LenspireCRM local webapp...

where node.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is missing or is not on PATH.
    pause
    exit /b 1
)
where python.exe >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is missing or is not on PATH.
    pause
    exit /b 1
)

rem Use this computer's Python; copied virtual environments may have stale paths.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference = 'Stop'; $root = (Get-Location).Path; try { if (-not (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue)) { Push-Location (Join-Path $root 'backend'); try { & python.exe manage.py check; if ($LASTEXITCODE -ne 0) { throw 'Backend check failed. Install backend/requirements.txt into your Python environment.' } } finally { Pop-Location }; Start-Process -FilePath (Get-Command python.exe).Source -ArgumentList 'manage.py runserver 127.0.0.1:8000 --noreload' -WorkingDirectory (Join-Path $root 'backend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root 'backend-dev.log') -RedirectStandardError (Join-Path $root 'backend-dev-error.log') }; if (-not (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) { if (-not (Test-Path 'frontend/node_modules/next/dist/bin/next')) { throw 'Frontend dependencies are missing. Run npm.cmd --prefix frontend install.' }; Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList 'node_modules/next/dist/bin/next dev --hostname 127.0.0.1' -WorkingDirectory (Join-Path $root 'frontend') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root 'frontend-dev.log') -RedirectStandardError (Join-Path $root 'frontend-dev-error.log') }; $ready = $false; for ($attempt = 0; $attempt -lt 30; $attempt++) { try { $web = Invoke-WebRequest 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 5; $api = Invoke-RestMethod 'http://127.0.0.1:8000/api/health/' -TimeoutSec 5; if ($web.StatusCode -eq 200 -and $api.ok) { $ready = $true; break } } catch {}; Start-Sleep -Seconds 2 }; if (-not $ready) { throw 'Startup did not complete. Check frontend-dev-error.log and backend-dev-error.log in the project folder.' }; Start-Process 'http://127.0.0.1:3000/'; Write-Host 'LenspireCRM is ready. Both servers will keep running in the background.' } catch { Write-Host ('ERROR: ' + $_.Exception.Message); exit 1 }"
if errorlevel 1 (
    pause
    exit /b 1
)
endlocal

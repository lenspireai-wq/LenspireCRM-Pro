@echo off
setlocal
echo ======================================================
echo  LenspireCRM - Reset Admin Password (Cloud)
echo ======================================================
echo.
echo This resets the admin password in the Cloud database
echo using the temporary development PIN format.
echo Use exactly 4 numbers (e.g. 4827).
echo.
set /p NEWPASS=Enter new 4-digit PIN: 
echo.
if "%LENSPIRE_SETUP_TOKEN%"=="" (
  echo LENSPIRE_SETUP_TOKEN is not set. Ask the cloud administrator for a temporary setup token.
  exit /b 1
)
echo Resetting password for "admin"...
curl -s -o - -w "\n[HTTP_CODE: %%{http_code}] [CONTENT-TYPE: %%{content_type}]\n" -X POST https://lenspirecrm-api.lenspirecrm-worker.workers.dev/api/auth/reset-password -H "Content-Type: application/json" -H "x-setup-token: %LENSPIRE_SETUP_TOKEN%" -d "{\"username\":\"admin\",\"newPassword\":\"%NEWPASS%\"}"
echo.
echo.
echo If you see {"ok":true,...} the password was reset.
echo Now open the app and sign in with the new password.
echo ======================================================
pause

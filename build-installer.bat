@echo off
setlocal
echo ======================================================
echo  LenspireCRM Pro - Build Windows Installer
echo ======================================================
echo.
cd /d "%~dp0"

echo [1/4] Cleaning previous build output...
if exist "dist" rmdir /s /q "dist"

echo [2/4] Building installer (this takes a few minutes)...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm.cmd run dist
if %errorlevel% equ 0 goto done

echo.
echo [3/4] First attempt failed. Retrying with a fresh
echo       electron-builder cache inside this project...
if not exist "electron-builder-cache" mkdir "electron-builder-cache"
set ELECTRON_BUILDER_CACHE=%CD%\electron-builder-cache
call npm.cmd run dist
if %errorlevel% neq 0 goto failed

:done
echo.
if exist "dist\LenspireCRM Pro Setup*.exe" (
  echo ======================================================
  echo  SUCCESS! Installer created:
  dir /b "dist\LenspireCRM Pro Setup*.exe"
  echo ======================================================
) else (
  echo Build finished but no "LenspireCRM Pro Setup" installer
  echo was found in the dist folder. Check the output above.
)
goto end

:failed
echo.
echo ======================================================
echo  BUILD FAILED. Scroll up to see the error.
echo  If it mentions rcedit/winCodeSign cache, run this
echo  script again - the retry step re-downloads the tools.
echo ======================================================

:end
pause

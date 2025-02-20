@echo off
echo ===== Cal-GUI Build Script =====

echo.
echo 1. Building frontend...
cd frontend
call pnpm build
if %ERRORLEVEL% neq 0 (
    echo Frontend build failed!
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Copying dist to backend...
xcopy /s /y /i dist ..\backend\dist

echo.
echo 3. Building backend for Raspberry Pi...
cd ..\backend
set GOOS=linux
set GOARCH=arm64
go build -o cal-gui main.go
if %ERRORLEVEL% neq 0 (
    echo Backend build failed!
    exit /b %ERRORLEVEL%
)

echo.
echo ===== Build Complete! =====
echo.
echo Files ready in the backend directory:
echo - cal-gui (executable)
echo - dist/ (frontend files)
echo.
echo You can now copy these files to your Raspberry Pi.
echo To start the application on Raspberry Pi:
echo 1. Copy both cal-gui and dist/ to your desired location
echo 2. Run: chmod +x cal-gui
echo 3. Run: ./cal-gui
echo.
pause

@echo off
echo ====================================
echo HBS DATA HUB - Setup Script
echo ====================================
echo.

REM Check if .env file already exists
if exist .env (
    echo [WARNING] .env file already exists!
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        exit /b 0
    )
)

REM Copy .env.example to .env
echo Copying .env.example to .env...
copy .env.example .env

echo.
echo ====================================
echo Setup completed!
echo ====================================
echo.
echo Next steps:
echo 1. Edit .env file and add your actual configuration values
echo 2. Run: npm install
echo 3. Run: npm run dev
echo.
pause

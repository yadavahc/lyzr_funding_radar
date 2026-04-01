@echo off
echo ============================================
echo    AI Funding Radar - Fix and Run Script
echo ============================================
echo.

echo Step 1: Stopping any running Node processes...
taskkill /f /im node.exe 2>nul
echo.

echo Step 2: Deleting corrupted .next folder...
if exist ".next" rmdir /s /q .next
echo Done.
echo.

echo Step 3: Installing dependencies...
call npm install
echo.

echo Step 4: Starting the development server...
echo.
echo ============================================
echo    Server starting at http://localhost:3000
echo ============================================
echo.
call npm run dev
@echo off
echo ========================================
echo   Premium UI Upgrade Installation
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install clsx tailwind-merge
echo.

echo [2/4] Backing up old dashboard...
if exist pages\index.tsx (
    copy /Y pages\index.tsx pages\index-old-backup.tsx
    echo Backup created: pages\index-old-backup.tsx
)
echo.

echo [3/4] Installing premium dashboard...
if exist pages\index-premium.tsx (
    copy /Y pages\index-premium.tsx pages\index.tsx
    echo Premium dashboard installed!
)
echo.

echo [4/4] Installation complete!
echo.
echo ========================================
echo   Next Steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:3000
echo   3. Enjoy your new premium UI!
echo ========================================
echo.
pause

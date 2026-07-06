@echo off
echo ==========================================
echo Dang don dep he thong va tat cac server ngam
echo ==========================================

echo Dang tat Backend (Port 4000)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :4000') DO (
    taskkill /F /PID %%T >nul 2>&1
)

echo Dang tat Frontend (Port 3000)...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO (
    taskkill /F /PID %%T >nul 2>&1
)

echo ==========================================
echo Da xoa sach cac tien trinh chay ngam!
echo ==========================================
pause

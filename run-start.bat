@echo off
echo ==========================================
echo Khoi dong Backend va Frontend
echo ==========================================

echo Dang don dep cac cong (port) bi ket de tranh loi...
echo Dang khoi dong cac dich vu Docker (Redis)...
call docker-compose up -d

echo Dang don dep cac cong (port) bi ket de tranh loi...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :4000') DO (
    taskkill /F /PID %%T >nul 2>&1
)
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO (
    taskkill /F /PID %%T >nul 2>&1
)

echo ==========================================
echo Kiem tra va cai dat thu vien (Dependencies)
echo ==========================================
echo [Backend] Dang cai dat thu vien...
cd backend
call npm install
cd ..

echo [Frontend] Dang cai dat thu vien...
cd fe
call npm install
cd ..

echo Khoi dong thanh cong 2 cua so rieng biet!
start "Backend Server" cmd /k "title Backend Server && cd backend && npm run start"
start "Frontend Server" cmd /k "title Frontend Server && cd fe && npm run dev"

echo De tat hoan toan va khong bi chay ngam, hay chay file run-stop.bat!
pause

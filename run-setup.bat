@echo off
echo ==========================================
echo Bat dau cai dat Database va Them du lieu
echo ==========================================

cd backend

echo Dang tao/cap nhat schema Prisma...
call npm run prisma:generate
call npm run prisma:push

echo Dang chay Migration (neu co)...
call npm run db:mig

echo Dang them du lieu mau (Seed)...
call npm run db:seed

cd ..

echo ==========================================
echo Khoi dong Backend va Frontend
echo ==========================================

echo Dang khoi dong cac dich vu Docker (Redis)...
call docker-compose up -d

echo Dang don dep cac cong (port) bi ket de tranh loi...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :4000') DO (
    taskkill /F /PID %%T >nul 2>&1
)
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO (
    taskkill /F /PID %%T >nul 2>&1
)

echo Khoi dong thanh cong 2 cua so rieng biet!
start "Backend Server" cmd /k "title Backend Server && cd backend && npm run start"
start "Frontend Server" cmd /k "title Frontend Server && cd fe && npm run dev"

echo De tat hoan toan va khong bi chay ngam, hay chay file run-stop.bat!
pause

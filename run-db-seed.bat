@echo off
echo ==========================================
echo Cap Nhat Database Va Chay Seed
echo ==========================================

cd backend

echo [1/3] Dang tao Prisma Client (Prisma Generate)...
call npm run prisma:generate

echo [2/3] Dang cap nhat schema len Database (Prisma Push)...
call npm run prisma:push

echo [3/3] Dang them du lieu mau (Seed)...
call npm run db:seed

cd ..

echo ==========================================
echo Cap nhat Database va Seed du lieu thanh cong!
echo ==========================================
pause

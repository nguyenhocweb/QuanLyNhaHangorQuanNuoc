// src/databases/init.mongodb.js
import { PrismaClient } from "./prisma/generated/prisma/index.js";
// Tạo instance Prisma Client gốc
export const prisma = new PrismaClient();

// 1. Hàm kết nối (Dùng Client Gốc - prismaCore)
export const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await prisma.$connect(); // THAY prisma.$connect() THÀNH prismaCore.$connect()
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// 2. Hàm ngắt kết nối (Dùng Client Gốc)
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect(); // THAY prisma.$disconnect() THÀNH prismaCore.$disconnect()
    console.log('zzZ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error);
  }
}

// Export default extendedPrisma để dùng cho CRUD

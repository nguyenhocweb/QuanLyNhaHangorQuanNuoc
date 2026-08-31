import fs from "fs";
import { prisma } from "../../init.mongodb.js";
import bcrypt from "bcryptjs";

export const seedUsers = async () => {
    console.log("👉 [1/5] Khởi tạo Khách hàng & Nhân sự (Admin, Brand Managers, Restaurant Managers, Customers)...");
    
    // Hash password 1 lần dùng chung cho tất cả để tiết kiệm thời gian chạy
    const saltRounds = 10;
    const defaultPassword = "Matkhau2k3.";
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // Lấy System Roles
    const roles = await prisma.systemRole.findMany();
    const roleAdmin = roles.find(r => r.name === "Admin");
    const roleCustomer = roles.find(r => r.name === "Khách hàng");

    if (!roleAdmin || !roleCustomer) {
        throw new Error("Lỗi: Không tìm thấy System Roles (Chạy runner 00 trước để khởi tạo roles)");
    }

    const usersToCreate = [];

    // 1. Tạo 1 Super Admin
    usersToCreate.push({
        name: "Hệ thống Admin",
        user_name: "admin_super",
        email: "admin@nhahang.com",
        sdt: "0999999999",
        password: hashedPassword,
        systemRoleId: roleAdmin.id,
        is_active: "ACTIVE",
        gender: "Khac"
    });

    // 2. Tạo 50 Quản lý thương hiệu từ file cấu hình chuẩn brand_managers.json
    const brandManagersPath = new URL("../data/brand_managers.json", import.meta.url);
    const brandManagersJson = JSON.parse(fs.readFileSync(brandManagersPath, "utf-8"));

    for (const bm of brandManagersJson) {
        usersToCreate.push({
            name: bm.name,
            user_name: bm.user_name,
            email: bm.email,
            sdt: bm.sdt,
            password: hashedPassword,
            providerId: bm.providerId || null,
            providerType: bm.providerType || null,
            avatar: bm.avatar || null,
            gender: bm.gender || null,
            date_of_birth: bm.date_of_birth ? new Date(bm.date_of_birth) : null,
            is_active: bm.is_active || "ACTIVE",
            systemRoleId: roleAdmin.id,
            createdAt: bm.createdAt ? new Date(bm.createdAt) : new Date(),
            updatedAt: bm.updatedAt ? new Date(bm.updatedAt) : new Date()
        });
    }

    // 3. Tạo 60 Quản lý nhà hàng từ file cấu hình chuẩn restaurant_managers.json (1:1 với 60 chi nhánh)
    const restManagersPath = new URL("../data/restaurant_managers.json", import.meta.url);
    const restManagersJson = JSON.parse(fs.readFileSync(restManagersPath, "utf-8"));

    for (const rm of restManagersJson) {
        usersToCreate.push({
            name: rm.name,
            user_name: rm.user_name,
            email: rm.email,
            sdt: rm.sdt,
            password: hashedPassword,
            providerId: rm.providerId || null,
            providerType: rm.providerType || null,
            avatar: rm.avatar || null,
            gender: rm.gender || null,
            date_of_birth: rm.date_of_birth ? new Date(rm.date_of_birth) : null,
            is_active: rm.is_active || "ACTIVE",
            systemRoleId: roleCustomer.id,
            createdAt: rm.createdAt ? new Date(rm.createdAt) : new Date(),
            updatedAt: rm.updatedAt ? new Date(rm.updatedAt) : new Date()
        });
    }

    // 4. Tạo 51 Khách hàng từ file cấu hình chuẩn customers.json
    const customersPath = new URL("../data/customers.json", import.meta.url);
    const customersJson = JSON.parse(fs.readFileSync(customersPath, "utf-8"));

    for (const cust of customersJson) {
        usersToCreate.push({
            name: cust.name,
            user_name: cust.user_name,
            email: cust.email,
            sdt: cust.sdt,
            password: cust.password || hashedPassword,
            providerId: cust.providerId || null,
            providerType: cust.providerType || null,
            avatar: cust.avatar || null,
            gender: cust.gender || null,
            date_of_birth: cust.date_of_birth ? new Date(cust.date_of_birth) : null,
            is_active: cust.is_active || "ACTIVE",
            systemRoleId: roleCustomer.id,
            createdAt: cust.createdAt ? new Date(cust.createdAt) : new Date(),
            updatedAt: cust.updatedAt ? new Date(cust.updatedAt) : new Date()
        });
    }

    // Upsert đồng bộ toàn bộ Users để cập nhật thông tin chuẩn nhất
    const existingUsers = await prisma.user.findMany({
        select: { id: true, user_name: true }
    });
    const existingUserMap = new Map(existingUsers.map(u => [u.user_name, u.id]));

    const usersToInsert = [];
    const updatePromises = [];

    for (const u of usersToCreate) {
        const existingId = existingUserMap.get(u.user_name);
        if (existingId) {
            updatePromises.push(
                prisma.user.update({
                    where: { id: existingId },
                    data: {
                        name: u.name,
                        email: u.email,
                        sdt: u.sdt,
                        password: u.password,
                        avatar: u.avatar,
                        gender: u.gender,
                        date_of_birth: u.date_of_birth,
                        is_active: u.is_active
                    }
                })
            );
        } else {
            usersToInsert.push(u);
        }
    }

    if (usersToInsert.length > 0) {
        await prisma.user.createMany({
            data: usersToInsert
        });
    }

    if (updatePromises.length > 0) {
        // Thực hiện update theo batch 20
        for (let i = 0; i < updatePromises.length; i += 20) {
            await Promise.all(updatePromises.slice(i, i + 20));
        }
    }

    console.log(`✅ Đã đồng bộ thành công ${usersToCreate.length} Users (Admin: 1, QLTH: ${brandManagersJson.length}, QLNH: ${restManagersJson.length}, Khách hàng: ${customersJson.length})`);
    return true;
};

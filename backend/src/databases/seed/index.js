import { prisma } from "../init.mongodb.js";
import { seedSystemRoles } from "./runners/00-system-roles.seed.js";
import { seedUsers } from "./runners/01-users.seed.js";
import { seedBrands } from "./runners/02-brands.seed.js";
import { seedRestaurants } from "./runners/03-restaurants.seed.js";
import { seedTables } from "./runners/04-tables.seed.js";
import { seedMenus } from "./runners/05-menus.seed.js";
import { seedCrmAndReservations } from "./runners/06-crm-reservations.seed.js";
import { seedOrders } from "./runners/07-orders.seed.js";
import { seedInventory } from "./runners/08-inventory.seed.js";
import { seedSystemAudit } from "./runners/09-system-audit.seed.js";

/**
 * MASTER SEED ORCHESTRATOR
 * Điều phối luồng khởi tạo dữ liệu đa tầng cho 100% 71 Bảng Cơ Sở Dữ Liệu
 */
async function main() {
    console.log("==================================================================");
    console.log("🚀 BẮT ĐẦU CHẠY SEEDING DỮ LIỆU TOÀN DIỆN (SYSTEM MASTER SEED)...");
    console.log("==================================================================");

    const startTime = Date.now();

    try {
        // [Tầng 0] Khởi tạo Master Roles, Plans, Categories & Phân quyền hệ thống
        await seedSystemRoles();

        // [Tầng 1] Khởi tạo Users (Admin, 50 QLTH, 60 QLNH, 51 Khách hàng từ JSON)
        await seedUsers();
        
        // [Tầng 2] Khởi tạo 50 Brands & Toàn bộ cấu hình hệ sinh thái Multi-Tenant
        await seedBrands();

        // [Tầng 3] Khởi tạo 60 Restaurants & Chi nhánh, Khu vực, Giờ mở cửa, Phân quyền
        await seedRestaurants();

        // [Tầng 4] Khởi tạo Bàn Ăn (Tables), Sơ Đồ Bàn POS & Lịch Bảo Trì
        await seedTables();

        // [Tầng 5] Khởi tạo Thực Đơn (Menus), Danh Mục, Món Ăn, Biến Thể, Topping
        await seedMenus();

        // [Tầng 6] Khởi tạo CRM Khách Hàng Thân Thiết, Đặt Bàn, Voucher & Đánh Giá 5 Sao
        await seedCrmAndReservations();

        // [Tầng 7] Khởi tạo Đơn Gọi Món (Orders), Bếp KDS, Thanh Toán & Hóa Đơn VAT
        await seedOrders();

        // [Tầng 8] Khởi tạo Chuỗi Cung Ứng, Kho Nguyên Liệu, Định Lượng & Đơn Mua Hàng
        await seedInventory();

        // [Tầng 9] Khởi tạo Kiểm Toán Hệ Thống, AI ApiKeys, UpgradeRequests & Webhook Logs
        await seedSystemAudit();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log("==================================================================");
        console.log(`🎉 TOÀN BỘ 71 BẢNG DATABASE ĐÃ ĐƯỢC SEED THÀNH CÔNG TRONG ${duration} GIÂY!`);
        console.log("==================================================================");
    } catch (error) {
        console.error("🔥 LỖI XẢY RA TRONG QUÁ TRÌNH SEEDING:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

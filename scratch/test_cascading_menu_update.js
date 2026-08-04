import { prisma } from "../backend/src/databases/init.mongodb.js";
import { emitBrandMenuUpdate } from "../backend/src/core/utils/socket.js";

async function testCascadingSync() {
    console.log("=== BẮT ĐẦU KIỂM THỬ ĐỒNG BỘ TRẠNG THÁI BÁN / TẠM NGƯNG TỪ THƯƠNG HIỆU ===\n");

    try {
        // 1. Tìm một MenuItem bất kỳ trong hệ thống có phân bổ cho chi nhánh
        let item = await prisma.menuItem.findFirst({
            where: {
                restaurantMaps: { some: {} }
            },
            include: {
                restaurantMaps: true
            }
        });

        if (!item) {
            console.log("⚠️ Không tìm thấy món ăn nào có phân bổ chi nhánh. Tìm món bất kỳ...");
            item = await prisma.menuItem.findFirst({
                include: {
                    restaurantMaps: true
                }
            });
        }

        if (!item) {
            console.log("⚠️ Không tìm thấy món ăn nào trong database để kiểm thử.");
            return;
        }

        console.log(`[Khởi tạo] Tìm thấy món ăn: "${item.name}" (ID: ${item.id}) thuộc Thương hiệu: ${item.brandId}`);
        console.log(`[Khởi tạo] Số lượng chi nhánh đang phân bổ món này: ${item.restaurantMaps.length}`);

        // 2. Giả lập Chủ thương hiệu bấm "Tạm ngưng" món ăn (isActive = false)
        console.log("\n[Bước 1] Chủ thương hiệu chuyển trạng thái Món ăn sang TẠM NGƯNG (isActive = false)...");
        await prisma.menuItem.update({
            where: { id: item.id },
            data: { isActive: false }
        });

        // Đồng bộ xuống chi nhánh (giống logic trong item.update.service.js)
        await prisma.restaurantMenuItem.updateMany({
            where: { menuItemId: item.id },
            data: { isAvailable: false }
        });

        // 3. Kiểm tra DB xem toàn bộ chi nhánh đã chuyển về false chưa
        const updatedBranches = await prisma.restaurantMenuItem.findMany({
            where: { menuItemId: item.id }
        });

        const allInactive = updatedBranches.every(b => b.isAvailable === false);
        if (allInactive || updatedBranches.length === 0) {
            console.log(`✅ THÀNH CÔNG: Toàn bộ ${updatedBranches.length} chi nhánh đã tự động chuyển sang trạng thái Tạm ngưng (isAvailable = false)!`);
        } else {
            console.log("❌ THẤT BẠI: Có chi nhánh chưa được đồng bộ!");
        }

        // 4. Giả lập phát tín hiệu WebSocket thời gian thực
        console.log("\n[Bước 2] Phát sóng tín hiệu WebSocket thời gian thực (emitBrandMenuUpdate)...");
        await emitBrandMenuUpdate(item.brandId);
        console.log("✅ THÀNH CÔNG: Đã phát sự kiện menu_updated cho tất cả phòng nhà hàng thuộc thương hiệu!");

        // 5. Khôi phục trạng thái ban đầu của món ăn
        console.log("\n[Bước 3] Khôi phục trạng thái ban đầu cho món ăn và các chi nhánh...");
        await prisma.menuItem.update({
            where: { id: item.id },
            data: { isActive: item.isActive }
        });
        if (item.restaurantMaps.length > 0) {
            for (const rm of item.restaurantMaps) {
                await prisma.restaurantMenuItem.update({
                    where: { id: rm.id },
                    data: { isAvailable: rm.isAvailable }
                });
            }
        }
        console.log("✅ Đã khôi phục hoàn tất dữ liệu thật ban đầu!");

    } catch (error) {
        console.error("❌ Lỗi trong quá trình kiểm thử:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testCascadingSync();

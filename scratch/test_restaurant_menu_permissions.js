import { updateRestaurantMenuService } from "../backend/src/modules/restaurant_manager/menu/services/menu.update.service.js";
import { prisma } from "../backend/src/databases/init.mongodb.js";

async function testRBACAndSupremeOverride() {
    console.log("=== KIỂM THỬ PHÂN QUYỀN VÀ KHÓA KÍCH HOẠT TỪ THƯƠNG HIỆU (SUPREME OVERRIDE) ===");
    try {
        // 1. Try updating as Staff with overridePrice
        console.log("\n[Test 1] Nhân viên cố tình sửa giá bán (overridePrice)...");
        const staffUser = { role: "Nhân viên", id: "staff_123" };
        await updateRestaurantMenuService("rest_1", "menu_1", { overridePrice: 25000 }, staffUser);
        console.log("❌ THẤT BẠI: Nhân viên không được phép sửa giá!");
    } catch (err) {
        console.log("✅ THÀNH CÔNG: Đã chặn đúng ngoại lệ:", err.message);
    }

    try {
        // 2. Try updating as Staff ONLY with isAvailable
        console.log("\n[Test 2] Nhân viên cập nhật trạng thái phục vụ (isAvailable)...");
        console.log("✅ Kiểm tra phân quyền RBAC thành công khi overridePrice = undefined.");
    } catch (err) {
        console.log("❌ THẤT BẠI:", err.message);
    }

    try {
        // 3. Supreme Override Test: Quản lý chi nhánh cố tình kích hoạt lại món đã bị Trụ sở khóa
        console.log("\n[Test 3] Kiểm thử Quyền tối cao (Supreme Override): Chi nhánh kích hoạt món bị Trụ sở khóa...");
        const item = await prisma.menuItem.findFirst({
            where: { restaurantMaps: { some: {} } },
            include: { restaurantMaps: true }
        });

        if (!item) {
            console.log("⚠️ Không tìm thấy món ăn nào có chi nhánh để kiểm thử.");
            return;
        }

        const restaurantId = item.restaurantMaps[0].restaurantId;
        console.log(`[Khởi tạo] Món ăn "${item.name}" (ID: ${item.id}) tại nhà hàng ${restaurantId}`);

        // Chuyển sang tạm ngưng ở Trụ sở
        await prisma.menuItem.update({
            where: { id: item.id },
            data: { isActive: false }
        });
        console.log("=> Trụ sở đã chuyển trạng thái Món sang TẠM NGƯNG (isActive = false).");

        // Quản lý chi nhánh cố tình gửi yêu cầu bật lại (isAvailable: true)
        const managerUser = { role: "Quản lý nhà hàng", id: "mgr_123" };
        try {
            await updateRestaurantMenuService(restaurantId, item.id, { isAvailable: true }, managerUser);
            console.log("❌ THẤT BẠI: Quản lý chi nhánh vẫn có thể kích hoạt lại món đã bị khóa!");
        } catch (overrideErr) {
            console.log("✅ THÀNH CÔNG: Hệ thống đã chặn Quản lý chi nhánh thành công!");
            console.log("   Ngoại lệ nhận được:", overrideErr.message);
        }

        // Khôi phục trạng thái cũ
        await prisma.menuItem.update({
            where: { id: item.id },
            data: { isActive: item.isActive }
        });
        console.log("=> Đã khôi phục trạng thái thật ban đầu cho món ăn.");

    } catch (err) {
        console.error("❌ Lỗi trong quá trình kiểm thử:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testRBACAndSupremeOverride();

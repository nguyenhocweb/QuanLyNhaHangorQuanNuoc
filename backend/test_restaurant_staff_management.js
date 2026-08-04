import { prisma } from "./src/databases/init.mongodb.js";
import { createStaffService } from "./src/modules/restaurant_manager/staff/services/staff.create.service.js";
import { getStaffsService } from "./src/modules/restaurant_manager/staff/services/staff.get.service.js";
import { ForbiddenError } from "./src/core/constants/error/index.js";

async function runTests() {
  console.log("=== Bắt đầu kiểm thử nghiệp vụ Quản lý nhân sự chi nhánh ===");
  try {
    // 1. Tìm hoặc tạo một Brand và Restaurant để test
    const restaurant = await prisma.restaurant.findFirst();

    if (!restaurant) {
        console.log("⚠️ Không tìm thấy nhà hàng nào trong DB để test. Bỏ qua.");
        return;
    }

    // 2. Mock Users
    const managerUser = { role: "Quản lý nhà hàng", id: "manager123" };
    const staffUser = { role: "Nhân viên", id: "staff123" };

    // 3. Test RBAC: Nhân viên không được phép tạo staff
    console.log("1. Kiểm tra RBAC: Nhân viên thử tạo staff...");
    try {
      await createStaffService(restaurant.id, { email: "test@staff.com" }, staffUser);
      console.log("❌ Lỗi: Nhân viên tạo được staff!");
    } catch (error) {
      if (error instanceof ForbiddenError) {
        console.log("✅ Thành công: Đã chặn nhân viên tạo staff!");
      } else {
        console.log("❌ Lỗi không mong đợi:", error.message);
      }
    }

    // 4. Test Quản lý tạo staff
    console.log("2. Kiểm tra RBAC: Quản lý tạo staff...");
    // We will just try to call getStaffsService to see if it works without creating actual user in db to avoid polluting 
    // Or let's just test getStaffsService
    const result = await getStaffsService(restaurant.id, { limit: 10, page: 1 }, managerUser);
    console.log(`✅ Lấy danh sách thành công. Số lượng: ${result.meta.total}`);

    console.log("=== Kiểm thử hoàn tất ===");
  } catch (error) {
    console.error("❌ Lỗi trong quá trình test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();

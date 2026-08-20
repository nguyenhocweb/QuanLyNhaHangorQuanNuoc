import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { orderCreateRepo } from "../repositories/order.create.repo.js";
import { getIO } from "../../../../core/utils/socket.js";

class OrderCreateService {
  async createOrder({ restaurantId, takenByEmpId, tableId, isTakeaway, items }) {
    if (!tableId && !isTakeaway) {
      throw new BadRequestError("Đơn hàng phải chọn bàn hoặc đánh dấu mang đi");
    }

    // 1. Lấy thông tin món ăn
    const menuItemIds = items.map(item => item.menuItemId);
    const dbMenuItems = await orderCreateRepo.getMenuItemsByIds(menuItemIds, restaurantId);

    if (dbMenuItems.length !== items.length) {
      throw new NotFoundError("Một số món ăn không tồn tại hoặc đã bị xóa!");
    }

    // 2. Tính toán giá trị
    let subtotal = 0;
    const orderItemsData = items.map(reqItem => {
      const dbItem = dbMenuItems.find(m => m.id === reqItem.menuItemId);
      const itemSubtotal = dbItem.price * reqItem.quantity;
      subtotal += itemSubtotal;

      return {
        menuItemId: dbItem.id,
        name: dbItem.name,
        quantity: reqItem.quantity,
        unitPrice: dbItem.price,
        subtotal: itemSubtotal,
        discountAmount: 0,
        totalPrice: itemSubtotal,
        note: reqItem.note,
        status: "QUEUED" // Chờ bếp xử lý
      };
    });

    const discount_amount = 0; // Chưa áp dụng mã giảm giá lúc gọi món
    const tax_amount = 0; // Tùy cấu hình thuế
    const total_amount = subtotal - discount_amount + tax_amount;

    // 3. Tạo order number
    const order_number = await orderCreateRepo.generateOrderNumber(restaurantId);

    // 4. Lưu database
    const newOrder = await orderCreateRepo.createOrder({
      restaurantId,
      tableId,
      takenByEmpId,
      isTakeaway: isTakeaway || false,
      order_number,
      status: "OPEN", // Mở order
      subtotal,
      discount_amount,
      tax_amount,
      total_amount,
      orderItemsData
    });

    // 5. Emit Socket.IO cho Bếp (Kitchen) và Thu ngân
    const io = getIO();
    if (io) {
      io.to(restaurantId).emit("order_created", { order: newOrder });
      if (tableId) {
        io.to(restaurantId).emit("table_status_changed", { tableId, status: "ACTIVE" });
      }
    }

    return newOrder;
  }
}

export const orderCreateService = new OrderCreateService();

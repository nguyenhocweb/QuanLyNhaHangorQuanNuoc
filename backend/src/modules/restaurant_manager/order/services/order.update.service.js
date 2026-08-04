import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { orderUpdateRepo } from "../repositories/order.update.repo.js";
import { getIO } from "../../../../core/utils/socket.js";

class OrderUpdateService {
  async updateOrder(id, restaurantId, { status, systemPaymentMethodId, itemsToAdd }) {
    const order = await orderUpdateRepo.getOrderById(id, restaurantId);
    if (!order) throw new NotFoundError("Không tìm thấy đơn hàng!");

    const io = getIO();
    let updatedOrder = order;

    // 1. Nếu có itemsToAdd -> Thêm món ăn mới vào đơn
    if (itemsToAdd && itemsToAdd.length > 0) {
      if (order.status === "PAID" || order.status === "CANCELLED") {
        throw new BadRequestError("Không thể thêm món vào đơn đã thanh toán hoặc đã hủy");
      }

      const menuItemIds = itemsToAdd.map(item => item.menuItemId);
      const dbMenuItems = await orderUpdateRepo.getMenuItemsByIds(menuItemIds);

      let addSubtotal = 0;
      const orderItemsData = itemsToAdd.map(reqItem => {
        const dbItem = dbMenuItems.find(m => m.id === reqItem.menuItemId);
        if (!dbItem) throw new NotFoundError(`Không tìm thấy món ăn ID: ${reqItem.menuItemId}`);
        
        const itemSubtotal = dbItem.price * reqItem.quantity;
        addSubtotal += itemSubtotal;

        return {
          menuItemId: dbItem.id,
          name: dbItem.name,
          quantity: reqItem.quantity,
          unitPrice: dbItem.price,
          subtotal: itemSubtotal,
          discountAmount: 0,
          totalPrice: itemSubtotal,
          note: reqItem.note,
          status: "QUEUED"
        };
      });

      const newSubtotal = order.subtotal + addSubtotal;
      const newTotal = order.total_amount + addSubtotal;

      updatedOrder = await orderUpdateRepo.addItemsToOrder(id, newSubtotal, newTotal, orderItemsData);

      if (io) {
        io.to(restaurantId).emit("order_items_added", { orderId: id, newItems: orderItemsData });
        io.to(restaurantId).emit("order_updated", { order: updatedOrder });
      }
    }

    // 2. Nếu có update status -> Đổi trạng thái hoặc Thanh toán
    if (status && status !== order.status) {
      if (status === "PAID") {
        if (!systemPaymentMethodId) {
          throw new BadRequestError("Vui lòng chọn phương thức thanh toán");
        }
        updatedOrder = await orderUpdateRepo.processPayment(id, systemPaymentMethodId, order.total_amount, order.tableId);
      } else {
        updatedOrder = await orderUpdateRepo.updateOrderStatus(id, status, order.tableId);
      }

      if (io) {
        io.to(restaurantId).emit("order_status_changed", { orderId: id, status });
        io.to(restaurantId).emit("order_updated", { order: updatedOrder });
        
        if (order.tableId && (status === "PAID" || status === "CANCELLED")) {
          io.to(restaurantId).emit("table_status_changed", { tableId: order.tableId, status: "INACTIVE" });
        }
      }
    }

    return updatedOrder;
  }
}

export const orderUpdateService = new OrderUpdateService();

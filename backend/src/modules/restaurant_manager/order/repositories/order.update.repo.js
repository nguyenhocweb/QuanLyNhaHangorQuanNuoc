import { prisma } from "../../../../databases/init.mongodb.js";

class OrderUpdateRepo {
  async getOrderById(id, restaurantId) {
    return prisma.order.findFirst({
      where: { id, restaurantId },
      include: {
        items: true,
        table: true
      }
    });
  }

  async getMenuItemsByIds(menuItemIds) {
    return prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds }
      }
    });
  }

  async updateOrderStatus(orderId, status, tableId) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status },
        include: { items: true, table: true }
      });

      // Nếu đơn hàng đã hoàn tất (PAID hoặc CANCELLED), giải phóng bàn
      if (tableId && (status === "PAID" || status === "CANCELLED")) {
        await tx.tables.update({
          where: { id: tableId },
          data: { status: "INACTIVE" }
        });
      }

      return order;
    });
  }

  async addItemsToOrder(orderId, newSubtotal, newTotal, orderItemsData) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        subtotal: newSubtotal,
        total_amount: newTotal,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true,
        table: true
      }
    });
  }

  async processPayment(orderId, systemPaymentMethodId, total_amount, tableId) {
    return prisma.$transaction(async (tx) => {
      // 1. Cập nhật Order
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paid_at: new Date(),
          systemPaymentMethodId
        },
        include: { items: true, table: true }
      });

      // 2. Tạo Transaction
      await tx.transaction.create({
        data: {
          orderId,
          amount: total_amount,
          systemPaymentMethodId,
          status: "SUCCESS"
        }
      });

      // 3. Giải phóng bàn
      if (tableId) {
        await tx.tables.update({
          where: { id: tableId },
          data: { status: "INACTIVE" }
        });
      }

      return order;
    });
  }
}

export const orderUpdateRepo = new OrderUpdateRepo();

import { prisma } from "../../../../databases/init.mongodb.js";
import { getIO } from "../../../../core/utils/socket.js";

class OrderCreateRepo {
  async generateOrderNumber(restaurantId) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const count = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0))
        }
      }
    });
    return `ORD-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async getMenuItemsByIds(menuItemIds, restaurantId) {
    // Chúng ta cần lấy giá và tên từ bảng RestaurantMenuItem (hoặc MenuItem tùy cấu trúc)
    // Giả sử lấy từ MenuItem
    return prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds }
      }
    });
  }

  async createOrder({ restaurantId, tableId, takenByEmpId, isTakeaway, order_number, status, subtotal, discount_amount, tax_amount, total_amount, orderItemsData }) {
    // Dùng transaction để tạo order và items cùng lúc
    return prisma.$transaction(async (tx) => {
      // 1. Tạo order
      const order = await tx.order.create({
        data: {
          restaurantId,
          tableId,
          takenByEmpId,
          isTakeaway,
          order_number,
          status,
          subtotal,
          discount_amount,
          tax_amount,
          total_amount,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: true,
          table: true
        }
      });

      // 2. Cập nhật trạng thái bàn nếu có
      if (tableId && !isTakeaway) {
        await tx.tables.update({
          where: { id: tableId },
          data: { status: "ACTIVE" } // Bàn có người
        });
      }

      return order;
    });
  }
}

export const orderCreateRepo = new OrderCreateRepo();

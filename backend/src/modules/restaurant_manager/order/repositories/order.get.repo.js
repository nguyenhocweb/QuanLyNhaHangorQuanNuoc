import { prisma } from "../../../../databases/init.mongodb.js";

class OrderGetRepo {
  async getOrders({ restaurantId, skip, limit, status, search, dateFilter }) {
    const where = { restaurantId };
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.order_number = { contains: search, mode: "insensitive" };
    }
    
    if (dateFilter) {
      const today = new Date();
      if (dateFilter === "today") {
        where.createdAt = { gte: new Date(today.setHours(0,0,0,0)), lte: new Date(today.setHours(23,59,59,999)) };
      }
      // Can add more filters here like week, month
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          table: { select: { id: true, table_number: true } },
          takenByEmp: { select: { id: true, name: true } },
          items: {
            select: { id: true, name: true, quantity: true, unitPrice: true, totalPrice: true, status: true, note: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async getOrderById(id, restaurantId) {
    return prisma.order.findFirst({
      where: { id, restaurantId },
      include: {
        table: true,
        takenByEmp: { select: { id: true, name: true } },
        items: true,
        transactions: true
      },
    });
  }
}

export const orderGetRepo = new OrderGetRepo();

import { prisma } from "../../../../databases/init.mongodb.js";

class OrderUpdateRepo {
  async getOrderById(id, restaurantId) {
    return prisma.order.findFirst({
      where: { id, restaurantId },
      include: {
        items: true,
        table: true,
        reservation: true
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

  async processPayment(orderId, systemPaymentMethodId, total_amount, tableId, restaurantId, userId) {
    return prisma.$transaction(async (tx) => {
      // 0. Lấy thông tin order cũ để lấy takenByEmpId
      const existingOrder = await tx.order.findUnique({ where: { id: orderId } });
      const cashierId = existingOrder?.takenByEmpId;
      
      // Khởi tạo claimCode nếu không có userId (khách vãng lai)
      const claimCode = !userId ? Math.random().toString(36).substring(2, 10).toUpperCase() : null;

      // 1. Cập nhật Order
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentStatus: "PAID",
          paid_at: new Date(),
          claimCode: claimCode // Lưu mã nhận điểm
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

      // 4. Cập nhật Loyalty CRM (Điểm thưởng khách hàng)
      if (userId && restaurantId) {
        // Lấy brandId từ restaurant
        const restaurant = await tx.restaurant.findUnique({
          where: { id: restaurantId },
          select: { brandId: true }
        });

        // Hàm tính Tier
        const calculateTier = (spent) => {
          if (spent >= 15000000) return 'VIP'; // Trên 15 triệu
          if (spent >= 6000000) return 'GOLD'; // Trên 6 triệu
          if (spent >= 2500000) return 'SILVER'; // Trên 2.5 triệu
          if (spent >= 800000) return 'MEMBER'; // Trên 800k
          return 'NEW';
        };

        const earnedPoints = total_amount / 10000; // Tiêu 10.000đ = 1 điểm

        // Fraud Detection: Khách hàng mua bao nhiêu đơn hôm nay?
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const ordersToday = await tx.order.count({
          where: {
            userId,
            createdAt: { gte: startOfDay }
          }
        });
        
        // Nếu đã có 2 đơn trở lên trong ngày thì đơn này bị coi là đáng ngờ
        const isSuspicious = ordersToday >= 2;

        // Upsert RestaurantCustomer
        const restCustomer = await tx.restaurantCustomer.upsert({
          where: {
            restaurantId_userId: {
              restaurantId,
              userId
            }
          },
          update: {
            totalSpent: { increment: total_amount },
            loyaltyPoints: { increment: earnedPoints },
            orderCount: { increment: 1 },
            lastVisit: new Date()
          },
          create: {
            restaurantId,
            userId,
            totalSpent: total_amount,
            loyaltyPoints: earnedPoints,
            orderCount: 1,
            lastVisit: new Date()
          }
        });
        
        // Cập nhật lại Tier
        await tx.restaurantCustomer.update({
          where: { id: restCustomer.id },
          data: { tier: calculateTier(restCustomer.totalSpent) }
        });

        // Upsert BrandCustomer
        if (restaurant && restaurant.brandId) {
          const brandCustomer = await tx.brandCustomer.upsert({
            where: {
              brandId_userId: {
                brandId: restaurant.brandId,
                userId
              }
            },
            update: {
              totalSpent: { increment: total_amount },
              loyaltyPoints: { increment: earnedPoints },
              orderCount: { increment: 1 }
            },
            create: {
              brandId: restaurant.brandId,
              userId,
              totalSpent: total_amount,
              loyaltyPoints: earnedPoints,
              orderCount: 1
            }
          });
          
          await tx.brandCustomer.update({
            where: { id: brandCustomer.id },
            data: { tier: calculateTier(brandCustomer.totalSpent) }
          });
          
          // Tạo LoyaltyTransaction
          await tx.loyaltyTransaction.create({
            data: {
              userId,
              restaurantId,
              brandId: restaurant.brandId,
              orderId,
              cashierId,
              points: earnedPoints,
              type: "EARN",
              isSuspicious,
              description: `Tích lũy ${earnedPoints} điểm từ hóa đơn ${orderId}`
            }
          });
        }
      }

      return order;
    });
  }
}

export const orderUpdateRepo = new OrderUpdateRepo();

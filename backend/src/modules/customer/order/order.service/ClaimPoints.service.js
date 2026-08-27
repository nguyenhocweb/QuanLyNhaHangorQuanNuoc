import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";

export const claimPointsService = async (userId, claimCode) => {
  return prisma.$transaction(async (tx) => {
    // 1. Tìm Order với claimCode
    const order = await tx.order.findUnique({
      where: { claimCode },
      include: { restaurant: true }
    });

    if (!order) {
      throw new NotFoundError("Mã nhận điểm không hợp lệ hoặc không tồn tại.");
    }

    if (order.userId) {
      throw new BadRequestError("Hóa đơn này đã được nhận điểm bởi người khác.");
    }
    
    if (order.status !== "PAID") {
      throw new BadRequestError("Hóa đơn này chưa được thanh toán hoàn tất.");
    }

    // Kiểm tra hạn sử dụng của claimCode (ví dụ: chỉ nhận điểm trong vòng 24h)
    const orderAgeHours = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60);
    if (orderAgeHours > 24) {
      throw new BadRequestError("Mã nhận điểm đã hết hạn (Quá 24 giờ kể từ khi xuất hóa đơn).");
    }

    const earnedPoints = order.total_amount / 10000;
    const restaurantId = order.restaurantId;
    const brandId = order.restaurant?.brandId;

    // 2. Gắn userId vào Order và xóa claimCode
    await tx.order.update({
      where: { id: order.id },
      data: {
        userId,
        claimCode: null // Xóa mã để không ai dùng lại được
      }
    });

    // Hàm tính Tier
    const calculateTier = (spent) => {
      if (spent >= 15000000) return 'VIP';
      if (spent >= 6000000) return 'GOLD';
      if (spent >= 2500000) return 'SILVER';
      if (spent >= 800000) return 'MEMBER';
      return 'NEW';
    };

    // Fraud Detection
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const ordersToday = await tx.order.count({
      where: {
        userId,
        createdAt: { gte: startOfDay }
      }
    });
    const isSuspicious = ordersToday > 2;

    // 3. Cập nhật RestaurantCustomer
    if (restaurantId) {
      const restCustomer = await tx.restaurantCustomer.upsert({
        where: {
          restaurantId_userId: { restaurantId, userId }
        },
        update: {
          totalSpent: { increment: order.total_amount },
          loyaltyPoints: { increment: earnedPoints },
          orderCount: { increment: 1 },
          lastVisit: new Date()
        },
        create: {
          restaurantId,
          userId,
          totalSpent: order.total_amount,
          loyaltyPoints: earnedPoints,
          orderCount: 1,
          lastVisit: new Date()
        }
      });

      await tx.restaurantCustomer.update({
        where: { id: restCustomer.id },
        data: { tier: calculateTier(restCustomer.totalSpent) }
      });
    }

    // 4. Tạo LoyaltyTransaction
    if (brandId) {
      await tx.loyaltyTransaction.create({
        data: {
          userId,
          restaurantId,
          brandId,
          orderId: order.id,
          cashierId: order.takenByEmpId,
          points: earnedPoints,
          type: "EARN",
          isSuspicious,
          description: `Khách tự nhận ${earnedPoints} điểm từ mã trên hóa đơn vô danh`
        }
      });
    }

    return {
      success: true,
      earnedPoints,
      message: `Tích lũy thành công ${earnedPoints} điểm!`
    };
  });
};

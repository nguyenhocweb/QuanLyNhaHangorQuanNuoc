import cron from "node-cron";
import { prisma } from "../databases/init.mongodb.js";

const calculateDowngradedTier = (currentTier) => {
  switch (currentTier) {
    case 'VIP': return 'GOLD';
    case 'GOLD': return 'SILVER';
    case 'SILVER': return 'MEMBER';
    default: return 'NEW';
  }
};

export const startLoyaltyDowngradeJob = () => {
  // Chạy vào lúc 02:00 AM mỗi ngày
  cron.schedule("0 2 * * *", async () => {
    console.log("[CRON] Bắt đầu quét và giáng hạng khách hàng không hoạt động...");
    
    // Ngày tính mốc: 180 ngày trước
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 180);

    try {
      // 1. Quét RestaurantCustomer
      const inactiveRestCustomers = await prisma.restaurantCustomer.findMany({
        where: {
          lastVisit: { lt: thresholdDate },
          tier: { not: 'NEW' }
        },
        include: { restaurant: true }
      });

      for (const customer of inactiveRestCustomers) {
        const newTier = calculateDowngradedTier(customer.tier);
        const pointsToDeduct = Math.floor(customer.loyaltyPoints / 2); // Trừ 50% số điểm

        await prisma.$transaction([
          prisma.restaurantCustomer.update({
            where: { id: customer.id },
            data: {
              tier: newTier,
              loyaltyPoints: { decrement: pointsToDeduct },
              lastVisit: new Date() // Reset lastVisit để tránh giáng hạng liên tục mỗi ngày
            }
          }),
          prisma.loyaltyTransaction.create({
            data: {
              userId: customer.userId,
              restaurantId: customer.restaurantId,
              brandId: customer.restaurant?.brandId,
              points: -pointsToDeduct,
              type: "EXPIRED",
              description: `Hạ hạng từ ${customer.tier} xuống ${newTier} và trừ ${pointsToDeduct} điểm do quá 180 ngày không giao dịch.`
            }
          })
        ]);
        
        console.log(`[CRON] Đã hạ hạng khách hàng ${customer.userId} tại nhà hàng ${customer.restaurantId}`);
      }

      console.log(`[CRON] Hoàn tất quét. Đã hạ hạng ${inactiveRestCustomers.length} khách hàng.`);
    } catch (error) {
      console.error("[CRON] Lỗi khi chạy job giáng hạng:", error);
    }
  });
};

import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getLoyaltyService = {
  getMyLoyaltyInfo: async (userId) => {
    // Tìm tất cả các thẻ thành viên cấp Thương hiệu
    const brandLoyalties = await prisma.brandCustomer.findMany({
      where: { userId },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    });

    // Tìm tất cả các thẻ thành viên cấp Nhà hàng độc lập
    const restaurantLoyalties = await prisma.restaurantCustomer.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            imageMain: true
          }
        }
      }
    });

    return {
      brands: brandLoyalties,
      restaurants: restaurantLoyalties
    };
  },

  getMyLoyaltyHistory: async (userId, brandId, restaurantId) => {
    const where = { userId };
    
    if (brandId) where.brandId = brandId;
    if (restaurantId) where.restaurantId = restaurantId;

    const history = await prisma.loyaltyTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50 // Giới hạn lấy 50 giao dịch gần nhất
    });

    return history;
  }
};

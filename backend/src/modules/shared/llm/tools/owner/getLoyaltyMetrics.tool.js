import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getLoyaltyMetricsSchema = {
  name: "getLoyaltyMetrics",
  description: "Xem tập khách hàng thân thiết và điểm thưởng (Loyalty) của Thương hiệu. Dành cho Owner.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      minPoints: {
        type: SchemaType.INTEGER,
        description: "Lọc khách hàng có số điểm lớn hơn mức này. Để trống để lấy top 10 khách hàng điểm cao nhất."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng khách hàng tối đa (mặc định 10)."
      }
    }
  }
};

export const executeGetLoyaltyMetrics = async (args, context) => {
  try {
    const { minPoints = 0, limit = 10 } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    const customers = await prisma.restaurantCustomer.findMany({
      where: {
        restaurant: { brandId: brandId },
        loyaltyPoints: { gte: minPoints }
      },
      include: {
        user: { select: { user_name: true, phone: true } }
      },
      orderBy: { loyaltyPoints: 'desc' },
      take: Math.min(limit, 20)
    });

    const dto = customers.map(c => ({
      name: c.user?.user_name || c.user?.name || "Khách",
      phone: c.user?.phone || c.user?.sdt || "N/A",
      loyaltyPoints: c.loyaltyPoints,
      tier: c.tier
    }));

    return { 
      data: dto, 
      count: dto.length,
      message: "Danh sách khách hàng thân thiết."
    };
  } catch (error) {
    console.error("[getLoyaltyMetrics] Error:", error.message);
    return { error: "Lỗi tải số liệu khách hàng: " + error.message };
  }
};

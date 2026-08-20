import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getPlatformMetricsSchema = {
  name: "getPlatformMetrics",
  description: "Lấy số liệu tổng quan của nền tảng (Platform) bao gồm tổng số Brand, Restaurant, User. Dành riêng cho Admin.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {}
  }
};

export const executeGetPlatformMetrics = async (args, context) => {
  try {
    const { role } = context;

    if (role !== "Admin") {
      return { error: "Bạn không có quyền truy cập số liệu nền tảng." };
    }

    // Chạy song song các query để tăng tốc
    const [totalUsers, totalBrands, totalRestaurants] = await Promise.all([
      prisma.user.count(),
      prisma.brand.count(),
      prisma.restaurant.count()
    ]);

    return { 
      totalUsers,
      totalBrands,
      totalRestaurants,
      message: `Hệ thống đang có ${totalUsers} người dùng, ${totalBrands} thương hiệu và ${totalRestaurants} nhà hàng.` 
    };
  } catch (error) {
    console.error("[getPlatformMetrics] Error:", error.message);
    return { error: "Lỗi tải số liệu nền tảng: " + error.message };
  }
};

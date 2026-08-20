import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getRestaurantComparisonSchema = {
  name: "getRestaurantComparison",
  description: "So sánh doanh thu giữa các chi nhánh (nhà hàng) trong cùng một thương hiệu. Dành cho Owner.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      month: {
        type: SchemaType.INTEGER,
        description: "Tháng cần so sánh (1-12). Để trống để lấy tháng hiện tại."
      },
      year: {
        type: SchemaType.INTEGER,
        description: "Năm cần so sánh. Để trống lấy năm hiện tại."
      }
    }
  }
};

export const executeGetRestaurantComparison = async (args, context) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    const startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = new Date(`${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`);

    // Lấy doanh thu của tất cả các nhà hàng thuộc brandId trong tháng
    const revenues = await prisma.restaurantRevenue.findMany({
      where: {
        brandId,
        date: { gte: startDate, lt: endDate }
      },
      include: {
        restaurant: { select: { name: true } }
      }
    });

    // Group theo nhà hàng
    const grouped = revenues.reduce((acc, rev) => {
      const rId = rev.restaurantId;
      if (!acc[rId]) {
        acc[rId] = {
          restaurantName: rev.restaurant?.name || "Unknown",
          totalRevenue: 0,
          totalOrders: 0
        };
      }
      acc[rId].totalRevenue += rev.totalRevenue;
      acc[rId].totalOrders += rev.totalOrders;
      return acc;
    }, {});

    const dto = Object.values(grouped).sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort desc

    return { 
      data: dto, 
      period: `${month}/${year}`,
      message: dto.length > 0 ? `So sánh doanh thu ${month}/${year}` : "Chưa có dữ liệu doanh thu tháng này."
    };
  } catch (error) {
    console.error("[getRestaurantComparison] Error:", error.message);
    return { error: "Lỗi tải so sánh chi nhánh: " + error.message };
  }
};

import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getBrandRevenueSummarySchema = {
  name: "getBrandRevenueSummary",
  description: "Lấy tổng quan doanh thu của toàn bộ Thương hiệu (tổng của tất cả các nhà hàng). Chỉ Chủ thương hiệu mới được dùng.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      year: {
        type: SchemaType.INTEGER,
        description: "Năm cần xem doanh thu. (Mặc định năm hiện tại)"
      }
    }
  }
};

export const executeGetBrandRevenueSummary = async (args, context) => {
  try {
    const { year = new Date().getFullYear() } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    // Lọc theo năm
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const revenues = await prisma.brandRevenue.findMany({
      where: {
        brandId,
        date: { gte: startDate, lte: endDate }
      }
    });

    // Tính tổng
    const total = revenues.reduce((sum, rev) => sum + rev.totalRevenue, 0);

    return { 
      brandId, 
      year, 
      totalRevenue: total, 
      currency: "VND",
      message: `Doanh thu năm ${year} là ${total.toLocaleString()} VND.` 
    };
  } catch (error) {
    console.error("[getBrandRevenueSummary] Error:", error.message);
    return { error: "Lỗi tải doanh thu thương hiệu: " + error.message };
  }
};

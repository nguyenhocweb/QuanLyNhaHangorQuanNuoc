import { approveStockCountRepo } from "../../../../brand_owner/stock_count/repositories/stock_count.approve.repo.js";
import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, ForbiddenError } from "../../../../../core/constants/error/index.js";

export const managerApproveStockCountService = {
  approve: async (stockCountId, userId, reason) => {
    // 1. Tính tổng giá trị chênh lệch (Variance Value)
    const stockCount = await prisma.stockCount.findUnique({
      where: { id: stockCountId },
      include: { 
        items: { include: { inventoryItem: true } }
      }
    });

    if (!stockCount) throw new BadRequestError("Phiếu không tồn tại");
    if (stockCount.status !== "PENDING_APPROVAL") throw new BadRequestError("Phiếu chưa được submit");

    // Lấy Hạn mức duyệt từ Brand
    const brand = await prisma.brand.findUnique({ where: { id: stockCount.brandId } });
    const threshold = brand?.inventoryApprovalThreshold || 0;

    // Tính tổng giá trị (Cost)
    let totalVarianceValue = 0;
    for (const item of stockCount.items) {
       // Độ lệch (discrepancy) * giá Min Price của item (giá vốn tạm thời)
       const value = Math.abs(item.discrepancy * (item.inventoryItem.minPrice || 0));
       totalVarianceValue += value;
    }

    if (totalVarianceValue > threshold) {
      throw new ForbiddenError(`Tổng giá trị chênh lệch (${totalVarianceValue}) vượt quá Hạn mức duyệt của nhà hàng (${threshold}). Vui lòng chờ Brand Owner duyệt.`);
    }

    // 2. Chạy Transaction Repo chung
    return await approveStockCountRepo(stockCountId, userId, reason);
  }
};

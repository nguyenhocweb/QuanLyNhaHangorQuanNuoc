import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../../core/constants/error/index.js";

export const managerRejectStockCountService = {
  reject: async (stockCountId, userId, reason) => {
    const stockCount = await prisma.stockCount.findUnique({
      where: { id: stockCountId }
    });

    if (!stockCount) throw new BadRequestError("Phiếu không tồn tại");
    if (stockCount.status !== "PENDING_APPROVAL") throw new BadRequestError("Phiếu chưa được submit hoặc đã được xử lý");

    const updatedStockCount = await prisma.stockCount.update({
      where: { id: stockCountId },
      data: {
        status: "REJECTED",
        approvedBy: userId,
        approvedAt: new Date(),
        reason: reason
      }
    });

    return updatedStockCount;
  }
};

import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";

export const updateStockCountService = {
  updateDraft: async (userId, stockCountId, data) => {
    // 1. Kiểm tra phiếu tồn tại
    const stockCount = await prisma.stockCount.findUnique({
      where: { id: stockCountId },
      include: { items: true }
    });

    if (!stockCount) throw new NotFoundError("Phiếu kiểm kê không tồn tại");

    // 2. Chỉ được sửa phiếu DRAFT và của chính mình
    if (stockCount.status !== "DRAFT") {
      throw new BadRequestError("Chỉ có thể chỉnh sửa phiếu đang ở trạng thái nháp");
    }
    if (stockCount.createdBy !== userId) {
      throw new BadRequestError("Bạn không có quyền chỉnh sửa phiếu này");
    }

    // 3. Xoá các items cũ và tạo mới lại (để đồng bộ discrepancy)
    // Cách tốt nhất là dùng transaction
    return await prisma.$transaction(async (tx) => {
      // Xoá items cũ
      await tx.stockCountItem.deleteMany({
        where: { stockCountId: stockCountId }
      });

      // Insert lại items mới
      const newItems = data.items.map((item) => {
        const discrepancy = item.actualQty - item.systemQty;
        return {
          inventoryItemId: item.inventoryItemId,
          systemQty: item.systemQty,
          actualQty: item.actualQty,
          discrepancy: discrepancy,
          stockCountId: stockCountId
        };
      });

      await tx.stockCountItem.createMany({
        data: newItems
      });

      // Cập nhật lại notes nếu có
      const updatedStockCount = await tx.stockCount.update({
        where: { id: stockCountId },
        data: {
          notes: data.notes
        },
        include: { items: true }
      });

      return updatedStockCount;
    });
  }
};

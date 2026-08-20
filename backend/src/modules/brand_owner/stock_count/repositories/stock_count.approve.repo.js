import { prisma } from "../../../../databases/init.mongodb.js";

export const approveStockCountRepo = async (stockCountId, userId, reason) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Lấy phiếu kiểm kê và các items
    const stockCount = await tx.stockCount.findUnique({
      where: { id: stockCountId },
      include: { items: true },
    });

    if (!stockCount) {
      throw new Error("Không tìm thấy phiếu kiểm kê");
    }

    if (stockCount.status === "APPROVED") {
      throw new Error("Phiếu này đã được duyệt");
    }

    // 2. Cập nhật trạng thái phiếu
    const updatedStockCount = await tx.stockCount.update({
      where: { id: stockCountId },
      data: {
        status: "APPROVED",
        approvedBy: userId,
        approvedAt: new Date(),
        reason: reason,
      },
    });

    // 3. Xử lý từng item (Event Sourcing: Tạo giao dịch và update tồn kho)
    for (const item of stockCount.items) {
      if (item.discrepancy !== 0) {
        // Cập nhật số lượng trong InventoryStock
        const updatedStock = await tx.inventoryStock.update({
          where: {
            restaurantId_inventoryItemId: {
              restaurantId: stockCount.restaurantId,
              inventoryItemId: item.inventoryItemId,
            },
          },
          data: {
            quantity: item.actualQty,
          },
        });

        // Tạo giao dịch lưu vết (Audit Trail)
        await tx.stockTransaction.create({
          data: {
            restaurantId: stockCount.restaurantId,
            inventoryItemId: item.inventoryItemId,
            userId: userId,
            type: "ADJ_AUDIT",
            quantityChange: item.discrepancy,
            balanceAfter: item.actualQty,
            referenceId: stockCountId,
            notes: reason || "Duyệt phiếu kiểm kê",
          },
        });
      }
    }

    return updatedStockCount;
  });
};

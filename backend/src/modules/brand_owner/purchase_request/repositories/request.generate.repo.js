import { prisma } from "../../../../databases/init.mongodb.js";

export const generatePurchaseOrdersRepo = async (brandId, userId, centralWarehouseId, groups) => {
  // Thực hiện Transaction để đảm bảo tính toàn vẹn dữ liệu
  const result = await prisma.$transaction(async (tx) => {
    const createdPOs = [];
    const processedRequestIds = new Set();
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    let currentCount = await tx.purchaseOrder.count();

    for (const group of groups) {
      if (!group.supplierId) continue; // Bỏ qua nếu không có supplierId

      currentCount++;
      const poNumber = `PO-${dateStr}-${currentCount.toString().padStart(4, '0')}`;

      // Tạo Purchase Order
      const po = await tx.purchaseOrder.create({
        data: {
          restaurantId: centralWarehouseId, // Nhập về Kho Tổng
          supplierId: group.supplierId,
          createdBy: userId,
          poNumber,
          status: "PENDING",
          totalAmount: group.items.reduce((sum, item) => sum + (item.approvedQty * item.unitPrice), 0),
          items: {
            create: group.items.map(item => ({
              inventoryItemId: item.inventoryItemId,
              orderQty: item.approvedQty,
              unitPrice: item.unitPrice,
            }))
          }
        }
      });
      createdPOs.push(po);

      // Thu thập các request ID đã xử lý
      group.items.forEach(item => {
        item.sourceRequestIds.forEach(id => processedRequestIds.add(id));
      });
    }

    // Cập nhật trạng thái các Purchase Request thành PO_CREATED
    if (processedRequestIds.size > 0) {
      await tx.purchaseRequest.updateMany({
        where: { id: { in: Array.from(processedRequestIds) }, brandId },
        data: { status: "PO_CREATED" }
      });
    }

    return createdPOs;
  });

  return result;
};

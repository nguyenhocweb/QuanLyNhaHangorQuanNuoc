import { prisma } from "../../../../databases/init.mongodb.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

export const updateStockCountRepo = async (id, data, userId) => {
  return await prisma.$transaction(async (tx) => {
    const checkCount = await tx.stockCount.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!checkCount) throw new NotFoundError("Không tìm thấy phiếu kiểm kho");
    if (checkCount.status === 'COMPLETED' && data.status === 'COMPLETED') {
      throw new ConflictError("Phiếu kiểm kho đã được hoàn tất trước đó");
    }

    if (data.status === 'COMPLETED') {
      // Hoàn tất kiểm kho
      const incomingItems = data.items || [];
      const incomingMap = new Map(incomingItems.map(i => [i.id, i]));
      
      for (const item of checkCount.items) {
        const incoming = incomingMap.get(item.id) || {};
        const actualQty = incoming.actualQty !== undefined ? incoming.actualQty : item.actualQty;
        const discrepancy = actualQty - item.systemQty;
        
        if (discrepancy !== 0) {
          // Điều chỉnh tồn kho
          const stock = await tx.inventoryStock.upsert({
            where: {
              restaurantId_inventoryItemId: {
                restaurantId: checkCount.restaurantId,
                inventoryItemId: item.inventoryItemId
              }
            },
            update: { quantity: actualQty },
            create: {
              restaurantId: checkCount.restaurantId,
              inventoryItemId: item.inventoryItemId,
              quantity: actualQty
            }
          });
          
          // Ghi lại lịch sử giao dịch
          await tx.stockTransaction.create({
            data: {
              restaurantId: checkCount.restaurantId,
              inventoryItemId: item.inventoryItemId,
              userId: userId,
              type: "ADJ_AUDIT",
              quantityChange: discrepancy,
              balanceAfter: stock.quantity,
              unitCost: 0,
              referenceId: checkCount.id,
              notes: "Điều chỉnh kiểm kho hàng ngày"
            }
          });
        }
        
        // Update item discrepancy
        await tx.stockCountItem.update({
          where: { id: item.id },
          data: { actualQty, discrepancy }
        });
      }
      
      return await tx.stockCount.update({
        where: { id },
        data: { status: 'COMPLETED' },
        include: { items: true }
      });
      
    } else {
      // Chỉ lưu cập nhật số lượng
      const updatePromises = [];
      if (data.status) {
        updatePromises.push(tx.stockCount.update({ where: { id }, data: { status: data.status } }));
      }
      
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          if (item.id && item.actualQty !== undefined) {
            // Re-calculate discrepancy based on current systemQty
            const currentItem = checkCount.items.find(i => i.id === item.id);
            if (currentItem) {
              const discrepancy = item.actualQty - currentItem.systemQty;
              updatePromises.push(tx.stockCountItem.update({
                where: { id: item.id },
                data: { actualQty: item.actualQty, discrepancy }
              }));
            }
          }
        }
      }
      await Promise.all(updatePromises);
      return await tx.stockCount.findUnique({ where: { id }, include: { items: true } });
    }
  });
};

import { prisma } from "../../../../databases/init.mongodb.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

export const updatePurchaseOrderRepo = async (id, data, userId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch PO to ensure it exists
    const po = await tx.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!po) throw new NotFoundError("Không tìm thấy đơn nhập hàng");

    // Lỗi Double-click / Concurrency: Tránh việc nhập kho 2 lần
    if (po.status === 'COMPLETED' && data.status === 'COMPLETED') {
      throw new ConflictError("Đơn hàng này đã được nhập kho hoàn tất trước đó.");
    }

    let updatedPO;
    
    // 2. Logic khi chuyển sang COMPLETED (Nhập kho)
    if (data.status === 'COMPLETED') {
      const incomingItems = data.items || [];
      const incomingMap = new Map(incomingItems.map(i => [i.id, i]));
      
      for (const item of po.items) {
        const incoming = incomingMap.get(item.id) || {};
        // Mặc định lấy orderQty nếu không truyền receivedQty
        const receivedQty = incoming.receivedQty !== undefined ? incoming.receivedQty : item.orderQty;
        
        // Upsert inventory stock bằng Atomic Increment
        const stock = await tx.inventoryStock.upsert({
          where: {
            restaurantId_inventoryItemId: {
              restaurantId: po.restaurantId,
              inventoryItemId: item.inventoryItemId
            }
          },
          update: {
            quantity: { increment: receivedQty }
          },
          create: {
            restaurantId: po.restaurantId,
            inventoryItemId: item.inventoryItemId,
            quantity: receivedQty
          }
        });
        
        // Tạo lịch sử giao dịch (Stock Transaction)
        await tx.stockTransaction.create({
          data: {
            restaurantId: po.restaurantId,
            inventoryItemId: item.inventoryItemId,
            userId: userId, // Bắt buộc phải có để biết ai nhập kho
            type: "IN_PO",
            quantityChange: receivedQty,
            balanceAfter: stock.quantity,
            unitCost: incoming.unitPrice !== undefined ? incoming.unitPrice : item.unitPrice,
            referenceId: po.id,
            notes: "Nhập hàng từ Đơn nhập kho (PO)"
          }
        });
        
        // Cập nhật số lượng thực nhận và tiền thực tế vào PO Item
        const updateItemData = { receivedQty };
        if (incoming.unitPrice !== undefined) updateItemData.unitPrice = incoming.unitPrice;
        updateItemData.actualAmount = incoming.actualAmount !== undefined ? incoming.actualAmount : (receivedQty * (incoming.unitPrice !== undefined ? incoming.unitPrice : item.unitPrice));
        
        await tx.purchaseOrderItem.update({
          where: { id: item.id },
          data: updateItemData
        });
      }
      
      // Tính lại tổng tiền thực tế để update vào PO nếu cần
      const allUpdatedItems = await tx.purchaseOrderItem.findMany({ where: { purchaseOrderId: id } });
      const newTotalAmount = allUpdatedItems.reduce((acc, curr) => acc + curr.actualAmount, 0);

      // Cuối cùng, cập nhật trạng thái PO và ảnh hóa đơn
      const poUpdateData = { status: 'COMPLETED', totalAmount: newTotalAmount };
      if (data.invoiceImageUrl !== undefined) poUpdateData.invoiceImageUrl = data.invoiceImageUrl;

      updatedPO = await tx.purchaseOrder.update({
        where: { id },
        data: poUpdateData,
        include: { items: true }
      });
    } else {
      // Xử lý khi chỉ update bình thường (VD: DRAFT -> CANCELLED)
      const updatePromises = [];
      
      const poUpdateData = {};
      if (data.status) poUpdateData.status = data.status;
      if (data.invoiceImageUrl !== undefined) poUpdateData.invoiceImageUrl = data.invoiceImageUrl;
      
      if (Object.keys(poUpdateData).length > 0) {
        updatePromises.push(
          tx.purchaseOrder.update({
            where: { id },
            data: poUpdateData
          })
        );
      }

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          if (item.id) {
            const itemData = {};
            if (item.receivedQty !== undefined) itemData.receivedQty = item.receivedQty;
            if (item.orderQty !== undefined) itemData.orderQty = item.orderQty;
            if (item.unitPrice !== undefined) itemData.unitPrice = item.unitPrice;
            if (item.actualAmount !== undefined) itemData.actualAmount = item.actualAmount;
            
            if (Object.keys(itemData).length > 0) {
              updatePromises.push(
                tx.purchaseOrderItem.update({
                  where: { id: item.id },
                  data: itemData
                })
              );
            }
          }
        }
      }

      await Promise.all(updatePromises);
      
      updatedPO = await tx.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });
    }

    return updatedPO;
  });
};

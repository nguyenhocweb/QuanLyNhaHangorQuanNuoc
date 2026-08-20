import { getStockTransferByIdRepo } from "../repositories/stock_transfer.get.repo.js";
import { updateStockTransferRepo } from "../repositories/stock_transfer.update.repo.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const updateStockTransferService = async (id, data, userId) => {
  const existingTransfer = await getStockTransferByIdRepo(id);
  if (!existingTransfer) {
    throw new NotFoundError("Không tìm thấy phiếu chuyển kho");
  }

  if (existingTransfer.status === "COMPLETED" || existingTransfer.status === "CANCELLED") {
    throw new BadRequestError(`Không thể cập nhật phiếu ở trạng thái ${existingTransfer.status}`);
  }

  const operations = [];

  // 1. Move to IN_TRANSIT -> Subtract stock from source
  if (existingTransfer.status === "DRAFT" && data.status === "IN_TRANSIT") {
    for (const item of existingTransfer.items) {
      // Find current stock
      const currentStock = await prisma.inventoryStock.findFirst({
        where: {
          restaurantId: existingTransfer.fromRestaurantId,
          inventoryItemId: item.inventoryItemId
        }
      });
      const stockBalance = currentStock ? currentStock.quantity : 0;
      if (stockBalance < item.transferQty) {
        throw new BadRequestError(`Hàng hóa ID ${item.inventoryItemId} không đủ tồn kho để xuất. Tồn hiện tại: ${stockBalance}`);
      }

      // Subtract
      const newBalance = stockBalance - item.transferQty;
      operations.push(
        prisma.inventoryStock.updateMany({
          where: {
            restaurantId: existingTransfer.fromRestaurantId,
            inventoryItemId: item.inventoryItemId
          },
          data: { quantity: newBalance }
        })
      );

      // Log transaction OUT_TRANSFER
      operations.push(
        prisma.stockTransaction.create({
          data: {
            restaurantId: existingTransfer.fromRestaurantId,
            inventoryItemId: item.inventoryItemId,
            userId: userId,
            type: "OUT_TRANSFER",
            quantityChange: -item.transferQty,
            balanceAfter: newBalance,
            referenceId: existingTransfer.id,
            notes: `Xuất chuyển kho ${existingTransfer.transferNumber}`
          }
        })
      );
    }
  }

  // 2. Move to COMPLETED -> Add stock to destination based on receivedQty
  let updateData = { status: data.status };
  
  if (data.status === "COMPLETED") {
    // If we transition directly from DRAFT to COMPLETED (if allowed), we need to handle OUT as well,
    // but typically we should enforce DRAFT -> IN_TRANSIT -> COMPLETED.
    if (existingTransfer.status === "DRAFT") {
      throw new BadRequestError("Phiếu phải chuyển sang trạng thái Đang giao trước khi Hoàn tất");
    }

    if (!data.receivedItems || data.receivedItems.length === 0) {
      throw new BadRequestError("Vui lòng cung cấp số lượng thực nhận");
    }

    // Update receivedQty in StockTransferItem
    for (const rItem of data.receivedItems) {
      operations.push(
        prisma.stockTransferItem.update({
          where: { id: rItem.id },
          data: { receivedQty: rItem.receivedQty }
        })
      );

      // Add to destination stock
      // We must use upsert or check existing stock
      // Since prisma transactions don't support conditional reads well without interactive tx, 
      // we prepare it here by reading existing stock first.
      const destStock = await prisma.inventoryStock.findFirst({
        where: {
          restaurantId: existingTransfer.toRestaurantId,
          inventoryItemId: rItem.inventoryItemId
        }
      });
      
      const currentDestBalance = destStock ? destStock.quantity : 0;
      const newDestBalance = currentDestBalance + rItem.receivedQty;

      if (destStock) {
        operations.push(
          prisma.inventoryStock.update({
            where: { id: destStock.id },
            data: { quantity: newDestBalance }
          })
        );
      } else {
        operations.push(
          prisma.inventoryStock.create({
            data: {
              restaurantId: existingTransfer.toRestaurantId,
              inventoryItemId: rItem.inventoryItemId,
              quantity: newDestBalance,
              minStockLevel: 0,
              location: "Chưa xác định"
            }
          })
        );
      }

      // Log transaction IN_TRANSFER
      operations.push(
        prisma.stockTransaction.create({
          data: {
            restaurantId: existingTransfer.toRestaurantId,
            inventoryItemId: rItem.inventoryItemId,
            userId: userId,
            type: "IN_TRANSFER",
            quantityChange: rItem.receivedQty,
            balanceAfter: newDestBalance,
            referenceId: existingTransfer.id,
            notes: `Nhập chuyển kho ${existingTransfer.transferNumber}`
          }
        })
      );
    }
  }

  return await updateStockTransferRepo(id, updateData, operations);
};

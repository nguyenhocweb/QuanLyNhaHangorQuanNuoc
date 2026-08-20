import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../../core/constants/error/index.js";

export const staffStockCountService = {
  createDraft: async (userId, data) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // Tìm brandId từ user (hoặc restaurant)
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: data.restaurantId }
    });
    if (!restaurant) throw new BadRequestError("Nhà hàng không tồn tại");

    return await prisma.$transaction(async (tx) => {
      // 1. Lấy tồn kho hiện tại để tính độ lệch ngầm
      const stocks = await tx.inventoryStock.findMany({
        where: { restaurantId: data.restaurantId }
      });
      const stockMap = new Map(stocks.map(s => [s.inventoryItemId, s.quantity]));

      // 2. Tạo items
      const itemsToCreate = data.items.map(item => {
        const sysQty = stockMap.get(item.inventoryItemId) || 0;
        return {
          inventoryItemId: item.inventoryItemId,
          systemQty: sysQty,
          actualQty: item.actualQty,
          discrepancy: item.actualQty - sysQty
        };
      });

      return await tx.stockCount.create({
        data: {
          code: `CHK-STAFF-${dateStr}-${randomNum}`,
          status: "DRAFT",
          restaurantId: data.restaurantId,
          brandId: restaurant.brandId,
          createdBy: userId,
          notes: data.notes,
          items: {
            create: itemsToCreate
          }
        }
      });
    });
  },

  submitPending: async (userId, countId) => {
    const stockCount = await prisma.stockCount.findUnique({ where: { id: countId } });
    if (!stockCount) throw new BadRequestError("Phiếu không tồn tại");
    if (stockCount.createdBy !== userId) throw new BadRequestError("Không có quyền nộp phiếu này");
    if (stockCount.status !== "DRAFT") throw new BadRequestError("Chỉ có thể nộp phiếu DRAFT");

    return await prisma.stockCount.update({
      where: { id: countId },
      data: { status: "PENDING_APPROVAL" }
    });
  },

  getMyCounts: async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [counts, totalCount] = await prisma.$transaction([
      prisma.stockCount.findMany({
        where: { createdBy: userId },
        skip,
        take: limit,
        include: {
          items: {
            include: { inventoryItem: { select: { name: true, baseUnit: true } } }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.stockCount.count({ where: { createdBy: userId } })
    ]);

    // Lọc bỏ cột systemQty và discrepancy trước khi trả về cho Staff (BLIND COUNT)
    const formattedCounts = counts.map(count => ({
      ...count,
      items: count.items.map(item => ({
        id: item.id,
        inventoryItemId: item.inventoryItemId,
        inventoryItem: item.inventoryItem,
        actualQty: item.actualQty
      }))
    }));

    return {
      counts: formattedCounts,
      options: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  },

  getItemsForCount: async (restaurantId) => {
    // Chỉ lấy thông tin mặt hàng, TUYỆT ĐỐI KHÔNG TRẢ VỀ systemQty để đảm bảo Blind Count
    const stocks = await prisma.inventoryStock.findMany({
      where: { restaurantId },
      include: {
        inventoryItem: { select: { name: true, baseUnit: true } }
      }
    });

    return stocks.map(stock => ({
      inventoryItemId: stock.inventoryItemId,
      inventoryItem: stock.inventoryItem
    }));
  }
};

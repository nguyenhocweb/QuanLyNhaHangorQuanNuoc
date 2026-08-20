import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../../core/constants/error/index.js";

export const managerGetStockCountsService = {
  getManagerStockCounts: async (restaurantId, userId, status, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    // Nếu truyền lên status = DRAFT, chỉ lấy các phiếu DRAFT do chính Manager này tạo
    // Nếu truyền lên status = PENDING_APPROVAL, lấy toàn bộ phiếu của nhà hàng đang chờ duyệt
    const whereClause = {
      restaurantId: restaurantId,
      ...(status && { status })
    };

    if (status === "DRAFT") {
      whereClause.createdBy = userId;
    }

    const [counts, totalCount] = await prisma.$transaction([
      prisma.stockCount.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          items: {
            include: { inventoryItem: { select: { id: true, name: true, baseUnit: true, minPrice: true } } }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.stockCount.count({ where: whereClause })
    ]);

    const userIds = [...new Set(counts.map(c => c.createdBy))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, systemRole: true, employments: { include: { workspaceRole: true } } }
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { brand: { select: { inventoryApprovalThreshold: true } } }
    });
    const threshold = restaurant?.brand?.inventoryApprovalThreshold || 0;

    // Get latest purchase price for all items in the counts
    const inventoryItemIds = [...new Set(counts.flatMap(c => c.items.map(i => i.inventoryItem?.id)).filter(Boolean))];
    const latestPoItems = await prisma.purchaseOrderItem.findMany({
      where: { inventoryItemId: { in: inventoryItemIds } },
      orderBy: { id: 'desc' },
      distinct: ['inventoryItemId']
    });
    const poPriceMap = new Map(latestPoItems.map(po => [po.inventoryItemId, po.unitPrice]));

    return {
      threshold,
      counts: counts.map(count => {
        const creator = userMap.get(count.createdBy);
        return {
          ...count,
          creatorName: creator?.name || "N/A",
          creatorRole: creator?.employments?.find(e => e.restaurantId === restaurantId)?.workspaceRole?.name || creator?.systemRole?.name || "Khác",
          items: count.items.map(item => ({
            id: item.id,
            inventoryItemId: item.inventoryItemId,
            inventoryItem: {
              ...item.inventoryItem,
              minPrice: poPriceMap.has(item.inventoryItemId) 
                ? poPriceMap.get(item.inventoryItemId) 
                : item.inventoryItem?.minPrice || 0
            },
            systemQty: item.systemQty,
            actualQty: item.actualQty,
            discrepancy: item.discrepancy
          }))
        };
      }),
      options: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }
};

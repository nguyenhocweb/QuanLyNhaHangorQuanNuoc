import { prisma } from "../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../core/constants/error/index.js";

export const getNotificationService = {
  getNotifications: async ({ userId, workspaceType, restaurantId, brandId, type, page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    switch (workspaceType) {
      case "CUSTOMER":
        const customerWhere = { userId, isDeleted: false, ...(type ? { type } : {}) };
        const customerNotifs = await prisma.customerNotification.findMany({
          where: customerWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
        });
        const totalCustomer = await prisma.customerNotification.count({ where: customerWhere });
        const unreadCustomer = await prisma.customerNotification.count({ where: { ...customerWhere, isRead: false } });
        return { data: customerNotifs, total: totalCustomer, unreadCount: unreadCustomer };

      case "RESTAURANT":
        if (!restaurantId) throw new BadRequestError("Thiếu restaurantId");
        const resWhere = { 
          restaurantId, 
          OR: [
            { targetUserId: null },
            { targetUserId: { isSet: false } },
            { targetUserId: userId }
          ],
          ...(type ? { type } : {}),
          readReceipts: { none: { userId, isDeleted: true } }
        };
        const restaurantNotifs = await prisma.restaurantNotification.findMany({
          where: resWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
          // B2B: Lấy luôn bảng ReadReceipt của userId hiện tại để biết họ đã đọc chưa
          include: {
            readReceipts: {
              where: { userId, isDeleted: false },
              select: { id: true }
            }
          }
        });
        
        // Format lại dữ liệu cho Frontend dễ dùng (thêm cờ isRead)
        const formattedResNotifs = restaurantNotifs.map(n => ({
          ...n,
          isRead: n.readReceipts.length > 0,
          readReceipts: undefined // Xóa mảng này đi cho gọn JSON
        }));
        
        const totalRes = await prisma.restaurantNotification.count({ where: resWhere });
        // Tính số lượng chưa đọc
        const unreadRes = await prisma.restaurantNotification.count({
          where: { 
            ...resWhere,
            readReceipts: { none: { userId } } // Chưa có Receipt của user này
          }
        });
        
        return { data: formattedResNotifs, total: totalRes, unreadCount: unreadRes };

      case "BRAND":
        if (!brandId) throw new BadRequestError("Thiếu brandId");
        const brandWhere = { 
          brandId, 
          OR: [
            { targetUserId: null },
            { targetUserId: { isSet: false } },
            { targetUserId: userId }
          ],
          ...(type ? { type } : {}),
          readReceipts: { none: { userId, isDeleted: true } }
        };
        const brandNotifs = await prisma.brandNotification.findMany({
          where: brandWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
          include: {
            readReceipts: {
              where: { userId, isDeleted: false },
              select: { id: true }
            }
          }
        });

        const formattedBrandNotifs = brandNotifs.map(n => ({
          ...n,
          isRead: n.readReceipts.length > 0,
          readReceipts: undefined
        }));

        const totalBrand = await prisma.brandNotification.count({ where: brandWhere });
        const unreadBrand = await prisma.brandNotification.count({
          where: { 
            ...brandWhere,
            readReceipts: { none: { userId } }
          }
        });

        return { data: formattedBrandNotifs, total: totalBrand, unreadCount: unreadBrand };

      case "SYSTEM_ADMIN":
        const systemWhere = { 
          OR: [
            { targetUserId: null },
            { targetUserId: { isSet: false } },
            { targetUserId: userId }
          ],
          ...(type ? { type } : {}),
          readReceipts: { none: { userId, isDeleted: true } }
        };
        const systemNotifs = await prisma.systemNotification.findMany({
          where: systemWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: Number(limit),
          include: {
            readReceipts: {
              where: { userId, isDeleted: false },
              select: { id: true }
            }
          }
        });

        const formattedSystemNotifs = systemNotifs.map(n => ({
          ...n,
          isRead: n.readReceipts.length > 0,
          readReceipts: undefined
        }));

        const totalSystem = await prisma.systemNotification.count({ where: systemWhere });
        const unreadSystem = await prisma.systemNotification.count({
          where: { 
            ...systemWhere,
            readReceipts: { none: { userId } }
          }
        });

        return { data: formattedSystemNotifs, total: totalSystem, unreadCount: unreadSystem };

      default:
        throw new BadRequestError("workspaceType không hợp lệ");
    }
  },

  getUnreadCount: async ({ userId, workspaceType, restaurantId, brandId }) => {
    switch (workspaceType) {
      case "CUSTOMER":
        return await prisma.customerNotification.count({ 
          where: { userId, isDeleted: false, isRead: false } 
        });

      case "RESTAURANT":
        if (!restaurantId) throw new BadRequestError("Thiếu restaurantId");
        return await prisma.restaurantNotification.count({
          where: { 
            restaurantId,
            OR: [
              { targetUserId: null },
              { targetUserId: { isSet: false } },
              { targetUserId: userId }
            ],
            readReceipts: { none: { userId } }
          }
        });

      case "BRAND":
        if (!brandId) throw new BadRequestError("Thiếu brandId");
        return await prisma.brandNotification.count({
          where: { 
            brandId,
            OR: [
              { targetUserId: null },
              { targetUserId: { isSet: false } },
              { targetUserId: userId }
            ],
            readReceipts: { none: { userId } }
          }
        });

      case "SYSTEM_ADMIN":
        return await prisma.systemNotification.count({
          where: { 
            OR: [
              { targetUserId: null },
              { targetUserId: { isSet: false } },
              { targetUserId: userId }
            ],
            readReceipts: { none: { userId } }
          }
        });

      default:
        throw new BadRequestError("workspaceType không hợp lệ");
    }
  }
};

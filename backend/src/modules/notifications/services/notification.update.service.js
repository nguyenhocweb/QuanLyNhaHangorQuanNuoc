import { prisma } from "../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../core/constants/error/index.js";

export const updateNotificationService = {
  markAsRead: async ({ notificationId, userId, workspaceType }) => {
    switch (workspaceType) {
      case "CUSTOMER":
        return await prisma.customerNotification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });

      case "RESTAURANT":
        // Dùng upsert để tránh lỗi unique constraint nếu click nhanh 2 lần
        return await prisma.restaurantNotificationReadReceipt.upsert({
          where: {
            notificationId_userId: { notificationId, userId }
          },
          update: {}, // Đã có rồi thì thôi
          create: { notificationId, userId }
        });

      case "BRAND":
        return await prisma.brandNotificationReadReceipt.upsert({
          where: {
            notificationId_userId: { notificationId, userId }
          },
          update: {},
          create: { notificationId, userId }
        });

      case "SYSTEM_ADMIN":
        return await prisma.systemNotificationReadReceipt.upsert({
          where: {
            notificationId_userId: { notificationId, userId }
          },
          update: {},
          create: { notificationId, userId }
        });

      default:
        throw new BadRequestError("workspaceType không hợp lệ");
    }
  },

  markAllAsRead: async ({ userId, workspaceType, restaurantId, brandId }) => {
    switch (workspaceType) {
      case "CUSTOMER":
        return await prisma.customerNotification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true }
        });

      case "RESTAURANT":
        if (!restaurantId) throw new BadRequestError("Thiếu restaurantId");
        // Tìm các thông báo thuộc nhà hàng mà user CHƯA đọc
        const unreadResNotifs = await prisma.restaurantNotification.findMany({
          where: {
            restaurantId,
            readReceipts: { none: { userId } }
          },
          select: { id: true }
        });

        if (unreadResNotifs.length > 0) {
          const receipts = unreadResNotifs.map(n => ({
            notificationId: n.id,
            userId
          }));
          await prisma.restaurantNotificationReadReceipt.createMany({
            data: receipts,
            skipDuplicates: true
          });
        }
        return { message: "Đánh dấu tất cả đã đọc thành công" };

      case "BRAND":
        if (!brandId) throw new BadRequestError("Thiếu brandId");
        const unreadBrandNotifs = await prisma.brandNotification.findMany({
          where: {
            brandId,
            readReceipts: { none: { userId } }
          },
          select: { id: true }
        });

        if (unreadBrandNotifs.length > 0) {
          const receipts = unreadBrandNotifs.map(n => ({
            notificationId: n.id,
            userId
          }));
          await prisma.brandNotificationReadReceipt.createMany({
            data: receipts,
            skipDuplicates: true
          });
        }
        return { message: "Đánh dấu tất cả đã đọc thành công" };

      case "SYSTEM_ADMIN":
        const unreadSystemNotifs = await prisma.systemNotification.findMany({
          where: {
            readReceipts: { none: { userId } }
          },
          select: { id: true }
        });

        if (unreadSystemNotifs.length > 0) {
          const receipts = unreadSystemNotifs.map(n => ({
            notificationId: n.id,
            userId
          }));
          await prisma.systemNotificationReadReceipt.createMany({
            data: receipts,
            skipDuplicates: true
          });
        }
        return { message: "Đánh dấu tất cả đã đọc thành công" };

      default:
        throw new BadRequestError("workspaceType không hợp lệ");
    }
  }
};

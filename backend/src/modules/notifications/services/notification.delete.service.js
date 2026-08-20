import { prisma } from "../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../core/constants/error/index.js";

export const deleteNotificationService = {
  deleteNotification: async (notificationId, workspaceType, userId) => {
    switch (workspaceType) {
      case "CUSTOMER":
        // Dành cho Customer, hard delete hoặc soft delete trực tiếp trên bản ghi
        const customerNotif = await prisma.customerNotification.findFirst({
          where: { id: notificationId, userId }
        });
        if (!customerNotif) throw new NotFoundError("Thông báo không tồn tại");

        return await prisma.customerNotification.update({
          where: { id: notificationId },
          data: { isDeleted: true }
        });

      case "RESTAURANT":
      case "BRAND":
      case "SYSTEM_ADMIN":
        // Dành cho các workspace dùng chung thông báo, ta dùng soft delete trên bảng Receipt
        let ReadReceiptModel;
        if (workspaceType === "RESTAURANT") ReadReceiptModel = prisma.restaurantNotificationReadReceipt;
        else if (workspaceType === "BRAND") ReadReceiptModel = prisma.brandNotificationReadReceipt;
        else ReadReceiptModel = prisma.systemNotificationReadReceipt;

        // Upsert vào bảng Receipt: Đã đọc/Xóa
        return await ReadReceiptModel.upsert({
          where: {
            notificationId_userId: { notificationId, userId }
          },
          update: {
            isDeleted: true
          },
          create: {
            notificationId,
            userId,
            isDeleted: true
          }
        });

      default:
        throw new BadRequestError("workspaceType không hợp lệ");
    }
  }
};

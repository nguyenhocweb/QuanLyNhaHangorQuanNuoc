import { updateNotificationService } from "../services/notification.update.service.js";

export const updateNotificationController = {
  markAsRead: async (req, res) => {
    const userId = req.user.id;
    const { id: notificationId } = req.params;
    const workspaceType = req.workspaceContext || "CUSTOMER";

    await updateNotificationService.markAsRead({
      notificationId,
      userId,
      workspaceType
    });

    res.status(200).json({
      message: "Đánh dấu đã đọc thành công",
      metadata: null
    });
  },

  markAllAsRead: async (req, res) => {
    const userId = req.user.id;
    const workspaceType = req.workspaceContext || "CUSTOMER";
    
    const restaurantId = req.restaurantId || req.headers["x-restaurant-id"];
    const brandId = req.brandId || req.headers["x-brand-id"];

    await updateNotificationService.markAllAsRead({
      userId,
      workspaceType,
      restaurantId,
      brandId
    });

    res.status(200).json({
      message: "Đánh dấu tất cả đã đọc thành công",
      metadata: null
    });
  }
};

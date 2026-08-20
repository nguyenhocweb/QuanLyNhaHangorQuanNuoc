import { getNotificationService } from "../services/notification.get.service.js";

export const getNotificationController = {
  getNotifications: async (req, res) => {
    const userId = req.user.id;
    const { page, limit, type } = req.query;
    const workspaceType = req.workspaceContext || "CUSTOMER";
    
    // Headers hoặc req context có thể gửi restaurantId hoặc brandId
    const restaurantId = req.restaurantId || req.headers["x-restaurant-id"];
    const brandId = req.brandId || req.headers["x-brand-id"];

    const metadata = await getNotificationService.getNotifications({
      userId,
      workspaceType,
      restaurantId,
      brandId,
      type,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    });

    res.status(200).json({
      message: "Lấy danh sách thông báo thành công",
      metadata
    });
  },

  getUnreadCount: async (req, res) => {
    const userId = req.user.id;
    const workspaceType = req.workspaceContext || "CUSTOMER";
    const restaurantId = req.restaurantId || req.headers["x-restaurant-id"];
    const brandId = req.brandId || req.headers["x-brand-id"];

    const unreadCount = await getNotificationService.getUnreadCount({
      userId,
      workspaceType,
      restaurantId,
      brandId
    });

    res.status(200).json({
      message: "Lấy số lượng thông báo chưa đọc thành công",
      metadata: { unreadCount }
    });
  }
};

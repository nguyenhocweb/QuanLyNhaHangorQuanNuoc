import { getLoyaltyService } from "../services/loyalty.get.service.js";

export const getLoyaltyController = {
  getMyLoyaltyInfo: async (req, res) => {
    // req.user được set từ authenticateToken
    const userId = req.user.id;
    const metadata = await getLoyaltyService.getMyLoyaltyInfo(userId);
    res.status(200).json({
      message: "Lấy thông tin Thẻ thành viên thành công",
      metadata
    });
  },

  getMyLoyaltyHistory: async (req, res) => {
    const userId = req.user.id;
    // Có thể truyền thêm query (brandId, restaurantId, page, limit) nếu cần
    const { brandId, restaurantId } = req.query;
    const metadata = await getLoyaltyService.getMyLoyaltyHistory(userId, brandId, restaurantId);
    res.status(200).json({
      message: "Lấy lịch sử tích/trừ điểm thành công",
      metadata
    });
  }
};

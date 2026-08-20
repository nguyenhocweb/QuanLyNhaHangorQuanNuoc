import { staffStockCountService } from "../services/stock_counts.service.js";

export const stockCountController = {
  createDraft: async (req, res) => {
    const userId = req.user.id;
    const result = await staffStockCountService.createDraft(userId, req.body);
    res.status(201).json({
      message: "Tạo phiếu kiểm kê nháp thành công",
      metadata: result
    });
  },

  submitPending: async (req, res) => {
    const userId = req.user.id;
    const countId = req.params.id;
    const result = await staffStockCountService.submitPending(userId, countId);
    res.status(200).json({
      message: "Nộp phiếu kiểm kê thành công",
      metadata: result
    });
  },

  getMyCounts: async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await staffStockCountService.getMyCounts(userId, page, limit);
    res.status(200).json({
      message: "Lấy danh sách phiếu kiểm kê thành công",
      metadata: result
    });
  },

  getItemsForCount: async (req, res) => {
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) return res.status(400).json({ message: "Thiếu restaurantId" });
    
    // Security check: Có thể check thêm userId có thuộc restaurant này không nếu cần
    // Nhưng do đã qua authorizeRole nên tạm tin tưởng staff của nhà hàng
    const result = await staffStockCountService.getItemsForCount(restaurantId);
    res.status(200).json({
      message: "Lấy danh sách mặt hàng thành công",
      metadata: result
    });
  }
};

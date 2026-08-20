import { managerGetStockCountsService } from "../services/stock_counts.get.service.js";

export const managerGetStockCountsController = {
  getCounts: async (req, res) => {
    const userId = req.user.id;
    // Assuming restaurantId is attached to req.user or provided in query
    // Actually, manager's restaurantId can be found from employment
    const restaurantId = req.query.restaurantId || req.user.employments?.find(e => e.restaurantId)?.restaurantId;
    if (!restaurantId) {
       return res.status(400).json({ message: "Thiếu restaurantId" });
    }
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await managerGetStockCountsService.getManagerStockCounts(restaurantId, userId, status, page, limit);

    res.status(200).json({
      message: "Lấy danh sách phiếu kiểm kê thành công",
      metadata: result
    });
  }
};

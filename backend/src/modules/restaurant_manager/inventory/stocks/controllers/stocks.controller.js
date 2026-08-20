import { managerStocksService } from "../services/stocks.service.js";

export const managerStocksController = {
  getStocks: async (req, res) => {
    // Assuming restaurantId is from query or from employment
    const restaurantId = req.query.restaurantId || req.user.employments?.find(e => e.restaurantId)?.restaurantId;
    if (!restaurantId) return res.status(400).json({ message: "Thiếu restaurantId" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // search by name
    const filter = {};
    if (req.query.search) {
      filter.inventoryItem = {
        name: { contains: req.query.search, mode: 'insensitive' }
      };
    }

    const result = await managerStocksService.getStocks(restaurantId, filter, page, limit);
    res.status(200).json({
      message: "Lấy danh sách tồn kho thành công",
      metadata: result
    });
  },

  addStockItem: async (req, res) => {
    const restaurantId = req.body.restaurantId;
    const inventoryItemId = req.body.inventoryItemId;

    if (!restaurantId || !inventoryItemId) {
      return res.status(400).json({ message: "Thiếu restaurantId hoặc inventoryItemId" });
    }

    const result = await managerStocksService.addStockItem(restaurantId, inventoryItemId);
    res.status(201).json({
      message: "Thêm mặt hàng vào kho thành công",
      metadata: result
    });
  },

  getMasterItems: async (req, res) => {
    const restaurantId = req.query.restaurantId || req.user.employments?.find(e => e.restaurantId)?.restaurantId;
    if (!restaurantId) return res.status(400).json({ message: "Thiếu restaurantId" });

    const result = await managerStocksService.getMasterItems(restaurantId);
    res.status(200).json({
      message: "Lấy danh mục hàng hóa thành công",
      metadata: result
    });
  }
};

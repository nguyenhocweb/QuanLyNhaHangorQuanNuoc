import { getStockCountsService, getStockCountByIdService } from "../services/stock_count.get.service.js";

export const getStockCountsController = {
  getAll: async (req, res) => {
    const brandId = req.params.id_brand;
    
    // Extract pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Extract filter params
    const { page: _p, limit: _l, ...filters } = req.query; 
    
    const result = await getStockCountsService(brandId, filters, page, limit);
    res.status(200).json({ message: "Lấy danh sách thành công", metadata: result.items, options: result.options });
  },
  getById: async (req, res) => {
    const { id } = req.params;
    const result = await getStockCountByIdService(id);
    res.status(200).json({ message: "Lấy chi tiết thành công", metadata: result });
  }
};

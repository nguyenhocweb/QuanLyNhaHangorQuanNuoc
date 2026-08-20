import { getInventoryStocksService } from "../services/inventory_stock.get.service.js";

export const getInventoryStocksController = async (req, res) => {
  const brandId = req.params.id_brand;
  
  // Extract pagination params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Extract filter params
  const { page: _p, limit: _l, ...filter } = req.query; 
  
  const result = await getInventoryStocksService(brandId, filter, page, limit);
  res.status(200).json({
    message: "Lấy danh sách tồn kho thành công",
    metadata: result.items,
    options: result.options
  });
};

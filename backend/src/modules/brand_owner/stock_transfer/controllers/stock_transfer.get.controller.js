import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getStockTransfersService, getStockTransferByIdService } from "../services/stock_transfer.get.service.js";

export const getStockTransfersController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  
  // Extract pagination params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Extract filter params
  const { page: _p, limit: _l, ...filter } = req.query; 

  const result = await getStockTransfersService(brandId, filter, page, limit);
  res.status(200).json({
    message: "Lấy danh sách phiếu chuyển kho thành công",
    metadata: result.items,
    options: result.options
  });
});

export const getStockTransferByIdController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await getStockTransferByIdService(id);
  res.status(200).json({
    message: "Lấy chi tiết phiếu chuyển kho thành công",
    metadata: result
  });
});

import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createStockTransferService } from "../services/stock_transfer.create.service.js";

export const createStockTransferController = asyncHandler(async (req, res) => {
  const data = req.body;
  data.createdBy = req.user.id;
  
  const result = await createStockTransferService(data);
  res.status(201).json({
    message: "Tạo phiếu chuyển kho thành công",
    metadata: result
  });
});

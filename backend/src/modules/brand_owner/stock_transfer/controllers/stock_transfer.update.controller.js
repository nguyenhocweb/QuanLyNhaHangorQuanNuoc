import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateStockTransferService } from "../services/stock_transfer.update.service.js";

export const updateStockTransferController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const userId = req.user.id;
  
  const result = await updateStockTransferService(id, data, userId);
  res.status(200).json({
    message: "Cập nhật phiếu chuyển kho thành công",
    metadata: result
  });
});

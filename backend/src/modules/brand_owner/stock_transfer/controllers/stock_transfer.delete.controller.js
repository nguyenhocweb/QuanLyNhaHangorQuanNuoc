import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteStockTransferService } from "../services/stock_transfer.delete.service.js";

export const deleteStockTransferController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await deleteStockTransferService(id);
  res.status(200).json({
    message: "Xóa phiếu chuyển kho thành công"
  });
});

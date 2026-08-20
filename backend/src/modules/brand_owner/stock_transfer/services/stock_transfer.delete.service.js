import { getStockTransferByIdRepo } from "../repositories/stock_transfer.get.repo.js";
import { deleteStockTransferRepo } from "../repositories/stock_transfer.delete.repo.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteStockTransferService = async (id) => {
  const existingTransfer = await getStockTransferByIdRepo(id);
  if (!existingTransfer) {
    throw new NotFoundError("Không tìm thấy phiếu chuyển kho");
  }

  if (existingTransfer.status !== "DRAFT") {
    throw new BadRequestError("Chỉ có thể xóa phiếu nháp");
  }

  return await deleteStockTransferRepo(id);
};

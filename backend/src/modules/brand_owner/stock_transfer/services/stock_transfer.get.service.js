import { getStockTransfersRepo, getStockTransferByIdRepo } from "../repositories/stock_transfer.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getStockTransfersService = async (brandId, filter, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  
  const { stockTransfers, totalCount } = await getStockTransfersRepo(brandId, filter, skip, take);
  
  return {
    items: stockTransfers,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};

export const getStockTransferByIdService = async (id) => {
  const transfer = await getStockTransferByIdRepo(id);
  if (!transfer) {
    throw new NotFoundError("Không tìm thấy phiếu chuyển kho");
  }
  return transfer;
};

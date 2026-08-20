import { approveStockCountRepo } from "../repositories/stock_count.approve.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const approveStockCountService = async (stockCountId, userId, reason) => {
  if (!stockCountId || !userId) {
    throw new BadRequestError("Thiếu thông tin phê duyệt");
  }

  try {
    const result = await approveStockCountRepo(stockCountId, userId, reason);
    return result;
  } catch (error) {
    if (error.message.includes("Không tìm thấy") || error.message.includes("đã được duyệt")) {
      throw new BadRequestError(error.message);
    }
    throw error;
  }
};

import { rejectStockCountRepo } from "../repositories/stock_count.reject.repo.js";

export const rejectStockCountService = async (stockCountId, userId, reason) => {
  if (!reason || reason.trim() === "") {
    throw new Error("Lý do từ chối là bắt buộc");
  }
  const result = await rejectStockCountRepo(stockCountId, userId, reason);
  return result;
};

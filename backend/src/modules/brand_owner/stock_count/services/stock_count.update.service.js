import { updateStockCountRepo } from "../repositories/stock_count.update.repo.js";

export const updateStockCountService = async (id, data, userId) => {
  return await updateStockCountRepo(id, data, userId);
};

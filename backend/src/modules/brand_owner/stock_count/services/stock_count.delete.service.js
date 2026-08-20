import { deleteStockCountRepo } from "../repositories/stock_count.delete.repo.js";

export const deleteStockCountService = async (id) => {
  return await deleteStockCountRepo(id);
};

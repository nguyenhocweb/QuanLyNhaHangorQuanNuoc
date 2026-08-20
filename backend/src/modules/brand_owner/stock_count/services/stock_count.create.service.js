import { createStockCountRepo } from "../repositories/stock_count.create.repo.js";

export const createStockCountService = async (data) => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  data.code = `CHK-${dateStr}-${randomNum}`;
  
  return await createStockCountRepo(data);
};

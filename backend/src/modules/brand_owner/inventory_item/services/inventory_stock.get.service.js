import { getInventoryStocksRepo } from "../repositories/inventory_stock.get.repo.js";

export const getInventoryStocksService = async (brandId, filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const { stocks, totalCount } = await getInventoryStocksRepo(brandId, filter, skip, take);

  return {
    items: stocks,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};

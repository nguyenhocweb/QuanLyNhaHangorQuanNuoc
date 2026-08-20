import { getStockCountsRepo, getStockCountByIdRepo } from "../repositories/stock_count.get.repo.js";

export const getStockCountsService = async (brandId, filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  
  const { stockCounts, totalCount } = await getStockCountsRepo(brandId, filters, skip, take);
  
  return {
    items: stockCounts,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};

export const getStockCountByIdService = async (id) => {
  return await getStockCountByIdRepo(id);
};

import { getInventoryItemsRepo } from "../repositories/inventory_item.get.repo.js";

export const getInventoryItemsService = async (brandId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  
  const { items, totalCount } = await getInventoryItemsRepo(brandId, skip, take);
  
  return {
    items,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};

import { getPurchaseOrdersRepo } from "../repositories/purchase_order.get.repo.js";

export const getPurchaseOrdersService = async (brandId, filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  
  const { purchaseOrders, totalCount } = await getPurchaseOrdersRepo(brandId, filter, skip, take);
  
  return {
    items: purchaseOrders,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};

import { getPurchaseRequestsRepo } from "../repositories/request.get.repo.js";

export const getPurchaseRequestsService = async (query) => {
  const { restaurantId, page, limit, status } = query;
  return await getPurchaseRequestsRepo({
    restaurantId,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    status
  });
};

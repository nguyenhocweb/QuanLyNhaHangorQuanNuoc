import { getPurchaseRequestsRepo } from "../repositories/request.get.repo.js";

export const getPurchaseRequestsService = async (brandId, filter, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const { data, totalCount } = await getPurchaseRequestsRepo(brandId, filter, skip, limit);
  
  return {
    items: data,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  };
};

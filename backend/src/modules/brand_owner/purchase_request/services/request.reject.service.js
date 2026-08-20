import { rejectPurchaseRequestsRepo } from "../repositories/request.reject.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const rejectPurchaseRequestsService = async (brandId, requestIds) => {
  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
    throw new BadRequestError("Vui lòng chọn ít nhất 1 Yêu cầu để từ chối");
  }

  const result = await rejectPurchaseRequestsRepo(brandId, requestIds);
  return result;
};

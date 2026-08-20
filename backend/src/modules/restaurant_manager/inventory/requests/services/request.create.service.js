import { BadRequestError } from "../../../../../core/constants/error/index.js";
import { createPurchaseRequestRepo } from "../repositories/request.create.repo.js";

export const createPurchaseRequestService = async (body) => {
  const { restaurantId, items, notes, expectedDate } = body;
  
  if (!items || items.length === 0) {
    throw new BadRequestError("Vui lòng chọn ít nhất 1 mặt hàng");
  }
  
  return await createPurchaseRequestRepo({ restaurantId, items, notes, expectedDate });
};

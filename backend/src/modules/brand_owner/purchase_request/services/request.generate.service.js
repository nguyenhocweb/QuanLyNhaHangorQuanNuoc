import { generatePurchaseOrdersRepo } from "../repositories/request.generate.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const generatePurchaseOrdersService = async (brandId, userId, centralWarehouseId, groups) => {
  if (!centralWarehouseId) {
    throw new BadRequestError("Vui lòng chọn Kho Tổng để nhận hàng nhập từ PO");
  }

  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    throw new BadRequestError("Không có dữ liệu hợp lệ để tạo PO");
  }

  const result = await generatePurchaseOrdersRepo(brandId, userId, centralWarehouseId, groups);
  return result;
};

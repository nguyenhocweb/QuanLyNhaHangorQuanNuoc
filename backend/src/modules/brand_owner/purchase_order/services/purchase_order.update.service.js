import { updatePurchaseOrderRepo } from "../repositories/purchase_order.update.repo.js";
import { findPurchaseOrderByIdRepo } from "../repositories/purchase_order.delete.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updatePurchaseOrderService = async (id, data, brandId, userId) => {
  const purchaseOrder = await findPurchaseOrderByIdRepo(id);
  if (!purchaseOrder) {
    throw new NotFoundError("Không tìm thấy đơn nhập hàng");
  }
  
  return await updatePurchaseOrderRepo(id, data, userId);
};

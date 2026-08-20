import { deletePurchaseOrderRepo, findPurchaseOrderByIdRepo } from "../repositories/purchase_order.delete.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";

export const deletePurchaseOrderService = async (id, brandId) => {
  const purchaseOrder = await findPurchaseOrderByIdRepo(id);
  if (!purchaseOrder) {
    throw new NotFoundError("Không tìm thấy đơn nhập hàng");
  }
  
  if (purchaseOrder.status !== "DRAFT") {
    throw new ConflictError("Chỉ có thể xóa đơn nhập hàng ở trạng thái Nháp (DRAFT)");
  }

  return await deletePurchaseOrderRepo(id);
};

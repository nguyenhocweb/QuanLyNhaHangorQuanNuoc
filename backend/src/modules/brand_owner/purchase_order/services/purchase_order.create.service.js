import { createPurchaseOrderRepo } from "../repositories/purchase_order.create.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const createPurchaseOrderService = async (data, userId) => {
  // Generate PO number
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  data.poNumber = `PO-${dateStr}-${randomNum}`;
  
  data.createdBy = userId;
  
  // Calculate total amount
  let totalAmount = 0;
  if (data.items && data.items.length > 0) {
    for (const item of data.items) {
      totalAmount += item.orderQty * item.unitPrice;
    }
  } else {
    throw new BadRequestError("Đơn hàng phải có ít nhất 1 mặt hàng");
  }
  
  data.totalAmount = totalAmount;

  return await createPurchaseOrderRepo(data);
};

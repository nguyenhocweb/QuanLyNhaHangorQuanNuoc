import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const createPurchaseOrderValidator = {
  body: z.object({
    restaurantId: demoValidator.chuoi("ID Nhà hàng"),
    supplierId: demoValidator.chuoi("ID Nhà cung cấp"),
    invoiceImageUrl: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
    items: z.array(z.object({
      inventoryItemId: demoValidator.chuoi("ID Hàng hóa"),
      orderQty: demoValidator.int("Số lượng đặt", 1),
      unitPrice: demoValidator.int("Đơn giá", 0)
    })).min(1, "Phải có ít nhất 1 mặt hàng"),
    notes: demoValidator.chuoi("Ghi chú").optional()
  })
};

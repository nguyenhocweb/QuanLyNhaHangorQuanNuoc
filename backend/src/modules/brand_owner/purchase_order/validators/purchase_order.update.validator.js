import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updatePurchaseOrderValidator = {
  params: z.object({
    id: demoValidator.chuoi("ID Đơn nhập hàng")
  }),
  body: z.object({
    status: demoValidator.chuoi("Trạng thái").optional(),
    invoiceImageUrl: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
    items: z.array(z.object({
      id: demoValidator.chuoi("ID Chi tiết").optional(),
      inventoryItemId: demoValidator.chuoi("ID Hàng hóa"),
      orderQty: demoValidator.int("Số lượng đặt", 1).optional(),
      receivedQty: demoValidator.int("Số lượng nhận", 0).optional(),
      unitPrice: demoValidator.int("Đơn giá", 0).optional(),
      actualAmount: demoValidator.int("Thành tiền thực tế", 0).optional()
    })).optional(),
    notes: demoValidator.chuoi("Ghi chú").optional()
  })
};

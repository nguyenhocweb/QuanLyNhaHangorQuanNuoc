import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateStockCountValidator = z.object({
    params: z.object({
    id: demoValidator.chuoi("ID Phiếu kiểm kho")
  }),
  body: z.object({
    status: demoValidator.chuoi("Trạng thái").optional(),
    notes: demoValidator.chuoi("Ghi chú").optional(),
    items: z.array(z.object({
      id: demoValidator.chuoi("ID Chi tiết").optional(),
      inventoryItemId: demoValidator.chuoi("ID Hàng hóa").optional(),
      actualQty: z.number().optional()
    })).optional()
  })
});

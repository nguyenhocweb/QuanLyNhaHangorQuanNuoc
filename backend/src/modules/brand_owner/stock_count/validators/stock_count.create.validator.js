import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const createStockCountValidator = {
  body: z.object({
    restaurantId: demoValidator.chuoi("ID Nhà hàng"),
    notes: demoValidator.chuoi("Ghi chú").optional(),
    items: z.array(z.object({
      inventoryItemId: demoValidator.chuoi("ID Hàng hóa"),
      systemQty: z.number()
    })).min(1, "Phải có ít nhất 1 mặt hàng")
  })
};

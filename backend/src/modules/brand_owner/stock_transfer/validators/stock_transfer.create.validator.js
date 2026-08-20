import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

export const stockTransferCreateValidator = {
  body: z.object({
    fromRestaurantId: objectIdSchema,
    toRestaurantId: objectIdSchema,
    notes: z.string().optional(),
    items: z.array(z.object({
      inventoryItemId: objectIdSchema,
      transferQty: z.number().min(0.01, "Số lượng xuất phải lớn hơn 0")
    })).min(1, "Vui lòng chọn ít nhất 1 mặt hàng")
  })
};

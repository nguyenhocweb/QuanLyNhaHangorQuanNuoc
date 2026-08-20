import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const createRequestValidator = {
  body: z.object({
    restaurantId: demoValidator.chuoi("ID Chi nhánh"),
    notes: z.string().optional(),
    expectedDate: z.string().optional(),
    items: z.array(z.object({
      inventoryItemId: demoValidator.chuoi("ID Hàng hóa"),
      requestedQty: demoValidator.double("Số lượng yêu cầu", 0)
    })).min(1, "Phải có ít nhất 1 mặt hàng")
  })
};

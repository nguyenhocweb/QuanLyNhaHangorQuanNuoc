import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const purchaseRequestItemSchema = z.object({
  inventoryItemId: validator.string("Mặt hàng"),
  requestedQty: z.number().min(0.1, "Số lượng phải > 0"),
});

export const purchaseRequestSchema = z.object({
  restaurantId: validator.string("Chi nhánh"),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(purchaseRequestItemSchema).min(1, "Vui lòng chọn ít nhất 1 mặt hàng"),
});

export type PurchaseRequestFormValues = z.infer<typeof purchaseRequestSchema>;

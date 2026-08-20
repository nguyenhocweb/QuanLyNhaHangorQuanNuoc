import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const stockCountItemSchema = z.object({
  id: z.string().optional(),
  inventoryItemId: validator.string("Mặt hàng"),
  systemQty: z.number(),
  actualQty: z.number().optional()
});

export const createStockCountSchema = z.object({
  restaurantId: validator.string("Nhà hàng"),
  notes: validator.string("Ghi chú").optional().or(z.literal("")),
  items: z.array(stockCountItemSchema).min(1, "Phải có ít nhất 1 mặt hàng")
});

export type StockCountItemFormValues = z.infer<typeof stockCountItemSchema>;
export type CreateStockCountFormValues = z.infer<typeof createStockCountSchema>;

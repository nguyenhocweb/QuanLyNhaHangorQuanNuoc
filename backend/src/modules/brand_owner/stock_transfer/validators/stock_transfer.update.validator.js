import { z } from "zod";

export const stockTransferUpdateValidator = z.object({
    body: z.object({
    status: z.enum(["IN_TRANSIT", "COMPLETED", "CANCELLED"]),
    receivedItems: z.array(z.object({
      id: z.string().optional(), // Id của StockTransferItem
      inventoryItemId: z.string().optional(),
      receivedQty: z.number().min(0, "Số lượng nhận không được âm")
    })).optional()
  })
});

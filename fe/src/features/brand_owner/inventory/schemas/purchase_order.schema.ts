import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const purchaseOrderItemSchema = z.object({
  id: z.string().optional(),
  inventoryItemId: validator.string("Mặt hàng"),
  orderQty: validator.number("Số lượng đặt").min(0.01, "Số lượng phải lớn hơn 0"),
  receivedQty: validator.number("Số lượng nhận").optional(),
  unitPrice: validator.number("Đơn giá").min(0, "Đơn giá không hợp lệ"),
  actualAmount: validator.number("Thành tiền thực tế").optional()
});

export const createPurchaseOrderSchema = z.object({
  restaurantId: validator.string("Nhà hàng (Kho nhận)"),
  supplierId: validator.string("Nhà cung cấp"),
  invoiceImageUrl: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
  items: z.array(purchaseOrderItemSchema).min(1, "Phải có ít nhất 1 mặt hàng"),
  notes: validator.string("Ghi chú").optional().or(z.literal(""))
});

export type PurchaseOrderItemFormValues = z.infer<typeof purchaseOrderItemSchema>;
export type CreatePurchaseOrderFormValues = z.infer<typeof createPurchaseOrderSchema>;

import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const inventoryItemSchema = z.object({
  sku: validator.string("Mã SKU").optional().or(z.literal("")),
  name: validator.string("Tên hàng hóa"),
  categoryId: validator.string("Danh mục").optional().or(z.literal("")),
  baseUnit: validator.string("Đơn vị cơ bản"),
  minPrice: z.number().min(0, "Giá tối thiểu phải >= 0").optional(),
  maxPrice: z.number().min(0, "Giá tối đa phải >= 0").optional(),
  minStockLevel: z.number().min(0, "Mức tối thiểu phải >= 0").optional(),
  type: validator.string("Loại hàng hóa").optional(),
  supplierId: validator.string("Nhà cung cấp").optional().or(z.literal("")),
  isActive: z.boolean().optional()
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

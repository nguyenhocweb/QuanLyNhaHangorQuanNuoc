import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateInventoryItemValidator = z.object({
    params: z.object({
    itemId: demoValidator.chuoi("ID hàng hóa")
  }),
  body: z.object({
    sku: demoValidator.chuoi("Mã SKU").optional().or(z.literal("")),
    name: demoValidator.chuoi("Tên hàng hóa").optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ").optional().or(z.literal("")),
    baseUnit: demoValidator.chuoi("Đơn vị cơ bản").optional(),
    minPrice: z.number().min(0, "Giá tối thiểu phải >= 0").optional(),
    maxPrice: z.number().min(0, "Giá tối đa phải >= 0").optional(),
    type: demoValidator.chuoi("Loại hàng hóa").optional(),
    supplierId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ").optional().or(z.literal("")),
    minStockLevel: z.number().min(0, "Hạn mức tối thiểu phải >= 0").optional(),
    isActive: z.boolean().optional()
  })
});

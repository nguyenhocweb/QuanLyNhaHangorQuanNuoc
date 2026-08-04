import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const menuUpdateSchema = z.object({
    isAvailable: validator.boolean("Trạng thái còn hàng").optional(),
    overridePrice: validator.number("Giá bán chi nhánh", 0).nullable().optional()
});

export type MenuUpdateFormValues = z.infer<typeof menuUpdateSchema>;

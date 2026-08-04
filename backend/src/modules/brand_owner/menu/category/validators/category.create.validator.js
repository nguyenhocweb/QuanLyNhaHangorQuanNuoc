import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const createCategoryValidator = z.object({
    body: z.object({
        menuIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thực đơn"),
        name: demoValidator.chuoi("Tên danh mục"),
        description: z.string().optional(),
        is_active: z.boolean().default(true),
        sort_order: z.number().int().default(0)
    })
});

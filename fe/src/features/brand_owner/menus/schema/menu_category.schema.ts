import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const menuCategorySchema = z.object({
    menuIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thực đơn"),
    name: validator.string("Tên danh mục"),
    description: z.string().optional(),
    sort_order: z.coerce.number().int().min(0).default(0),
    is_active: z.boolean().default(true)
});

export type MenuCategoryFormValues = z.infer<typeof menuCategorySchema>;

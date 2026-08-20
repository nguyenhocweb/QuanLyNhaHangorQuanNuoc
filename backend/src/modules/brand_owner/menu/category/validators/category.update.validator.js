import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const updateCategoryValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Danh mục")
    }),
    body: z.object({
        menuIds: z.array(z.string()).optional(),
        name: z.string().min(1, "Tên danh mục không được để trống").optional(),
        description: z.string().optional(),
        sort_order: z.number().int().min(0).optional(),
        is_active: z.boolean().optional()
    })
});

export const deleteCategoryValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Danh mục")
    })
});

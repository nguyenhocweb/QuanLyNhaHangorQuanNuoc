import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const createItemValidator = z.object({
    body: z.object({
        categoryIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 danh mục"),
        name: demoValidator.chuoi("Tên món ăn"),
        description: z.string().optional(),
        basePrice: z.number().min(0, "Giá không được âm"),
        image: z.string().optional(),
        sku: z.string().optional(),
        is_featured: z.boolean().default(false),
        prep_time: z.number().int().optional(),
        spice_level: z.number().int().optional(),
        allergens: z.array(z.string()).default([]),
        sort_order: z.number().int().default(0),
        isActive: z.boolean().default(true),
        
        // Mảng các biến thể (VD: Size S, M, L)
        variants: z.array(z.object({
            name: demoValidator.chuoi("Tên biến thể"),
            price: z.number().min(0, "Giá biến thể không được âm")
        })).optional().default([]),

        // Mảng nhóm tùy chọn (VD: Topping, Lượng đường)
        modifierGroups: z.array(z.object({
            name: demoValidator.chuoi("Tên nhóm tùy chọn"),
            minSelections: z.number().int().min(0).default(0),
            maxSelections: z.number().int().min(1).default(1),
            options: z.array(z.object({
                name: demoValidator.chuoi("Tên tùy chọn"),
                priceExtra: z.number().min(0).default(0)
            })).min(1, "Nhóm tùy chọn phải có ít nhất 1 lựa chọn")
        })).optional().default([]),

        // Danh sách ID các nhà hàng bán món này
        restaurantIds: z.array(demoValidator.chuoi("ID Nhà hàng")).optional().default([])
    })
});

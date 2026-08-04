import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const updateItemValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Món ăn")
    }),
    body: z.object({
        categoryIds: z.array(z.string()).optional(),
        name: demoValidator.chuoi("Tên món ăn").optional(),
        description: z.string().optional(),
        basePrice: z.number().min(0, "Giá không được âm").optional(),
        image: z.string().optional(),
        sku: z.string().optional(),
        is_featured: z.boolean().optional(),
        prep_time: z.number().int().optional(),
        spice_level: z.number().int().optional(),
        allergens: z.array(z.string()).optional(),
        sort_order: z.number().int().optional(),
        isActive: z.boolean().optional(),
        
        variants: z.array(z.object({
            name: demoValidator.chuoi("Tên biến thể"),
            price: z.number().min(0, "Giá biến thể không được âm")
        })).optional(),

        modifierGroups: z.array(z.object({
            name: demoValidator.chuoi("Tên nhóm tùy chọn"),
            minSelections: z.number().int().min(0).default(0),
            maxSelections: z.number().int().min(1).default(1),
            options: z.array(z.object({
                name: demoValidator.chuoi("Tên tùy chọn"),
                priceExtra: z.number().min(0).default(0)
            })).min(1, "Nhóm tùy chọn phải có ít nhất 1 lựa chọn")
        })).optional(),

        restaurantIds: z.array(demoValidator.chuoi("ID Nhà hàng")).optional()
    })
});

export const deleteItemValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID Món ăn")
    })
});

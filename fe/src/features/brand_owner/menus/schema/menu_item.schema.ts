import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const variantSchema = z.object({
    name: validator.string("Tên kích cỡ / biến thể"),
    price: z.coerce.number().min(0, "Giá không được âm")
});

export const modifierOptionSchema = z.object({
    name: validator.string("Tên lựa chọn"),
    priceExtra: z.coerce.number().min(0, "Giá phụ thu không được âm")
});

export const modifierGroupSchema = z.object({
    name: validator.string("Tên nhóm tùy chọn"),
    minSelections: z.coerce.number().int().min(0).default(0),
    maxSelections: z.coerce.number().int().min(1).default(1),
    options: z.array(modifierOptionSchema).min(1, "Vui lòng thêm ít nhất 1 lựa chọn")
});

export const menuItemSchema = z.object({
    categoryIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 danh mục"),
    name: validator.string("Tên món ăn"),
    description: z.string().optional(),
    basePrice: z.coerce.number().min(0, "Giá cơ bản không được âm"),
    sku: z.string().optional(),
    is_featured: z.boolean().default(false),
    prep_time: z.coerce.number().int().optional(),
    spice_level: z.coerce.number().int().min(0).max(5).optional(),
    allergens: z.array(z.string()).default([]),
    sort_order: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
    variants: z.array(variantSchema).default([]),
    modifierGroups: z.array(modifierGroupSchema).default([]),
    restaurantIds: z.array(z.string()).default([])
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

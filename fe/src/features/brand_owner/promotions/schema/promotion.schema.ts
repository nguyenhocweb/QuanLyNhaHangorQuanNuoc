import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const basePromotionSchema = z.object({
    code: validator.string("Mã khuyến mãi").max(20, "Mã khuyến mãi tối đa 20 ký tự"),
    description: validator.string("Mô tả").optional(),
    discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
        message: "Loại giảm giá là bắt buộc"
    }),
    discount_value: z.number({ message: "Vui lòng nhập số" }),
    min_order_value: z.number().optional(),
    max_discount: z.number().optional(),
    valid_from: z.string({ message: "Ngày bắt đầu là bắt buộc" }),
    valid_until: z.string({ message: "Ngày kết thúc là bắt buộc" }),
    usage_limit: z.number().optional(),
    image: validator.string("Ảnh banner").optional(),
    isActive: z.boolean().optional(),
});

export const createPromotionSchema = basePromotionSchema.refine((data) => {
    if (data.discount_type === "PERCENTAGE" && data.discount_value > 100) {
        return false;
    }
    return true;
}, {
    message: "Khuyến mãi phần trăm không được vượt quá 100%",
    path: ["discount_value"]
}).refine((data) => new Date(data.valid_until) > new Date(data.valid_from), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["valid_until"]
});

export type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export const updatePromotionSchema = basePromotionSchema.partial().refine((data) => {
    if (data.discount_type === "PERCENTAGE" && data.discount_value !== undefined && data.discount_value > 100) {
        return false;
    }
    return true;
}, {
    message: "Khuyến mãi phần trăm không được vượt quá 100%",
    path: ["discount_value"]
}).refine((data) => {
    if (data.valid_from && data.valid_until) {
        return new Date(data.valid_until) > new Date(data.valid_from);
    }
    return true;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["valid_until"]
});

export type UpdatePromotionFormValues = z.infer<typeof updatePromotionSchema>;

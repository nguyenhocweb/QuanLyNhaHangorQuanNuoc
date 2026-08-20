import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const optionalNumber = z.preprocess((val) => (val === "" || Number.isNaN(val) ? undefined : Number(val)), z.number().optional());

const basePromotionSchema = z.object({
    code: validator.string("Mã khuyến mãi").max(20, "Mã khuyến mãi tối đa 20 ký tự"),
    description: z.string().optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
        message: "Loại giảm giá là bắt buộc"
    }),
    discountValue: z.preprocess((val) => val === '' || isNaN(Number(val)) ? undefined : Number(val), z.number({ required_error: "Vui lòng nhập giá trị giảm", invalid_type_error: "Giá trị giảm không hợp lệ" }).positive("Giá trị giảm phải lớn hơn 0")),
    minOrderValue: optionalNumber,
    maxDiscount: optionalNumber,
    validFrom: z.string({ message: "Ngày bắt đầu là bắt buộc" }),
    validUntil: z.string({ message: "Ngày kết thúc là bắt buộc" }),
    
    // === ĐIỀU KIỆN THỜI GIAN ===
    daysOfWeek: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),

    // === MỞ RỘNG ===
    // === ĐỐI TƯỢNG ===
    targetAudience: z.enum(["ALL", "NEW_CUSTOMER", "VIP", "STUDENT"]).optional(),

    // === SỐ LƯỢNG ===
    usageLimit: optionalNumber,
    usageLimitPerUser: optionalNumber,
    maxBudget: optionalNumber,
    
    image: z.string().optional(),
    
    // === PHẠM VI ÁP DỤNG ===
    restaurantIds: z.array(z.string()).optional(),
    menuItemIds: z.array(z.string()).optional(),
    
    isActive: z.boolean().optional(),
});

export const createPromotionSchema = basePromotionSchema.refine((data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
        return false;
    }
    return true;
}, {
    message: "Khuyến mãi phần trăm không được vượt quá 100%",
    path: ["discountValue"]
}).refine((data) => new Date(data.validUntil) > new Date(data.validFrom), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validUntil"]
});

export type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export const updatePromotionSchema = basePromotionSchema.partial().refine((data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue !== undefined && data.discountValue > 100) {
        return false;
    }
    return true;
}, {
    message: "Khuyến mãi phần trăm không được vượt quá 100%",
    path: ["discountValue"]
}).refine((data) => {
    if (data.validFrom && data.validUntil) {
        return new Date(data.validUntil) > new Date(data.validFrom);
    }
    return true;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validUntil"]
});

export type UpdatePromotionFormValues = z.infer<typeof updatePromotionSchema>;

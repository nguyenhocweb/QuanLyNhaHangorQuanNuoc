import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const baseBodySchema = z.object({
    code: demoValidator.chuoi("Mã khuyến mãi").max(20, "Mã khuyến mãi không được quá 20 ký tự"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
        required_error: "Loại giảm giá là bắt buộc",
        invalid_type_error: "Loại giảm giá không hợp lệ"
    }),
    discountValue: demoValidator.double("Giá trị giảm giá", 0),
    minOrderValue: demoValidator.double("Giá trị đơn hàng tối thiểu", 0).optional(),
    maxDiscount: demoValidator.double("Giảm tối đa", 0).optional(),
    validFrom: demoValidator.date_sinh("Ngày bắt đầu", -10, 100), 
    validUntil: demoValidator.date_sinh("Ngày kết thúc", -10, 100),
    
    // === ĐIỀU KIỆN THỜI GIAN ===
    daysOfWeek: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),

    // === MỞ RỘNG ===
    conditions: z.any().optional(),

    // === SỐ LƯỢNG ===
    usageLimit: demoValidator.int("Giới hạn sử dụng", 1).optional(),
    usageLimitPerUser: demoValidator.int("Giới hạn mỗi user", 1).optional(),
    maxBudget: demoValidator.int("Ngân sách tối đa", 0).optional(),

    image: demoValidator.chuoiKhongBatBuoc("Ảnh banner"),
    
    // === PHẠM VI ÁP DỤNG ===
    restaurantIds: z.array(z.string()).optional(),
    menuItemIds: z.array(z.string()).optional(),
    
    isActive: demoValidator.boolean("Trạng thái").optional()
});

const refinedCreateBodySchema = baseBodySchema.refine((data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
        return false;
    }
    return true;
}, {
    message: "Giá trị giảm giá phần trăm không được vượt quá 100%",
    path: ["discountValue"]
}).refine((data) => data.validUntil > data.validFrom, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validUntil"]
});

export const createPromotionSchema = z.object({
    body: refinedCreateBodySchema
});

const refinedUpdateBodySchema = baseBodySchema.partial().omit({ code: true }).refine((data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue !== undefined && data.discountValue > 100) {
        return false;
    }
    return true;
}, {
    message: "Giá trị giảm giá phần trăm không được vượt quá 100%",
    path: ["discountValue"]
}).refine((data) => {
    if (data.validUntil && data.validFrom) {
        return data.validUntil > data.validFrom;
    }
    return true;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validUntil"]
});

export const updatePromotionSchema = z.object({
    body: refinedUpdateBodySchema
});

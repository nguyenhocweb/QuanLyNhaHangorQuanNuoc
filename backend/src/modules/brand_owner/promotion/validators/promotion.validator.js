import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

const baseBodySchema = z.object({
    code: demoValidator.chuoi("Mã khuyến mãi").max(20, "Mã khuyến mãi không được quá 20 ký tự"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
        required_error: "Loại giảm giá là bắt buộc",
        invalid_type_error: "Loại giảm giá không hợp lệ"
    }),
    discount_value: demoValidator.double("Giá trị giảm giá", 0),
    min_order_value: demoValidator.double("Giá trị đơn hàng tối thiểu", 0).optional(),
    max_discount: demoValidator.double("Giảm tối đa", 0).optional(),
    valid_from: demoValidator.date_sinh("Ngày bắt đầu", -10, 100), 
    valid_until: demoValidator.date_sinh("Ngày kết thúc", -10, 100),
    usage_limit: demoValidator.int("Giới hạn sử dụng", 1).optional(),
    image: demoValidator.chuoiKhongBatBuoc("Ảnh banner"),
    restaurantId: demoValidator.chuoiKhongBatBuoc("ID Nhà hàng"), 
    isActive: demoValidator.boolean("Trạng thái").optional()
});

const refinedCreateBodySchema = baseBodySchema.refine((data) => {
    if (data.discount_type === "PERCENTAGE" && data.discount_value > 100) {
        return false;
    }
    return true;
}, {
    message: "Giá trị giảm giá phần trăm không được vượt quá 100%",
    path: ["discount_value"]
}).refine((data) => data.valid_until > data.valid_from, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["valid_until"]
});

export const createPromotionSchema = z.object({
    body: refinedCreateBodySchema
});

const refinedUpdateBodySchema = baseBodySchema.partial().omit({ code: true }).refine((data) => {
    if (data.discount_type === "PERCENTAGE" && data.discount_value !== undefined && data.discount_value > 100) {
        return false;
    }
    return true;
}, {
    message: "Giá trị giảm giá phần trăm không được vượt quá 100%",
    path: ["discount_value"]
}).refine((data) => {
    if (data.valid_until && data.valid_from) {
        return data.valid_until > data.valid_from;
    }
    return true;
}, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["valid_until"]
});

export const updatePromotionSchema = z.object({
    body: refinedUpdateBodySchema
});

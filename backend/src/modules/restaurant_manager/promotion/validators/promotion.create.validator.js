import { z } from 'zod';
import { demoValidator } from '../../../../core/utils/validator.js';

export const createPromotionValidator = z.object({
  body: z.object({
    brandId: demoValidator.chuoiKhongBatBuoc("ID Thương hiệu"),
    restaurantId: demoValidator.chuoiKhongBatBuoc("ID Nhà hàng"),
    code: demoValidator.chuoi("Mã khuyến mãi").regex(/^[A-Z0-9_]+$/, "Mã khuyến mãi chỉ chứa chữ in hoa, số và dấu gạch dưới"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    discount_value: demoValidator.double("Giá trị giảm", 0),
    min_order_value: demoValidator.double("Giá trị đơn tối thiểu", 0).optional(),
    max_discount: demoValidator.double("Giảm tối đa", 0).optional(),
    
    valid_from: demoValidator.event_date("Ngày bắt đầu"),
    valid_until: demoValidator.event_date("Ngày kết thúc"),
    
    usage_limit: demoValidator.int("Giới hạn số lượt", 1).optional(),
    isActive: demoValidator.boolean("Kích hoạt").optional().default(true),
  }).refine((data) => {
    // If PERCENTAGE, discount_value must be <= 100
    if (data.discount_type === "PERCENTAGE" && data.discount_value > 100) {
      return false;
    }
    return true;
  }, {
    message: "Giá trị giảm theo phần trăm không được vượt quá 100",
    path: ["discount_value"]
  }).refine((data) => {
    // valid_from <= valid_until
    if (data.valid_from && data.valid_until && new Date(data.valid_from) > new Date(data.valid_until)) {
      return false;
    }
    return true;
  }, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["valid_until"]
  })
});

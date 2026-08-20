import { z } from 'zod';
import { demoValidator } from '../../../../core/utils/validator.js';
import { DiscountType, PromotionStatus, TargetAudience, DayOfWeek } from '../../../../databases/prisma/generated/prisma/client.js';

export const createPromotionValidator = z.object({
  body: z.object({
    brandId: demoValidator.chuoiKhongBatBuoc("ID Thương hiệu"),
    restaurantId: demoValidator.chuoiKhongBatBuoc("ID Nhà hàng"),
    apply_restaurant_ids: demoValidator.array("Danh sách ID nhà hàng áp dụng", z.string()).optional(),
    code: demoValidator.chuoi("Mã khuyến mãi").regex(/^[A-Z0-9_]+$/, "Mã khuyến mãi chỉ chứa chữ in hoa, số và dấu gạch dưới"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    discountType: z.nativeEnum(DiscountType, {
      errorMap: () => ({ message: "Loại giảm giá không hợp lệ" })
    }),
    discountValue: demoValidator.double("Giá trị giảm", 0),
    minOrderValue: demoValidator.double("Giá trị đơn tối thiểu", 0).optional(),
    maxDiscount: demoValidator.double("Giảm tối đa", 0).optional(),
    
    validFrom: demoValidator.event_date("Ngày bắt đầu"),
    validUntil: demoValidator.event_date("Ngày kết thúc"),
    
    daysOfWeek: demoValidator.array("Ngày áp dụng", z.nativeEnum(DayOfWeek), 1).optional(),
    timeStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ bắt đầu không hợp lệ (HH:mm)").optional().or(z.literal('')),
    timeEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ kết thúc không hợp lệ (HH:mm)").optional().or(z.literal('')),
    
    targetAudience: z.nativeEnum(TargetAudience).optional(),
    usageLimit: demoValidator.int("Giới hạn số lượt", 1).optional(),
    usageLimitPerUser: demoValidator.int("Giới hạn mỗi user", 1).optional(),
    maxBudget: demoValidator.double("Ngân sách tối đa", 0).optional(),
    
    image: demoValidator.chuoiKhongBatBuoc("Hình ảnh"),
    status: z.nativeEnum(PromotionStatus).optional(),
    menuItemIds: demoValidator.array("Danh sách món ăn", z.string()).optional()
  }).refine((data) => {
    // If PERCENTAGE, discountValue must be <= 100
    if (data.discountType === DiscountType.PERCENTAGE && data.discountValue > 100) {
      return false;
    }
    return true;
  }, {
    message: "Giá trị giảm theo phần trăm không được vượt quá 100",
    path: ["discountValue"]
  }).refine((data) => {
    // validFrom <= validUntil
    if (data.validFrom && data.validUntil && new Date(data.validFrom) > new Date(data.validUntil)) {
      return false;
    }
    return true;
  }, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["validUntil"]
  })
});

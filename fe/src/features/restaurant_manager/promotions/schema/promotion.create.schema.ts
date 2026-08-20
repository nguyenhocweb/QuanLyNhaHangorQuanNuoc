import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

const preprocessNumber = (val: any) => {
  if (val === '' || val === undefined || val === null) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

const preprocessDate = (val: any) => {
  if (val === '' || val === undefined || val === null) return undefined;
  return val;
};

export const promotionCreateSchema = z.object({
  code: validator.string("Mã khuyến mãi", 20, 3)
    .regex(/^[A-Z0-9]+$/, "Mã code chỉ được chứa chữ in hoa và số, không khoảng trắng"),
  description: z.string().optional(),
  
  // === LOẠI GIẢM GIÁ ===
  discountType: validator.enum("Loại giảm giá", ['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.any().transform(v => Number(v)).refine(v => !isNaN(v) && v > 0, { message: "Bắt buộc nhập Giá trị giảm (lớn hơn 0)" }),
  minOrderValue: z.any().transform(v => v === '' || v === undefined || v === null ? undefined : Number(v)).refine(v => v === undefined || (!isNaN(v) && v >= 0), { message: "Đơn tối thiểu không được âm" }),
  maxDiscount: z.any().transform(v => v === '' || v === undefined || v === null ? undefined : Number(v)).refine(v => v === undefined || (!isNaN(v) && v >= 0), { message: "Mức giảm tối đa không được âm" }),

  // === THỜI GIAN ===
  validFrom: z.preprocess(preprocessDate, validator.date("Ngày bắt đầu")),
  validUntil: z.preprocess(preprocessDate, validator.date("Ngày kết thúc")),
  daysOfWeek: validator.array("Ngày áp dụng trong tuần", z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']), { min: 1 }),
  timeStart: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Sai định dạng HH:mm").optional().or(z.literal('')),
  timeEnd: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Sai định dạng HH:mm").optional().or(z.literal('')),

  // === ĐỐI TƯỢNG ===
  targetAudience: validator.enum("Đối tượng khách hàng", ['ALL', 'NEW_CUSTOMER', 'VIP', 'STUDENT']),
  usageLimit: z.any().transform(v => v === '' || v === undefined || v === null ? undefined : Number(v)).refine(v => v === undefined || (!isNaN(v) && v > 0), { message: "Phải lớn hơn 0" }),
  usageLimitPerUser: z.any().transform(v => v === '' || v === undefined || v === null ? undefined : Number(v)).refine(v => v === undefined || (!isNaN(v) && v > 0), { message: "Phải lớn hơn 0" }),
  maxBudget: z.any().transform(v => v === '' || v === undefined || v === null ? undefined : Number(v)).refine(v => v === undefined || (!isNaN(v) && v > 0), { message: "Phải lớn hơn 0" }),

  // === PHẠM VI MÓN ĂN ===
  menuItemIds: z.array(z.string()).default([]), // Nếu rỗng là áp dụng toàn menu
}).superRefine((data, ctx) => {
  // 1. Nếu discountType là PERCENTAGE thì discountValue không quá 100 và BẮT BUỘC có maxDiscount
  if (data.discountType === 'PERCENTAGE') {
    if (data.discountValue && data.discountValue > 100) {
      ctx.addIssue({ path: ['discountValue'], code: z.ZodIssueCode.custom, message: 'Phần trăm giảm không được vượt quá 100%' });
    }
    if (!data.maxDiscount || data.maxDiscount <= 0) {
      ctx.addIssue({ path: ['maxDiscount'], code: z.ZodIssueCode.custom, message: 'Bắt buộc nhập Mức giảm tối đa khi chọn giảm theo % để tránh thất thoát' });
    }
  }

  // 2. Logic Giá trị đơn tối thiểu > Giá trị giảm (nếu là FIXED_AMOUNT)
  if (data.discountType === 'FIXED_AMOUNT' && data.minOrderValue && data.discountValue) {
    if (data.discountValue >= data.minOrderValue) {
      ctx.addIssue({ path: ['minOrderValue'], code: z.ZodIssueCode.custom, message: 'Giá trị đơn tối thiểu phải lớn hơn Giá trị giảm' });
    }
  }

  // 3. Logic Ngày kết thúc > Ngày bắt đầu
  if (data.validUntil && data.validFrom) {
    if (data.validUntil <= data.validFrom) {
      ctx.addIssue({ path: ['validUntil'], code: z.ZodIssueCode.custom, message: 'Ngày kết thúc phải sau ngày bắt đầu' });
    }
  }

  // 4. Logic timeEnd > timeStart
  if (data.timeStart && data.timeEnd) {
    const [startH, startM] = data.timeStart.split(':').map(Number);
    const [endH, endM] = data.timeEnd.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    if (endMins <= startMins) {
      ctx.addIssue({ path: ['timeEnd'], code: z.ZodIssueCode.custom, message: 'Giờ kết thúc phải sau giờ bắt đầu' });
    }
  } else if ((data.timeStart && !data.timeEnd) || (!data.timeStart && data.timeEnd)) {
    ctx.addIssue({ path: ['timeEnd'], code: z.ZodIssueCode.custom, message: 'Phải điền đủ Giờ bắt đầu và Giờ kết thúc' });
  }
});

export type PromotionCreateFormValues = z.infer<typeof promotionCreateSchema>;

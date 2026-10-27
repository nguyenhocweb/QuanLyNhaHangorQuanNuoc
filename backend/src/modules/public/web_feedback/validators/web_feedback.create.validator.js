import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";
import { FeedbackCategory } from "../../../../databases/prisma/generated/prisma/index.js";

export const createWebFeedbackValidator = z.object({
  body: z.object({
    rating: demoValidator.int("Điểm đánh giá", 1, 5),
    content: demoValidator.chuoi("Nội dung đánh giá"),
    title: demoValidator.chuoiKhongBatBuoc("Tiêu đề"),
    category: z.nativeEnum(FeedbackCategory, {
      errorMap: () => ({ message: "Danh mục đánh giá không hợp lệ" })
    }).optional().default(FeedbackCategory.GENERAL),
    guestName: demoValidator.chuoiKhongBatBuoc("Tên người gửi"),
    guestEmail: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
    guestPhone: z.string().trim().optional().or(z.literal("")),
    pageUrl: demoValidator.chuoiKhongBatBuoc("Đường dẫn trang"),
    deviceInfo: demoValidator.chuoiKhongBatBuoc("Thông tin thiết bị"),
    screenResolution: demoValidator.chuoiKhongBatBuoc("Độ phân giải màn hình"),
    attachments: demoValidator.array("Ảnh đính kèm", z.string().url("URL ảnh không hợp lệ"), 0).optional()
  })
});

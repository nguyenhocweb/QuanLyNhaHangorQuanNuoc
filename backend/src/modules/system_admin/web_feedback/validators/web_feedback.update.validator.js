import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";
import { FeedbackStatus } from "../../../../databases/prisma/generated/prisma/index.js";

export const updateWebFeedbackValidator = z.object({
  params: z.object({
    id: demoValidator.chuoi("ID nhận xét")
  }),
  body: z.object({
    status: z.nativeEnum(FeedbackStatus, {
      errorMap: () => ({ message: "Trạng thái kiểm duyệt không hợp lệ" })
    }).optional(),
    isFeatured: z.boolean({
      invalid_type_error: "isFeatured phải là boolean"
    }).optional(),
    adminNote: demoValidator.chuoiKhongBatBuoc("Ghi chú Admin"),
    adminReply: demoValidator.chuoiKhongBatBuoc("Phản hồi của Admin")
  })
});

import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createContactTicketValidator = z.object({
  body: z.object({
    guestName: demoValidator.chuoi("Họ và tên", 100, 2),
    guestEmail: demoValidator.email("Địa chỉ Email"),
    guestPhone: z.string().trim().optional().or(z.literal("")),
    hasZalo: z.boolean().optional().default(false),
    subject: z.string().trim().max(200).optional().or(z.literal("")),
    message: demoValidator.chuoi("Nội dung cần hỗ trợ", 2000, 5),
    deviceInfo: z.string().optional()
  })
});

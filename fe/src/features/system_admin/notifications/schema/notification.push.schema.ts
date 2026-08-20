import { z } from "zod";
import { validator } from "@/src/core/lib/validations";



export const pushNotificationSchema = z.object({
  targetType: validator.enum("Đối tượng", ["ALL_SYSTEM", "INDIVIDUAL_USER", "RESTAURANT", "BRAND"]),
  targetIds: z.array(z.string()).optional(),
  isAllOfType: z.boolean().default(false),
  title: validator.string("Tiêu đề"),
  body: validator.string("Nội dung"),
  type: validator.enum("Loại thông báo", ["ORDER", "PROMOTION", "SYSTEM", "RESERVATION", "INVENTORY", "SUBSCRIPTION"]),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
}).refine((data) => {
  if (data.targetType !== "ALL_SYSTEM" && !data.isAllOfType && (!data.targetIds || data.targetIds.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Vui lòng chọn ít nhất 1 đối tượng hoặc bật tuỳ chọn gửi tất cả",
  path: ["targetIds"]
});

export type PushNotificationValues = z.infer<typeof pushNotificationSchema>;

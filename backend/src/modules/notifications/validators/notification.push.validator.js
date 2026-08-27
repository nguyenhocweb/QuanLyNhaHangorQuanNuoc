import { z } from "zod";
import { demoValidator } from "../../../core/utils/validator.js";

export const pushNotificationValidator = z.object({
    body: z.object({
    targetType: z.enum(["ALL_SYSTEM", "INDIVIDUAL_USER", "RESTAURANT", "BRAND"], {
      required_error: "Loại đối tượng không được để trống",
    }),
    targetIds: z.array(z.string()).optional(),
    isAllOfType: z.boolean().default(false),
    title: demoValidator.chuoi("Tiêu đề"),
    body: demoValidator.chuoi("Nội dung"),
    type: z.enum(["ORDER", "PROMOTION", "SYSTEM", "RESERVATION", "INVENTORY", "SUBSCRIPTION"], {
      required_error: "Loại thông báo không được để trống",
    }),
    referenceId: z.string().optional(),
    referenceType: z.string().optional(),
  }).refine((data) => {
    if (data.targetType !== "ALL_SYSTEM" && !data.isAllOfType && (!data.targetIds || data.targetIds.length === 0)) {
      return false;
    }
    return true;
  }, {
    message: "Vui lòng chọn ít nhất 1 đối tượng hoặc bật tùy chọn gửi tất cả",
    path: ["targetIds"]
  })
});

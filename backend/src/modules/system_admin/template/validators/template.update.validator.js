import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const templateUpdateValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("Template ID").regex(/^[0-9a-fA-F]{24}$/, "Template ID không hợp lệ"),
    }),
    body: z.object({
        name: demoValidator.chuoi("Tên Mẫu Giao Diện").optional(),
        code: demoValidator.chuoi("Mã Giao Diện").optional(),
        type: z.enum(["BRAND_TEMPLATE", "RESTAURANT_TEMPLATE"], {
            invalid_type_error: "Loại giao diện không hợp lệ",
        }).optional(),
        thumbnailUrl: demoValidator.chuoiKhongBatBuoc("Ảnh Đại Diện").optional(),
        description: demoValidator.chuoiKhongBatBuoc("Mô Tả").optional(),
        isActive: demoValidator.boolean("Trạng thái hoạt động").optional(),
        allowedPlanIds: z.array(demoValidator.chuoi("Gói Cước ID").regex(/^[0-9a-fA-F]{24}$/, "Gói Cước ID không hợp lệ")).optional(),
    }),
});

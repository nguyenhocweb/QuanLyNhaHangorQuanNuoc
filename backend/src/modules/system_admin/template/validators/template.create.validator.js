import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const templateCreateValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên Mẫu Giao Diện"),
        code: demoValidator.chuoi("Mã Giao Diện"),
        type: z.enum(["BRAND_TEMPLATE", "RESTAURANT_TEMPLATE"], {
            required_error: "Loại giao diện không được để trống",
            invalid_type_error: "Loại giao diện không hợp lệ",
        }),
        thumbnailUrl: demoValidator.chuoiKhongBatBuoc("Ảnh Đại Diện"),
        description: demoValidator.chuoiKhongBatBuoc("Mô Tả"),
        allowedPlanIds: z.array(demoValidator.chuoi("Gói Cước ID").regex(/^[0-9a-fA-F]{24}$/, "Gói Cước ID không hợp lệ")).optional(),
    }),
});

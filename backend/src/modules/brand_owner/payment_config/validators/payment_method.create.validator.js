import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createPaymentMethodValidator = z.object({
    body: z.object({
        name: demoValidator.chuoi("Tên phương thức thanh toán"),
        code: demoValidator.chuoi("Mã phương thức (Code)"),
        description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
        iconUrl: demoValidator.chuoiKhongBatBuoc("Link icon"),
        isActive: demoValidator.boolean("Trạng thái").optional().default(true)
    })
});

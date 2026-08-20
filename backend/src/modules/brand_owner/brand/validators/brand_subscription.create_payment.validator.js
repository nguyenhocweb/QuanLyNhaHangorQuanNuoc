import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createPaymentValidator = z.object({
    body: z.object({
        planId: demoValidator.chuoi("ID Gói Cước"),
        systemPaymentMethodId: demoValidator.chuoiKhongBatBuoc("ID Phương thức thanh toán")
    })
});

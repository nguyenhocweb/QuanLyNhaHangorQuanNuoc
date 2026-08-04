import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const saveVoucherValidator = z.object({
    body: z.object({
        identifier: demoValidator.chuoi("Mã voucher hoặc ID")
    })
});

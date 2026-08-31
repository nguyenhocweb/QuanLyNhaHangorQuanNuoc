import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const getDineInOrderValidator = z.object({
    params: z.object({
        reservationId: demoValidator.chuoi("Mã đặt bàn")
    })
});

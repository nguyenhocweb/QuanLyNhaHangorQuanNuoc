import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const restaurantPublicValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("Restaurant ID").regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ"),
    }),
});

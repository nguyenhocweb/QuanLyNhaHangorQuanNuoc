import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateRestaurantTagsValidator = z.object({
    params: z.object({
        id: demoValidator.chuoi("ID nhà hàng")
    }),
    body: z.object({
        tagIds: z.array(demoValidator.chuoi("ID tag")).optional(),
    })
});

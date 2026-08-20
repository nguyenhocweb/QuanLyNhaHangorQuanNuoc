import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateRestaurantMenuValidator = z.object({
    body: z.object({
        isAvailable: z.boolean().optional(),
        overridePrice: z.number().nullable().optional()
    })
});

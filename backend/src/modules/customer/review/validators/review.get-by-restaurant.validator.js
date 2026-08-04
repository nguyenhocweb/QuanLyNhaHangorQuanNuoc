import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const getReviewsValidator = z.object({
    params: z.object({
        restaurantId: demoValidator.chuoi("ID nhà hàng").regex(/^[0-9a-fA-F]{24}$/, "ID nhà hàng không hợp lệ")
    }),
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        rating: z.string().optional(),
        sortBy: z.enum(["newest", "helpful"]).optional()
    })
});

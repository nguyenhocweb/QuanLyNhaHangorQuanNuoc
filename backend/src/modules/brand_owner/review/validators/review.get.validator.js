import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const getBrandReviewsValidator = z.object({
    params: z.object({
        id_brand: demoValidator.chuoi("ID thương hiệu").regex(/^[0-9a-fA-F]{24}$/, "ID thương hiệu không hợp lệ")
    }),
    query: z.object({
        restaurantId: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED_SPAM"]).optional(),
        rating: z.string().optional()
    })
});

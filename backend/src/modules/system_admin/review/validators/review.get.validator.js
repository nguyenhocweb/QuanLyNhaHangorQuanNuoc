import { z } from "zod";

export const getSystemReviewsValidator = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED_SPAM"]).optional(),
        rating: z.string().optional(),
        restaurantId: z.string().optional(),
        brandId: z.string().optional()
    })
});

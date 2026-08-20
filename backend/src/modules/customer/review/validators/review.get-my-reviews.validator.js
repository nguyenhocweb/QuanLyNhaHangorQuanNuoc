import { z } from "zod";

export const getMyReviewsValidator = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z.string().optional(),
        rating: z.string().optional()
    })
});
